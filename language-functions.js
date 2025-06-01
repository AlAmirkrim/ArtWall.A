/**
 * language-functions.js
 * ملف جافاسكريبت موحد يحتوي على دوال متعلقة بتغيير اللغة
 */

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

// تحديث خيارات اللغة استنادًا إلى اللغة المحددة - حدّثت لتدعم كلا نوعي معرفات العناصر
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

// دالة تبديل اللغة الموحدة للموقع - حدّثت لتدعم كلا نوعي معرفات العناصر
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
    
    // تحديث الترجمات - محاولة استيراد الوحدة أولاً
    if (typeof updateUILanguage === 'function') {
        updateUILanguage();
    } else {
        try {
            import('./translations.js').then(module => {
                const { setLanguage, updateUILanguage } = module;
                if (typeof setLanguage === 'function') {
                    setLanguage(lang);
                }
                if (typeof updateUILanguage === 'function') {
                    updateUILanguage();
                }
            }).catch(err => {
                console.error('خطأ في استيراد وحدة الترجمة:', err);
            });
        } catch (e) {
            console.error('خطأ في استيراد وحدة الترجمة:', e);
        }
    }
}

// تهيئة اللغة عند تحميل الصفحة
// دوال الزر الجديد المحسن
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
        
        // استخدام قوة الحوسبة لتأكيد ظهور القائمة (ابتكاري)
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
    
    // استدعاء دالة تحديث واجهة المستخدم من ملف الترجمات
    try {
        if (typeof updateUILanguage === 'function') {
            updateUILanguage();
        } else {
            import('./translations.js').then(module => {
                if (typeof module.updateUILanguage === 'function') {
                    module.updateUILanguage();
                }
            }).catch(err => {
                console.error('خطأ في استيراد وحدة الترجمة:', err);
            });
        }
    } catch (e) {
        console.error('خطأ في استدعاء دالة تحديث واجهة المستخدم:', e);
    }
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

document.addEventListener('DOMContentLoaded', function() {
    console.log('حدث تحميل DOM - بداية تهيئة زر اللغة');
    
    // إضافة تأخير صغير للتأكد من تحميل العناصر
    setTimeout(function() {
        // تهيئة جميع أزرار اللغة
        initializeAllLanguageButtons();
    }, 500);
});