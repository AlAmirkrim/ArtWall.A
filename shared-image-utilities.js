/**
 * shared-image-utilities.js
 * ملف وظائف مشتركة للتعامل مع الصور بين مختلف أجزاء التطبيق
 */

// تحديد اتجاه الصورة (أفقي، عمودي، مربع) بناءً على أبعادها
function setImageOrientation(imgElement) {
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
      return orientation;
    }
    return 'landscape'; // افتراضي
  }
  
  // تبديل إلى العرض المدمج عند النقر على الصورة
  function switchToCompactView(imgElement) {
    if (typeof viewFullImage === 'function') {
      // احصل على عنوان URL للصورة والعنوان
      const imageUrl = imgElement.src;
      const imageTitle = imgElement.alt;
      
      // عرض الصورة في وضع ملء الشاشة
      viewFullImage(imageUrl, imageTitle);
    } else {
      console.warn('وظيفة viewFullImage غير معرفة');
    }
  }
  
  // عرض الصورة في وضع ملء الشاشة
  function viewFullImage(url, title, event) {
    if (event) event.stopPropagation();
    console.log('عرض الصورة في وضع ملء الشاشة:', url);
    
    // البحث عن عارض موجود أو إنشاء واحد جديد
    let fullscreenViewer = document.getElementById('fullscreen-viewer');
    
    if (!fullscreenViewer) {
      fullscreenViewer = document.createElement('div');
      fullscreenViewer.id = 'fullscreen-viewer';
      fullscreenViewer.className = 'fullscreen-viewer';
      
      document.body.appendChild(fullscreenViewer);
    } else {
      fullscreenViewer.innerHTML = '';
    }
    
    // إنشاء محتوى العارض
    fullscreenViewer.innerHTML = `
      <div class="fullscreen-overlay" onclick="document.getElementById('fullscreen-viewer').remove()">
        <div class="fullscreen-content" onclick="event.stopPropagation()">
          <div class="fullscreen-header">
            <h3>${title || 'صورة'}</h3>
            <button class="close-btn" onclick="document.getElementById('fullscreen-viewer').remove()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="fullscreen-body">
            <img src="${url}" alt="${title || 'صورة'}" class="fullscreen-image" />
          </div>
          <div class="fullscreen-footer">
            <div class="image-actions">
              <button class="action-btn like-btn" onclick="handleLikeClick('${url}', event)">
                <i class="fas fa-heart"></i>
                <span class="likes-count" data-url="${url}">${getLikesCount ? getLikesCount(url) : 0}</span>
              </button>
              <button class="action-btn favorite-btn ${getFavorites && getFavorites().includes(url) ? 'active' : ''}" 
                      onclick="handleFavoriteButton('${url}', event)">
                <i class="fas fa-star"></i>
              </button>
              <button class="action-btn download-btn" onclick="downloadImage(event, '${url}')">
                <i class="fas fa-download"></i>
              </button>
              <button class="action-btn share-btn" onclick="showShareDialog('${url}')">
                <i class="fas fa-share-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // إضافة أنماط CSS إذا لم تكن موجودة
    if (!document.getElementById('fullscreen-viewer-styles')) {
      const styles = document.createElement('style');
      styles.id = 'fullscreen-viewer-styles';
      styles.textContent = `
        .fullscreen-viewer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 9999;
          animation: fade-in 0.3s ease;
        }
        .fullscreen-overlay {
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fullscreen-content {
          max-width: 95%;
          max-height: 95%;
          background: #111;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);
        }
        .fullscreen-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: #1a0b20;
          color: white;
          direction: rtl;
        }
        .fullscreen-header h3 {
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .close-btn {
          background: transparent;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
        }
        .fullscreen-body {
          flex: 1;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
          max-height: 80vh;
        }
        .fullscreen-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        .fullscreen-footer {
          padding: 15px;
          background: #1a0b20;
          display: flex;
          justify-content: center;
        }
        .image-actions {
          display: flex;
          gap: 15px;
        }
        .action-btn {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .action-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .action-btn.like-btn {
          background: rgba(255, 0, 0, 0.2);
        }
        .action-btn.favorite-btn.active {
          background: rgba(255, 215, 0, 0.3);
        }
        .action-btn.favorite-btn.active i {
          color: #FFD700;
        }
        .action-btn.download-btn {
          background: rgba(0, 128, 0, 0.2);
        }
        .action-btn.share-btn {
          background: rgba(0, 128, 255, 0.2);
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `;
      document.head.appendChild(styles);
    }
    
    // معالجة مفتاح Escape لإغلاق العارض
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        const viewer = document.getElementById('fullscreen-viewer');
        if (viewer) viewer.remove();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    // تسجيل مشاهدة الصورة إذا كانت الوظيفة متاحة
    if (typeof recordImageView === 'function') {
      recordImageView();
    }
  }
  
  // تعيين الصورة كصورة ملف شخصي
  function setAsProfileImage(imageUrl) {
    console.log('تعيين الصورة كصورة ملف شخصي:', imageUrl);
    
    // التحقق من وجود المستخدم الحالي
    if (typeof getCurrentUser !== 'function' || !getCurrentUser()) {
      // عرض نافذة تنبيه للمستخدم
      alert('يرجى تسجيل الدخول أولاً لاستخدام هذه الميزة');
      return;
    }
    
    // تأكيد من المستخدم
    if (confirm('هل تريد بالتأكيد تعيين هذه الصورة كصورة الملف الشخصي الخاص بك؟')) {
      // تحميل الصورة أولاً
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
      
      img.onload = function() {
        // إنشاء عنصر canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = Math.min(img.width, img.height);
        
        // إعداد Canvas بالحجم المناسب (مربع)
        canvas.width = 200;
        canvas.height = 200;
        
        // حساب موضع القص للحصول على جزء مربع من الصورة
        const sourceX = (img.width - size) / 2;
        const sourceY = (img.height - size) / 2;
        
        // رسم الصورة على Canvas (مع القص والتعديل إلى شكل مربع)
        ctx.drawImage(img, sourceX, sourceY, size, size, 0, 0, 200, 200);
        
        // تحويل Canvas إلى صورة
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        // حفظ الصورة كصورة ملف شخصي
        if (typeof saveUserAvatar === 'function') {
          saveUserAvatar(dataUrl);
          
          // تحديث جميع صور الملف الشخصي في الصفحة
          if (typeof updateUserAvatars === 'function') {
            updateUserAvatars();
          }
          
          // تأكيد للمستخدم
          alert('تم تعيين الصورة بنجاح كصورة الملف الشخصي الخاص بك!');
        } else {
          console.error('وظيفة saveUserAvatar غير متوفرة');
          alert('حدث خطأ أثناء محاولة حفظ الصورة. يرجى المحاولة مرة أخرى لاحقًا.');
        }
      };
      
      img.onerror = function() {
        console.error('فشل تحميل الصورة لتعيينها كصورة ملف شخصي');
        alert('حدث خطأ أثناء تحميل الصورة. يرجى المحاولة مرة أخرى لاحقًا.');
      };
    }
  }
  
  // مشاركة الصورة
  function showShareDialog(imageUrl) {
    console.log('مشاركة الصورة:', imageUrl);
    
    // إنشاء عنوان URL للمشاركة (يمكن تكييفه حسب احتياجاتك)
    const shareUrl = `${window.location.origin}/share.html?image=${encodeURIComponent(imageUrl)}`;
    
    // التحقق من توفر واجهة برمجة مشاركة الويب
    if (navigator.share) {
      navigator.share({
        title: 'شارك هذه الصورة',
        text: 'شاهد هذه الصورة الرائعة!',
        url: shareUrl
      })
      .then(() => console.log('تمت المشاركة بنجاح'))
      .catch((error) => console.error('خطأ في المشاركة:', error));
    } else {
      // إنشاء نافذة مشاركة مخصصة
      let shareDialog = document.getElementById('custom-share-dialog');
      
      if (!shareDialog) {
        shareDialog = document.createElement('div');
        shareDialog.id = 'custom-share-dialog';
        shareDialog.className = 'custom-share-dialog';
        
        document.body.appendChild(shareDialog);
      }
      
      shareDialog.innerHTML = `
        <div class="share-overlay" onclick="document.getElementById('custom-share-dialog').remove()">
          <div class="share-content" onclick="event.stopPropagation()">
            <div class="share-header">
              <h3>مشاركة الصورة</h3>
              <button class="close-btn" onclick="document.getElementById('custom-share-dialog').remove()">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="share-body">
              <div class="share-preview">
                <img src="${imageUrl}" alt="Share preview" class="share-image" />
              </div>
              <div class="share-options">
                <button class="share-btn fb-btn" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}', '_blank')">
                  <i class="fab fa-facebook-f"></i> Facebook
                </button>
                <button class="share-btn tw-btn" onclick="window.open('https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('شاهد هذه الصورة الرائعة!')}', '_blank')">
                  <i class="fab fa-twitter"></i> Twitter
                </button>
                <button class="share-btn wa-btn" onclick="window.open('https://api.whatsapp.com/send?text=${encodeURIComponent('شاهد هذه الصورة الرائعة! ' + shareUrl)}', '_blank')">
                  <i class="fab fa-whatsapp"></i> WhatsApp
                </button>
                <button class="share-btn tg-btn" onclick="window.open('https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('شاهد هذه الصورة الرائعة!')}', '_blank')">
                  <i class="fab fa-telegram-plane"></i> Telegram
                </button>
              </div>
              <div class="share-link">
                <input type="text" id="share-url" value="${shareUrl}" readonly />
                <button class="copy-btn" onclick="document.getElementById('share-url').select(); document.execCommand('copy'); this.textContent = 'تم النسخ!'">
                  نسخ الرابط
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // إضافة أنماط CSS إذا لم تكن موجودة
      if (!document.getElementById('share-dialog-styles')) {
        const styles = document.createElement('style');
        styles.id = 'share-dialog-styles';
        styles.textContent = `
          .custom-share-dialog {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            animation: fade-in 0.3s ease;
          }
          .share-overlay {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .share-content {
            width: 90%;
            max-width: 500px;
            max-height: 90%;
            background: #111;
            border-radius: 8px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);
          }
          .share-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            background: #1a0b20;
            color: white;
            direction: rtl;
          }
          .share-header h3 {
            margin: 0;
          }
          .share-body {
            padding: 20px;
            overflow-y: auto;
            direction: rtl;
          }
          .share-preview {
            margin-bottom: 20px;
            background: #000;
            border-radius: 8px;
            overflow: hidden;
            text-align: center;
          }
          .share-image {
            max-width: 100%;
            max-height: 200px;
            object-fit: contain;
          }
          .share-options {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 20px;
          }
          .share-btn {
            padding: 10px;
            border: none;
            border-radius: 5px;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .share-btn:hover {
            opacity: 0.9;
          }
          .fb-btn {
            background: #3b5998;
          }
          .tw-btn {
            background: #1da1f2;
          }
          .wa-btn {
            background: #25d366;
          }
          .tg-btn {
            background: #0088cc;
          }
          .share-link {
            display: flex;
            gap: 10px;
          }
          .share-link input {
            flex: 1;
            padding: 10px;
            border: 1px solid #333;
            border-radius: 5px;
            background: #222;
            color: white;
          }
          .copy-btn {
            padding: 10px 15px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            white-space: nowrap;
          }
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @media (max-width: 600px) {
            .share-options {
              grid-template-columns: 1fr;
            }
            .share-link {
              flex-direction: column;
            }
          }
        `;
        document.head.appendChild(styles);
      }
    }
  }
  
  // تصدير الدوال للنطاق العالمي
  window.setImageOrientation = setImageOrientation;
  window.switchToCompactView = switchToCompactView;
  window.viewFullImage = viewFullImage;
  window.setAsProfileImage = setAsProfileImage;
  window.showShareDialog = showShareDialog;
  
  // تصدير ES Modules (تم التعطيل - التعديل B)
  /*
  export {
    setImageOrientation,
    switchToCompactView,
    viewFullImage,
    setAsProfileImage,
    showShareDialog
  };
  */