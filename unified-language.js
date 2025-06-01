/**
 * unified-language.js
 * ملف موحد لجميع وظائف اللغة والترجمة في التطبيق
 * يجمع بين ملفي translations.js و language-functions.js
 */

// قاموس الترجمة
let translations = {
    // ترجمات عامة
    "welcome": {
      "en": "Welcome!",
      "ar": "مرحبًا!"
    },
    "intro": {
      "en": "Here you will find different types of wallpapers,",
      "ar": "هنا ستجد أنواعًا مختلفة من خلفيات الشاشة،"
    },
    "enjoy": {
      "en": "... enjoy!",
      "ar": "... استمتع!"
    },
    "start": {
      "en": "Start",
      "ar": "ابدأ"
    },
    "communication": {
      "en": "Communication",
      "ar": "تواصل"
    },
    "signIn": {
      "en": "Sign In",
      "ar": "تسجيل الدخول"
    },
    "signUp": {
      "en": "Sign Up",
      "ar": "إنشاء حساب"
    },
    "myProfile": {
      "en": "My Profile",
      "ar": "ملفي الشخصي"
    },
    "myAccount": {
      "en": "My Account",
      "ar": "حسابي"
    },
    "myFavorites": {
      "en": "My Favorites",
      "ar": "المفضلة"
    },
    "imageDimensions": {
      "en": "Image Dimensions",
      "ar": "أبعاد الصور"
    },
    "all": {
      "en": "All",
      "ar": "الكل"
    },
    "classic": {
      "en": "Classic",
      "ar": "كلاسيكي"
    },
    "world": {
      "en": "World",
      "ar": "عالم"
    },
    "animals": {
      "en": "Animals",
      "ar": "حيوانات"
    },
    "creativity": {
      "en": "Creativity",
      "ar": "إبداع"
    },
    "anime": {
      "en": "Anime",
      "ar": "أنمي"
    },
    "download": {
      "en": "Download",
      "ar": "تنزيل"
    },
    "setAsProfile": {
      "en": "Set as Profile Picture",
      "ar": "تعيين كصورة شخصية"
    },
    "siteCreated": {
      "en": "Site created by [AK]",
      "ar": "تم الإنشاء بواسطة [AK]"
    },
    "development": {
      "en": "The site is still under development.",
      "ar": "الموقع لا يزال قيد التطوير."
    },
    "phoneNumber": {
      "en": "Phone number: coming soon.",
      "ar": "رقم الهاتف: قريبًا."
    },
    "email": {
      "en": "Email: coming soon.",
      "ar": "البريد الإلكتروني: قريبًا."
    },
    "support": {
      "en": "Support",
      "ar": "الدعم"
    },
    "categories": {
      "en": "Categories",
      "ar": "الفئات"
    },
    "account": {
      "en": "Account",
      "ar": "الحساب"
    },
    "switchLanguage": {
      "en": "Switch Language",
      "ar": "تبديل اللغة"
    },
    "dontHaveAccount": {
      "en": "Don't have an account?",
      "ar": "لا تمتلك حساب؟"
    },
    "createAccount": {
      "en": "Create account",
      "ar": "قم بإنشاء حساب"
    },
    "alreadyHaveAccount": {
      "en": "Already have an account?",
      "ar": "تمتلك حساب؟"
    },
    "loginToAccount": {
      "en": "Sign in",
      "ar": "قم بتسجيل الدخول"
    },
    "generateImage": {
      "en": "Generate AI Image",
      "ar": "توليد صورة بالذكاء الاصطناعي"
    },
    "imageGenerator": {
      "en": "AI Image Generator",
      "ar": "مولد الصور بالذكاء الاصطناعي"
    },
    "generate": {
      "en": "Generate",
      "ar": "توليد"
    },
    "generating": {
      "en": "Generating...",
      "ar": "جاري التوليد..."
    },
    "saveToGallery": {
      "en": "Save to Gallery",
      "ar": "حفظ في المعرض"
    },
    "regenerate": {
      "en": "Regenerate",
      "ar": "إعادة التوليد"
    },
    "realistic": {
      "en": "Realistic",
      "ar": "واقعي"
    },
    "animeStyle": {
      "en": "Anime",
      "ar": "أنمي"
    },
    "3dStyle": {
      "en": "3D",
      "ar": "ثلاثي الأبعاد"
    },
    "paintingStyle": {
      "en": "Painting",
      "ar": "لوحة فنية"
    },
    "square": {
      "en": "Square 1:1",
      "ar": "مربع 1:1"
    },
    "landscape": {
      "en": "Landscape 16:9",
      "ar": "أفقي 16:9"
    },
    "portrait": {
      "en": "Portrait 2:3",
      "ar": "عمودي 2:3"
    },
    "backToHome": {
      "en": "Back to Home",
      "ar": "العودة للرئيسية"
    },
    "generatorDescription": {
      "en": "Write a description of the image you want to create, and choose the appropriate style and dimensions.",
      "ar": "اكتب وصفاً للصورة التي تريد إنشاءها، واختر النمط المناسب وأبعاد الصورة."
    }
  };
  
  // دالة لإضافة ترجمات جديدة
  function addTranslations(newTranslations) {
    translations = {...translations, ...newTranslations};
  }
  
  // الحصول على الترجمة لعنصر معين
  function getTranslation(key, language) {
    if (!translations[key]) {
      return key;
    }
    return translations[key][language] || translations[key]['en'];
  }
  
  // تعيين اللغة
  function setLanguage(language) {
    localStorage.setItem('language', language);
    // تعيين اتجاه الصفحة بناءً على اللغة
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }
  
  // تبديل اللغة
  function toggleLanguage() {
    const currentLang = localStorage.getItem('language') || 'en';
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    
    setLanguage(newLang);
    return newLang;
  }
  
  // تحديث العناصر الخاصة في واجهة المستخدم
  function updateSpecialElements(language) {
    // تحديث placeholder لحقل البحث
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.placeholder = language === 'ar' ? 'ابحث عن صور...' : 'Search images...';
    }
    
    // تحديث رسائل التأكيد
    const confirmDialogText = document.querySelector('.confirm-content p');
    if (confirmDialogText) {
      confirmDialogText.textContent = language === 'ar' 
        ? 'هل أنت متأكد من رغبتك في حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.'
        : 'Are you sure you want to delete your account? This action cannot be undone.';
    }
  
    const confirmYesBtn = document.getElementById('confirmYes');
    if (confirmYesBtn) {
      confirmYesBtn.textContent = language === 'ar' 
        ? 'نعم، حذف الحساب'
        : 'Yes, Delete Account';
    }
  
    const confirmNoBtn = document.getElementById('confirmNo');
    if (confirmNoBtn) {
      confirmNoBtn.textContent = language === 'ar' 
        ? 'إلغاء'
        : 'Cancel';
    }
  }
  
  // تحديث الهيدر والتنقل حسب اللغة المحددة
  function updateHeaderBasedOnLanguage(currentLang) {
    // تطبيق الإعدادات الخاصة بالهيدر حسب اللغة
    const isArabic = currentLang === 'ar';
    
    // تعيين زر تبديل اللغة
    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) {
      langBtn.innerHTML = isArabic ? 
        'اللغة <span class="down-arrow">&#9660;</span>' : 
        'Language <span class="down-arrow">&#9660;</span>';
    }
    
    // تحديث حاوية الشعار بناءً على اللغة
    const siteLogoContainer = document.querySelector('.site-logo-container');
    if (siteLogoContainer) {
      siteLogoContainer.style.flexDirection = 'row';
      // الاتجاه دائمًا ltr لإظهار الشعار بشكل صحيح
      siteLogoContainer.style.direction = 'ltr';
    }
    
    // تحديث القسم الرئيسي للهيدر (الشعار)
    const logoUserSection = document.querySelector('.logo-user-section');
    if (logoUserSection) {
      if (isArabic) {
        logoUserSection.style.marginRight = '15px';
        logoUserSection.style.marginLeft = 'auto';
        logoUserSection.style.textAlign = 'right';
      } else {
        logoUserSection.style.marginLeft = '15px';
        logoUserSection.style.marginRight = 'auto';
        logoUserSection.style.textAlign = 'left';
      }
    }
    
    // تحديث اتجاه حاوية التنقل (شريط التنقل)
    const navContainer = document.querySelector('.nav-container');
    if (navContainer) {
      // تطبيق السلوك المناسب للغة العربية
      if (isArabic) {
        navContainer.style.direction = 'rtl';
        // ضمان أن النص في الجهة اليمنى للشاشات العربية
        const navigation = navContainer.querySelector('.navigation');
        if (navigation) {
          navigation.style.textAlign = 'left'; // في rtl، اليسار يصبح اليمين
          navigation.style.paddingLeft = '15px';
          navigation.style.paddingRight = '0';
        }
      } else {
        navContainer.style.direction = 'ltr';
        // ضمان أن النص في الجهة اليمنى للشاشات الإنجليزية
        const navigation = navContainer.querySelector('.navigation');
        if (navigation) {
          navigation.style.textAlign = 'right';
          navigation.style.paddingRight = '15px';
          navigation.style.paddingLeft = '0';
        }
      }
    }
    
    // إعداد قائمة التنقل - دائمًا أفقي مع توجيه ltr للأزرار
    const navList = document.getElementById('nav-list');
    if (navList) {
      // دائمًا ltr لضمان ترتيب الأزرار بشكل صحيح
      navList.style.direction = 'ltr';
      // دائمًا أفقي
      navList.style.display = 'inline-flex';
      navList.style.flexDirection = 'row';
      navList.style.flexWrap = 'nowrap';
    }
    
    // تطبيق تنسيقات موضع القائمة المنسدلة للغة
    const languageDropdownContent = document.querySelector('.language-dropdown-content');
    if (languageDropdownContent) {
      if (isArabic) {
        languageDropdownContent.style.left = '0';
        languageDropdownContent.style.right = 'auto';
        languageDropdownContent.style.textAlign = 'right';
      } else {
        languageDropdownContent.style.right = '0';
        languageDropdownContent.style.left = 'auto';
        languageDropdownContent.style.textAlign = 'left';
      }
    }
  }
  
  // تطبيق تنسيقات الهيدر للشاشات الصغيرة
  function applyResponsiveHeaderStyles(isArabic) {
    // تحقق إذا كانت شاشة صغيرة
    const isSmallScreen = window.innerWidth <= 768;
    
    // حصول على عناصر التنقل
    const navList = document.getElementById('nav-list');
    const headerContent = document.querySelector('.header-content');
    
    if (isSmallScreen) {
      // تنسيقات خاصة للشاشات الصغيرة بغض النظر عن اللغة
      if (navList) {
        // عرض الأزرار أفقياً مع التفاف (wrap) عند الحاجة
        navList.style.flexDirection = 'row';
        navList.style.flexWrap = 'wrap';
        navList.style.justifyContent = 'center';
        navList.style.alignItems = 'center';
        navList.style.width = '100%';
        navList.style.marginTop = '5px';
        navList.style.padding = '0';
      }
      
      if (headerContent) {
        headerContent.style.flexDirection = 'column';
        headerContent.style.alignItems = 'center';
      }
      
      // تصغير حجم الأزرار قليلاً وضبط المسافات بينها
      document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.style.textAlign = 'center';
        btn.style.width = 'auto'; // لتتناسب مع المحتوى
        btn.style.fontSize = '0.85rem';
        btn.style.padding = '5px 8px';
        btn.style.margin = '3px 5px';
      });
    } else {
      // إعادة تنسيقات الشاشات الكبيرة
      if (navList) {
        navList.style.flexDirection = 'row';
        navList.style.flexWrap = 'nowrap';
        navList.style.justifyContent = isArabic ? 'flex-start' : 'flex-end';
        navList.style.width = 'auto';
        navList.style.marginTop = '0';
      }
      
      if (headerContent) {
        headerContent.style.flexDirection = 'row';
        headerContent.style.justifyContent = 'space-between';
      }
      
      // إعادة حجم الأزرار الطبيعي
      document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.style.textAlign = 'center';
        btn.style.width = 'auto';
        btn.style.fontSize = '1rem';
        btn.style.padding = '8px 15px';
        btn.style.margin = '0 3px';
      });
    }
  }
  
  // تحديث واجهة المستخدم باللغة المحددة
  function updateUILanguage() {
    const currentLang = localStorage.getItem('language') || 'en';
    
    // تحديث جميع العناصر التي تحتوي على سمة data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (translations[key]) {
        element.textContent = getTranslation(key, currentLang);
      }
    });
    
    // تحديث العناصر الخاصة الأخرى
    updateSpecialElements(currentLang);
    
    // تحديث تاريخ الانضمام
    const joinDate = document.getElementById('join-date');
    const user = window.getCurrentUser ? window.getCurrentUser() : null;
    
    if (joinDate && user && user.createdAt) {
      const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
      
      if (currentLang === 'en') {
        joinDate.textContent = new Date(user.createdAt).toLocaleDateString('en-US', dateOptions);
      } else {
        joinDate.textContent = new Date(user.createdAt).toLocaleDateString('ar-SA', dateOptions);
      }
    }
    
    // تحديث الهيدر والتنقل
    updateHeaderBasedOnLanguage(currentLang);
  }
  
  // التهيئة الأولية لزر اللغة - تدعم كلا نوعي معرفات العناصر
  function initLanguageDropdown() {
    console.log('تهيئة قائمة اللغة المنسدلة');
    
    // بحث عن العناصر بالمعرف القياسي أو معرف الصفحة الرئيسية
    const langBtn = document.getElementById('langToggleBtn') || document.getElementById('indexLangToggleBtn');
    const menu = document.getElementById('languageMenu') || document.getElementById('indexLanguageMenu');
    
    // تأكد من أن القائمة مخفية في البداية
    if (menu) {
      // ضبط نمط العرض المبدئي إلى "none" للتأكد من إخفاء القائمة
      menu.style.display = 'none';
      // تطبيق تنسيقات إضافية للقائمة المنسدلة (فقط إذا كان المعرف القياسي)
      if (menu.id === 'languageMenu') {
        menu.style.backgroundColor = 'rgba(26, 11, 32, 0.95)';
        menu.style.borderRadius = '8px';
        menu.style.boxShadow = '0 5px 15px rgba(0,0,0,0.4)';
        menu.style.zIndex = '2000';
        menu.style.padding = '8px 0';
        menu.style.minWidth = '140px';
        menu.style.border = '1px solid rgba(177, 76, 200, 0.3)';
      }
    }
    
    console.log('عناصر القائمة المنسدلة:', { 
      'وجود زر اللغة': !!langBtn, 
      'معرف زر اللغة': langBtn ? langBtn.id : 'غير موجود',
      'وجود قائمة اللغة': !!menu,
      'معرف قائمة اللغة': menu ? menu.id : 'غير موجود',
      'حالة عرض القائمة': menu ? window.getComputedStyle(menu).display : 'غير متاح'
    });
    
    // إذا كان معرف القائمة هو indexLanguageMenu، لا نحتاج لإضافة مستمع حدث لأنه موجود بالفعل
    if (menu && menu.id === 'indexLanguageMenu') {
      console.log('تم اكتشاف قائمة index، سيتم استخدام الوظائف المضمنة لها');
      return;
    }
    
    if (langBtn && menu) {
      // إضافة حدث النقر على زر اللغة
      langBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('تم النقر على زر اللغة في القائمة المنسدلة');
        
        // استخدم النمط المباشر بدلاً من الفئة لتجنب تعارضات CSS
        const currentDisplay = window.getComputedStyle(menu).display;
        console.log('حالة العرض الحالية للقائمة:', currentDisplay);
        
        // تبديل العرض بشكل مباشر
        if (currentDisplay === 'none') {
          console.log('عرض القائمة');
          menu.style.display = 'block';
          // أضف الفئة أيضًا للتوافق مع الشيفرة الموجودة
          menu.classList.add('show');
        } else {
          console.log('إخفاء القائمة');
          menu.style.display = 'none';
          // إزالة الفئة للتوافق
          menu.classList.remove('show');
        }
      });
      
      // إغلاق القائمة عند النقر في أي مكان آخر
      document.addEventListener('click', function(e) {
        if (e.target !== langBtn && !menu.contains(e.target)) {
          console.log('إغلاق القائمة بالنقر خارجها');
          menu.style.display = 'none';
          menu.classList.remove('show');
        }
      });
      
      // تطبيق اللغة الحالية عند التحميل
      const savedLang = localStorage.getItem('language') || 'ar';
      updateLanguageOptions(savedLang);
    } else {
      console.error('خطأ: لم يتم العثور على عناصر زر اللغة أو القائمة المنسدلة');
    }
  }
  
  // تحديث خيارات اللغة استنادًا إلى اللغة المحددة
  function updateLanguageOptions(lang) {
    console.log('تحديث خيارات اللغة إلى:', lang);
    
    // تحديث خيارات اللغة
    document.querySelectorAll('.lang-option').forEach(option => {
      if (option.getAttribute('data-lang') === lang) {
        option.classList.add('active');
      } else {
        option.classList.remove('active');
      }
    });
    
    // تحديث النص على زر اللغة (الدعم لكلا نوعي المعرفات)
    const standardLangText = document.querySelector('#langToggleBtn span[data-i18n="language"]');
    const indexLangText = document.querySelector('#indexLangToggleBtn span[data-i18n="language"]');
    
    // النص الذي سيتم عرضه على الزر
    const buttonText = lang === 'ar' ? 'اللغة' : 'Language';
    
    // تحديث النص على الزر القياسي إذا وجد
    if (standardLangText) {
      standardLangText.textContent = buttonText;
    }
    
    // تحديث النص على زر صفحة index إذا وجد
    if (indexLangText) {
      indexLangText.textContent = buttonText;
    }
  }
  
  // دالة تبديل اللغة الموحدة للموقع
  function switchLanguage(lang) {
    console.log('تبديل اللغة إلى:', lang);
    
    // تخزين اللغة
    localStorage.setItem('language', lang);
    
    // تحديث اتجاه الصفحة
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // تحديث حالة الخيارات
    updateLanguageOptions(lang);
    
    // إغلاق القائمة - التحقق من كلا نوعي معرفات العناصر
    const standardMenu = document.getElementById('languageMenu');
    const indexMenu = document.getElementById('indexLanguageMenu');
    
    // إغلاق القائمة القياسية إذا وجدت
    if (standardMenu) {
      standardMenu.classList.remove('show');
      standardMenu.style.display = 'none';
    }
    
    // إغلاق قائمة صفحة index إذا وجدت
    if (indexMenu) {
      indexMenu.style.display = 'none';
    }
    
    // تحديث واجهة المستخدم
    updateUILanguage();
  }
  
  // إظهار رسالة "قريبًا" للغات غير المدعومة حاليًا
  function showLanguageTodo(lang) {
    event.preventDefault();
    const langNames = {
      'fr': 'الفرنسية',
      'es': 'الإسبانية'
    };
    const currentLang = localStorage.getItem('language') || 'ar';
    const message = currentLang === 'ar' 
      ? `سيتم دعم اللغة ${langNames[lang]} قريبًا!` 
      : `${lang === 'fr' ? 'French' : 'Spanish'} language support coming soon!`;
    alert(message);
  }
  
  // تهيئة قائمة اللغة الجديدة
  function initNewLanguageMenu() {
    // تعيين اللغة الحالية كنشطة
    const currentLang = localStorage.getItem('language') || 'ar';
    document.querySelectorAll('#newLanguageMenu a').forEach(item => {
      if (item.getAttribute('data-lang') === currentLang) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    
    // تحديث نص زر اللغة
    const langBtnText = document.querySelector('#newLangToggleBtn span[data-i18n="language"]');
    if (langBtnText) {
      langBtnText.textContent = currentLang === 'ar' ? 'اللغة' : 'Language';
    }
  }
  
  // دالة تبديل عرض قائمة اللغة الجديدة
  function toggleNewLanguageMenu(event) {
    // منع السلوك الافتراضي
    event.preventDefault();
    event.stopPropagation();
    
    const btn = document.getElementById('newLangToggleBtn');
    const menu = document.getElementById('newLanguageMenu');
    
    if (menu.style.display === 'block') {
      menu.style.display = 'none';
    } else {
      // مسح أي أنماط سابقة قد تتسبب في المشاكل
      menu.removeAttribute('style');
      
      // وضع عنصر خفي مؤقت لقياس أبعاد القائمة
      menu.style.visibility = 'hidden';
      menu.style.display = 'block';
      menu.style.position = 'fixed';
      
      // حساب موضع القائمة بالنسبة للزر
      const btnRect = btn.getBoundingClientRect();
      const navContainer = document.querySelector('.nav-container') || document.querySelector('.sidebar');
      const navRect = navContainer ? navContainer.getBoundingClientRect() : null;
      
      // استخدام نقطة مرجعية أكثر استقرارًا
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      // تحديد موضع القائمة - تخطى أي محتوى آخر
      menu.style.zIndex = '100000';
  
      // تحديد ما إذا كانت القائمة ستظهر فوق أو تحت الزر بناءً على المساحة المتاحة
      const bottomSpace = window.innerHeight - btnRect.bottom;
      const menuHeight = 220; // تقدير تقريبي لارتفاع القائمة
      const showAbove = bottomSpace < menuHeight; // إذا لم تكن هناك مساحة كافية في الأسفل
      
      // محاذاة القائمة حسب اتجاه الصفحة (RTL/LTR)
      const isRTL = document.documentElement.dir === 'rtl';
      
      if (showAbove) {
        // عرض القائمة فوق الزر
        menu.style.bottom = (window.innerHeight - btnRect.top + 5) + 'px';
        menu.style.top = 'auto';
        menu.setAttribute('data-position', 'top');
        
        if (isRTL) {
          // الموضع في حالة RTL
          menu.style.left = (btnRect.left) + 'px';
          menu.style.right = 'auto';
        } else {
          // الموضع في حالة LTR
          menu.style.left = (btnRect.left - 60) + 'px';
          menu.style.right = 'auto';
        }
      } else {
        // عرض القائمة تحت الزر
        menu.style.top = (btnRect.bottom + 5) + 'px';
        menu.style.bottom = 'auto';
        menu.setAttribute('data-position', 'bottom');
        
        if (isRTL) {
          // الموضع في حالة RTL
          menu.style.left = (btnRect.left) + 'px';
          menu.style.right = 'auto';
        } else {
          // الموضع في حالة LTR
          menu.style.left = (btnRect.left - 60) + 'px';
          menu.style.right = 'auto';
        }
      }
      
      // عرض القائمة المخفية لقياس أبعادها الحقيقية
      const menuRect = menu.getBoundingClientRect();
      
      // ضمان بقاء القائمة داخل حدود الشاشة
      if (menuRect.right > screenWidth) {
        menu.style.left = 'auto';
        menu.style.right = '10px';
      }
      
      if (menuRect.left < 0) {
        menu.style.left = '10px';
        menu.style.right = 'auto';
      }
      
      if (menuRect.bottom > screenHeight) {
        menu.style.top = 'auto';
        menu.style.bottom = '10px';
      }
      
      // استخدام قوة الحوسبة لتأكيد ظهور القائمة
      menu.style.visibility = 'visible';
      menu.style.opacity = '0';
      
      // رفع الأولوية باستخدام تأجيل لضمان تقديم التغييرات
      setTimeout(() => {
        menu.style.opacity = '1';
      }, 10);
    }
  }
  
  // دالة تبديل اللغة الجديدة
  function switchLanguageNew(lang) {
    // تخزين اللغة
    localStorage.setItem('language', lang);
    
    // تحديث اتجاه الصفحة
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // إغلاق القائمة
    const menu = document.getElementById('newLanguageMenu');
    menu.style.display = 'none';
    
    // تحديث حالة الخيارات في الزر الجديد
    document.querySelectorAll('#newLanguageMenu a').forEach(item => {
      if (item.getAttribute('data-lang') === lang) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    
    // تحديث حالة الخيارات في الأزرار الأخرى للحفاظ على المزامنة
    try {
      document.querySelectorAll('.lang-option').forEach(item => {
        if (item.getAttribute('data-lang') === lang) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    } catch (e) {
      console.error('خطأ في تحديث حالة خيارات اللغة:', e);
    }
    
    // تحديث نص زر اللغة الجديد
    const newLangBtnText = document.querySelector('#newLangToggleBtn span[data-i18n="language"]');
    if (newLangBtnText) {
      newLangBtnText.textContent = lang === 'ar' ? 'اللغة' : 'Language';
    }
    
    // تحديث نص زر اللغة الأصلي إذا كان موجودًا
    const originalLangText = document.querySelector('#langToggleBtn span[data-i18n="language"]');
    if (originalLangText) {
      originalLangText.textContent = lang === 'ar' ? 'اللغة' : 'Language';
    }
    
    // استدعاء دالة تحديث واجهة المستخدم
    updateUILanguage();
  }
  
  // معالجات إغلاق القائمة
  function setupMenuCloseHandlers() {
    // إغلاق القائمة عند النقر في أي مكان آخر
    document.addEventListener('click', function(event) {
      const menu = document.getElementById('newLanguageMenu');
      if (!menu) return;
      
      const btn = document.getElementById('newLangToggleBtn');
      
      // تحقق ما إذا كان الهدف ليس الزر أو القائمة
      if (event.target !== btn && !btn.contains(event.target) && 
          !menu.contains(event.target)) {
        menu.style.display = 'none';
      }
    });
    
    // إغلاق القائمة عند التمرير
    window.addEventListener('scroll', function() {
      const menu = document.getElementById('newLanguageMenu');
      if (menu && menu.style.display === 'block') {
        menu.style.display = 'none';
      }
    });
    
    // إغلاق القائمة عند تغيير حجم النافذة
    window.addEventListener('resize', function() {
      const menu = document.getElementById('newLanguageMenu');
      if (menu && menu.style.display === 'block') {
        menu.style.display = 'none';
      }
    });
  }
  
  // تهيئة أزرار اللغة في التطبيق
  function initializeAllLanguageButtons() {
    console.log('جاري تهيئة أزرار اللغة في التطبيق...');
    
    // تحقق من نوع الصفحة - بناءً على عنوان HTML
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('index.html') || currentPage === '/' || currentPage === '') {
      // نحن في الصفحة الرئيسية - استخدم الزر الجديد
      const newLangBtn = document.getElementById('newLangToggleBtn');
      const newMenu = document.getElementById('newLanguageMenu');
      
      if (newLangBtn && newMenu) {
        console.log('تم العثور على الزر الجديد، جاري تهيئته...');
        initNewLanguageMenu();
        setupMenuCloseHandlers();
      }
    } else {
      // نحن في صفحة أخرى (مثل simple-gallery.html) - استخدم الزر القديم
      const oldLangBtn = document.getElementById('langToggleBtn');
      const oldMenu = document.getElementById('languageMenu');
      
      if (oldLangBtn && oldMenu) {
        console.log('تم العثور على الزر القديم، جاري تهيئته...');
        initLanguageDropdown();
      } else {
        console.warn('لم يتم العثور على أي زر لغة في الصفحة الحالية!');
      }
    }
  }
  
  // إضافة مستمع لحدث تحميل الصفحة لتهيئة أزرار اللغة
  document.addEventListener('DOMContentLoaded', function() {
    console.log('حدث تحميل DOM - بداية تهيئة زر اللغة');
    
    // إضافة تأخير صغير للتأكد من تحميل العناصر
    setTimeout(function() {
      // تهيئة جميع أزرار اللغة
      initializeAllLanguageButtons();
    }, 500);
  });
  
  // إعادة تطبيق أنماط الشاشات الصغيرة عند تغيير حجم النافذة
  window.addEventListener('resize', function() {
    const currentLang = localStorage.getItem('language') || 'en';
    applyResponsiveHeaderStyles(currentLang === 'ar');
  });
  
  // تصدير الوظائف
  export {
    // وظائف من translations.js
    toggleLanguage,
    updateUILanguage,
    getTranslation,
    setLanguage,
    addTranslations,
    
    // وظائف من language-functions.js
    initLanguageDropdown,
    updateLanguageOptions,
    switchLanguage,
    showLanguageTodo,
    initNewLanguageMenu,
    toggleNewLanguageMenu,
    switchLanguageNew,
    setupMenuCloseHandlers,
    initializeAllLanguageButtons
  }