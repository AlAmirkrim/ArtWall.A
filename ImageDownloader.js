/**
 * ImageDownloader.js
 * كلاس متقدم لتنزيل الصور من مصادر مختلفة مع التعامل مع CORS
 */

class ImageDownloader {
    /**
     * إنشاء مثيل جديد من محمّل الصور
     * @param {Object} options - خيارات التكوين
     */
    constructor(options = {}) {
      this.options = {
        useProxy: true,
        proxyUrl: '/proxy-image',
        downloadUrl: '/download-image',
        showNotifications: true,
        ...options
      };
      
      // تعيين حالة المعالجة
      this.isProcessing = false;
      
      // تهيئة الأحداث
      this.setupGlobalHandlers();
    }
    
    /**
     * تعيين معالجات الأحداث العامة
     */
    setupGlobalHandlers() {
      // تعريف الدالة كدالة عامة يمكن استدعاؤها من HTML
      window.downloadImage = this.downloadImage.bind(this);
    }
    
    /**
     * تنزيل صورة من URL معين
     * @param {Event} event - حدث النقر
     * @param {string} url - رابط الصورة الأصلي
     * @returns {Promise<boolean>} نجاح العملية
     */
    async downloadImage(event, url) {
      // منع السلوك الافتراضي (إن وجد)
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      // فحص الرابط
      if (!url || url === 'undefined') {
        console.error('رابط الصورة غير صالح');
        this.showError('رابط الصورة غير صالح');
        return false;
      }
      
      console.log('جاري تنزيل الصورة:', url);
      
      // منع الاستدعاءات المتعددة
      if (this.isProcessing) {
        console.warn('جاري معالجة طلب سابق، يرجى الانتظار');
        return false;
      }
      
      // تعيين حالة المعالجة
      this.isProcessing = true;
      
      // الحصول على الزر الذي تم النقر عليه
      const button = event?.currentTarget || event?.target;
      
      try {
        // إظهار حالة التحميل على الزر
        this.showButtonLoading(button, true);
        
        // استخراج اسم الملف من الرابط
        const filename = this.getFilenameFromUrl(url);
        
        // إذا تم تسجيل المستخدم حالياً، قم بتسجيل التنزيل (إذا كانت الدالة موجودة)
        if (typeof recordImageDownload === 'function' && typeof getCurrentUser === 'function' && getCurrentUser()) {
          recordImageDownload();
        }
        
        // استخدام الخادم الوسيط
        if (this.options.useProxy) {
          await this.downloadViaProxy(url, filename);
        } else {
          await this.downloadDirectly(url, filename);
        }
        
        // تم التنزيل بنجاح
        console.log('تم تنزيل الصورة بنجاح:', filename);
        return true;
      } catch (error) {
        console.error('خطأ أثناء تنزيل الصورة:', error);
        this.showError('حدث خطأ أثناء تنزيل الصورة. يرجى المحاولة مرة أخرى.');
        return false;
      } finally {
        // إعادة تعيين حالة الزر بعد ثانيتين
        setTimeout(() => {
          this.showButtonLoading(button, false);
          this.isProcessing = false;
        }, 2000);
      }
    }
    
    /**
     * تنزيل الصورة من خلال وسيط الخادم
     * @param {string} url - رابط الصورة الأصلي
     * @param {string} filename - اسم الملف المقترح للتنزيل
     * @returns {Promise<void>}
     */
    async downloadViaProxy(url, filename) {
      // إنشاء رابط للتنزيل يستخدم وسيط الخادم
      const proxyUrl = `${this.options.downloadUrl}?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
      
      // إنشاء عنصر iframe مخفي للتنزيل
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = proxyUrl;
      document.body.appendChild(iframe);
      
      // إزالة iframe بعد التنزيل
      return new Promise((resolve) => {
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
          resolve();
        }, 5000);
      });
    }
    
    /**
     * تنزيل الصورة مباشرة (إذا سمحت سياسة CORS)
     * @param {string} url - رابط الصورة
     * @param {string} filename - اسم الملف المقترح للتنزيل
     * @returns {Promise<void>}
     */
    async downloadDirectly(url, filename) {
      try {
        // محاولة الحصول على الصورة
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`فشل الاستجابة: ${response.status} ${response.statusText}`);
        }
        
        // تحويل الاستجابة إلى blob
        const blob = await response.blob();
        
        // إنشاء رابط وهمي للتنزيل
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        link.style.display = 'none';
        
        // إضافة الرابط، النقر عليه، ثم إزالته
        document.body.appendChild(link);
        link.click();
        
        // تنظيف الموارد
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
          document.body.removeChild(link);
        }, 1000);
      } catch (error) {
        console.error('خطأ في التنزيل المباشر، جاري المحاولة عبر وسيط:', error);
        // في حالة الفشل، المحاولة عبر الوسيط
        await this.downloadViaProxy(url, filename);
      }
    }
    
    /**
     * استخراج اسم ملف من URL
     * @param {string} url - رابط الصورة
     * @returns {string} اسم الملف النظيف
     */
    getFilenameFromUrl(url) {
      try {
        // استخراج الجزء الأخير من الرابط
        let filename = url.split('/').pop().split(/[?#]/)[0];
        
        // التحقق من وجود امتداد صالح
        const validExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
        const hasValidExtension = validExtensions.some(ext => 
          filename.toLowerCase().includes(ext)
        );
        
        // إضافة امتداد إذا لم يكن موجوداً
        if (!hasValidExtension) {
          if (url.includes('.png') || url.includes('png=')) {
            filename += '.png';
          } else if (url.includes('.gif') || url.includes('gif=')) {
            filename += '.gif';
          } else if (url.includes('.webp') || url.includes('webp=')) {
            filename += '.webp';
          } else {
            filename += '.jpg'; // افتراضي
          }
        }
        
        // تنقية اسم الملف من الأحرف غير المسموحة
        filename = filename.replace(/[^a-z0-9_.-]/gi, '_');
        
        // التحقق من صحة اسم الملف
        if (!filename || filename.length < 3 || filename === '.jpg' || filename === '_.jpg') {
          const timestamp = Date.now();
          const typeHint = url.includes('leonardo.ai') ? 'leonardo_' : 'image_';
          filename = `${typeHint}${timestamp}.jpg`;
        }
        
        return filename;
      } catch (e) {
        console.error('خطأ في استخراج اسم الملف:', e);
        return `image_${Date.now()}.jpg`;
      }
    }
    
    /**
     * إظهار/إخفاء مؤشر التحميل على الزر
     * @param {HTMLElement} button - عنصر الزر
     * @param {boolean} isLoading - حالة التحميل
     */
    showButtonLoading(button, isLoading) {
      if (!button) return;
      
      // حفظ المحتوى الأصلي إذا لم يتم حفظه من قبل
      if (isLoading && !button.dataset.originalHtml) {
        button.dataset.originalHtml = button.innerHTML;
      }
      
      // تغيير مظهر الزر
      button.disabled = isLoading;
      
      if (isLoading) {
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      } else if (button.dataset.originalHtml) {
        button.innerHTML = button.dataset.originalHtml;
      }
    }
    
    /**
     * إظهار رسالة خطأ للمستخدم
     * @param {string} message - نص الرسالة
     */
    showError(message) {
      if (this.options.showNotifications) {
        alert(message);
      }
    }
  }
  
  // تصدير الكلاس ليمكن استيراده في ملفات أخرى
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageDownloader;
  }
  
  // تهيئة عند تحميل الصفحة
  document.addEventListener('DOMContentLoaded', () => {
    // إنشاء مثيل جديد من المحمّل
    window.imageDownloader = new ImageDownloader();
    console.log('تم تهيئة محمل الصور بنجاح');
  });