/**
 * shared-gallery-utilities.js
 * ملف موحد للوظائف المشتركة المتعلقة بالمعرض
 * يجمع بين الوظائف المتكررة من ملفات متعددة ويوفر واجهة موحدة
 */

// استيراد الوظائف المتعلقة بالتخزين والتفاعل
import { 
    getCurrentUser, 
    getFavorites, 
    toggleFavorite, 
    getUserLikes, 
    getLikesCount, 
    recordImageView, 
    recordImageDownload, 
    recordImageLike 
  } from './Storage.js';
  
  /**
   * يحتوي على جميع وظائف المعرض المشتركة
   */
  const GalleryUtils = {
    /**
     * تهيئة المعرض
     * @param {Object} options - خيارات التهيئة
     */
    initGallery: function(options = {}) {
      console.log('تهيئة وظائف المعرض المشتركة...');
      
      // دمج الخيارات مع الإعدادات الافتراضية
      const settings = {
        containerSelector: '.gallery-container',
        useEnhancedGallery: false,
        useUnifiedMasonry: true,
        ...options
      };
      
      // التأكد من وجود بيانات الصور
      if (!window.imageData && window.galleryImages) {
        window.imageData = window.galleryImages;
        console.log('تم تعيين بيانات الصور من galleryImages');
      }
      
      if (!window.imageData || !Array.isArray(window.imageData) || window.imageData.length === 0) {
        console.error('لم يتم العثور على بيانات الصور!');
        return false;
      }
      
      console.log('تهيئة المعرض مع', window.imageData.length, 'صورة');
      
      // تهيئة الإعدادات العامة للمعرض
      this.settings = settings;
      
      // تحقق من وجود الحاوية
      const container = document.querySelector(settings.containerSelector);
      if (!container) {
        console.error(`لم يتم العثور على حاوية المعرض (${settings.containerSelector})!`);
        return false;
      }
      
      // عرض المعرض بناءً على الإعدادات
      if (settings.useEnhancedGallery && typeof window.EnhancedGallery !== 'undefined') {
        console.log('استخدام المعرض المحسن...');
        window.EnhancedGallery.renderGallery(window.imageData);
      } else if (settings.useUnifiedMasonry && typeof window.createMasonryGallery === 'function') {
        console.log('استخدام Masonry الموحد...');
        window.createMasonryGallery(settings.containerSelector, window.imageData);
      } else {
        console.log('استخدام عرض المعرض العادي...');
        this.renderGallery();
      }
      
      // تهيئة وظائف التصفية
      this.initFilters();
      
      return true;
    },
    
    /**
     * عرض المعرض بشكل أساسي
     */
    renderGallery: function() {
      // العثور على حاوية المعرض
      const galleryContainer = document.querySelector(this.settings?.containerSelector || '.gallery-container');
      if (!galleryContainer) {
        console.error('لم يتم العثور على حاوية المعرض!');
        return;
      }
      
      // إنشاء أو استخدام شبكة Masonry
      let masonryGrid = galleryContainer.querySelector('.masonry-grid');
      if (!masonryGrid) {
        masonryGrid = document.createElement('div');
        masonryGrid.className = 'masonry-grid';
        galleryContainer.innerHTML = '';
        galleryContainer.appendChild(masonryGrid);
      }
      
      // تفريغ الشبكة وإضافة عناصر التنسيق
      const gridSizer = masonryGrid.querySelector('.grid-sizer');
      masonryGrid.innerHTML = '';
      if (gridSizer) {
        masonryGrid.appendChild(gridSizer);
      } else {
        const newGridSizer = document.createElement('div');
        newGridSizer.className = 'grid-sizer';
        masonryGrid.appendChild(newGridSizer);
      }
      
      // إضافة الصور إلى المعرض
      if (window.imageData && Array.isArray(window.imageData)) {
        window.imageData.forEach((imageData, index) => {
          const card = this.createImageCard(imageData);
          masonryGrid.appendChild(card);
        });
      }
      
      // تطبيق Masonry بعد تحميل الصور
      if (typeof imagesLoaded === 'function' && typeof Masonry === 'function') {
        imagesLoaded(masonryGrid, function() {
          new Masonry(masonryGrid, {
            itemSelector: '.grid-item',
            columnWidth: '.grid-sizer',
            percentPosition: true
          });
        });
      }
    },
    
    /**
     * إنشاء بطاقة صورة
     * @param {Object} imageData - بيانات الصورة
     * @returns {HTMLElement} - عنصر بطاقة الصورة
     */
    createImageCard: function(imageData) {
      // تحديد اتجاه الصورة
      let orientation = this.determineImageOrientation(imageData);
      
      // الحصول على الفئة
      const category = this.normalizeCategoryValue(imageData.category || '');
      
      // إنشاء عنصر grid-item
      const gridItem = document.createElement('div');
      gridItem.className = `grid-item ${orientation}`;
      gridItem.setAttribute('data-category', category);
      gridItem.setAttribute('data-dimension', orientation);
      
      // الحصول على بيانات المستخدم والتفضيلات
      const userData = this.getUserData();
      const imagePreferences = this.getImagePreferences(imageData.url);
      
      // الحصول على عنوان الصورة
      const imageName = this.getLocalizedImageTitle(imageData);
      
      // إنشاء بطاقة الصورة
      const imageCard = document.createElement('div');
      imageCard.className = 'image-card';
      imageCard.setAttribute('data-url', imageData.url);
      
      // إضافة معلومات المستخدم
      const userInfo = document.createElement('div');
      userInfo.className = 'user-info';
      userInfo.innerHTML = `
        <img src="${userData.avatarUrl}" alt="${userData.username}" class="user-avatar">
        <span class="user-name">${userData.username}</span>
      `;
      
      // إضافة عنوان الصورة
      const titleDiv = document.createElement('div');
      titleDiv.className = 'image-title';
      titleDiv.textContent = imageName;
      
      // إنشاء عنصر الصورة
      const imgElement = document.createElement('img');
      imgElement.className = 'gallery-image lazy-image';
      imgElement.alt = imageData.alt || imageName;
      imgElement.setAttribute('data-src', imageData.url);
      
      // إضافة عنصر تحميل مؤقت
      const loadingPlaceholder = document.createElement('div');
      loadingPlaceholder.className = 'loading-indicator';
      loadingPlaceholder.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        <div>${imageName}</div>
      `;
      
      // إضافة أزرار التفاعل
      const buttonsHTML = this.createImageButtonsHTML(imageData, imagePreferences);
      
      // إضافة جميع العناصر إلى بطاقة الصورة
      imageCard.appendChild(userInfo);
      imageCard.appendChild(titleDiv);
      imageCard.appendChild(imgElement);
      imageCard.appendChild(loadingPlaceholder);
      imageCard.innerHTML += buttonsHTML;
      
      // إضافة بطاقة الصورة إلى العنصر grid-item
      gridItem.appendChild(imageCard);
      
      return gridItem;
    },
    
    /**
     * إنشاء HTML لأزرار التفاعل مع الصورة
     * @param {Object} imageData - بيانات الصورة
     * @param {Object} imagePreferences - تفضيلات الصورة (المفضلة، الإعجابات)
     * @returns {string} - HTML لأزرار التفاعل
     */
    createImageButtonsHTML: function(imageData, imagePreferences) {
      const { url, title } = imageData;
      const { isFavorite, hasLiked, likesCount } = imagePreferences;
      
      return `
        <div class="view-btn" onclick="if (typeof window.viewImage === 'function') window.viewImage('${url}', event)">
          <i class="fas fa-eye"></i>
        </div>
        
        <div class="likes-counter" onclick="if (typeof window.handleLikeClick === 'function') window.handleLikeClick('${url}', event)">
          <i class="fas fa-heart like-icon" data-url="${url}" 
             style="color: ${hasLiked ? 'white' : 'transparent'}; 
                    -webkit-text-stroke: ${hasLiked ? '0' : '1px'} white;"></i>
          <span class="likes-count" data-url="${url}">${likesCount}</span>
        </div>
        
        <div class="action-buttons">
          <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="if (typeof window.handleFavoriteButton === 'function') window.handleFavoriteButton('${url}', event)" data-image-url="${url}">
            <i class="fas fa-star" style="color: ${isFavorite ? '#FFD700' : 'white'}; font-size: 18px;"></i>
          </button>
          
          <button class="btn set-avatar-btn" onclick="if (typeof window.setAsProfileImage === 'function') window.setAsProfileImage('${url}')">
            <i class="fas fa-user-circle"></i>
          </button>
          
          <button class="btn download-btn" onclick="if (typeof window.downloadImage === 'function') window.downloadImage(event, '${url}')">
            <i class="fas fa-download"></i>
          </button>
          
          <button class="btn share-btn" 
                  onclick="if (typeof window.showShareDialog === 'function') window.showShareDialog('${url}')" 
                  data-image-url="${url}">
            <i class="fas fa-share-alt"></i>
          </button>
        </div>
      `;
    },
    
    /**
     * تهيئة وظائف التصفية
     */
    initFilters: function() {
      // تهيئة أزرار الفئات
      document.querySelectorAll('.category-btn, .filter-btn[data-category]').forEach(button => {
        button.addEventListener('click', (event) => {
          event.preventDefault();
          const category = button.getAttribute('data-category') || button.getAttribute('data-filter');
          this.filterByCategory(category);
        });
      });
      
      // تهيئة أزرار الأبعاد
      document.querySelectorAll('.dimension-btn, .filter-btn[data-dimension]').forEach(button => {
        button.addEventListener('click', (event) => {
          event.preventDefault();
          const dimension = button.getAttribute('data-dimension') || button.getAttribute('data-filter');
          this.filterByDimension(dimension);
        });
      });
      
      // تهيئة البحث
      const searchInput = document.querySelector('#gallery-search, #search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (event) => {
          this.searchGallery(event.target.value);
        });
        
        // تهيئة نموذج البحث
        const searchForm = searchInput.closest('form');
        if (searchForm) {
          searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            this.searchGallery(searchInput.value);
          });
        }
      }
    },
    
    /**
     * تصفية المعرض حسب الفئة
     * @param {string} category - فئة التصفية
     */
    filterByCategory: function(category) {
      console.log('تصفية المعرض حسب الفئة:', category);
      
      // توحيد قيمة الفئة
      const normalizedCategory = this.normalizeCategoryValue(category);
      
      // تحديث حالة أزرار الفئة
      document.querySelectorAll('.category-btn, .filter-btn[data-category]').forEach(btn => {
        const buttonCategory = this.normalizeCategoryValue(btn.getAttribute('data-category') || btn.getAttribute('data-filter') || '');
        btn.classList.toggle('active', buttonCategory === normalizedCategory);
      });
      
      // إظهار/إخفاء العناصر حسب الفئة
      document.querySelectorAll('.grid-item').forEach(item => {
        const itemCategory = this.normalizeCategoryValue(item.getAttribute('data-category') || '');
        
        if (normalizedCategory === 'all' || itemCategory === normalizedCategory) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
      
      // إعادة ترتيب Masonry
      this.refreshMasonryLayout();
    },
    
    /**
     * تصفية المعرض حسب الأبعاد
     * @param {string} dimension - أبعاد التصفية (portrait, landscape, square, all)
     */
    filterByDimension: function(dimension) {
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
      this.refreshMasonryLayout();
    },
    
    /**
     * بحث في المعرض
     * @param {string} searchTerm - مصطلح البحث
     */
    searchGallery: function(searchTerm) {
      console.log('البحث في المعرض عن:', searchTerm);
      
      // تحويل مصطلح البحث إلى أحرف صغيرة وتجريده من المسافات الزائدة
      const normalizedSearchTerm = (searchTerm || '').toLowerCase().trim();
      
      if (!normalizedSearchTerm) {
        // إذا كان مصطلح البحث فارغًا، عرض جميع الصور
        document.querySelectorAll('.grid-item').forEach(item => {
          item.style.display = '';
        });
      } else {
        // فلترة العناصر حسب مصطلح البحث
        document.querySelectorAll('.grid-item').forEach(item => {
          const imageCard = item.querySelector('.image-card');
          const imageTitle = item.querySelector('.image-title')?.textContent || '';
          const imageCategory = item.getAttribute('data-category') || '';
          const imageUrl = imageCard ? (imageCard.getAttribute('data-url') || '') : '';
          
          // البحث في العنوان والفئة والرابط
          const isMatch = 
            imageTitle.toLowerCase().includes(normalizedSearchTerm) || 
            imageCategory.toLowerCase().includes(normalizedSearchTerm) || 
            imageUrl.toLowerCase().includes(normalizedSearchTerm);
          
          item.style.display = isMatch ? '' : 'none';
        });
      }
      
      // إعادة ترتيب Masonry
      this.refreshMasonryLayout();
    },
    
    /**
     * إعادة ترتيب تخطيط Masonry بعد التصفية
     */
    refreshMasonryLayout: function() {
      // البحث عن جميع حاويات Masonry المحتملة
      const containers = [
        document.querySelector('.masonry-grid'),
        document.querySelector('.gallery-container')
      ];
      
      containers.forEach(container => {
        if (container) {
          // الحصول على مثيل Masonry المرتبط بالحاوية
          const masonry = typeof Masonry !== 'undefined' ? Masonry.data(container) : null;
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
     * الحصول على بيانات المستخدم
     * @returns {Object} - بيانات المستخدم
     */
    getUserData: function() {
      const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
      const username = user ? user.username : 'مستخدم';
      const avatarUrl = typeof window.getUserAvatar === 'function' ? (window.getUserAvatar() || 'generated-icon.png') : 'generated-icon.png';
      
      return {
        username,
        avatarUrl
      };
    },
    
    /**
     * الحصول على تفضيلات الصورة
     * @param {string} imageUrl - رابط الصورة
     * @returns {Object} - تفضيلات الصورة
     */
    getImagePreferences: function(imageUrl) {
      // التحقق من حالة المفضلة
      const isFavorite = typeof getFavorites === 'function' ? 
        getFavorites().includes(imageUrl) : false;
      
      // الحصول على عدد الإعجابات
      const likesCount = typeof getLikesCount === 'function' ? 
        getLikesCount(imageUrl) : 0;
      
      // التحقق مما إذا كان المستخدم قد أعجب بالصورة
      const hasLiked = typeof getUserLikes === 'function' ? 
        getUserLikes().includes(imageUrl) : false;
      
      return {
        isFavorite,
        likesCount,
        hasLiked
      };
    },
    
    /**
     * تحديد اتجاه الصورة بناءً على البيانات
     * @param {Object} imageData - بيانات الصورة
     * @returns {string} - اتجاه الصورة (portrait, landscape, square)
     */
    determineImageOrientation: function(imageData) {
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
    },
    
    /**
     * الحصول على عنوان الصورة المناسب للغة الحالية
     * @param {Object} imageData - بيانات الصورة
     * @returns {string} - عنوان الصورة
     */
    getLocalizedImageTitle: function(imageData) {
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
    },
    
    /**
     * توحيد قيمة الفئة
     * @param {string} category - فئة التصفية
     * @returns {string} - فئة التصفية الموحدة
     */
    normalizeCategoryValue: function(category) {
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
     * تعامل مع النقر على زر الإعجاب
     * @param {string} imageUrl - رابط الصورة
     * @param {Event} event - حدث النقر
     */
    handleLikeClick: function(imageUrl, event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      if (typeof toggleLike === 'function') {
        const newLikesCount = toggleLike(imageUrl);
        
        // تحديث عناصر الإعجاب المرئية
        if (typeof updateLikeVisuals === 'function') {
          const imageId = typeof getImageId === 'function' ? getImageId(imageUrl) : imageUrl;
          const hasLiked = typeof getUserLikes === 'function' ? getUserLikes().includes(imageUrl) : false;
          updateLikeVisuals(imageUrl, imageId, newLikesCount, hasLiked);
        }
      }
    },
    
    /**
     * تعامل مع زر المفضلة
     * @param {string} imageUrl - رابط الصورة
     * @param {Event} event - حدث النقر
     */
    handleFavoriteButton: function(imageUrl, event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      if (typeof toggleFavorite === 'function') {
        const isFavorite = toggleFavorite(imageUrl);
        
        // تحديث جميع أزرار المفضلة للصورة نفسها
        if (typeof updateAllFavoriteButtons === 'function') {
          const imageId = typeof getImageId === 'function' ? getImageId(imageUrl) : imageUrl;
          updateAllFavoriteButtons(imageUrl, imageId, isFavorite);
        }
      }
    }
  };
  
  // إتاحة الواجهة العامة
  window.GalleryUtils = GalleryUtils;
  
  // تصدير وظائف محددة كواجهة عامة للتوافق مع الكود القديم
  window.filterByCategory = GalleryUtils.filterByCategory.bind(GalleryUtils);
  window.filterByDimension = GalleryUtils.filterByDimension.bind(GalleryUtils);
  window.searchGallery = GalleryUtils.searchGallery.bind(GalleryUtils);
  window.handleLikeClick = GalleryUtils.handleLikeClick.bind(GalleryUtils);
  window.handleFavoriteButton = GalleryUtils.handleFavoriteButton.bind(GalleryUtils);
  
  // تصدير للمودولات ES
  export default GalleryUtils;