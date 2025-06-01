/**
 * main.js
 * ملف نقطة الدخول الرئيسية للمشروع
 * يقوم بتحميل وتهيئة جميع المكونات الموحدة
 */

// استيراد الوحدات الموحدة
import GalleryManager from './unified-gallery-manager.js';
// تم نقل الملفات التالية إلى مجلد old2 وإلغاء استيرادها
// import LazyLoader from './unified-lazy-loading.js';
// import ImageViewer from './unified-image-viewer.js';
// import ImageInteractions from './unified-image-interactions.js';

// تعريف بدائل للكائنات المحذوفة
const LazyLoader = { init: () => console.log("تم حذف LazyLoader - استخدم lazyLoading.js بدلاً منه") };
const ImageViewer = { init: () => console.log("تم حذف ImageViewer") };
const ImageInteractions = { init: () => console.log("تم حذف ImageInteractions") };

/**
 * كائن إدارة التطبيق الرئيسي
 */
const AppManager = {
  // المكونات الرئيسية
  components: {
    galleryManager: GalleryManager,
    lazyLoader: LazyLoader,
    imageViewer: ImageViewer,
    imageInteractions: ImageInteractions
  },
  
  // الحالة
  state: {
    isInitialized: false,
    isDarkMode: false,
    currentPage: null,
    isRouterEnabled: false
  },
  
  /**
   * تهيئة مدير التطبيق
   */
  init: function() {
    console.log('تهيئة مدير التطبيق...');
    
    // تحديد الصفحة الحالية
    this.detectCurrentPage();
    
    // إعداد مكونات الصفحة المناسبة
    this.setupPageComponents();
    
    // إضافة مستمعات الأحداث العامة
    this.setupGlobalEventListeners();
    
    // تمكين نظام التوجيه إذا كان متاحاً
    this.setupRouter();
    
    // استعادة إعدادات الموضوع
    this.restoreThemeSettings();
    
    // تعيين الحالة إلى "تم التهيئة"
    this.state.isInitialized = true;
    console.log('تم تهيئة مدير التطبيق بنجاح');
    
    return this;
  },
  
  /**
   * تحديد الصفحة الحالية
   */
  detectCurrentPage: function() {
    const path = window.location.pathname;
    
    // تحديد نوع الصفحة الحالية
    if (path.includes('simple-gallery.html') || path.includes('/home')) {
      this.state.currentPage = 'home';
    } else if (path.includes('favorites.html') || path.includes('/favorites')) {
      this.state.currentPage = 'favorites';
    } else if (path.includes('profile.html') || path.includes('/profile')) {
      this.state.currentPage = 'profile';
    } else if (path.includes('ImageGenerator.html') || path.includes('/generator')) {
      this.state.currentPage = 'generator';
    } else if (path.includes('index.html') || path === '/' || path === '') {
      this.state.currentPage = 'index';
    } else {
      this.state.currentPage = 'unknown';
    }
    
    console.log('الصفحة الحالية:', this.state.currentPage);
  },
  
  /**
   * إعداد المكونات المناسبة للصفحة الحالية
   */
  setupPageComponents: function() {
    // إعداد المكونات العامة
    this.initializeGlobalComponents();
    
    // إعداد المكونات الخاصة بالصفحة
    switch (this.state.currentPage) {
      case 'home':
        this.setupHomePageComponents();
        break;
      case 'favorites':
        this.setupFavoritesPageComponents();
        break;
      case 'profile':
        this.setupProfilePageComponents();
        break;
      case 'generator':
        this.setupGeneratorPageComponents();
        break;
      case 'index':
        this.setupIndexPageComponents();
        break;
      default:
        // المكونات العامة تم تهيئتها بالفعل
        break;
    }
  },
  
  /**
   * تهيئة المكونات العامة المشتركة بين جميع الصفحات
   */
  initializeGlobalComponents: function() {
    // تهيئة وحدة التحميل المتأخر للصور
    if (this.components.lazyLoader) {
      this.components.lazyLoader.init();
    }
    
    // تهيئة وحدة التفاعل مع الصور
    if (this.components.imageInteractions) {
      this.components.imageInteractions.init();
    }
    
    // تهيئة وحدة عرض الصور
    if (this.components.imageViewer) {
      this.components.imageViewer.init();
    }
    
    // تهيئة القائمة الجانبية
    if (typeof window.initializeMenu === 'function') {
      window.initializeMenu();
    }
    
    // تهيئة مراقب الاتصال
    if (typeof window.initConnectionMonitor === 'function') {
      window.initConnectionMonitor();
    }
    
    // تهيئة Service Worker إذا كان مدعوماً
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/serviceWorker.js')
          .then(registration => {
            console.log('تم تسجيل Service Worker بنجاح:', registration.scope);
          })
          .catch(error => {
            console.log('فشل تسجيل Service Worker:', error);
          });
      });
    }
  },
  
  /**
   * إعداد مكونات الصفحة الرئيسية
   */
  setupHomePageComponents: function() {
    console.log('إعداد مكونات الصفحة الرئيسية...');
    
    // تهيئة مدير المعرض
    if (this.components.galleryManager) {
      this.components.galleryManager.init({
        containerSelector: '.gallery-container',
        useEnhancedGallery: true,
        useUnifiedMasonry: true
      });
    }
    
    // تهيئة وظائف التصفية
    if (typeof window.initializeFilters === 'function') {
      window.initializeFilters();
    }
    
    // تهيئة أزرار وضع العرض
    document.querySelectorAll('.view-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        if (mode && this.components.galleryManager) {
          this.components.galleryManager.switchViewMode(mode);
        }
      });
    });
  },
  
  /**
   * إعداد مكونات صفحة المفضلة
   */
  setupFavoritesPageComponents: function() {
    console.log('إعداد مكونات صفحة المفضلة...');
    
    // الحصول على قائمة المفضلة
    let favoriteUrls = [];
    if (typeof window.getFavoriteUrls === 'function') {
      favoriteUrls = window.getFavoriteUrls();
    } else if (typeof window.getFavorites === 'function') {
      favoriteUrls = window.getFavorites();
    }
    
    // إذا كانت قائمة المفضلة فارغة، عرض رسالة
    if (favoriteUrls.length === 0) {
      const container = document.querySelector('.gallery-container, #favorites-container');
      if (container) {
        container.innerHTML = `
          <div class="empty-favorites-message">
            <i class="fas fa-star" style="font-size: 48px; color: #FFD700; margin-bottom: 15px;"></i>
            <h3>لا توجد صور في المفضلة</h3>
            <p>قم بإضافة صور للمفضلة باستخدام زر النجمة على الصور في المعرض</p>
            <a href="simple-gallery.html" class="nav-btn">الانتقال للمعرض</a>
          </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
          .empty-favorites-message {
            text-align: center;
            padding: 50px 20px;
            background-color: rgba(0, 0, 0, 0.05);
            border-radius: 12px;
            margin: 30px auto;
            max-width: 600px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
        `;
        document.head.appendChild(style);
      }
      return;
    }
    
    // إنشاء بيانات المعرض من المفضلة
    if (window.imageData && Array.isArray(window.imageData)) {
      // فلترة بيانات الصور لإظهار المفضلة فقط
      window.favoriteImageData = window.imageData.filter(img => 
        favoriteUrls.includes(img.url)
      );
      
      // إذا لم يتم العثور على جميع الصور في بيانات الصور، قم بإنشاء بيانات الصور الناقصة
      const foundUrls = window.favoriteImageData.map(img => img.url);
      const missingUrls = favoriteUrls.filter(url => !foundUrls.includes(url));
      
      if (missingUrls.length > 0) {
        missingUrls.forEach(url => {
          const filename = url.split('/').pop().split(/[?#]/)[0];
          window.favoriteImageData.push({
            url: url,
            alt: 'صورة مفضلة',
            title: {
              ar: filename,
              en: filename
            },
            category: 'favorites'
          });
        });
      }
      
      // تهيئة مدير المعرض مع بيانات المفضلة
      if (this.components.galleryManager) {
        // استخدام بيانات المفضلة بدلاً من بيانات الصور العامة
        const originalImageData = window.imageData;
        window.imageData = window.favoriteImageData;
        
        // تهيئة المعرض
        this.components.galleryManager.init({
          containerSelector: '.gallery-container, #favorites-container',
          useEnhancedGallery: true,
          useUnifiedMasonry: true
        });
        
        // استعادة بيانات الصور الأصلية
        window.imageData = originalImageData;
      }
    }
  },
  
  /**
   * إعداد مكونات صفحة الملف الشخصي
   */
  setupProfilePageComponents: function() {
    console.log('إعداد مكونات صفحة الملف الشخصي...');
    
    // تهيئة وظائف الملف الشخصي
    if (typeof window.initializeProfile === 'function') {
      window.initializeProfile();
    }
    
    // تهيئة مستمعات أحداث تغيير صورة الملف الشخصي
    const avatarInput = document.getElementById('avatar-input');
    if (avatarInput) {
      avatarInput.addEventListener('change', (event) => {
        if (typeof window.handleAvatarChange === 'function') {
          window.handleAvatarChange(event);
        }
      });
    }
    
    // تهيئة مستمعات أحداث تسجيل الخروج
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (typeof window.handleLogout === 'function') {
          window.handleLogout();
        }
      });
    }
    
    // تهيئة مستمعات أحداث حذف الحساب
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    if (deleteAccountBtn) {
      deleteAccountBtn.addEventListener('click', () => {
        if (typeof window.handleDeleteAccount === 'function') {
          window.handleDeleteAccount();
        }
      });
    }
  },
  
  /**
   * إعداد مكونات صفحة مولد الصور
   */
  setupGeneratorPageComponents: function() {
    console.log('إعداد مكونات صفحة مولد الصور...');
    
    // تهيئة وظائف مولد الصور
    if (typeof window.initializeImageGenerator === 'function') {
      window.initializeImageGenerator();
    }
  },
  
  /**
   * إعداد مكونات الصفحة الرئيسية (index)
   */
  setupIndexPageComponents: function() {
    console.log('إعداد مكونات الصفحة الرئيسية...');
    
    // تهيئة مستمعات أحداث إعادة التوجيه
    const startButtons = document.querySelectorAll('[onclick*="checkAuthAndRedirect"]');
    startButtons.forEach(button => {
      button.addEventListener('click', () => {
        if (typeof window.checkAuthAndRedirect === 'function') {
          window.checkAuthAndRedirect('simple-gallery.html');
        }
      });
    });
    
    // تهيئة مستمعات أحداث تسجيل الدخول/الاشتراك
    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
      signinForm.addEventListener('submit', (event) => {
        if (typeof window.handleSignIn === 'function') {
          window.handleSignIn(event);
        }
      });
    }
    
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', (event) => {
        if (typeof window.handleSignUp === 'function') {
          window.handleSignUp(event);
        }
      });
    }
  },
  
  /**
   * إضافة مستمعات الأحداث العامة
   */
  setupGlobalEventListeners: function() {
    // مستمع إعادة التحميل للصور المتأخرة
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // مستمع التمرير للتأثيرات البصرية
    window.addEventListener('scroll', this.handleScroll.bind(this));
    
    // مستمع تحميل النافذة
    window.addEventListener('load', this.handleWindowLoad.bind(this));
  },
  
  /**
   * معالجة حدث تغيير حجم النافذة
   */
  handleResize: function() {
    // إعادة تهيئة Masonry إذا كان متاحاً
    if (this.components.galleryManager) {
      if (typeof this.components.galleryManager.refreshMasonryLayout === 'function') {
        this.components.galleryManager.refreshMasonryLayout();
      }
    }
    
    // تحديث حجم النافذة المنبثقة للصور إذا كانت مفتوحة
    const imageTooltip = document.querySelector('.image-tooltip');
    if (imageTooltip) {
      const container = imageTooltip.querySelector('.fullscreen-image-container');
      if (container) {
        container.style.maxWidth = (window.innerWidth > 768) ? '90%' : '95%';
        container.style.maxHeight = (window.innerWidth > 768) ? '80vh' : '90vh';
      }
    }
  },
  
  /**
   * معالجة حدث التمرير
   */
  handleScroll: function() {
    // إضافة تأثيرات تمرير للعناصر المرئية
    this.applyScrollEffects();
    
    // تحميل الصور المتأخرة الجديدة إذا تم التمرير إلى نهاية الصفحة تقريباً
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 600) {
      if (this.components.lazyLoader && typeof this.components.lazyLoader.setupLazyLoadingForNewImages === 'function') {
        this.components.lazyLoader.setupLazyLoadingForNewImages();
      }
    }
  },
  
  /**
   * تطبيق تأثيرات التمرير على العناصر
   */
  applyScrollEffects: function() {
    // تحديد العناصر التي ستتأثر بالتمرير
    const scrollElements = document.querySelectorAll('.scroll-fade, .scroll-slide');
    
    scrollElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add('active');
      } else {
        element.classList.remove('active');
      }
    });
  },
  
  /**
   * معالجة حدث تحميل النافذة
   */
  handleWindowLoad: function() {
    // إخفاء شاشة التحميل الأولية إذا كانت موجودة
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }
  },
  
  /**
   * إعداد نظام التوجيه
   */
  setupRouter: function() {
    if (typeof window.Router !== 'function') {
      return;
    }
    
    // التحقق من وجود نظام توجيه محلي
    if (window.router && typeof window.router.init === 'function') {
      console.log('تم العثور على نظام توجيه، جاري التهيئة...');
      
      // تسجيل دوال التهيئة للصفحات المختلفة
      if (typeof window.router.registerInitFunction === 'function') {
        window.router.registerInitFunction('/simple-gallery.html', this.setupHomePageComponents.bind(this));
        window.router.registerInitFunction('/favorites.html', this.setupFavoritesPageComponents.bind(this));
        window.router.registerInitFunction('/profile.html', this.setupProfilePageComponents.bind(this));
        window.router.registerInitFunction('/ImageGenerator.html', this.setupGeneratorPageComponents.bind(this));
      }
      
      // تفعيل نظام التوجيه
      window.router.init('#main-content');
      
      this.state.isRouterEnabled = true;
      console.log('تم تهيئة نظام التوجيه بنجاح');
    } else {
      // إنشاء نظام توجيه جديد
      window.router = new window.Router();
      
      if (typeof window.router.init === 'function') {
        // تسجيل دوال التهيئة للصفحات المختلفة
        if (typeof window.router.registerInitFunction === 'function') {
          window.router.registerInitFunction('/simple-gallery.html', this.setupHomePageComponents.bind(this));
          window.router.registerInitFunction('/favorites.html', this.setupFavoritesPageComponents.bind(this));
          window.router.registerInitFunction('/profile.html', this.setupProfilePageComponents.bind(this));
          window.router.registerInitFunction('/ImageGenerator.html', this.setupGeneratorPageComponents.bind(this));
        }
        
        // تفعيل نظام التوجيه
        window.router.init('#main-content');
        
        this.state.isRouterEnabled = true;
        console.log('تم تهيئة نظام توجيه جديد بنجاح');
      }
    }
  },
  
  /**
   * استعادة إعدادات الموضوع
   */
  restoreThemeSettings: function() {
    // استعادة وضع الظلام
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
      this.state.isDarkMode = true;
      document.body.classList.add('dark-mode');
    }
  }
};

// تصدير مدير التطبيق للاستخدام كوحدة
export default AppManager;

// تهيئة مدير التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  // إتاحة مدير التطبيق عالمياً
  window.AppManager = AppManager;
  
  // تهيئة مدير التطبيق
  AppManager.init();
});