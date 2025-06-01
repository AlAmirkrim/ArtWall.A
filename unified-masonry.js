/**
 * unified-masonry.js
 * ملف موحد وأمثل لإنشاء وإدارة معرض الصور بتخطيط Masonry
 * يجمع بين وظائف masonry.js و masonry-optimized.js مع تحسينات إضافية
 */

// مصفوفة لتتبع الصور التي تم تحميلها
let loadedImages = [];

/**
 * إنشاء معرض صور Masonry
 * @param {string} containerSelector - محدد CSS للحاوية (مثل '.gallery-container' أو معرف فريد)
 * @param {Array} images - مصفوفة بيانات الصور
 */
function createMasonryGallery(containerSelector, images) {
  console.log('بدء إنشاء معرض Masonry الموحد...');
  
  // العثور على حاوية المعرض بطريقة مرنة
  let container = findGalleryContainer(containerSelector);
  if (!container) {
    console.error('لم يتم العثور على حاوية المعرض:', containerSelector);
    return;
  }
  
  // البحث عن أو إنشاء شبكة Masonry
  let masonryGrid = findOrCreateMasonryGrid(container);
  
  // تفريغ المحتويات الحالية مع الحفاظ على عناصر التنسيق
  preserveAndClearMasonryGrid(masonryGrid);
  
  // تتبع عدد الصور التي تم تحميلها
  let loadedImagesCount = 0;
  const totalImages = images.length;
  
  console.log(`إضافة ${images.length} صورة إلى المعرض...`);
  
  // إضافة الصور إلى المعرض
  images.forEach((imageData, index) => {
    // إنشاء بطاقة الصورة وإضافتها للمعرض
    const gridItem = createMasonryImageCard(imageData, index, () => {
      // استدعاء عند اكتمال تحميل الصورة
      loadedImagesCount++;
      
      // عند اكتمال تحميل جميع الصور، تهيئة Masonry
      if (loadedImagesCount === totalImages) {
        initializeMasonry(masonryGrid);
      }
    });
    
    // إضافة العنصر إلى شبكة المعرض
    masonryGrid.appendChild(gridItem);
  });
  
  // تطبيق Masonry بعد فترة زمنية مناسبة حتى وإن لم تكتمل جميع الصور
  setTimeout(() => {
    if (loadedImagesCount < totalImages) {
      console.log(`تطبيق Masonry بعد تحميل ${loadedImagesCount} من ${totalImages} صورة...`);
      initializeMasonry(masonryGrid);
    }
  }, 5000);
}

/**
 * العثور على حاوية المعرض بطريقة مرنة
 * @param {string} containerSelector - المحدد (سواء كان معرف، فئة، أو محدد CSS)
 * @returns {HTMLElement} - عنصر الحاوية أو null إذا لم يتم العثور عليه
 */
function findGalleryContainer(containerSelector) {
  // محاولة العثور على العنصر بالطرق المختلفة
  let container;
  
  // إذا كان المحدد يبدأ بـ "." فهو فئة
  if (containerSelector.startsWith('.')) {
    container = document.querySelector(containerSelector);
  } 
  // إذا كان المحدد يبدأ بـ "#" فهو معرّف
  else if (containerSelector.startsWith('#')) {
    container = document.querySelector(containerSelector);
  } 
  // نحاول أولاً كمعرّف
  else {
    container = document.getElementById(containerSelector);
    
    // إذا لم نجد، نحاول كفئة
    if (!container) {
      container = document.querySelector('.' + containerSelector);
    }
    
    // إذا لم نجد أيضًا، نجرب استخدام المحدد كما هو
    if (!container) {
      container = document.querySelector(containerSelector);
    }
  }
  
  // إذا لم نجد الحاوية، نحاول الحصول على الحاوية الافتراضية
  if (!container) {
    container = document.querySelector('.gallery-container');
    if (container) {
      console.log('تم استخدام حاوية المعرض الافتراضية (.gallery-container)');
    }
  }
  
  return container;
}

/**
 * البحث عن أو إنشاء شبكة Masonry داخل الحاوية
 * @param {HTMLElement} container - حاوية المعرض
 * @returns {HTMLElement} - عنصر شبكة Masonry
 */
function findOrCreateMasonryGrid(container) {
  // البحث عن شبكة Masonry موجودة
  let masonryGrid = container.querySelector('.masonry-grid');
  
  // إنشاء شبكة جديدة إذا لم تكن موجودة
  if (!masonryGrid) {
    console.log('إنشاء عنصر masonry-grid جديد');
    masonryGrid = document.createElement('div');
    masonryGrid.className = 'masonry-grid';
    container.innerHTML = '';
    container.appendChild(masonryGrid);
  }
  
  return masonryGrid;
}

/**
 * تفريغ المحتويات الحالية مع الحفاظ على عناصر التنسيق
 * @param {HTMLElement} masonryGrid - عنصر شبكة Masonry
 */
function preserveAndClearMasonryGrid(masonryGrid) {
  // الاحتفاظ بعناصر التنسيق
  const gridSizer = masonryGrid.querySelector('.grid-sizer');
  const gutterSizer = masonryGrid.querySelector('.gutter-sizer');
  
  // تفريغ المحتويات
  masonryGrid.innerHTML = '';
  
  // إعادة عناصر التنسيق
  if (gridSizer) {
    masonryGrid.appendChild(gridSizer);
  } else {
    const newGridSizer = document.createElement('div');
    newGridSizer.className = 'grid-sizer';
    masonryGrid.appendChild(newGridSizer);
  }
  
  if (gutterSizer) {
    masonryGrid.appendChild(gutterSizer);
  } else {
    const newGutterSizer = document.createElement('div');
    newGutterSizer.className = 'gutter-sizer';
    masonryGrid.appendChild(newGutterSizer);
  }
}

/**
 * إنشاء بطاقة صورة لمعرض Masonry
 * @param {Object} imageData - بيانات الصورة
 * @param {number} index - ترتيب الصورة في المعرض
 * @param {Function} onLoadCallback - دالة ترجع عند اكتمال تحميل الصورة
 * @returns {HTMLElement} - عنصر grid-item
 */
function createMasonryImageCard(imageData, index, onLoadCallback) {
  // تحديد اتجاه الصورة (أفقي، عمودي، مربع)
  let orientation = determineImageOrientation(imageData);
  
  // استخراج الفئة الرئيسية من البيانات
  const category = normalizeCategoryValue(imageData.category || '');
  
  // إنشاء عنصر grid-item
  const gridItem = document.createElement('div');
  gridItem.className = `grid-item ${orientation}`;
  gridItem.setAttribute('data-category', category);
  gridItem.setAttribute('data-dimension', orientation);
  gridItem.setAttribute('data-index', index);
  
  // الحصول على بيانات المستخدم والتفضيلات
  const userData = getUserData();
  const imagePreferences = getImagePreferences(imageData.url);
  
  // الحصول على عنوان الصورة المناسب للغة الحالية
  const imageName = getLocalizedImageTitle(imageData);
  
  // إنشاء HTML لبطاقة الصورة
  gridItem.innerHTML = `
    <div class="image-card">
      <div class="user-info">
        <img src="${userData.avatarUrl}" alt="${userData.username}" class="user-avatar">
        <span class="user-name">${userData.username}</span>
      </div>
      
      <div class="image-title">${imageName}</div>
      
      <div class="image-container">
        <img 
          data-src="${imageData.url}" 
          alt="${imageData.alt || imageName}" 
          class="gallery-image lazy-image" 
          style="display: none"
          onload="this.style.display='block'; this.parentNode.querySelector('.loading-indicator')?.remove(); typeof window.setImageOrientation === 'function' && window.setImageOrientation(this);">
        <div class="loading-indicator">
          <i class="fas fa-spinner fa-spin"></i>
          <div>${imageName}</div>
        </div>
      </div>
      
      <div class="image-actions">
        <div class="view-btn" onclick="if (typeof window.viewImage === 'function') window.viewImage('${imageData.url}', event)">
          <i class="fas fa-eye"></i>
        </div>
        
        <div class="likes-counter" onclick="if (typeof window.handleLikeButton === 'function') window.handleLikeButton('${imageData.url}', event)">
          <i class="fas fa-heart like-icon" data-url="${imageData.url}" 
             style="color: ${imagePreferences.hasLiked ? 'white' : 'transparent'}; 
                    -webkit-text-stroke: ${imagePreferences.hasLiked ? '0' : '1px'} white;"></i>
          <span class="likes-count" data-url="${imageData.url}">${imagePreferences.likesCount}</span>
        </div>
        
        <div class="action-buttons">
          <button class="favorite-btn ${imagePreferences.isFavorite ? 'active' : ''}" 
                  onclick="if (typeof window.handleFavoriteButton === 'function') window.handleFavoriteButton('${imageData.url}', event)">
            <i class="fas fa-star" style="color: ${imagePreferences.isFavorite ? '#FFD700' : 'white'};"></i>
          </button>
          
          <button class="btn set-avatar-btn" onclick="if (typeof window.setAsProfileImage === 'function') window.setAsProfileImage('${imageData.url}')">
            <i class="fas fa-user-circle"></i>
          </button>
          
          <button class="btn download-btn" onclick="if (typeof window.downloadImage === 'function') window.downloadImage(event, '${imageData.url}')">
            <i class="fas fa-download"></i>
          </button>
          
          <button class="btn share-btn" 
                  onclick="if (typeof window.showShareDialog === 'function') window.showShareDialog('${imageData.url}')" 
                  data-image-url="${imageData.url}">
            <i class="fas fa-share-alt"></i>
          </button>
        </div>
      </div>
    </div>
  `;
  
  // تهيئة التحميل المتأخر للصورة
  setupLazyLoading(gridItem, onLoadCallback);
  
  return gridItem;
}

/**
 * إعداد التحميل المتأخر للصورة
 * @param {HTMLElement} gridItem - عنصر grid-item
 * @param {Function} onLoadCallback - دالة ترجع عند اكتمال تحميل الصورة
 */
function setupLazyLoading(gridItem, onLoadCallback) {
  const img = gridItem.querySelector('img.gallery-image');
  if (!img) return;
  
  // تطبيق المراقبة لتحميل الصورة عند ظهورها في الشاشة
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          if (img.dataset.src) {
            img.src = img.dataset.src;
            
            img.onload = () => {
              img.classList.add('loaded');
              if (typeof onLoadCallback === 'function') {
                onLoadCallback();
              }
              
              // تسجيل مشاهدة الصورة إذا كانت الوظيفة متاحة
              if (typeof window.recordImageView === 'function' && 
                  typeof window.getCurrentUser === 'function' && 
                  window.getCurrentUser()) {
                window.recordImageView();
              }
            };
            
            observer.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '100px',
      threshold: 0.1
    });
    
    imageObserver.observe(img);
  } else {
    // التنفيذ التقليدي للمتصفحات القديمة
    img.src = img.dataset.src;
    img.onload = () => {
      if (typeof onLoadCallback === 'function') {
        onLoadCallback();
      }
    };
  }
}

/**
 * تهيئة Masonry على حاوية المعرض
 * @param {HTMLElement} container - عنصر الحاوية
 */
function initializeMasonry(container) {
  console.log('تهيئة Masonry على الحاوية...');
  
  // استخدام imagesLoaded للتأكد من تحميل جميع الصور قبل تهيئة Masonry
  if (typeof imagesLoaded === 'function') {
    imagesLoaded(container, function() {
      console.log('تم تحميل الصور، تهيئة Masonry...');
      
      // تهيئة Masonry
      const masonry = new Masonry(container, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        gutter: '.gutter-sizer',
        percentPosition: true,
        transitionDuration: '0.4s'
      });
      
      console.log('تم تهيئة Masonry بنجاح!');
      
      // تطبيق التصفية النشطة
      applyActiveFilters();
    });
  } else {
    // إذا لم تكن مكتبة imagesLoaded متاحة، نستخدم setTimeout للتأكد من تحميل الصور
    console.warn('مكتبة imagesLoaded غير متاحة، استخدام تأخير بسيط بدلاً من ذلك');
    setTimeout(() => {
      // تهيئة Masonry
      const masonry = new Masonry(container, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        gutter: '.gutter-sizer',
        percentPosition: true,
        transitionDuration: '0.4s'
      });
      
      console.log('تم تهيئة Masonry بنجاح! (بعد التأخير)');
      
      // تطبيق التصفية النشطة
      applyActiveFilters();
    }, 1000);
  }
}

/**
 * الحصول على بيانات المستخدم
 * @returns {Object} - بيانات المستخدم
 */
function getUserData() {
  const user = typeof window.getCurrentUser === 'function' ? window.getCurrentUser() : null;
  const username = user ? user.username : 'مستخدم';
  const avatarUrl = typeof window.getUserAvatar === 'function' ? (window.getUserAvatar() || 'generated-icon.png') : 'generated-icon.png';
  
  return {
    username,
    avatarUrl
  };
}

/**
 * الحصول على تفضيلات الصورة
 * @param {string} imageUrl - رابط الصورة
 * @returns {Object} - تفضيلات الصورة
 */
function getImagePreferences(imageUrl) {
  // التحقق من حالة المفضلة
  const isFavorite = typeof window.getFavorites === 'function' ? 
    window.getFavorites().includes(imageUrl) : false;
  
  // الحصول على عدد الإعجابات
  const likesCount = typeof window.getLikesCount === 'function' ? 
    window.getLikesCount(imageUrl) : 0;
  
  // التحقق مما إذا كان المستخدم قد أعجب بالصورة
  const hasLiked = typeof window.getUserLikes === 'function' ? 
    window.getUserLikes().includes(imageUrl) : false;
  
  return {
    isFavorite,
    likesCount,
    hasLiked
  };
}

/**
 * تحديد اتجاه الصورة بناءً على البيانات
 * @param {Object} imageData - بيانات الصورة
 * @returns {string} - اتجاه الصورة (portrait, landscape, square)
 */
function determineImageOrientation(imageData) {
  // إذا كان هناك اتجاه محدد في البيانات، نستخدمه
  if (imageData.orientation) {
    return imageData.orientation;
  }
  
  // التحقق من الحالات الخاصة (بناءً على URL)
  if (imageData.url && typeof imageData.url === 'string') {
    if (imageData.url.includes("cb450271-02bf-4d3e-be12-55a1a3ebdf54")) {
      return 'portrait';
    } else if (imageData.url.includes("83c6136c-2564-46d5-8623-9eed2a12dd07")) {
      return 'landscape';
    }
  }
  
  // الاتجاه الافتراضي
  return 'landscape';
}

/**
 * الحصول على عنوان الصورة المناسب للغة الحالية
 * @param {Object} imageData - بيانات الصورة
 * @returns {string} - عنوان الصورة
 */
function getLocalizedImageTitle(imageData) {
  // الحصول على اللغة الحالية
  const currentLang = localStorage.getItem('language') || 'ar';
  
  // استخدام حقل title حسب اللغة
  let imageName;
  if (imageData.title && typeof imageData.title === 'object') {
    imageName = imageData.title[currentLang] || imageData.title.ar || imageData.title.en || imageData.alt || 'صورة';
  } else {
    imageName = imageData.title || imageData.alt || 'صورة';
  }
  
  return imageName;
}

/**
 * توحيد قيمة الفئة
 * @param {string} category - فئة التصفية
 * @returns {string} - فئة التصفية الموحدة
 */
function normalizeCategoryValue(category) {
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
}

/**
 * تطبيق التصفية النشطة
 */
function applyActiveFilters() {
  // التحقق من وجود فئة نشطة
  const activeCategory = document.querySelector('.category-btn.active, .filter-btn[data-category].active');
  if (activeCategory) {
    const category = activeCategory.getAttribute('data-category') || activeCategory.getAttribute('data-filter');
    if (category && category !== 'all') {
      filterByCategory(category);
    }
  }
  
  // التحقق من وجود بُعد نشط
  const activeDimension = document.querySelector('.dimension-btn.active, .filter-btn[data-dimension].active');
  if (activeDimension) {
    const dimension = activeDimension.getAttribute('data-dimension') || activeDimension.getAttribute('data-filter');
    if (dimension && dimension !== 'all') {
      filterByDimension(dimension);
    }
  }
}

/**
 * تصفية المعرض حسب الفئة
 * @param {string} category - فئة التصفية
 */
function filterByCategory(category) {
  console.log('تصفية المعرض حسب الفئة:', category);
  
  // توحيد قيمة الفئة
  const normalizedCategory = normalizeCategoryValue(category);
  
  // تحديث حالة أزرار الفئة
  document.querySelectorAll('.category-btn, .filter-btn[data-category]').forEach(btn => {
    const buttonCategory = normalizeCategoryValue(btn.getAttribute('data-category') || btn.getAttribute('data-filter') || '');
    btn.classList.toggle('active', buttonCategory === normalizedCategory);
  });
  
  // إظهار/إخفاء العناصر حسب الفئة
  document.querySelectorAll('.grid-item').forEach(item => {
    const itemCategory = normalizeCategoryValue(item.getAttribute('data-category') || '');
    
    if (normalizedCategory === 'all' || itemCategory === normalizedCategory) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
  
  // إعادة ترتيب Masonry
  refreshMasonryLayout();
}

/**
 * تصفية المعرض حسب الأبعاد
 * @param {string} dimension - أبعاد التصفية (portrait, landscape, square, all)
 */
function filterByDimension(dimension) {
  console.log('تصفية المعرض حسب الأبعاد:', dimension);
  
  // تحديث حالة أزرار الأبعاد
  document.querySelectorAll('.dimension-btn, .filter-btn[data-dimension]').forEach(btn => {
    const buttonDimension = btn.getAttribute('data-dimension') || btn.getAttribute('data-filter');
    btn.classList.toggle('active', buttonDimension === dimension);
  });
  
  // إظهار/إخفاء العناصر حسب الأبعاد
  document.querySelectorAll('.grid-item').forEach(item => {
    if (dimension === 'all' || item.classList.contains(dimension)) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
  
  // إعادة ترتيب Masonry
  refreshMasonryLayout();
}

/**
 * إعادة ترتيب تخطيط Masonry بعد التصفية
 */
function refreshMasonryLayout() {
  // البحث عن جميع حاويات Masonry المحتملة
  const containers = [
    document.querySelector('.masonry-grid'),
    document.querySelector('.gallery-container')
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
}

// تصدير الوظائف للاستخدام العالمي
window.createMasonryGallery = createMasonryGallery;
window.filterByCategory = filterByCategory;
window.filterByDimension = filterByDimension;

// تخزين النسخ البديلة للتوافق مع الكود القديم
window.setupMasonryGallery = createMasonryGallery;
window.filterGalleryByCategory = filterByCategory;
window.filterGalleryByDimension = filterByDimension;

// تأكيد تحميل الملف بنجاح
console.log('تم تحميل ملف unified-masonry.js بنجاح');