/**
 * lazyLoading.js
 * تحسين أداء الموقع بتأجيل تحميل الصور باستخدام Intersection Observer API
 */

document.addEventListener('DOMContentLoaded', function() {
    // التحقق من دعم المتصفح لـ Intersection Observer
    if ('IntersectionObserver' in window) {
      // تهيئة مراقب العناصر المرئية
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          // إذا أصبح العنصر مرئيًا
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // إذا كان هناك صورة تأخير
            if (img.dataset.src) {
              // تعيين مصدر الصورة من السمة data-src
              img.src = img.dataset.src;
              
              // إضافة حدث لعرض الصورة بعد التحميل
              img.onload = () => {
                img.classList.add('loaded');
                // تسجيل مشاهدة الصورة إذا كان هناك دالة لتسجيل المشاهدات
                if (typeof recordImageView === 'function' && typeof getCurrentUser === 'function' && getCurrentUser()) {
                  recordImageView();
                }
              };
              
              // إزالة العنصر من المراقبة بعد تحميله
              observer.unobserve(img);
            }
          }
        });
      }, {
        // هوامش مراقبة الظهور (بكسل)
        rootMargin: '50px',
        // نسبة ظهور العنصر المطلوبة لتنفيذ الوظيفة (0-1)
        threshold: 0.1
      });
      
      // البحث عن جميع الصور التي تحتوي على سمة data-src
      const lazyImages = document.querySelectorAll('img[data-src]');
      
      // تطبيق المراقبة على جميع الصور
      lazyImages.forEach(img => {
        // إضافة صنف للصور المتأخرة التحميل
        img.classList.add('lazy-image');
        // مراقبة الصورة
        imageObserver.observe(img);
      });
      
      console.log(`تم تهيئة التحميل المؤجل لـ ${lazyImages.length} صورة`);
    } else {
      // إذا كان المتصفح لا يدعم Intersection Observer، نقوم بتحميل جميع الصور مباشرة
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => {
        img.src = img.dataset.src;
      });
      
      console.log('المتصفح لا يدعم Intersection Observer. تم تحميل الصور بشكل مباشر.');
    }
    
    // تحويل الصور الحالية إلى تحميل متأخر عند إضافة صور جديدة للصفحة
    // وظيفة محسنة لإعداد التحميل المتأخر للصور الجديدة
    function setupLazyLoadingForNewImages() {
      console.log('بدء إعداد التحميل المتأخر للصور الجديدة');
      
      // إنشاء مراقب جديد لمنع ظهور أخطاء محتملة إذا لم يكن متاحًا
      const newImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          // إذا أصبح العنصر مرئيًا
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // إذا كان هناك صورة تأخير
            if (img.dataset.src) {
              console.log(`تحميل صورة: ${img.dataset.src}`);
              
              // تعيين مصدر الصورة من السمة data-src
              img.src = img.dataset.src;
              
              // إضافة حدث لعرض الصورة بعد التحميل
              img.onload = () => {
                img.classList.add('loaded');
                console.log(`تم تحميل الصورة: ${img.dataset.src}`);
                
                // تسجيل مشاهدة الصورة إذا كان هناك دالة لتسجيل المشاهدات
                if (typeof recordImageView === 'function' && typeof getCurrentUser === 'function' && getCurrentUser()) {
                  recordImageView();
                }
              };
              
              // إزالة العنصر من المراقبة بعد تحميله
              observer.unobserve(img);
            }
          }
        });
      }, {
        // هوامش مراقبة الظهور (بكسل)
        rootMargin: '100px',
        // نسبة ظهور العنصر المطلوبة لتنفيذ الوظيفة (0-1)
        threshold: 0.1
      });
      
      // الحصول على جميع الصور في الصفحة والتي لم يتم تطبيق التحميل المتأخر عليها بعد
      const allImages = document.querySelectorAll('img:not(.lazy-image)');
      let lazyCount = 0;
      
      allImages.forEach(img => {
        // تخطي الصور التي لاتحتاج إلى تحميل متأخر
        const skipImage = 
          img.classList.contains('lazy-image') || 
          img.classList.contains('site-logo') || 
          img.classList.contains('sidebar-logo') ||
          img.classList.contains('user-avatar') ||
          img.classList.contains('user-avatar-small') ||
          img.classList.contains('header-logo') ||
          img.classList.contains('styleImglogo') ||
          img.parentElement.classList.contains('hero') ||
          !img.src || // تجاهل الصور التي ليس لها مصدر أصلاً
          img.src.startsWith('data:'); // تجاهل الصور التي هي بالفعل صور بيانات
  
        if (!skipImage && img.src) {
          // حفظ المصدر الأصلي في data-src
          img.dataset.src = img.src;
          // تعيين مصدر بديل مؤقت (شكل بسيط)
          img.src = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D"http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width%3D"100" height%3D"100" viewBox%3D"0 0 100 100"%3E%3Crect fill%3D"%231a001a" width%3D"100" height%3D"100"%2F%3E%3C%2Fsvg%3E';
          img.classList.add('lazy-image');
          
          // مراقبة الصورة ببدء التحميل عندما تصبح مرئية
          newImageObserver.observe(img);
          lazyCount++;
        }
      });
      
      console.log(`تم إعداد التحميل المتأخر لـ ${lazyCount} صورة جديدة`);
      
      // تخزين المراقب في متغير عام ليمكن استخدامه لاحقًا
      window.currentImageObserver = newImageObserver;
    }
    
    // تصدير الدالة للاستخدام من خارج الملف
    window.enableLazyLoadingForImages = setupLazyLoadingForNewImages;
    
    // لا نحتاج لإعادة تهيئة التحميل المؤجل عند كل تمرير،
    // بل فقط نتأكد من تحميل الصور التي أصبحت مرئية بسبب التمرير
    window.addEventListener('scroll', function() {
      // ملاحظة: المراقب الذي أنشأناه سابقاً سيعمل على تحميل الصور تلقائياً عند ظهورها
      // لذا لسنا بحاجة لتنفيذ أي عمليات إضافية عند التمرير
    });
  });
  
  /**
   * دالة لضغط الصور قبل العرض لتحسين زمن التحميل
   * @param {HTMLImageElement} img - عنصر الصورة
   * @param {number} maxWidth - الحد الأقصى للعرض (اختياري)
   * @param {number} quality - جودة الصورة (0-1) اختياري
   * @returns {Promise<string>} - وعد بعنوان URL للصورة المضغوطة
   */
  function compressImage(img, maxWidth = 1200, quality = 0.8) {
    return new Promise(resolve => {
      // إنشاء عنصر canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // حساب الأبعاد الجديدة بحيث لا يتجاوز العرض القيمة القصوى
      let width = img.naturalWidth;
      let height = img.naturalHeight;
      
      if (width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height = height * ratio;
      }
      
      // تعيين أبعاد الـ canvas
      canvas.width = width;
      canvas.height = height;
      
      // رسم الصورة على الـ canvas
      ctx.drawImage(img, 0, 0, width, height);
      
      // تحويل الصورة إلى URL بصيغة JPEG مع ضغط
      const compressedUrl = canvas.toDataURL('image/jpeg', quality);
      
      resolve(compressedUrl);
    });
  }
  
  // إعداد نظام ضغط الصور عند تحميلها
  document.addEventListener('DOMContentLoaded', function() {
    // إضافة وظيفة ضغط الصور للمتصفح
    window.compressAndDisplayImage = async function(imgElement, imgUrl, maxWidth = 1200, quality = 0.8) {
      // إنشاء صورة مؤقتة لقراءة الأبعاد
      const tempImg = new Image();
      
      tempImg.onload = async function() {
        // ضغط الصورة
        const compressedUrl = await compressImage(tempImg, maxWidth, quality);
        
        // تعيين المصدر المضغوط للصورة الأصلية
        imgElement.src = compressedUrl;
        
        // تفعيل حدث تحميل الصورة
        imgElement.classList.add('loaded');
      };
      
      // بدء تحميل الصورة الأصلية
      tempImg.src = imgUrl;
    };
  });