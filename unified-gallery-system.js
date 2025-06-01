/**
 * unified-gallery-system.js
 * ملف موحد يجمع بين مكونات المعرض ووظائف التصفية
 * يجمع بين unified-filters.js و unified-gallery-components.js
 */

// ==============================
// الجزء 1: وظائف التصفية الموحدة (من unified-filters.js)
// ==============================

/**
 * الفئة الحالية للتصفية
 * @type {string}
 */
let currentCategory = 'all';

/**
 * البعد الحالي للتصفية
 * @type {string}
 */
let currentDimension = 'all';

/**
 * مصطلح البحث الحالي
 * @type {string}
 */
let currentSearchTerm = '';

/**
 * تهيئة وظائف التصفية
 */
function initializeFilters() {
  console.log('تهيئة وظائف التصفية الموحدة...');
  
  // تهيئة أزرار الفئات
  const categoryButtons = document.querySelectorAll('.category-btn, .filter-btn[data-category]');
  categoryButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const category = button.getAttribute('data-category') || button.getAttribute('data-filter');
      filterByCategory(category);
    });
  });
  
  // تهيئة أزرار الأبعاد
  const dimensionButtons = document.querySelectorAll('.dimension-btn, .filter-btn[data-dimension]');
  dimensionButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const dimension = button.getAttribute('data-dimension') || button.getAttribute('data-filter');
      filterByDimension(dimension);
    });
  });
  
  // تهيئة حقل البحث
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      searchGallery(event.target.value);
    });
    
    // التأكد من أن زر البحث يعمل أيضًا إذا كان موجودًا
    const searchButton = document.querySelector('.search-button, .search-icon');
    if (searchButton) {
      searchButton.addEventListener('click', () => {
        searchGallery(searchInput.value);
      });
    }
  }
  
  // استعادة حالة التصفية السابقة من localStorage
  restoreFilterState();
}

/**
 * استعادة حالة التصفية من التخزين المحلي
 */
function restoreFilterState() {
  try {
    const savedCategory = localStorage.getItem('galleryCategory');
    const savedDimension = localStorage.getItem('galleryDimension');
    const savedSearchTerm = localStorage.getItem('gallerySearchTerm');
    
    // تطبيق الفئة المحفوظة
    if (savedCategory) {
      currentCategory = savedCategory;
      updateCategoryButtons(currentCategory);
    }
    
    // تطبيق البعد المحفوظ
    if (savedDimension) {
      currentDimension = savedDimension;
      updateDimensionButtons(currentDimension);
    }
    
    // تطبيق مصطلح البحث المحفوظ
    if (savedSearchTerm) {
      currentSearchTerm = savedSearchTerm;
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        searchInput.value = currentSearchTerm;
      }
    }
    
    // تطبيق جميع المرشحات
    applyAllFilters();
  } catch (error) {
    console.error('خطأ أثناء استعادة حالة التصفية:', error);
  }
}

/**
 * حفظ حالة التصفية في التخزين المحلي
 */
function saveFilterState() {
  try {
    localStorage.setItem('galleryCategory', currentCategory);
    localStorage.setItem('galleryDimension', currentDimension);
    localStorage.setItem('gallerySearchTerm', currentSearchTerm);
  } catch (error) {
    console.error('خطأ أثناء حفظ حالة التصفية:', error);
  }
}

/**
 * توحيد قيمة الفئة
 * @param {string} category - فئة التصفية
 * @returns {string} - فئة التصفية الموحدة
 */
function normalizeCategory(category) {
  if (!category) return 'all';
  
  // توحيد قيمة الفئة باستخدام تعبير منتظم لإزالة الأحرف غير المسموح بها
  return category.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '');
}

/**
 * توحيد قيمة البعد
 * @param {string} dimension - بعد التصفية
 * @returns {string} - بعد التصفية الموحد
 */
function normalizeDimension(dimension) {
  if (!dimension) return 'all';
  
  // قائمة القيم المسموح بها
  const validDimensions = ['all', 'portrait', 'landscape', 'square'];
  
  // توحيد القيمة
  const normalizedDimension = dimension.toLowerCase().trim();
  
  // التحقق من صحة القيمة
  return validDimensions.includes(normalizedDimension) ? normalizedDimension : 'all';
}

/**
 * تصفية المعرض حسب الفئة
 * @param {string} category - فئة التصفية
 * @param {boolean} saveState - هل يتم حفظ حالة التصفية (اختياري، افتراضي: true)
 */
function filterByCategory(category, saveState = true) {
  console.log('تصفية حسب الفئة:', category);
  
  // توحيد قيمة الفئة
  currentCategory = normalizeCategory(category);
  
  // تحديث حالة الأزرار
  updateCategoryButtons(currentCategory);
  
  // تطبيق التصفية
  applyAllFilters();
  
  // حفظ الحالة في localStorage
  if (saveState) {
    saveFilterState();
  }
}

/**
 * تصفية المعرض حسب البعد
 * @param {string} dimension - بعد التصفية
 * @param {boolean} saveState - هل يتم حفظ حالة التصفية (اختياري، افتراضي: true)
 */
function filterByDimension(dimension, saveState = true) {
  console.log('تصفية حسب البعد:', dimension);
  
  // توحيد قيمة البعد
  currentDimension = normalizeDimension(dimension);
  
  // تحديث حالة الأزرار
  updateDimensionButtons(currentDimension);
  
  // تطبيق التصفية
  applyAllFilters();
  
  // حفظ الحالة في localStorage
  if (saveState) {
    saveFilterState();
  }
}

/**
 * تصفية المعرض حسب مصطلح البحث
 * @param {string|object} searchTerm - مصطلح البحث أو عنصر البحث
 * @param {boolean} saveState - هل يتم حفظ حالة التصفية (اختياري، افتراضي: true)
 */
function searchGallery(searchTerm, saveState = true) {
  // الحصول على النص من العنصر إذا كان كائنًا
  if (typeof searchTerm === 'object' && searchTerm !== null) {
    if (searchTerm.value !== undefined) {
      searchTerm = searchTerm.value;
    } else if (searchTerm.target && searchTerm.target.value !== undefined) {
      searchTerm = searchTerm.target.value;
    }
  }
  
  // تنظيف مصطلح البحث
  currentSearchTerm = (searchTerm || '').trim().toLowerCase();
  
  // تطبيق التصفية
  applyAllFilters();
  
  // حفظ الحالة في localStorage
  if (saveState) {
    saveFilterState();
  }
}

/**
 * تطبيق جميع المرشحات
 */
function applyAllFilters() {
  const galleryItems = document.querySelectorAll('.grid-item, .image-card');
  
  if (galleryItems.length === 0) {
    console.log('لا توجد عناصر معرض لتطبيق المرشحات عليها');
    return;
  }
  
  let visibleCount = 0;
  
  galleryItems.forEach(item => {
    // تحديد الفئة واتجاه الصورة وعنوان الصورة
    const itemCategory = item.getAttribute('data-category') || 'all';
    const itemOrientation = item.getAttribute('data-orientation') || 'all';
    const itemTitle = (item.getAttribute('data-title') || item.textContent || '').toLowerCase();
    const itemAlt = (item.querySelector('img')?.alt || '').toLowerCase();
    
    // تحديد مدى تطابق الفئة
    const categoryMatch = currentCategory === 'all' || itemCategory.includes(currentCategory);
    
    // تحديد مدى تطابق البعد
    const dimensionMatch = currentDimension === 'all' || itemOrientation === currentDimension;
    
    // تحديد مدى تطابق البحث
    const searchMatch = currentSearchTerm === '' || 
                         itemTitle.includes(currentSearchTerm) || 
                         itemAlt.includes(currentSearchTerm);
    
    // تحديد الرؤية بناءً على تطابق جميع الشروط
    const isVisible = categoryMatch && dimensionMatch && searchMatch;
    
    // تطبيق الرؤية على العنصر
    item.style.display = isVisible ? 'block' : 'none';
    
    // تحديث عداد العناصر المرئية
    if (isVisible) {
      visibleCount++;
    }
  });
  
  console.log(`المرشحات المطبقة - ظاهر: ${visibleCount}/${galleryItems.length}`);
  
  // تحديث تخطيط Masonry بعد التصفية
  refreshMasonryLayout();
  
  // عرض رسالة عند عدم وجود نتائج
  const noResultsElement = document.querySelector('.no-results-message');
  if (visibleCount === 0) {
    if (!noResultsElement) {
      const container = document.querySelector('.gallery-container, .masonry-grid');
      if (container) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results-message';
        noResults.innerHTML = `
          <i class="fas fa-search" style="font-size: 48px; margin-bottom: 15px; color: #666;"></i>
          <h3>لا توجد نتائج</h3>
          <p>لم يتم العثور على صور مطابقة للمعايير المحددة.</p>
          <button class="reset-filters-btn">إعادة ضبط المرشحات</button>
        `;
        container.appendChild(noResults);
        
        // إضافة مستمع حدث لزر إعادة الضبط
        const resetBtn = noResults.querySelector('.reset-filters-btn');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            // إعادة تعيين جميع المرشحات
            currentCategory = 'all';
            currentDimension = 'all';
            currentSearchTerm = '';
            
            // تحديث واجهة المستخدم
            updateCategoryButtons('all');
            updateDimensionButtons('all');
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
              searchInput.value = '';
            }
            
            // تطبيق المرشحات وحفظ الحالة
            applyAllFilters();
            saveFilterState();
          });
        }
      }
    }
  } else if (noResultsElement) {
    noResultsElement.remove();
  }
}

/**
 * تحديث حالة أزرار الفئات
 * @param {string} activeCategory - الفئة النشطة
 */
function updateCategoryButtons(activeCategory) {
  document.querySelectorAll('.filter-btn[data-category], .category-btn').forEach(button => {
    const buttonCategory = button.getAttribute('data-category') || button.getAttribute('data-filter');
    
    if (normalizeCategory(buttonCategory) === activeCategory) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

/**
 * تحديث حالة أزرار الأبعاد
 * @param {string} activeDimension - البعد النشط
 */
function updateDimensionButtons(activeDimension) {
  document.querySelectorAll('.filter-btn[data-dimension], .dimension-btn').forEach(button => {
    const buttonDimension = button.getAttribute('data-dimension') || button.getAttribute('data-filter');
    
    if (normalizeDimension(buttonDimension) === activeDimension) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

/**
 * تحديد اتجاه الصورة بناءً على أبعادها
 * @param {HTMLElement} imgElement - عنصر الصورة
 * @returns {string} - اتجاه الصورة ('portrait', 'landscape', 'square')
 */
function determineImageOrientation(imgElement) {
  if (!imgElement || !imgElement.complete) {
    console.log('لا توجد معلومات أبعاد للصورة:', imgElement?.alt || 'غير معروفة');
    return 'landscape'; // قيمة افتراضية
  }
  
  const width = imgElement.naturalWidth;
  const height = imgElement.naturalHeight;
  
  // التأكد من وجود أبعاد
  if (!width || !height) {
    console.log('لا توجد معلومات أبعاد للصورة:', imgElement.alt || 'غير معروفة');
    return 'landscape'; // قيمة افتراضية
  }
  
  // حساب نسبة العرض إلى الارتفاع
  const ratio = width / height;
  
  // تحديد الاتجاه بناءً على النسبة
  if (Math.abs(ratio - 1) < 0.1) {
    return 'square'; // مربع (نسبة قريبة من 1:1)
  } else if (ratio < 0.9) {
    return 'portrait'; // طولي (عمودي)
  } else {
    return 'landscape'; // عرضي (أفقي)
  }
}

/**
 * إعادة ترتيب تخطيط Masonry بعد التصفية
 */
function refreshMasonryLayout() {
  // البحث عن مثيل Masonry
  const masonryGrid = document.querySelector('.masonry-grid');
  
  // البحث عن مكتبة Masonry المتاحة عالمياً
  if (masonryGrid && window.Masonry) {
    // الحصول على مثيل Masonry المخزن
    let masonryInstance = masonryGrid.masonry;
    
    // إعادة تشكيل مثيل Masonry
    if (masonryInstance) {
      setTimeout(() => {
        masonryInstance.layout();
      }, 100);
    } else {
      // إنشاء مثيل جديد إذا لم يكن موجوداً
      masonryInstance = new window.Masonry(masonryGrid, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true,
        transitionDuration: '0.4s'
      });
      
      // تخزين المثيل في عنصر DOM
      masonryGrid.masonry = masonryInstance;
    }
  } else {
    console.log('مكتبة Masonry غير متاحة أو لم يتم العثور على شبكة Masonry');
  }
}

// ==============================
// الجزء 2: مكونات المعرض (من unified-gallery-components.js)
// ==============================

/**
 * تهيئة معرض الصور مع تخطيط Masonry
 * @param {string} containerSelector - محدد CSS لحاوية المعرض
 * @param {Array} images - مصفوفة بيانات الصور 
 */
function initializeGallery(containerSelector, images) {
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.error('لم يتم العثور على حاوية المعرض!');
    return;
  }

  // إنشاء عناصر هيكل المعرض إذا لم تكن موجودة
  if (!document.querySelector(`${containerSelector} .masonry-grid`)) {
    // إنشاء حقل البحث
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
      <input type="text" class="search-input" id="searchInput" placeholder="ابحث عن اسم صورة..." data-i18n-placeholder="searchPlaceholder">
      <i class="fas fa-search search-icon"></i>
    `;
    container.appendChild(searchContainer);
    
    // إنشاء حاوية أزرار الفئات
    const filtersContainer = document.createElement('div');
    filtersContainer.className = 'filters-container';
    filtersContainer.innerHTML = `
      <div class="filters">
        <button class="filter-btn active" data-category="all" data-i18n="allImages">جميع الصور</button>
        <button class="filter-btn" data-category="animals" data-i18n="animals">حيوانات</button>
        <button class="filter-btn" data-category="anime" data-i18n="anime">أنمي</button>
        <button class="filter-btn" data-category="creativity" data-i18n="creativity">إبداع</button>
        <button class="filter-btn" data-category="world" data-i18n="world">عالم</button>
        <button class="filter-btn" data-category="classic" data-i18n="classic">كلاسيكي</button>
      </div>
    `;
    container.appendChild(filtersContainer);
    
    // إنشاء شبكة Masonry
    const masonryGrid = document.createElement('div');
    masonryGrid.className = 'masonry-grid';
    container.appendChild(masonryGrid);
    
    // إضافة عنصر تحديد الحجم للشبكة
    const gridSizer = document.createElement('div');
    gridSizer.className = 'grid-sizer';
    masonryGrid.appendChild(gridSizer);
  }
  
  // عرض الصور في المعرض
  renderGalleryImages(images);
  
  // إضافة مستمعات الأحداث
  setupEventListeners();
  
  console.log('تم إضافة أنماط المعرض الموحدة');
}

/**
 * إضافة مستمعات الأحداث للمعرض
 */
function setupEventListeners() {
  // تهيئة وظائف التصفية
  initializeFilters();
  
  // مستمع لتغيير حجم النافذة
  window.addEventListener('resize', updateLayoutOnResize);
  
  // تهيئة حقل البحث
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    // إضافة مستمع الأحداث للبحث عند الكتابة
    searchInput.addEventListener('input', function() {
      searchGallery(this.value);
    });
    
    // إضافة مستمع الأحداث للبحث عند الضغط على Enter
    searchInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        searchGallery(this.value);
        event.preventDefault();
      }
    });
  }
  
  // تهيئة أزرار المشاركة
  document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', function(event) {
      event.preventDefault();
      const imageUrl = this.getAttribute('data-url');
      const imageTitle = this.getAttribute('data-title') || '';
      shareImage(imageUrl, imageTitle);
    });
  });
}

/**
 * عرض الصور في المعرض باستخدام Masonry
 * @param {Array} images - مصفوفة بيانات الصور
 */
function renderGalleryImages(images) {
  console.log('جاري تحديد أبعاد الصور...');
  
  // الحصول على حاوية المعرض
  const masonryGrid = document.querySelector('.masonry-grid');
  if (!masonryGrid) {
    console.error('لم يتم العثور على حاوية الشبكة!');
    return;
  }
  
  // إزالة جميع العناصر السابقة باستثناء grid-sizer
  const items = masonryGrid.querySelectorAll('.grid-item');
  items.forEach(item => item.remove());
  
  // إنشاء وإضافة بطاقات الصور
  images.forEach(imageData => {
    const card = createImageCard(imageData);
    masonryGrid.appendChild(card);
  });
  
  // تهيئة التحميل المتأخر للصور
  const imgElements = masonryGrid.querySelectorAll('.gallery-img');
  console.log(`تم تهيئة التحميل المؤجل لـ ${imgElements.length} صورة`);
  
  // تطبيق Masonry
  applyMasonry(masonryGrid);
}

/**
 * إنشاء بطاقة صورة واحدة
 * @param {Object} imageData - بيانات الصورة
 * @returns {HTMLElement} عنصر بطاقة الصورة
 */
function createImageCard(imageData) {
  // إنشاء عنصر البطاقة
  const gridItem = document.createElement('div');
  gridItem.className = 'grid-item';
  gridItem.setAttribute('data-category', imageData.category || 'general');
  
  // الحصول على عنوان الصورة المناسب للغة الحالية
  const currentLang = localStorage.getItem('language') || 'ar';
  let imageTitle = '';
  
  if (imageData.title) {
    if (typeof imageData.title === 'object') {
      // استخدام العنوان المناسب للغة الحالية أو الافتراضي
      imageTitle = imageData.title[currentLang] || imageData.title.ar || imageData.title.en || '';
    } else {
      imageTitle = imageData.title;
    }
  } else {
    imageTitle = imageData.alt || 'صورة';
  }
  
  // إنشاء HTML للبطاقة
  gridItem.innerHTML = `
    <div class="card-inner">
      <div class="img-container">
        <img src="${imageData.url}" alt="${imageData.alt || imageTitle}" class="gallery-img" loading="lazy">
      </div>
      <div class="img-overlay">
        <h3>${imageTitle}</h3>
        <div class="img-actions">
          <button class="img-btn download-btn" title="تنزيل" onclick="window.downloadImage(event, '${imageData.url}')">
            <i class="fas fa-download"></i>
          </button>
          <button class="img-btn share-btn" title="مشاركة" data-url="${imageData.url}" data-title="${imageTitle}">
            <i class="fas fa-share-alt"></i>
          </button>
          <button class="img-btn favorite-btn" title="إضافة للمفضلة" data-url="${imageData.url}">
            <i class="far fa-star"></i>
          </button>
        </div>
      </div>
    </div>
  `;
  
  // إضافة مستمع أحداث للصورة
  const img = gridItem.querySelector('.gallery-img');
  if (img) {
    img.addEventListener('load', () => {
      // تحديد اتجاه الصورة بعد التحميل
      const orientation = determineImageOrientation(img);
      gridItem.setAttribute('data-orientation', orientation);
      console.log('تم تحديد بعد الصورة:', imageTitle, orientation);
    });
    
    // إضافة مستمع أحداث للنقر لفتح الصورة
    img.addEventListener('click', () => {
      viewImage(imageData.url, imageTitle);
    });
  }
  
  // إضافة مستمع أحداث لزر المفضلة
  const favoriteBtn = gridItem.querySelector('.favorite-btn');
  if (favoriteBtn) {
    favoriteBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleFavorite(imageData.url, favoriteBtn);
    });
    
    // تحديد حالة المفضلة الحالية
    const favorites = getFavorites();
    if (favorites && favorites.includes(imageData.url)) {
      favoriteBtn.classList.add('active');
      favoriteBtn.querySelector('i').classList.remove('far');
      favoriteBtn.querySelector('i').classList.add('fas');
      favoriteBtn.title = 'إزالة من المفضلة';
    }
  }
  
  return gridItem;
}

/**
 * تطبيق Masonry على حاوية المعرض
 * @param {HTMLElement} masonryGrid - عنصر حاوية المعرض
 */
function applyMasonry(masonryGrid) {
  // التأكد من تحميل مكتبة Masonry
  if (typeof Masonry !== 'undefined') {
    // تأخير صغير للتأكد من تحميل الصور
    setTimeout(() => {
      const masonry = new Masonry(masonryGrid, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true,
        transitionDuration: '0.4s'
      });
      
      // تخزين مثيل Masonry في عنصر DOM
      masonryGrid.masonry = masonry;
      
      console.log('تم تطبيق Masonry بنجاح');
    }, 500);
  } else {
    console.error('مكتبة Masonry غير متاحة');
  }
}

/**
 * تحديث تخطيط المعرض عند تغيير حجم النافذة
 */
function updateLayoutOnResize() {
  const masonryGrid = document.querySelector('.masonry-grid');
  if (!masonryGrid || !masonryGrid.masonry) return;
  
  // إعادة تنظيم المعرض بعد تغيير الحجم
  masonryGrid.masonry.layout();
}

/**
 * تحديث Masonry بعد تطبيق الفلاتر
 */
function refreshMasonry() {
  const masonryGrid = document.querySelector('.masonry-grid');
  if (masonryGrid && masonryGrid.masonry) {
    setTimeout(() => {
      masonryGrid.masonry.layout();
    }, 100);
  }
}

/**
 * تصفية الصور حسب الفئة
 * @param {string} category - اسم الفئة
 */
function filterByCategory(category) {
  console.log('تصفية حسب الفئة:', category);
  
  // تنفيذ التصفية على جميع عناصر المعرض
  const items = document.querySelectorAll('.grid-item');
  items.forEach(item => {
    if (category === 'all' || item.getAttribute('data-category') === category) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
  
  // تحديث الفئة النشطة
  document.querySelectorAll('.filter-btn').forEach(btn => {
    if (btn.getAttribute('data-category') === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // تحديث تخطيط Masonry
  refreshMasonry();
}

/**
 * بحث عن صور في المعرض
 * @param {string} searchTerm - مصطلح البحث
 */
function searchGallery(searchTerm) {
  searchTerm = searchTerm.toLowerCase().trim();
  
  // تنفيذ البحث على جميع عناصر المعرض
  const items = document.querySelectorAll('.grid-item');
  let foundAny = false;
  
  items.forEach(item => {
    const img = item.querySelector('img');
    const title = item.querySelector('h3')?.textContent.toLowerCase() || '';
    const alt = img?.alt.toLowerCase() || '';
    
    if (title.includes(searchTerm) || alt.includes(searchTerm) || searchTerm === '') {
      item.style.display = 'block';
      foundAny = true;
    } else {
      item.style.display = 'none';
    }
  });
  
  // إظهار رسالة إذا لم يتم العثور على نتائج
  const noResultsMsg = document.querySelector('.no-results-message');
  if (!foundAny && searchTerm !== '') {
    if (!noResultsMsg) {
      const container = document.querySelector('.masonry-grid');
      if (container) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results-message';
        noResults.innerHTML = `
          <i class="fas fa-search"></i>
          <p>لم يتم العثور على نتائج لـ "${searchTerm}"</p>
        `;
        container.appendChild(noResults);
      }
    }
  } else if (noResultsMsg) {
    noResultsMsg.remove();
  }
  
  // تحديث تخطيط Masonry
  refreshMasonry();
}

/**
 * عرض الصورة في وضع ملء الشاشة
 * @param {string} url - رابط الصورة
 * @param {string} title - عنوان الصورة
 */
function viewImage(url, title) {
  // إنشاء عناصر الصورة بملء الشاشة
  const overlay = document.createElement('div');
  overlay.className = 'fullscreen-overlay';
  
  // HTML لصورة ملء الشاشة
  overlay.innerHTML = `
    <div class="fullscreen-container">
      <div class="fullscreen-header">
        <h3>${title}</h3>
        <button class="close-btn"><i class="fas fa-times"></i></button>
      </div>
      <div class="fullscreen-image-wrapper">
        <img src="${url}" alt="${title}" class="fullscreen-image">
      </div>
      <div class="fullscreen-footer">
        <button class="action-btn download-btn" onclick="window.downloadImage(event, '${url}')">
          <i class="fas fa-download"></i> تنزيل
        </button>
        <button class="action-btn share-btn" data-url="${url}" data-title="${title}">
          <i class="fas fa-share-alt"></i> مشاركة
        </button>
        <button class="action-btn favorite-btn" data-url="${url}">
          <i class="far fa-star"></i> المفضلة
        </button>
      </div>
    </div>
  `;
  
  // إضافة العنصر للصفحة
  document.body.appendChild(overlay);
  
  // تفعيل العنصر بعد إضافته
  setTimeout(() => {
    overlay.classList.add('active');
  }, 10);
  
  // إضافة مستمع أحداث لزر الإغلاق
  const closeBtn = overlay.querySelector('.close-btn');
  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
    setTimeout(() => {
      overlay.remove();
    }, 300);
  });
  
  // إضافة مستمع أحداث للنقر خارج الصورة
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      overlay.classList.remove('active');
      setTimeout(() => {
        overlay.remove();
      }, 300);
    }
  });
  
  // إضافة مستمع أحداث لزر المشاركة
  const shareBtn = overlay.querySelector('.share-btn');
  shareBtn.addEventListener('click', () => {
    shareImage(url, title);
  });
  
  // إضافة مستمع أحداث لزر المفضلة
  const favoriteBtn = overlay.querySelector('.favorite-btn');
  
  // تحديث حالة المفضلة الحالية
  const favorites = getFavorites();
  if (favorites && favorites.includes(url)) {
    favoriteBtn.classList.add('active');
    favoriteBtn.querySelector('i').classList.remove('far');
    favoriteBtn.querySelector('i').classList.add('fas');
    favoriteBtn.innerHTML = '<i class="fas fa-star"></i> إزالة من المفضلة';
  }
  
  favoriteBtn.addEventListener('click', () => {
    toggleFavorite(url, favoriteBtn);
  });
}

/**
 * مشاركة الصورة
 * @param {string} imageUrl - رابط الصورة
 * @param {string} title - عنوان الصورة (اختياري)
 */
function shareImage(imageUrl, title) {
  if (navigator.share) {
    // استخدام واجهة مشاركة الويب إذا كانت متاحة
    navigator.share({
      title: title || 'مشاركة صورة',
      text: 'إلقِ نظرة على هذه الصورة الرائعة!',
      url: imageUrl,
    }).then(() => {
      console.log('تمت المشاركة بنجاح');
    }).catch((error) => {
      console.error('خطأ في المشاركة:', error);
    });
  } else {
    // استخدام طريقة بديلة إذا كانت واجهة المشاركة غير متاحة
    try {
      // إنشاء حقل نصي مؤقت
      const textArea = document.createElement('textarea');
      textArea.value = imageUrl;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      // نسخ الرابط إلى الحافظة
      const successful = document.execCommand('copy');
      
      // إزالة الحقل النصي
      textArea.remove();
      
      if (successful) {
        alert('تم نسخ رابط الصورة إلى الحافظة');
      } else {
        alert('فشل نسخ الرابط، يرجى النسخ يدويًا: ' + imageUrl);
      }
    } catch (err) {
      console.error('خطأ في المشاركة:', err);
      alert('فشل في المشاركة. حاول مرة أخرى لاحقًا.');
    }
  }
}

/**
 * تعيين صورة كصورة ملف شخصي
 * @param {string} imageUrl - رابط الصورة
 */
function setProfileImage(imageUrl) {
  // التأكد من تسجيل الدخول
  if (typeof window.getCurrentUser !== 'function' || !window.getCurrentUser()) {
    alert('يجب تسجيل الدخول لتعيين صورة شخصية');
    return;
  }
  
  // تعيين الصورة كصورة ملف شخصي
  if (typeof window.setAsProfileImage === 'function') {
    window.setAsProfileImage(imageUrl);
  } else {
    alert('وظيفة تعيين صورة الملف الشخصي غير متاحة');
  }
}

/**
 * نسخ نص إلى الحافظة
 * @param {string} text - النص المراد نسخه
 */
function copyToClipboard(text) {
  try {
    // استخدام واجهة الحافظة الحديثة إذا كانت متاحة
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          alert('تم نسخ النص إلى الحافظة');
        })
        .catch((err) => {
          console.error('خطأ في نسخ النص:', err);
          fallbackCopyToClipboard(text);
        });
    } else {
      fallbackCopyToClipboard(text);
    }
  } catch (err) {
    console.error('خطأ في نسخ النص:', err);
    alert('فشل نسخ النص، يرجى النسخ يدويًا: ' + text);
  }
  
  // طريقة بديلة للنسخ باستخدام execCommand
  function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      textArea.remove();
      
      if (successful) {
        alert('تم نسخ النص إلى الحافظة');
      } else {
        alert('فشل نسخ النص، يرجى النسخ يدويًا: ' + text);
      }
    } catch (err) {
      console.error('خطأ في نسخ النص:', err);
      textArea.remove();
      alert('فشل نسخ النص، يرجى النسخ يدويًا: ' + text);
    }
  }
}

/**
 * استخراج اسم الملف من الرابط
 * @param {string} url - رابط الصورة
 * @returns {string} اسم الملف المستخرج
 */
function getFilenameFromUrl(url) {
  // استخراج اسم الملف من الرابط
  const urlParts = url.split('/');
  let filename = urlParts[urlParts.length - 1];
  
  // إزالة أي معلمات URL من اسم الملف
  filename = filename.split(/[?#]/)[0];
  
  // إذا لم يكن هناك اسم ملف أو كان فارغًا، استخدام اسم افتراضي
  if (!filename || filename.trim() === '') {
    filename = 'image.jpg';
  }
  
  return filename;
}

/**
 * تبديل حالة الإعجاب للصورة
 * @param {string} imageUrl - رابط الصورة
 * @param {HTMLElement} button - زر الإعجاب
 */
function toggleLike(imageUrl, button) {
  // تنفيذ تبديل الإعجاب
  if (typeof window.recordImageLike === 'function') {
    window.recordImageLike(!button.classList.contains('active'));
  }
  
  // تحديث واجهة المستخدم
  button.classList.toggle('active');
  
  // تحديث الأيقونة
  const icon = button.querySelector('i');
  if (icon) {
    if (button.classList.contains('active')) {
      icon.classList.remove('far');
      icon.classList.add('fas');
    } else {
      icon.classList.remove('fas');
      icon.classList.add('far');
    }
  }
  
  // إضافة تأثير بصري
  button.classList.add('pulse');
  setTimeout(() => {
    button.classList.remove('pulse');
  }, 500);
}

/**
 * تبديل حالة المفضلة للصورة
 * @param {string} imageUrl - رابط الصورة
 * @param {HTMLElement} button - زر المفضلة
 */
function toggleFavorite(imageUrl, button) {
  // التأكد من وجود دالة toggleFavorite في التخزين
  if (typeof window.toggleFavorite !== 'function') {
    console.error('وظيفة toggleFavorite غير متاحة');
    return;
  }
  
  // تنفيذ تبديل المفضلة
  const isFavorite = window.toggleFavorite(imageUrl);
  
  // تحديث نص وأيقونة الزر بناءً على الحالة الجديدة
  if (isFavorite) {
    button.classList.add('active');
    const icon = button.querySelector('i');
    if (icon) {
      icon.classList.remove('far');
      icon.classList.add('fas');
    }
    
    // تحديث النص إذا كان زر مفضلة في العرض الكامل
    if (button.classList.contains('action-btn')) {
      button.innerHTML = '<i class="fas fa-star"></i> إزالة من المفضلة';
    } else {
      button.title = 'إزالة من المفضلة';
    }
  } else {
    button.classList.remove('active');
    const icon = button.querySelector('i');
    if (icon) {
      icon.classList.remove('fas');
      icon.classList.add('far');
    }
    
    // تحديث النص إذا كان زر مفضلة في العرض الكامل
    if (button.classList.contains('action-btn')) {
      button.innerHTML = '<i class="far fa-star"></i> المفضلة';
    } else {
      button.title = 'إضافة للمفضلة';
    }
  }
  
  // إضافة تأثير بصري
  button.classList.add('scaled');
  setTimeout(() => {
    button.classList.remove('scaled');
  }, 300);
}

/**
 * الحصول على قائمة المفضلة
 * @returns {Array} قائمة المفضلة
 */
function getFavorites() {
  if (typeof window.getFavorites === 'function') {
    return window.getFavorites();
  }
  return [];
}

// جعل الوظائف متاحة عالمياً
window.initializeGallery = initializeGallery;
window.setupEventListeners = setupEventListeners;
window.renderGalleryImages = renderGalleryImages;
window.createImageCard = createImageCard;
window.applyMasonry = applyMasonry;
window.updateLayoutOnResize = updateLayoutOnResize;
window.refreshMasonry = refreshMasonry;
window.filterByCategory = filterByCategory;
window.searchGallery = searchGallery;
window.viewImage = viewImage;
window.shareImage = shareImage;
window.setProfileImage = setProfileImage;
window.copyToClipboard = copyToClipboard;
window.getFilenameFromUrl = getFilenameFromUrl;
window.toggleLike = toggleLike;
window.toggleFavorite = toggleFavorite;
window.initializeFilters = initializeFilters;
window.applyAllFilters = applyAllFilters;