
// Storage.js - وظائف التخزين المحلي مع تحسينات الأمان

// دالة تشفير بسيطة لكلمات المرور
function encryptPassword(password) {
    return btoa(password + "salt_123"); // يمكن استخدام خوارزمية تشفير أقوى في الإنتاج
  }
  
  // التحقق من صحة البريد الإلكتروني
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // التحقق من قوة كلمة المرور
  function validatePassword(password) {
    return password.length >= 8;
  }
  
  // الحصول على المستخدمين المسجلين
  function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }
  
  // حفظ المستخدمين
  function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }
  
  // تم إلغاء وقت انتهاء الجلسة لتسجيل الدخول الدائم
  function setSessionExpiry() {
    // لا شيء - تم إلغاء وقت انتهاء الجلسة
  }
  
  function checkSessionExpiry() {
    return false; // دائماً يعود false للحفاظ على تسجيل الدخول
  }
  
  // تسجيل الخروج
  function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('sessionExpiry');
    localStorage.removeItem('userAuthenticated');
    window.location.href = 'index.html';
  }
  
  // الحصول على المستخدم الحالي
  function getCurrentUser() {
    if (checkSessionExpiry()) return null;
    return JSON.parse(localStorage.getItem('currentUser'));
  }
  
  // حفظ المستخدم الحالي
  function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('userAuthenticated', 'true');
    setSessionExpiry();
  }
  
  // تسجيل مستخدم جديد
  function registerUser(username, email, password) {
    if (!validateEmail(email)) {
      throw new Error('البريد الإلكتروني غير صالح');
    }
  
    if (!validatePassword(password)) {
      throw new Error('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
    }
  
    const users = getUsers();
    
    if (users.some(u => u.email === email)) {
      throw new Error('البريد الإلكتروني مسجل مسبقاً');
    }
  
    const newUser = { 
      username, 
      email, 
      password: encryptPassword(password),
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);
    
    return newUser;
  }
  
  // تسجيل الدخول
  function loginUser(email, password) {
    const users = getUsers();
    const user = users.find(u => 
      u.email === email && 
      u.password === encryptPassword(password)
    );
    
    if (!user) {
      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
    
    setCurrentUser(user);
    return user;
  }
  
  // الحصول على المفضلة
  function getFavorites() {
    if (checkSessionExpiry()) return [];
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  }
  
  // حفظ المفضلة
  function saveFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
  
  // إضافة/إزالة من المفضلة
  function toggleFavorite(imageUrl) {
    const favorites = getFavorites();
    const index = favorites.indexOf(imageUrl);
    
    if (index === -1) {
      favorites.push(imageUrl);
    } else {
      favorites.splice(index, 1);
    }
    
    saveFavorites(favorites);
    return favorites;
  }
  
  // إضافة هذه الوظيفة في نهاية الملف قبل التصدير
  function deleteUser() {
    const users = getUsers();
    const currentUser = getCurrentUser();
    
    if (!currentUser) return false;
    
    const updatedUsers = users.filter(user => user.email !== currentUser.email);
    saveUsers(updatedUsers);
    
    // حذف بيانات المستخدم الحالي
    localStorage.removeItem('currentUser');
    localStorage.removeItem('sessionExpiry');
    localStorage.removeItem('userAuthenticated');
    
    return true;
  }
  
  // إضافة هذه الوظائف قبل التصدير
  
  // دالة لتهيئة إحصائيات المستخدم
  function initUserStats() {
    const user = getCurrentUser();
    if (!user) return;
    
    // تهيئة إحصائيات المستخدم إذا لم تكن موجودة
    const allUserStats = JSON.parse(localStorage.getItem('userStats') || '{}');
    
    if (!allUserStats[user.email]) {
      allUserStats[user.email] = {
        views: 0,
        downloads: 0,
        likes: 0
      };
      localStorage.setItem('userStats', JSON.stringify(allUserStats));
    }
  }
  
  // الحصول على إحصائيات المستخدم
  function getUserStats() {
    const user = getCurrentUser();
    if (!user) return { views: 0, downloads: 0, likes: 0 };
    
    initUserStats();
    const allUserStats = JSON.parse(localStorage.getItem('userStats') || '{}');
    return allUserStats[user.email] || { views: 0, downloads: 0, likes: 0 };
  }
  
  // زيادة قيمة إحصائية معينة
  function incrementUserStat(stat) {
    const user = getCurrentUser();
    if (!user) return;
    
    initUserStats();
    const allUserStats = JSON.parse(localStorage.getItem('userStats') || '{}');
    
    if (!allUserStats[user.email][stat]) {
      allUserStats[user.email][stat] = 0;
    }
    
    allUserStats[user.email][stat]++;
    localStorage.setItem('userStats', JSON.stringify(allUserStats));
    
    return allUserStats[user.email][stat];
  }
  
  // تسجيل مشاهدة صورة
  function recordImageView() {
    return incrementUserStat('views');
  }
  
  // تسجيل تنزيل صورة
  function recordImageDownload() {
    return incrementUserStat('downloads');
  }
  
  // تسجيل إعجاب أو إزالة إعجاب بصورة
  function recordImageLike(isLiking = true) {
    if (isLiking) {
      return incrementUserStat('likes');
    } else {
      // تقليل عدد الإعجابات بمقدار 1 عند إزالة الإعجاب
      const user = getCurrentUser();
      if (!user) return false;
      
      const users = getUsers();
      const userIndex = users.findIndex(u => u.email === user.email);
      
      if (userIndex !== -1) {
        // تأكد من أن الإحصائيات موجودة
        users[userIndex].stats = users[userIndex].stats || { views: 0, downloads: 0, likes: 0 };
        
        // تقليل عدد الإعجابات بحد أدنى 0
        users[userIndex].stats.likes = Math.max(0, (users[userIndex].stats.likes || 0) - 1);
        
        // حفظ التغييرات
        saveUsers(users);
        
        // تحديث المستخدم الحالي
        user.stats = users[userIndex].stats;
        setCurrentUser(user);
        
        return true;
      }
      
      return false;
    }
  }
  
  // وظيفة لحفظ صورة المستخدم
  function saveUserAvatar(imageData) {
    const user = getCurrentUser();
    if (!user) return false;
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === user.email);
    
    if (userIndex !== -1) {
      // تحديث صورة المستخدم في مصفوفة المستخدمين
      users[userIndex].avatar = imageData;
      // حفظ التغييرات إلى localStorage
      saveUsers(users);
      
      // تحديث المستخدم الحالي
      user.avatar = imageData;
      setCurrentUser(user);
      return true;
    }
    
    return false;
  }
  
  // وظيفة للحصول على صورة المستخدم
  function getUserAvatar() {
    const user = getCurrentUser();
    return user?.avatar || null;
  }
  
  // تهيئة إحصائيات الإعجابات
  function initializeLikes() {
    if (!localStorage.getItem('imageLikes')) {
      localStorage.setItem('imageLikes', '{}');
    }
    if (!localStorage.getItem('userLikes')) {
      localStorage.setItem('userLikes', '[]');
    }
  }
  
  // الحصول على عدد الإعجابات للصورة
  function getLikesCount(imageUrl) {
    initializeLikes();
    const likes = JSON.parse(localStorage.getItem('imageLikes'));
    return likes[imageUrl] || 0;
  }
  
  // الحصول على الصور التي أعجب بها المستخدم
  function getUserLikes() {
    initializeLikes();
    return JSON.parse(localStorage.getItem('userLikes') || '[]');
  }
  
  // إتاحة الدالة من خلال كائن window للوصول إليها من الملفات الأخرى
  window.getUserLikes = getUserLikes;
  
  // تحديث سطر التصدير ليشمل الوظائف الجديدة
  export {
    getUsers,
    getCurrentUser,
    registerUser,
    loginUser,
    logout,
    getFavorites,
    toggleFavorite,
    deleteUser,
    getUserStats,
    recordImageView,
    recordImageDownload,
    recordImageLike,
    saveUserAvatar,
    getUserAvatar,
    initializeLikes,
    getLikesCount,
    getUserLikes
  };