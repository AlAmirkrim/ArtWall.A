/**
 * unified-image-gallery-utils.js
 * ملف موحد للوظائف المشتركة المتعلقة بالصور والمعرض
 * يجمع بين shared-gallery-utilities.js و shared-image-utilities.js
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
      
      // استخدام الوظيفة الموحدة للعرض إذا كانت متاحة
      if (settings.useUnifiedMasonry && typeof window.createMasonryGallery === 'function') {
        window.createMasonryGallery(settings.containerSelector, window.imageData);
      } else {
        this.renderBasicGallery(settings.containerSelector);
      }
      
      return true;
    },
    
    /**
     * عرض المعرض بشكل أساسي
     */
    renderBasicGallery: function(containerSelector) {
      const container = document.querySelector(containerSelector);
      if (!container) {
        console.error('لم يتم العثور على حاوية المعرض:', containerSelector);
        return;
      }
      
      container.innerHTML = '';
      
      // إنشاء وإضافة بطاقات الصور
      window.imageData.forEach(imageData => {
        const card = this.createImageCard(imageData);
        container.appendChild(card);
      });
      
      console.log('تم عرض المعرض بشكل أساسي');
    },
    
    /**
     * إنشاء بطاقة صورة
     * @param {Object} imageData - بيانات الصورة
     * @returns {HTMLElement} - عنصر بطاقة الصورة
     */
    createImageCard: function(imageData) {
      const card = document.createElement('div');
      card.className = 'image-card';
      card.setAttribute('data-category', imageData.category || 'general');
      
      // تحديد عنوان الصورة
      const imageTitle = imageData.title ? 
        (typeof imageData.title === 'object' ? imageData.title.ar : imageData.title) : 
        imageData.alt || 'صورة';
      
      // إنشاء HTML للبطاقة
      card.innerHTML = `
        <div class="img-container">
          <img src="${imageData.url}" alt="${imageData.alt || imageTitle}" 
              loading="lazy" class="gallery-img" />
        </div>
        <div class="img-info">
          <h3>${imageTitle}</h3>
          ${this.createImageButtons(imageData, this.getImagePreferences(imageData.url))}
        </div>
      `;
      
      // إضافة مستمعات الأحداث للصورة
      const img = card.querySelector('.gallery-img');
      if (img) {
        img.addEventListener('click', (e) => ImageUtils.viewFullImage(imageData.url, imageTitle, e));
        img.addEventListener('load', () => {
          // تحديد اتجاه الصورة
          const orientation = ImageUtils.setImageOrientation(img);
          card.setAttribute('data-orientation', orientation);
        });
      }
      
      // إضافة مستمعات الأحداث للأزرار
      const likeBtn = card.querySelector('.like-btn');
      if (likeBtn) {
        likeBtn.addEventListener('click', (e) => this.handleLikeClick(imageData.url, e));
      }
      
      const favoriteBtn = card.querySelector('.favorite-btn');
      if (favoriteBtn) {
        favoriteBtn.addEventListener('click', (e) => this.handleFavoriteClick(imageData.url, e));
      }
      
      return card;
    },
    
    /**
     * إنشاء HTML لأزرار التفاعل مع الصورة
     * @param {Object} imageData - بيانات الصورة
     * @param {Object} imagePreferences - تفضيلات الصورة (المفضلة، الإعجابات)
     * @returns {string} - HTML لأزرار التفاعل
     */
    createImageButtons: function(imageData, imagePreferences) {
      const isFavorite = imagePreferences.isFavorite;
      const isLiked = imagePreferences.isLiked;
      
      return `
      <div class="btn-container">
        <div class="likes-counter" title="${isLiked ? 'أنت معجب بهذه الصورة' : 'انقر للإعجاب'}">
          <i class="like-icon ${isLiked ? 'fas' : 'far'} fa-heart"></i>
          <span class="likes-count">${imagePreferences.likesCount || 0}</span>
        </div>
        <button class="btn download-btn" title="تنزيل الصورة" onclick="window.downloadImage ? window.downloadImage(event, '${imageData.url}') : alert('وظيفة التنزيل غير متاحة')">
          <i class="fas fa-download"></i>
        </button>
        <button class="btn share-btn" title="مشاركة الصورة" onclick="ImageUtils.showShareDialog('${imageData.url}')">
          <i class="fas fa-share-alt"></i>
        </button>
        <button class="btn set-avatar-btn" title="تعيين كصورة شخصية" onclick="ImageUtils.setAsProfileImage('${imageData.url}')">
          <i class="fas fa-user-circle"></i>
        </button>
        <button class="favorite-btn ${isFavorite ? 'active' : ''}" title="${isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}">
          <i class="fa${isFavorite ? 's' : 'r'} fa-star"></i>
        </button>
      </div>
      `;
    },
    
    /**
     * الحصول على تفضيلات الصورة
     * @param {string} imageUrl - رابط الصورة
     * @returns {Object} - تفضيلات الصورة
     */
    getImagePreferences: function(imageUrl) {
      // الحصول على حالة المفضلة
      const favorites = getFavorites();
      const isFavorite = favorites.includes(imageUrl);
      
      // الحصول على عدد الإعجابات وحالة الإعجاب
      const likesCount = getLikesCount(imageUrl);
      const userLikes = getUserLikes();
      const isLiked = userLikes.includes(imageUrl);
      
      return {
        isFavorite,
        likesCount,
        isLiked
      };
    },
    
    /**
     * تعامل مع النقر على زر الإعجاب
     * @param {string} imageUrl - رابط الصورة
     * @param {Event} event - حدث النقر
     */
    handleLikeClick: function(imageUrl, event) {
      event.preventDefault();
      event.stopPropagation();
      
      const button = event.target.closest('.likes-counter');
      const userLikes = getUserLikes();
      const isLiked = userLikes.includes(imageUrl);
      
      // تغيير حالة الإعجاب
      recordImageLike(!isLiked);
      
      // تحديث العناصر المرئية
      const icon = button.querySelector('.like-icon');
      const counterSpan = button.querySelector('.likes-count');
      
      if (isLiked) {
        // إلغاء الإعجاب
        icon.classList.remove('fas');
        icon.classList.add('far');
        const newCount = Math.max(0, parseInt(counterSpan.textContent) - 1);
        counterSpan.textContent = newCount;
        button.title = 'انقر للإعجاب';
      } else {
        // إضافة إعجاب
        icon.classList.remove('far');
        icon.classList.add('fas');
        const newCount = parseInt(counterSpan.textContent) + 1;
        counterSpan.textContent = newCount;
        button.title = 'أنت معجب بهذه الصورة';
        
        // إضافة تأثير بصري
        icon.classList.add('pulse');
        counterSpan.classList.add('updated');
        setTimeout(() => {
          icon.classList.remove('pulse');
          counterSpan.classList.remove('updated');
        }, 500);
      }
    },
    
    /**
     * تعامل مع زر المفضلة
     * @param {string} imageUrl - رابط الصورة
     * @param {Event} event - حدث النقر
     */
    handleFavoriteClick: function(imageUrl, event) {
      event.preventDefault();
      event.stopPropagation();
      
      const isFavorite = toggleFavorite(imageUrl);
      const button = event.target.closest('.favorite-btn');
      
      if (isFavorite) {
        button.classList.add('active');
        button.title = 'إزالة من المفضلة';
        button.querySelector('i').classList.remove('far');
        button.querySelector('i').classList.add('fas');
      } else {
        button.classList.remove('active');
        button.title = 'إضافة للمفضلة';
        button.querySelector('i').classList.remove('fas');
        button.querySelector('i').classList.add('far');
      }
      
      button.classList.add('scaled');
      setTimeout(() => {
        button.classList.remove('scaled');
      }, 300);
    }
  };
  
  /**
   * وظائف مساعدة للتعامل مع الصور
   */
  const ImageUtils = {
    /**
     * تحديد اتجاه الصورة (أفقي، عمودي، مربع) بناءً على أبعادها
     * @param {HTMLElement} imgElement - عنصر الصورة
     * @returns {string} - اتجاه الصورة ('portrait', 'landscape', 'square')
     */
    setImageOrientation: function(imgElement) {
      if (!imgElement || !imgElement.complete) return;
      
      const width = imgElement.naturalWidth;
      const height = imgElement.naturalHeight;
      
      if (width && height) {
        let orientation = 'landscape';
        if (height > width) {
          orientation = 'portrait';
        } else if (Math.abs(height - width) < 10) {
          orientation = 'square';
        }
        
        // إضافة الاتجاه كسمة بيانات وكفئة CSS
        imgElement.setAttribute('data-orientation', orientation);
        const gridItem = imgElement.closest('.grid-item');
        if (gridItem) {
          gridItem.setAttribute('data-orientation', orientation);
        }
        
        console.log('تم تحديد بعد الصورة بعد التحميل:', imgElement.alt, orientation);
        return orientation;
      }
      return 'landscape'; // افتراضي
    },
    
    /**
     * تبديل إلى العرض المدمج عند النقر على الصورة
     * @param {HTMLElement} imgElement - عنصر الصورة
     */
    switchToCompactView: function(imgElement) {
      if (typeof this.viewFullImage === 'function') {
        // احصل على عنوان URL للصورة والعنوان
        const imageUrl = imgElement.src;
        const imageTitle = imgElement.alt;
        
        // عرض الصورة في وضع ملء الشاشة
        this.viewFullImage(imageUrl, imageTitle);
      } else {
        console.warn('وظيفة viewFullImage غير معرفة');
      }
    },
    
    /**
     * عرض الصورة في وضع ملء الشاشة
     * @param {string} url - رابط الصورة
     * @param {string} title - عنوان الصورة
     * @param {Event} event - حدث النقر (اختياري)
     */
    viewFullImage: function(url, title, event) {
      if (event) event.stopPropagation();
      console.log('عرض الصورة في وضع ملء الشاشة:', url);
      
      // تسجيل مشاهدة الصورة
      recordImageView();
      
      // إنشاء العناصر
      const tooltip = document.createElement('div');
      tooltip.className = 'image-tooltip';
      tooltip.style.position = 'fixed';
      tooltip.style.top = '0';
      tooltip.style.left = '0';
      tooltip.style.width = '100%';
      tooltip.style.height = '100%';
      tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
      tooltip.style.display = 'flex';
      tooltip.style.justifyContent = 'center';
      tooltip.style.alignItems = 'center';
      tooltip.style.zIndex = '9999';
      
      const container = document.createElement('div');
      container.className = 'fullscreen-image-container';
      container.style.position = 'relative';
      container.style.maxWidth = '90%';
      container.style.maxHeight = '80vh';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'center';
      
      // حاوية الصورة
      const imgContainer = document.createElement('div');
      imgContainer.style.position = 'relative';
      imgContainer.style.overflow = 'hidden';
      imgContainer.style.borderRadius = '8px';
      imgContainer.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
      
      // الصورة
      const img = document.createElement('img');
      img.src = url;
      img.alt = title;
      img.style.maxWidth = '100%';
      img.style.maxHeight = '75vh';
      img.style.objectFit = 'contain';
      img.style.borderRadius = '8px';
      
      // معلومات الصورة
      const infoContainer = document.createElement('div');
      infoContainer.style.width = '100%';
      infoContainer.style.padding = '15px';
      infoContainer.style.marginTop = '10px';
      infoContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      infoContainer.style.borderRadius = '8px';
      infoContainer.style.display = 'flex';
      infoContainer.style.justifyContent = 'space-between';
      infoContainer.style.alignItems = 'center';
      
      const titleElement = document.createElement('h3');
      titleElement.textContent = title;
      titleElement.style.margin = '0';
      titleElement.style.color = 'white';
      infoContainer.appendChild(titleElement);
      
      // أزرار التحكم
      const controlsContainer = document.createElement('div');
      controlsContainer.style.display = 'flex';
      controlsContainer.style.gap = '10px';
      
      // زر التنزيل
      const downloadBtn = document.createElement('button');
      downloadBtn.className = 'control-btn download-btn';
      downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
      downloadBtn.title = 'تنزيل الصورة';
      downloadBtn.style.width = '40px';
      downloadBtn.style.height = '40px';
      downloadBtn.style.borderRadius = '50%';
      downloadBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      downloadBtn.style.border = 'none';
      downloadBtn.style.color = 'white';
      downloadBtn.style.cursor = 'pointer';
      downloadBtn.style.display = 'flex';
      downloadBtn.style.justifyContent = 'center';
      downloadBtn.style.alignItems = 'center';
      downloadBtn.onclick = function() {
        if (window.downloadImage) {
          recordImageDownload();
          window.downloadImage(event, url);
        } else {
          alert('وظيفة التنزيل غير متاحة');
        }
      };
      controlsContainer.appendChild(downloadBtn);
      
      // زر تعيين كصورة شخصية
      const setAvatarBtn = document.createElement('button');
      setAvatarBtn.className = 'control-btn set-avatar-btn';
      setAvatarBtn.innerHTML = '<i class="fas fa-user-circle"></i>';
      setAvatarBtn.title = 'تعيين كصورة شخصية';
      setAvatarBtn.style.width = '40px';
      setAvatarBtn.style.height = '40px';
      setAvatarBtn.style.borderRadius = '50%';
      setAvatarBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      setAvatarBtn.style.border = 'none';
      setAvatarBtn.style.color = 'white';
      setAvatarBtn.style.cursor = 'pointer';
      setAvatarBtn.style.display = 'flex';
      setAvatarBtn.style.justifyContent = 'center';
      setAvatarBtn.style.alignItems = 'center';
      setAvatarBtn.onclick = function() {
        ImageUtils.setAsProfileImage(url);
        tooltip.remove();
      };
      controlsContainer.appendChild(setAvatarBtn);
      
      // زر المفضلة
      const isFavorite = getFavorites().includes(url);
      const favoriteBtn = document.createElement('button');
      favoriteBtn.className = 'control-btn favorite-btn' + (isFavorite ? ' active' : '');
      favoriteBtn.innerHTML = '<i class="fa' + (isFavorite ? 's' : 'r') + ' fa-star"></i>';
      favoriteBtn.title = isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة';
      favoriteBtn.style.width = '40px';
      favoriteBtn.style.height = '40px';
      favoriteBtn.style.borderRadius = '50%';
      favoriteBtn.style.backgroundColor = isFavorite ? '#ff4d4d' : 'rgba(0, 0, 0, 0.7)';
      favoriteBtn.style.border = 'none';
      favoriteBtn.style.color = 'white';
      favoriteBtn.style.cursor = 'pointer';
      favoriteBtn.style.display = 'flex';
      favoriteBtn.style.justifyContent = 'center';
      favoriteBtn.style.alignItems = 'center';
      favoriteBtn.onclick = function() {
        const isNowFavorite = toggleFavorite(url);
        favoriteBtn.classList.toggle('active', isNowFavorite);
        favoriteBtn.style.backgroundColor = isNowFavorite ? '#ff4d4d' : 'rgba(0, 0, 0, 0.7)';
        favoriteBtn.innerHTML = '<i class="fa' + (isNowFavorite ? 's' : 'r') + ' fa-star"></i>';
        favoriteBtn.title = isNowFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة';
      };
      controlsContainer.appendChild(favoriteBtn);
      
      // زر المشاركة
      const shareBtn = document.createElement('button');
      shareBtn.className = 'control-btn share-btn';
      shareBtn.innerHTML = '<i class="fas fa-share-alt"></i>';
      shareBtn.title = 'مشاركة الصورة';
      shareBtn.style.width = '40px';
      shareBtn.style.height = '40px';
      shareBtn.style.borderRadius = '50%';
      shareBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      shareBtn.style.border = 'none';
      shareBtn.style.color = 'white';
      shareBtn.style.cursor = 'pointer';
      shareBtn.style.display = 'flex';
      shareBtn.style.justifyContent = 'center';
      shareBtn.style.alignItems = 'center';
      shareBtn.onclick = function() {
        ImageUtils.showShareDialog(url);
      };
      controlsContainer.appendChild(shareBtn);
      
      infoContainer.appendChild(controlsContainer);
      
      // زر إغلاق
      const closeBtn = document.createElement('button');
      closeBtn.className = 'close-btn';
      closeBtn.innerHTML = '<i class="fas fa-times"></i>';
      closeBtn.style.position = 'absolute';
      closeBtn.style.top = '10px';
      closeBtn.style.right = '10px';
      closeBtn.style.width = '32px';
      closeBtn.style.height = '32px';
      closeBtn.style.borderRadius = '50%';
      closeBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      closeBtn.style.border = 'none';
      closeBtn.style.color = 'white';
      closeBtn.style.cursor = 'pointer';
      closeBtn.style.display = 'flex';
      closeBtn.style.justifyContent = 'center';
      closeBtn.style.alignItems = 'center';
      closeBtn.style.zIndex = '10';
      closeBtn.style.transition = 'background-color 0.3s ease';
      
      // إضافة العناصر
      imgContainer.appendChild(img);
      container.appendChild(closeBtn);
      container.appendChild(imgContainer);
      container.appendChild(infoContainer);
      tooltip.appendChild(container);
      document.body.appendChild(tooltip);
      
      // تأثير الظهور
      setTimeout(() => {
        tooltip.classList.add('active');
      }, 10);
      
      // مغلقات الأحداث
      closeBtn.onclick = function() {
        tooltip.classList.remove('active');
        setTimeout(() => {
          tooltip.remove();
        }, 300);
      };
      
      // إغلاق عند النقر خارج الصورة
      tooltip.onclick = function(e) {
        if (e.target === tooltip) {
          tooltip.classList.remove('active');
          setTimeout(() => {
            tooltip.remove();
          }, 300);
        }
      };
      
      // إغلاق عند الضغط على ESC
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          tooltip.classList.remove('active');
          setTimeout(() => {
            tooltip.remove();
          }, 300);
        }
      });
    },
    
    /**
     * تعيين صورة كصورة شخصية
     * @param {string} imageUrl - رابط الصورة
     */
    setAsProfileImage: function(imageUrl) {
      const user = getCurrentUser();
      if (!user) {
        alert('يجب تسجيل الدخول لتعيين صورة شخصية');
        return;
      }
      
      // تحميل الصورة واستخدام canvas لتحويلها
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      
      // مع وسيط خادم للتغلب على مشكلات CORS
      let adjustedUrl = imageUrl;
      if (!imageUrl.includes('data:') && !imageUrl.includes('blob:')) {
        adjustedUrl = `/proxy-image?url=${encodeURIComponent(imageUrl)}`;
      }
      
      img.onload = function() {
        // حساب الأبعاد للحفاظ على تناسب الصورة
        const size = Math.min(img.width, img.height);
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        
        // تحديد منطقة القص
        const offsetX = (img.width - size) / 2;
        const offsetY = (img.height - size) / 2;
        
        // رسم دائرة كقناع لصورة دائرية
        ctx.beginPath();
        ctx.arc(100, 100, 100, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        
        // رسم الصورة داخل الدائرة
        ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, 200, 200);
        
        // تحويل الصورة إلى base64
        const avatarData = canvas.toDataURL('image/png');
        
        // تخزين الصورة في localStorage
        if (typeof window.saveUserAvatar === 'function') {
          window.saveUserAvatar(avatarData);
          // تحديث صور الملف الشخصي في الواجهة
          if (typeof window.updateUserAvatars === 'function') {
            window.updateUserAvatars();
          }
          
          alert('تم تعيين الصورة الشخصية بنجاح');
        } else {
          console.error('وظيفة saveUserAvatar غير متاحة');
          alert('حدث خطأ أثناء تعيين الصورة الشخصية');
        }
      };
      
      img.onerror = function() {
        console.error('فشل تحميل الصورة:', adjustedUrl);
        alert('فشل تحميل الصورة. حاول تنزيل الصورة أولاً ثم تحميلها كصورة شخصية.');
      };
      
      img.src = adjustedUrl;
    },
    
    /**
     * عرض مربع حوار المشاركة
     * @param {string} imageUrl - رابط الصورة
     */
    showShareDialog: function(imageUrl) {
      console.log('مشاركة الصورة:', imageUrl);
      
      try {
        if (navigator.share) {
          navigator.share({
            title: 'مشاركة صورة من ArtWall',
            text: 'إليك هذه الصورة الرائعة من ArtWall',
            url: imageUrl
          }).then(() => {
            console.log('تمت المشاركة بنجاح');
          }).catch((error) => {
            console.error('حدث خطأ أثناء المشاركة:', error);
            this.showFallbackShareDialog(imageUrl);
          });
        } else {
          this.showFallbackShareDialog(imageUrl);
        }
      } catch (e) {
        console.error('خطأ في المشاركة:', e);
        this.showFallbackShareDialog(imageUrl);
      }
    },
    
    /**
     * عرض مربع حوار مشاركة بديل
     * @param {string} imageUrl - رابط الصورة
     */
    showFallbackShareDialog: function(imageUrl) {
      // التحقق من وجود مربع حوار المشاركة
      let shareDialog = document.getElementById('share-dialog');
      
      if (!shareDialog) {
        // إنشاء مربع الحوار
        shareDialog = document.createElement('div');
        shareDialog.id = 'share-dialog';
        shareDialog.className = 'modal';
        shareDialog.style.display = 'block';
        shareDialog.style.position = 'fixed';
        shareDialog.style.zIndex = '10000';
        shareDialog.style.left = '0';
        shareDialog.style.top = '0';
        shareDialog.style.width = '100%';
        shareDialog.style.height = '100%';
        shareDialog.style.backgroundColor = 'rgba(0,0,0,0.7)';
        shareDialog.style.alignItems = 'center';
        shareDialog.style.justifyContent = 'center';
        
        // محتوى مربع الحوار
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.backgroundColor = '#1a0b20';
        modalContent.style.color = 'white';
        modalContent.style.margin = '10% auto';
        modalContent.style.padding = '20px';
        modalContent.style.border = '1px solid rgba(177, 76, 200, 0.3)';
        modalContent.style.borderRadius = '8px';
        modalContent.style.width = '90%';
        modalContent.style.maxWidth = '400px';
        modalContent.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
        
        // العنوان
        const title = document.createElement('h2');
        title.textContent = 'مشاركة الصورة';
        title.style.marginBottom = '15px';
        title.style.textAlign = 'center';
        
        // صندوق النص
        const urlInput = document.createElement('input');
        urlInput.type = 'text';
        urlInput.value = imageUrl;
        urlInput.style.width = '100%';
        urlInput.style.padding = '10px';
        urlInput.style.marginBottom = '15px';
        urlInput.style.backgroundColor = 'rgba(0,0,0,0.2)';
        urlInput.style.border = '1px solid rgba(177, 76, 200, 0.5)';
        urlInput.style.borderRadius = '4px';
        urlInput.style.color = 'white';
        
        // أزرار المشاركة
        const shareButtons = document.createElement('div');
        shareButtons.style.display = 'flex';
        shareButtons.style.justifyContent = 'center';
        shareButtons.style.marginBottom = '20px';
        shareButtons.style.gap = '10px';
        
        // نسخ الرابط
        const copyBtn = document.createElement('button');
        copyBtn.className = 'share-btn';
        copyBtn.innerHTML = '<i class="fas fa-copy"></i> نسخ الرابط';
        copyBtn.style.padding = '8px 15px';
        copyBtn.style.border = 'none';
        copyBtn.style.borderRadius = '4px';
        copyBtn.style.backgroundColor = '#4CAF50';
        copyBtn.style.color = 'white';
        copyBtn.style.cursor = 'pointer';
        copyBtn.onclick = function() {
          urlInput.select();
          document.execCommand('copy');
          copyBtn.textContent = 'تم النسخ!';
          setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> نسخ الرابط';
          }, 2000);
        };
        shareButtons.appendChild(copyBtn);
        
        // زر الإغلاق
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'إغلاق';
        closeBtn.style.padding = '8px 15px';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '4px';
        closeBtn.style.backgroundColor = '#e0001a';
        closeBtn.style.color = 'white';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.marginTop = '10px';
        closeBtn.style.width = '100%';
        closeBtn.onclick = function() {
          shareDialog.remove();
        };
        
        // إضافة العناصر
        modalContent.appendChild(title);
        modalContent.appendChild(urlInput);
        modalContent.appendChild(shareButtons);
        modalContent.appendChild(closeBtn);
        shareDialog.appendChild(modalContent);
        
        document.body.appendChild(shareDialog);
      } else {
        // تحديث قيمة الرابط إذا كان مربع الحوار موجوداً بالفعل
        const urlInput = shareDialog.querySelector('input');
        if (urlInput) {
          urlInput.value = imageUrl;
        }
        shareDialog.style.display = 'block';
      }
    }
  };
  
  // تصدير الكائنات
  export { GalleryUtils, ImageUtils };
  
  // جعل الكائنات متاحة عالمياً
  window.GalleryUtils = GalleryUtils;
  window.ImageUtils = ImageUtils;