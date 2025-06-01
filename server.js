//server.js
const express = require('express');
const path = require('path');
const https = require('https');
const http = require('http');
const app = express();
const { createApi } = require('unsplash-js');
const fetch = require('node-fetch');
require('dotenv').config();

// إضافة خاصية عدم التخزين المؤقت لجميع الاستجابات
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// تعريف الملفات الثابتة
app.use(express.static('./', {
  etag: false,
  maxAge: 0
}));

// المسار الافتراضي للصفحة الرئيسية
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// إنشاء مثيل من Unsplash API
const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY || 'demo-access-key',
  fetch: fetch,
});

// مسار للبحث في صور Unsplash
app.get('/unsplash-search', async (req, res) => {
  const query = req.query.query;
  const orientation = req.query.orientation || '1:1';
  
  if (!query) {
    return res.status(400).json({ error: 'يجب توفير استعلام للبحث' });
  }
  
  // تحويل نسبة الأبعاد إلى تنسيق Unsplash
  let unsplashOrientation = 'squarish';
  if (orientation === '2:3') {
    unsplashOrientation = 'portrait';
  } else if (orientation === '16:9') {
    unsplashOrientation = 'landscape';
  }
  
  try {
    console.log(`البحث في Unsplash عن "${query}" بتنسيق ${unsplashOrientation}`);
    
    const result = await unsplash.search.getPhotos({
      query: query,
      orientation: unsplashOrientation,
      perPage: 1
    });
    
    if (result.errors) {
      console.error('خطأ في Unsplash API:', result.errors);
      return res.status(500).json({ error: 'فشل في البحث في Unsplash' });
    }
    
    // التحقق من وجود نتائج
    if (!result.response || !result.response.results || result.response.results.length === 0) {
      console.log('لم يتم العثور على صور');
      return res.status(404).json({ error: 'لم يتم العثور على صور مطابقة للاستعلام' });
    }
    
    // إرجاع الصورة الأولى
    const photo = result.response.results[0];
    res.json({
      id: photo.id,
      urls: photo.urls,
      alt_description: photo.alt_description || query,
      user: {
        name: photo.user.name,
        profile: photo.user.links.html
      }
    });
    
  } catch (error) {
    console.error('خطأ في البحث في Unsplash:', error);
    res.status(500).json({ error: 'فشل في الوصول إلى Unsplash API' });
  }
});

// إضافة مسار وسيط لتنزيل الصور
app.get('/proxy-image', async (req, res) => {
  const imageUrl = req.query.url;
  
  if (!imageUrl) {
    console.error('URL parameter is missing');
    return res.status(400).send('URL مطلوب');
  }
  
  console.log('Proxy request for:', imageUrl);
  
  try {
    // استخدام fetch للحصول على الصورة
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://leonardo.ai/',
        'Origin': 'https://leonardo.ai'
      }
    });
    
    if (!response.ok) {
      console.error(`Image server returned status code: ${response.status}`);
      return res.status(response.status).send(`فشل في جلب الصورة: ${response.statusText}`);
    }
    
    // نقل headers المهمة من الاستجابة الأصلية
    res.set({
      'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
      'Content-Length': response.headers.get('content-length'),
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*'
    });
    
    // تمرير محتوى الصورة للمستخدم
    response.body.pipe(res);
    
    // تسجيل اكتمال التنزيل
    res.on('finish', () => {
      console.log(`Image transfer complete for: ${imageUrl}`);
    });
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).send('فشل في معالجة الصورة');
  }
});

// مسار للتنزيل المباشر
app.get('/download-image', async (req, res) => {
  const imageUrl = req.query.url;
  const filename = req.query.filename || 'image.jpg';
  
  if (!imageUrl) {
    console.error('URL parameter is missing');
    return res.status(400).send('URL مطلوب');
  }
  
  console.log('Download request for:', imageUrl);
  
  try {
    // استخدام fetch للحصول على الصورة
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://leonardo.ai/',
        'Origin': 'https://leonardo.ai'
      }
    });
    
    if (!response.ok) {
      console.error(`Image server returned status code: ${response.status}`);
      return res.status(response.status).send(`فشل في جلب الصورة: ${response.statusText}`);
    }
    
    // إعداد headers للتنزيل
    res.set({
      'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': response.headers.get('content-length'),
      'Cache-Control': 'no-store',
      'Access-Control-Expose-Headers': 'Content-Disposition'
    });
    
    // تمرير محتوى الصورة للمستخدم
    response.body.pipe(res);
    
    // تسجيل اكتمال التنزيل
    res.on('finish', () => {
      console.log(`Download complete for: ${filename}`);
    });
    
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).send('فشل التنزيل');
  }
});

// تعريف المسارات الأخرى
const routes = [
  { path: '/index', file: 'index.html' },
  { path: '/home', file: 'simple-gallery.html' },
  { path: '/favorites', file: 'favorites.html' },
  { path: '/profile', file: 'profile.html' },
  { path: '/generator', file: 'ImageGenerator.html' }
];

// إضافة المسارات إلى التطبيق
routes.forEach(route => {
  app.get(route.path, (req, res) => {
    res.sendFile(path.join(__dirname, route.file));
  });
});

// بدء الخادم
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});