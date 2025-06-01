// script.js 
// Import statements
import { 
    loginUser, 
    registerUser, 
    getFavorites, 
    toggleFavorite, 
    getCurrentUser,
    recordImageView,
    recordImageDownload,
    recordImageLike,
    getUserAvatar,
    saveUserAvatar
  } from './Storage.js';
  
  // استيراد وظائف عرض الصور المشتركة (التعديل B)
  // import { viewImage, switchToCompactView, setImageOrientation } from './shared-image-utilities.js';
  // استخدام الوظائف من النطاق العالمي بدلاً من الاستيراد
  const { viewImage, switchToCompactView, setImageOrientation } = window;
  
  // الوصول لبيانات الصور من النطاق العالمي (التعديل B)
  // import imageData from './imageData.js';
  const imageData = window.imageData || [];
  
  // Global functions
  window.checkAuthAndRedirect = function(path) {
    const user = getCurrentUser();
    if (!user) {
      document.getElementById('signin-modal').style.display = 'block';
      return false;
    }
    window.location.href = path;
    return true;
  };
  
  // تعيين الوظائف المطلوبة عالميًا على كائن window
  window.getFavorites = getFavorites;
  window.toggleFavorite = toggleFavorite;
  window.setImageOrientation = setImageOrientation;
  window.viewImage = viewImage;
  window.getUserAvatar = getUserAvatar;
  window.saveUserAvatar = saveUserAvatar;
  window.recordImageView = recordImageView;
  window.recordImageDownload = recordImageDownload;
  window.recordImageLike = recordImageLike;
  
  // Global variables
  let currentCategory = 'all';
  let currentDimension = 'all';
  let currentSearchTerm = '';
  
  window.initializeLikes = function() {
    if (!localStorage.getItem('imageLikes')) {
      localStorage.setItem('imageLikes', '{}');
    }
    if (!localStorage.getItem('userLikes')) {
      localStorage.setItem('userLikes', '[]');
    }
  };
  // Make sure likes are initialized
  window.initializeLikes();
  
  window.getLikesCount = function(imageUrl) {
    window.initializeLikes();
    const likes = JSON.parse(localStorage.getItem('imageLikes'));
    return likes[imageUrl] || 0;
  };
  
  window.getUserLikes = function() {
    window.initializeLikes();
    return JSON.parse(localStorage.getItem('userLikes'));
  };
  
  window.toggleLike = function(imageUrl) {
    window.initializeLikes();
    const likes = JSON.parse(localStorage.getItem('imageLikes'));
    const userLikes = window.getUserLikes();
  
    const userLikeIndex = userLikes.indexOf(imageUrl);
  
    if (userLikeIndex === -1) {
      likes[imageUrl] = (likes[imageUrl] || 0) + 1;
      userLikes.push(imageUrl);
    } else {
      likes[imageUrl] = Math.max((likes[imageUrl] || 0) - 1, 0);
      userLikes.splice(userLikeIndex, 1);
    }
  
    localStorage.setItem('imageLikes', JSON.stringify(likes));
    localStorage.setItem('userLikes', JSON.stringify(userLikes));
    return likes[imageUrl];
  };
  
  window.handleLikeClick = function(imageUrl) {
    console.log("زر الإعجاب: ", imageUrl);
    
    // تحقق من القيمة الحالية أولا لتحسين واجهة المستخدم
    const userLikes = window.getUserLikes();
    const oldHasLiked = userLikes.includes(imageUrl);
    
    // تبديل الإعجاب والحصول على العدد الجديد
    const newCount = window.toggleLike(imageUrl);
    
    // تحديث كل البطاقات التي تحتوي على هذه الصورة
    const cards = document.querySelectorAll(`.image-card img[src="${imageUrl}"]`);
    cards.forEach(img => {
      const card = img.closest('.image-card');
      if (card) {
        const countElement = card.querySelector('.likes-count');
        const heartIcon = card.querySelector('.like-icon');
        
        // الحصول على حالة الإعجاب الجديدة
        const hasLiked = window.getUserLikes().includes(imageUrl);
        
        // تسجيل إعجاب إذا قام المستخدم بالإعجاب الآن وليس من قبل
        if (hasLiked && !oldHasLiked && getCurrentUser()) {
          recordImageLike();
        }
        
        // تحديث العداد والأيقونة
        if (countElement) {
          countElement.textContent = newCount;
          
          // إضافة تأثير مرئي للعداد
          countElement.classList.add('updated');
          setTimeout(() => countElement.classList.remove('updated'), 500);
        }
        
        if (heartIcon) {
          // تحديث أيقونة القلب
          heartIcon.style.color = hasLiked ? 'white' : 'transparent';
          heartIcon.style.webkitTextStroke = hasLiked ? '0' : '1px white';
          
          // إضافة تأثير مرئي
          heartIcon.classList.add('pulse');
          setTimeout(() => heartIcon.classList.remove('pulse'), 500);
        }
      }
    });
    
    // إذا كنا في عرض مشاهدة الصورة بشكل منفصل، نحدث القلب هناك أيضًا
    const tooltipHeartButtons = document.querySelectorAll('.image-tooltip .control-btn.favorite-btn');
    if (tooltipHeartButtons.length > 0) {
      const isFavorite = window.getFavorites().includes(imageUrl);
      tooltipHeartButtons.forEach(btn => {
        btn.innerHTML = `
          <i class="fas fa-heart"></i>
          ${isFavorite ? '❤️' : '🤍'}
        `;
      });
    }
  };
  
  // تعريف handleFavoriteClick كدالة전역 (عالمية)
  window.handleFavoriteClick = function(imageUrl, event) {
    console.log("زر المفضلة: ", imageUrl);
    
    // إذا كانت دالة معالجة الأزرار الجديدة متاحة، نستخدمها
    if (window.handleFavoriteButton) {
      // نمرر الحدث الحالي أو نقوم بإنشاء حدث وهمي إذا لم يكن الحدث الحالي متاحًا
      if (!event) {
        // إنشاء حدث وهمي
        event = {
          preventDefault: function() {},
          stopPropagation: function() {},
          currentTarget: document.querySelector(`button.favorite-btn[onclick*="${imageUrl}"]`)
        };
      }
      window.handleFavoriteButton(imageUrl, event);
      return;
    }
    
    // الشيفرة القديمة في حالة عدم توفر الدالة الجديدة
    // تبديل حالة المفضلة
    window.toggleFavorite(imageUrl);
    
    // الحصول على الحالة الجديدة
    const isFavorite = window.getFavorites().includes(imageUrl);
    
    // تحديث جميع الأزرار في جميع البطاقات التي تحتوي على هذه الصورة
    const allFavBtns = document.querySelectorAll(`button.favorite-btn[onclick*="${imageUrl}"]`);
    allFavBtns.forEach(btn => {
      btn.innerHTML = `<i class="fas fa-star" style="color: ${isFavorite ? '#FFD700' : 'white'}; font-size: 18px;"></i>`;
      btn.style.background = 'transparent';
      btn.classList.toggle('active', isFavorite);
      
      // إضافة تأثير مرئي
      btn.classList.add('scaled');
      setTimeout(() => btn.classList.remove('scaled'), 300);
    });
    
    // تحديث النافذة المنبثقة للصورة إذا كانت مفتوحة
    const tooltipFavBtns = document.querySelectorAll('.image-tooltip .favorite-btn');
    if (tooltipFavBtns.length > 0) {
      const currentImgSrc = document.querySelector('.image-tooltip img')?.src;
      if (currentImgSrc && currentImgSrc.includes(imageUrl)) {
        tooltipFavBtns.forEach(btn => {
          btn.innerHTML = `<i class="fas fa-star" style="color: ${isFavorite ? '#FFD700' : 'white'}; font-size: 18px;"></i>`;
          // إضافة تأثير مرئي
          btn.classList.add('scaled');
          setTimeout(() => btn.classList.remove('scaled'), 300);
        });
      }
    }
  }
  
  // جعل الدالة متاحة عالمياً في كائن window
  window.handleSignIn = function(e) {
    e.preventDefault();
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
  
    if (!email || !password) {
      alert('الرجاء إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }
  
    try {
      loginUser(email, password);
      const modal = document.getElementById('signin-modal');
      if (modal) modal.style.display = 'none';
      updateAuthUI();
      window.location.href = 'simple-gallery.html';
    } catch (error) {
      alert(error.message);
    }
  };
  
  window.handleSignUp = function(e) {
    e.preventDefault();
    const username = document.getElementById('signup-username')?.value;
    const email = document.getElementById('signup-email')?.value;
    const password = document.getElementById('signup-password')?.value;
  
    if (!username || !email || !password) {
      alert('الرجاء إدخال جميع البيانات المطلوبة');
      return;
    }
  
    try {
      registerUser(username, email, password);
      const modal = document.getElementById('signup-modal');
      if (modal) modal.style.display = 'none';
      
      // تعيين اسم المستخدم يدويًا في العنصر
      const userNameSpan = document.getElementById('user-name');
      if (userNameSpan) {
        userNameSpan.textContent = username;
        userNameSpan.style.display = 'block';
      }
      
      updateAuthUI();
      window.location.href = 'simple-gallery.html';
    } catch (error) {
      alert(error.message);
    }
  };
  
  // استخدام الدالة العالمية من window
  export function updateAuthUI() {
    // إذا كانت الدالة موجودة عالمياً، نستخدمها
    if (typeof window.updateAuthUI === 'function') {
      window.updateAuthUI();
    } else {
      // احتياطي - إذا لم تكن الدالة موجودة عالمياً
      const user = getCurrentUser();
      const userNameSpan = document.getElementById('user-name');
      const authButtons = document.querySelectorAll('.auth-buttons');
      const userButtons = document.querySelectorAll('.user-buttons');
      
      console.log("تحديث واجهة المستخدم (احتياطي):", user);
    
      // تحديث اسم المستخدم في القائمة الجانبية
      if (userNameSpan) {
        if (user) {
          userNameSpan.textContent = user.username || 'مستخدم';
          userNameSpan.style.fontSize = '15px';
          userNameSpan.style.fontWeight = 'bold';
          userNameSpan.style.color = '#fff';
          console.log("تم تعيين اسم المستخدم:", user.username);
        } else {
          userNameSpan.textContent = 'زائر';
          userNameSpan.style.color = '#bbb';
          console.log("تم تعيين اسم المستخدم الافتراضي: زائر");
        }
        userNameSpan.style.display = 'block';
        userNameSpan.style.width = '100%';
        userNameSpan.style.overflow = 'hidden';
        userNameSpan.style.textOverflow = 'ellipsis';
      }
    
      // تحديث أزرار تسجيل الدخول
      if (user) {
        authButtons.forEach(btn => btn.style.display = 'none');
        userButtons.forEach(btn => btn.style.display = 'inline-block');
      } else {
        authButtons.forEach(btn => btn.style.display = 'inline-block');
        userButtons.forEach(btn => btn.style.display = 'none');
      }
      
      // تحديث صورة الملف الشخصي أيضًا
      updateUserAvatars();
    }
  }
  
  // Image interaction functions that need to be accessed globally
  window.downloadImage = function(event, url) {
    event.preventDefault();
    event.stopPropagation();
    
    console.log("تنزيل الصورة: ", url);
  
    // تسجيل تنزيل الصورة
    if (getCurrentUser()) {
      recordImageDownload();
    }
  
    // طريقة بديلة: نفتح نافذة جديدة ثم نستخدم وظيفة طباعة المتصفح للتنزيل
    const windowContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>تنزيل الصورة</title>
        <style>
          body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #000;
            flex-direction: column;
          }
          img {
            max-width: 90%;
            max-height: 80vh;
          }
          .download-message {
            color: white;
            font-family: Arial, sans-serif;
            margin-top: 20px;
            text-align: center;
          }
          .download-btn {
            margin-top: 15px;
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <img src="${url}" alt="صورة" id="downloadImg" />
        <div class="download-message">اضغط على زر التنزيل للحفظ، أو اضغط بزر الماوس الأيمن على الصورة واختر "حفظ الصورة باسم"</div>
        <button class="download-btn" id="downloadButton">تنزيل الصورة</button>
        
        <script>
          document.getElementById('downloadButton').addEventListener('click', function() {
            const imgElement = document.getElementById('downloadImg');
            const link = document.createElement('a');
            link.href = imgElement.src;
            link.download = imgElement.src.split('/').pop().split('?')[0] || "image_${Date.now()}.jpg";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          });
        </script>
      </body>
      </html>
    `;
  
    const downloadWindow = window.open();
    downloadWindow.document.write(windowContent);
    downloadWindow.document.close();
  };
  
  // وظيفة لتحديث صور المستخدم في واجهة المستخدم
  export function updateUserAvatars() {
    const userAvatar = getUserAvatar();
    console.log("تحديث صورة المستخدم:", userAvatar);
    
    // الحصول على اسم المستخدم
    const user = getCurrentUser();
    const username = user ? user.username : 'زائر';
    
    // تحديث جميع صور المستخدم في الصفحة
    const avatarElements = document.querySelectorAll('#user-avatar, .user-avatar, .user-avatar-small');
    
    if (userAvatar) {
      avatarElements.forEach(elem => {
        elem.src = userAvatar;
        elem.style.display = 'block';
        
        // تحديث اسم المستخدم إذا كان موجودًا بجانب الصورة
        const parentElement = elem.parentElement;
        const siblingNameElement = parentElement.querySelector('.user-name, .username');
        if (siblingNameElement) {
          siblingNameElement.textContent = username;
        }
      });
      
      // تحديث صور المستخدم في بطاقات الصور
      document.querySelectorAll('.card-header .user-info-container .user-avatar-small').forEach(avatar => {
        avatar.src = userAvatar;
        avatar.style.display = 'block';
        
        // تحديث اسم المستخدم بجانب الصورة
        const usernameElement = avatar.parentElement.querySelector('.username');
        if (usernameElement) {
          usernameElement.textContent = username;
        }
      });
      
      // تحديث صورة المستخدم في القائمة الجانبية
      const sidebarAvatar = document.querySelector('.sidebar .user-info .user-avatar');
      if (sidebarAvatar) {
        sidebarAvatar.src = userAvatar;
        sidebarAvatar.style.display = 'block';
        
        // تحديث اسم المستخدم في القائمة الجانبية
        const sidebarUsername = document.querySelector('.sidebar .user-info .username');
        if (sidebarUsername) {
          sidebarUsername.textContent = username;
        }
      }
    }
  }
  
  // وظيفة تعيين صورة كصورة شخصية
  window.setAsProfileImage = function(imageUrl) {
    console.log("تعيين صورة شخصية: ", imageUrl);
    
    const user = getCurrentUser();
    if (!user) {
      alert('يرجى تسجيل الدخول لتعيين صورة شخصية');
      return;
    }
  
    // إضافة رسالة تأكيد باللغة العربية
    const confirmChange = confirm("هل أنت متأكد من تعيين هذه الصورة كصورة شخصية؟");
    if (!confirmChange) {
      return; // إلغاء العملية إذا ضغط المستخدم على "إلغاء"
    }
  
    // استخدم طريقة بسيطة مباشرة للصورة
    try {
      saveUserAvatar(imageUrl);
      updateUserAvatars();
      alert('تم تعيين الصورة كصورة شخصية بنجاح');
    } catch (error) {
      console.error('خطأ:', error);
      alert('فشل في تعيين الصورة كصورة شخصية');
    }
  };
  
  