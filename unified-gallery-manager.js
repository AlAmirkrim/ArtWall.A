/**
 * unified-gallery-manager.js
 * ملف رئيسي موحد لإدارة جميع وظائف المعرض
 * يعمل كنقطة دخول واحدة لجميع وظائف المعرض المحسنة
 */

// استيراد الوحدات الموحدة
import GalleryUtils from './shared-gallery-utilities.js';
import ImageInteractions from './unified-image-interactions.js';
import ImageViewer from './unified-image-viewer.js';

// تعريف المدير الرئيسي للمعرض
const GalleryManager = {
  // إعدادات افتراضية
  settings: {
    containerSelector: '.gallery-container',
    useEnhancedGallery: true,
    useUnifiedMasonry: true,
    useLocalStorage: true,
    autoInit: true
  },
  
  // حالة المعرض
  state: {
    isInitialized: false,
    currentCategory: 'all',
    currentDimension: 'all',
    currentSearchTerm: '',
    viewMode: 'grid'
  },
  
  /**
   * تهيئة مدير المعرض مع الإعدادات المخصصة
   * @param {Object} customSettings - إعدادات مخصصة (اختيارية)
   */
  init: function(customSettings = {}) {
    console.log('تهيئة مدير المعرض الموحد...');
    
    // دمج الإعدادات المخصصة مع الإعدادات الافتراضية
    this.settings = { ...this.settings, ...customSettings };
    
    // تسجيل المكونات الفرعية
    this.registerComponents();
    
    // استعادة حالة المعرض من التخزين المحلي
    this.restoreGalleryState();
    
    // تهيئة تلقائية إذا تم تعيين autoInit = true
    if (this.settings.autoInit) {
      // التأكد من اكتمال تحميل الصفحة قبل التهيئة
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.initGallery());
      } else {
        this.initGallery();
      }
    }
    
    // تعيين الحالة إلى "تم التهيئة"
    this.state.isInitialized = true;
    console.log('تم تهيئة مدير المعرض بنجاح');
    
    return this;
  },
  
  /**
   * تسجيل جميع المكونات الفرعية
   */
  registerComponents: function() {
    // تعيين المراجع للمكونات الفرعية
    this.galleryUtils = GalleryUtils;
    this.imageInteractions = ImageInteractions;
    this.imageViewer = ImageViewer;
    
    // إتاحة الوظائف العامة على النطاق العالمي
    this.exposeGlobalFunctions();
  },
  
  /**
   * إتاحة الوظائف الأساسية على النطاق العالمي لضمان التوافق مع الكود القديم
   */
  exposeGlobalFunctions: function() {
    // وظائف الواجهة
    window.initGallery = this.initGallery.bind(this);
    window.renderGallery = this.renderGallery.bind(this);
    window.refreshGallery = this.refreshGallery.bind(this);
    window.switchGalleryViewMode = this.switchViewMode.bind(this);
    
    // وظائف التصفية
    window.filterByCategory = this.filterByCategory.bind(this);
    window.filterByDimension = this.filterByDimension.bind(this);
    window.searchGallery = this.searchGallery.bind(this);
    
    // التوافق مع الكود القديم
    window.filterGalleryByCategory = this.filterByCategory.bind(this);
    window.filterGalleryByDimension = this.filterByDimension.bind(this);
  },
  
  /**
   * استعادة حالة المعرض من التخزين المحلي
   */
  restoreGalleryState: function() {
    if (!this.settings.useLocalStorage) return;
    
    // استعادة الفئة الحالية
    const savedCategory = localStorage.getItem('currentCategory');
    if (savedCategory) {
      this.state.currentCategory = savedCategory;
    }
    
    // استعادة البعد الحالي
    const savedDimension = localStorage.getItem('currentDimension');
    if (savedDimension) {
      this.state.currentDimension = savedDimension;
    }
    
    // استعادة مصطلح البحث الحالي
    const savedSearchTerm = localStorage.getItem('currentSearchTerm');
    if (savedSearchTerm) {
      this.state.currentSearchTerm = savedSearchTerm;
    }
    
    // استعادة وضع العرض
    const savedViewMode = localStorage.getItem('galleryViewMode');
    if (savedViewMode) {
      this.state.viewMode = savedViewMode;
    }
  },
  
  /**
   * حفظ حالة المعرض في التخزين المحلي
   */
  saveGalleryState: function() {
    if (!this.settings.useLocalStorage) return;
    
    localStorage.setItem('currentCategory', this.state.currentCategory);
    localStorage.setItem('currentDimension', this.state.currentDimension);
    localStorage.setItem('currentSearchTerm', this.state.currentSearchTerm);
    localStorage.setItem('galleryViewMode', this.state.viewMode);
  },
  
  /**
   * تهيئة المعرض وتحميل الصور
   */
  initGallery: function() {
    console.log('تهيئة المعرض...');
    
    // التأكد من وجود بيانات الصور
    if (!window.imageData && window.galleryImages) {
      window.imageData = window.galleryImages;
      console.log('تم تعيين بيانات الصور من galleryImages');
    }
    
    if (!window.imageData || !Array.isArray(window.imageData) || window.imageData.length === 0) {
      console.error('لم يتم العثور على بيانات الصور!');
      return false;
    }
    
    // تهيئة وظائف التصفية
    if (typeof window.initializeFilters === 'function') {
      window.initializeFilters();
    }
    
    // عرض المعرض
    this.renderGallery();
    
    // تطبيق حالة التصفية المحفوظة
    this.applyFilters();
    
    return true;
  },
  
  /**
   * عرض المعرض بناءً على الإعدادات
   */
  renderGallery: function() {
    console.log('عرض المعرض...');
    
    // العثور على حاوية المعرض
    const galleryContainer = document.querySelector(this.settings.containerSelector);
    if (!galleryContainer) {
      console.error('لم يتم العثور على حاوية المعرض!');
      return false;
    }
    
    // عرض المعرض بناءً على الإعدادات
    if (this.settings.useEnhancedGallery && typeof window.setupMasonryGallery === 'function') {
      // استخدام Masonry الموحد إذا كان متاحًا
      if (this.settings.useUnifiedMasonry && typeof window.createMasonryGallery === 'function') {
        window.createMasonryGallery(this.settings.containerSelector, window.imageData);
      } else {
        window.setupMasonryGallery(this.settings.containerSelector, window.imageData);
      }
    } else {
      // استخدام العرض البسيط
      this.renderSimpleGallery(galleryContainer);
    }
    
    // تطبيق وضع العرض الحالي
    this.applyViewMode();
    
    return true;
  },
  
  /**
   * عرض المعرض بطريقة بسيطة وقياسية
   * @param {HTMLElement} container - حاوية المعرض
   */
  renderSimpleGallery: function(container) {
    // إنشاء أو استخدام شبكة الصور
    let galleryGrid = container.querySelector('.gallery-grid');
    if (!galleryGrid) {
      galleryGrid = document.createElement('div');
      galleryGrid.className = 'gallery-grid';
      container.innerHTML = '';
      container.appendChild(galleryGrid);
    } else {
      galleryGrid.innerHTML = '';
    }
    
    // إضافة الصور إلى المعرض
    if (window.imageData && Array.isArray(window.imageData)) {
      window.imageData.forEach((imageData, index) => {
        // إنشاء بطاقة الصورة
        const card = document.createElement('div');
        card.className = 'gallery-card';
        card.setAttribute('data-category', imageData.category || '');
        
        // الحصول على العنوان المناسب للغة الحالية
        const currentLang = localStorage.getItem('language') || 'ar';
        let imageTitle;
        if (imageData.title && typeof imageData.title === 'object') {
          imageTitle = imageData.title[currentLang] || imageData.title.ar || imageData.title.en || imageData.alt || 'صورة';
        } else {
          imageTitle = imageData.title || imageData.alt || 'صورة';
        }
        
        // إنشاء HTML لبطاقة الصورة
        card.innerHTML = `
          <div class="image-container">
            <img src="${imageData.url}" alt="${imageData.alt || imageTitle}" class="gallery-image">
            <div class="image-title">${imageTitle}</div>
          </div>
          <div class="image-actions">
            <button class="view-btn" onclick="window.viewImage('${imageData.url}', event)">
              <i class="fas fa-eye"></i> عرض
            </button>
            <button class="download-btn" onclick="window.downloadImage(event, '${imageData.url}')">
              <i class="fas fa-download"></i> تنزيل
            </button>
          </div>
        `;
        
        // إضافة بطاقة الصورة إلى الشبكة
        galleryGrid.appendChild(card);
      });
    }
  },
  
  /**
   * تحديث المعرض (إعادة التحميل)
   */
  refreshGallery: function() {
    // إعادة عرض المعرض
    this.renderGallery();
    
    // إعادة تطبيق الفلاتر
    this.applyFilters();
    
    return true;
  },
  
  /**
   * تصفية المعرض حسب الفئة
   * @param {string} category - فئة التصفية
   */
  filterByCategory: function(category) {
    console.log('تصفية المعرض حسب الفئة:', category);
    
    // توحيد قيمة الفئة
    this.state.currentCategory = this.normalizeCategory(category);
    
    // تحديث حالة أزرار التصفية
    this.updateCategoryButtons();
    
    // تطبيق الفلاتر
    this.applyFilters();
    
    // حفظ الحالة
    this.saveGalleryState();
    
    return false; // منع السلوك الافتراضي للرابط
  },
  
  /**
   * تصفية المعرض حسب البعد
   * @param {string} dimension - بعد التصفية
   */
  filterByDimension: function(dimension) {
    console.log('تصفية المعرض حسب البعد:', dimension);
    
    // توحيد قيمة البعد
    this.state.currentDimension = this.normalizeDimension(dimension);
    
    // تحديث حالة أزرار التصفية
    this.updateDimensionButtons();
    
    // تطبيق الفلاتر
    this.applyFilters();
    
    // حفظ الحالة
    this.saveGalleryState();
    
    return false; // منع السلوك الافتراضي للرابط
  },
  
  /**
   * بحث في المعرض
   * @param {string|object} searchTerm - مصطلح البحث أو عنصر البحث
   */
  searchGallery: function(searchTerm) {
    console.log('البحث في المعرض عن:', searchTerm);
    
    // تعامل مع أنواع مختلفة من المدخلات
    if (searchTerm === null || searchTerm === undefined) {
      this.state.currentSearchTerm = '';
    }
    // إذا كان مربع بحث
    else if (typeof searchTerm === 'object') {
      // فحص إذا كان عنصر HTML مثل input
      if (searchTerm.value !== undefined) {
        this.state.currentSearchTerm = searchTerm.value.toLowerCase().trim();
      }
      // فحص إذا كان حدث
      else if (searchTerm.target && searchTerm.target.value !== undefined) {
        this.state.currentSearchTerm = searchTerm.target.value.toLowerCase().trim();
      }
      // التعامل مع كائنات أخرى
      else {
        this.state.currentSearchTerm = '';
      }
    }
    // إذا كان نص
    else {
      this.state.currentSearchTerm = String(searchTerm).toLowerCase().trim();
    }
    
    // تطبيق الفلاتر
    this.applyFilters();
    
    // حفظ الحالة
    this.saveGalleryState();
    
    // تحديث مربع البحث إذا كان موجوداً
    const searchInput = document.querySelector('#gallery-search, #search-input');
    if (searchInput && searchInput.value !== this.state.currentSearchTerm) {
      searchInput.value = this.state.currentSearchTerm;
    }
    
    return false; // منع السلوك الافتراضي للنموذج
  },
  
  /**
   * تطبيق جميع الفلاتر النشطة
   */
  applyFilters: function() {
    console.log('تطبيق جميع الفلاتر:', 
      'فئة:', this.state.currentCategory, 
      'بعد:', this.state.currentDimension, 
      'بحث:', this.state.currentSearchTerm
    );
    
    // استخدام وظيفة التصفية الموحدة إذا كانت متاحة
    if (typeof window.applyAllFilters === 'function') {
      window.applyAllFilters();
      return;
    }
    
    // التطبيق اليدوي للفلاتر
    const items = document.querySelectorAll('.grid-item, .gallery-card');
    
    items.forEach(item => {
      // استخراج البيانات من العنصر
      const itemCategory = this.normalizeCategory(item.getAttribute('data-category') || '');
      const itemTitle = item.querySelector('.image-title')?.textContent || '';
      
      // تحقق من تطابق الفئة
      const matchesCategory = (this.state.currentCategory === 'all' || itemCategory === this.state.currentCategory);
      
      // تحقق من تطابق البعد
      const matchesDimension = (this.state.currentDimension === 'all' || 
                              item.classList.contains(this.state.currentDimension) ||
                              item.getAttribute('data-dimension') === this.state.currentDimension);
      
      // تحقق من تطابق البحث
      const matchesSearch = !this.state.currentSearchTerm || 
                          itemTitle.toLowerCase().includes(this.state.currentSearchTerm) || 
                          itemCategory.toLowerCase().includes(this.state.currentSearchTerm);
      
      // تطبيق نتيجة التصفية
      item.style.display = (matchesCategory && matchesDimension && matchesSearch) ? '' : 'none';
    });
    
    // إعادة ترتيب Masonry إذا كان متاحًا
    this.refreshMasonryLayout();
  },
  
  /**
   * تحديث حالة أزرار الفئات
   */
  updateCategoryButtons: function() {
    document.querySelectorAll('.category-btn, .filter-btn[data-category]').forEach(btn => {
      const buttonCategory = this.normalizeCategory(btn.getAttribute('data-category') || btn.getAttribute('data-filter') || '');
      
      if (buttonCategory === this.state.currentCategory) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  },
  
  /**
   * تحديث حالة أزرار الأبعاد
   */
  updateDimensionButtons: function() {
    document.querySelectorAll('.dimension-btn, .filter-btn[data-dimension]').forEach(btn => {
      const buttonDimension = this.normalizeDimension(btn.getAttribute('data-dimension') || btn.getAttribute('data-filter') || '');
      
      if (buttonDimension === this.state.currentDimension) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  },
  
  /**
   * تغيير وضع عرض المعرض
   * @param {string} viewMode - وضع العرض ('grid', 'compact', 'masonry')
   */
  switchViewMode: function(viewMode) {
    console.log('تغيير وضع عرض المعرض إلى:', viewMode);
    
    // تحديث وضع العرض الحالي
    this.state.viewMode = viewMode;
    
    // تطبيق وضع العرض الجديد
    this.applyViewMode();
    
    // تحديث أزرار وضع العرض
    this.updateViewModeButtons();
    
    // حفظ الحالة
    this.saveGalleryState();
  },
  
  /**
   * تطبيق وضع العرض الحالي
   */
  applyViewMode: function() {
    // الحصول على حاوية المعرض
    const galleryContainer = document.querySelector(this.settings.containerSelector);
    if (!galleryContainer) return;
    
    // إزالة جميع فئات وضع العرض من الحاوية
    galleryContainer.classList.remove('grid-view', 'compact-view', 'masonry-view');
    
    // إضافة فئة وضع العرض الحالي
    galleryContainer.classList.add(`${this.state.viewMode}-view`);
    
    // إضافة أنماط CSS خاصة بوضع العرض
    switch (this.state.viewMode) {
      case 'grid':
        galleryContainer.style.display = 'grid';
        galleryContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
        galleryContainer.style.gap = '15px';
        break;
      case 'compact':
        galleryContainer.style.display = 'flex';
        galleryContainer.style.flexWrap = 'wrap';
        galleryContainer.style.gap = '10px';
        break;
      case 'masonry':
        // ترك الأمر لمكتبة Masonry
        galleryContainer.style.display = 'block';
        
        // إعادة تهيئة Masonry إذا كان متاحًا
        this.refreshMasonryLayout();
        break;
    }
  },
  
  /**
   * تحديث حالة أزرار وضع العرض
   */
  updateViewModeButtons: function() {
    document.querySelectorAll('.view-mode-btn').forEach(btn => {
      const buttonMode = btn.getAttribute('data-mode');
      
      if (buttonMode === this.state.viewMode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  },
  
  /**
   * إعادة ترتيب تخطيط Masonry
   */
  refreshMasonryLayout: function() {
    if (typeof Masonry === 'undefined') {
      return; // تجاهل إذا لم تكن مكتبة Masonry متاحة
    }
    
    // البحث عن جميع حاويات Masonry المحتملة
    const containers = [
      document.querySelector('.masonry-grid'),
      document.querySelector('.gallery-container .masonry-grid'),
      document.querySelector('#enhanced-gallery-container')
    ];
    
    containers.forEach(container => {
      if (container) {
        // الحصول على مثيل Masonry المرتبط بالحاوية
        const masonry = Masonry.data(container);
        if (masonry) {
          // تأخير قصير لضمان اكتمال عمليات DOM
          setTimeout(() => {
            masonry.layout();
            console.log('تم إعادة ترتيب Masonry');
          }, 100);
        }
      }
    });
  },
  
  /**
   * توحيد قيمة الفئة
   * @param {string} category - فئة التصفية
   * @returns {string} - فئة التصفية الموحدة
   */
  normalizeCategory: function(category) {
    if (!category) return 'all';
    
    // تحويل القيمة إلى أحرف صغيرة وإزالة أي مسافات زائدة
    let normalizedCategory = category.toLowerCase().trim();
    
    // في حالة وجود الفئة مع وصف إضافي مثل "Creativity - gold coins"
    // قم بأخذ الفئة الرئيسية فقط (الجزء قبل الشرطة)
    if (normalizedCategory.includes(' - ')) {
      normalizedCategory = normalizedCategory.split(' - ')[0].trim();
    } else if (normalizedCategory.includes(' – ')) {
      normalizedCategory = normalizedCategory.split(' – ')[0].trim();
    } else if (normalizedCategory.includes('-')) {
      normalizedCategory = normalizedCategory.split('-')[0].trim();
    }
    
    // تعامل مع الحالات الخاصة
    if (normalizedCategory === '*' || normalizedCategory === 'الكل' || normalizedCategory === 'all' || normalizedCategory === 'any') {
      return 'all';
    }
    
    return normalizedCategory;
  },
  
  /**
   * توحيد قيمة البعد
   * @param {string} dimension - بعد التصفية
   * @returns {string} - بعد التصفية الموحد
   */
  normalizeDimension: function(dimension) {
    if (!dimension) return 'all';
    
    const dimensionValue = dimension.toLowerCase().trim();
    
    // تعامل مع الحالات الخاصة
    if (dimensionValue === '*' || dimensionValue === 'الكل' || dimensionValue === 'all' || dimensionValue === 'any') {
      return 'all';
    }
    
    return dimensionValue;
  }
};

// تصدير مدير المعرض للاستخدام كوحدة
export default GalleryManager;

// تهيئة مدير المعرض عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  // إتاحة مدير المعرض عالمياً
  window.GalleryManager = GalleryManager;
  
  // تهيئة مدير المعرض تلقائياً
  GalleryManager.init();
});