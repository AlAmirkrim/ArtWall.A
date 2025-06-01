// imageData.js - ملف موحد لبيانات الصور
// يحتوي هذا الملف على جميع بيانات الصور للتطبيق ويدعم نظام تعدد اللغات

/**
 * مصفوفة بيانات الصور
 * قمنا بتحويل جميع العناوين لتدعم تعدد اللغات باستخدام الكائن title
 * أي عنوان سابق كان نصًا بسيطًا تم تحويله إلى كائن به مفتاح ar للعربية
 */
const imageData = [  
    // صور الإبداع
    {
      /*url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},    
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},    
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},    
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},    
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},    
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},    
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},    
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},    
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},    
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''},
      url:'',alt:'',category:'',title: {ar:'', en:''}},*/
        {url:'https://cdn.leonardo.ai/users/940f1923-0905-4588-9708-27da4d4c20e7/generations/cc291808-bdea-4f1b-bc62-04323cc75f29/Leonardo_Phoenix_10_A_delicate_holographic_treble_clef_musical_2.jpg',alt:'',category:'',title: {ar:'', en:''}},
    {url:'https://cdn.leonardo.ai/users/940f1923-0905-4588-9708-27da4d4c20e7/generations/cc291808-bdea-4f1b-bc62-04323cc75f29/Leonardo_Phoenix_10_A_delicate_holographic_treble_clef_musical_2.jpg',alt:'',category:'',title: {ar:'', en:''}},
      {url:'https://cdn.leonardo.ai/users/940f1923-0905-4588-9708-27da4d4c20e7/generations/cc291808-bdea-4f1b-bc62-04323cc75f29/Leonardo_Phoenix_10_A_delicate_holographic_treble_clef_musical_2.jpg',alt:'music',category:'creativity',title: {ar:'موسيقي', en:'Music'}},
    {url:'https://cdn.leonardo.ai/users/25aec653-01c1-4318-9021-b2c5525acceb/generations/7f7234ea-cb0b-48aa-b5e3-7318a215396e/Leonardo_Phoenix_10_a_mesmerizing_dreamlike_and_vividly_colore_3.jpg?w=512',alt:'colorful clouds',category:'creativity',title:{ar:'سحاب ملون', en:'colorful clouds'}},
      {url:'https://cdn.leonardo.ai/users/940f1923-0905-4588-9708-27da4d4c20e7/generations/12162abc-d406-4613-9cc6-3646418b5400/Leonardo_Anime_XL_A_soft_ombre_gradient_of_pink_hues_reminisce_0.jpg?w=512',alt:'Scent of Serenity',category:'Anime',title:{ar:'همس الزهور', en:'Scent of Serenity'}},
    {url:'https://cdn.leonardo.ai/users/940f1923-0905-4588-9708-27da4d4c20e7/generations/00338044-15d1-4d3e-9dfb-15566da3be73/Leonardo_Phoenix_10_A_stunning_and_epic_logo_for_Animal_World_2.jpg',alt:'Space Dragon',category:'Animals',title: {ar:'تنين الفضاء', en:'Space Dragon'}},
      {url:'https://cdn.leonardo.ai/users/940f1923-0905-4588-9708-27da4d4c20e7/generations/6abe61ab-b5bb-4f61-b140-7ef4600d25f3/Leonardo_Phoenix_10_A_stunning_and_epic_logo_for_the_Animal_Wo_1.jpg',alt:'Space Lion',category:'Animals',title: {ar:'أسد الفضاء',en:'Space Lion'}},
      {url:'https://cdn.leonardo.ai/users/25aec653-01c1-4318-9021-b2c5525acceb/generations/266ec8af-51db-4e3e-8698-799755e1d56a/3f175a0a-e171-41e6-8b01-d6d9f766b200.jpg?w=512',alt:'gold coins',category:'Creativity',title: {ar: 'عملات ذهبية',en:'Gold Coins'}},  
    {
      url:'https://cdn.leonardo.ai/users/25aec653-01c1-4318-9021-b2c5525acceb/generations/2b1b4c35-761d-4e67-a941-0aef72b1071b/9abc3d6e-64bd-4403-97d6-d2722b3b460b.jpg?w=512',
      alt:'gold coins',
      category:'Creativity',
      title: {
        ar: 'كنز ذهبي',
        en: 'Golden Treasure'
      }
    },  
    {
      url:'https://cdn.leonardo.ai/users/25aec653-01c1-4318-9021-b2c5525acceb/generations/8817e8f2-3a7b-4ee6-b643-b73347195022/Leonardo_Phoenix_10_Level_1_The_Seeker_of_LightA_small_figure_3.jpg?w=512',
      alt:'stone gate',
      category:'World',
      title: {
        ar: 'بوابة حجرية',
        en: 'Stone Gate'
      }
    },  
    {
      url:'https://cdn.leonardo.ai/users/25aec653-01c1-4318-9021-b2c5525acceb/generations/83c6136c-2564-46d5-8623-9eed2a12dd07/Leonardo_Phoenix_10_sleek_hightech_space_suit_The_visor_refle_1.jpg?w=512',
      alt:'space - astronaut in space',
      category:'space',
      title: {
        ar: 'رائد فضاء',
        en: 'Astronaut'
      }
    },  
    {
      url:'https://cdn.leonardo.ai/users/25aec653-01c1-4318-9021-b2c5525acceb/generations/8be3527b-b27e-4cc1-b7c4-1903a779c705/Leonardo_Phoenix_10_A_dark_immersive_codingthemed_wallpaper_cr_0.jpg?w=512',
      alt:'programming',
      category:'technology',
      title: {
        ar: 'برمجة رقمية',
        en: 'Digital Programming'
      }
    },  
    {
      url:'https://cdn.leonardo.ai/users/25aec653-01c1-4318-9021-b2c5525acceb/generations/d536a30f-0db7-441e-bd48-ca61eea03546/Leonardo_Phoenix_10_A_sleek_futuristic_darkthemed_wallpaper_ce_1.jpg?w=512',
      alt:'programming',
      category:'technology',
      title: {
        ar: 'مستقبل التكنولوجيا',
        en: 'Future of Technology'
      }
    },
    
    {
      url:'https://cdn.leonardo.ai/users/25aec653-01c1-4318-9021-b2c5525acceb/generations/6b7c254d-a8f3-4ab7-8655-8850beeb50b0/Leonardo_Phoenix_10_A_dreamy_cinematic_keyframe_featuring_a_st_2.jpg?w=512',
      alt:'heard and butterflies',
      category:'Creativity',
      title: {
        ar: 'الفراشات والقلوب',
        en: 'Butterflies and Hearts'
      }
    },
    
    {
      url:'https://cdn.leonardo.ai/users/25aec653-01c1-4318-9021-b2c5525acceb/generations/b3204aef-8312-4eb4-8d37-860465f7d665/Leonardo_Phoenix_10_A_futuristic_neonlit_open_book_rests_at_th_1.jpg?w=512',
      alt:'book and brain',
      category:'Creativity',
      title: {
        ar: 'كتاب المعرفة',
        en: 'Book of Knowledge'
      }
    },
    
    {
      url:'https://cdn.leonardo.ai/users/25aec653-01c1-4318-9021-b2c5525acceb/generations/4b5c0ca6-5ec0-4dc9-a847-298182a5d861/Leonardo_Phoenix_10_Level_3_The_Aesthetic_GuardianA_guardianli_1.jpg?w=512',
      alt:'boy magical',
      category:'Anime',
      title: {
        ar: 'الفتى السحري',
        en: 'Magical Boy'
      }
    },
    
    {
      url:'https://cdn.leonardo.ai/users/25aec653-01c1-4318-9021-b2c5525acceb/generations/ec5b12ee-f324-48bb-8ae6-7d6d07e7c68d/Leonardo_Phoenix_10_A_hyperrealistic_fantasy_lion_entirely_mad_1.jpg?w=512',
      alt:'lion pink',
      category:'Animals',
      title: {
        ar: 'أسد وردي',
        en: 'Pink Lion'
      }
    },
    
    {
      url:'https://cdn.leonardo.ai/users/25aec653-01c1-4318-9021-b2c5525acceb/generations/bc71d8a8-557c-4295-9a2a-fcdcc1c8d4f0/Leonardo_Phoenix_10_a_dramatic_cinematic_photograph_of_a_majes_0.jpg?w=512',
      alt:'Horse and Moon',
      category:'Animals',
      title: {
        ar: 'الحصان والقمر',
        en: 'Horse and Moon'
      }
    },
  
    {
      url:'https://cdn.leonardo.ai/users/25aec653-01c1-4318-9021-b2c5525acceb/generations/e2831bfc-aa7b-4814-a0bd-53733cc72187/Leonardo_Phoenix_10_a_dramatic_cinematic_photograph_of_a_majes_1.jpg',
      alt:'Horse and Moon',
      category:'Animals',
      title: {
        ar: 'حصان في ليلة مقمرة',
        en: 'Horse in Moonlight'
      }
    },
  
    {
      url:'https://cdn.leonardo.ai/users/25aec653-01c1-4318-9021-b2c5525acceb/generations/7641aa05-dc36-4c02-a8bc-95725a721aac/Leonardo_Phoenix_10_A_mesmerizing_scifi_concept_art_piece_feat_2.jpg?w=512',
      alt:'fish',
      category:'Animals',
      title: {
        ar: 'سمكة فضائية',
        en: 'Space Fish'
      }
    },
    {
      url:'https://cdn.leonardo.ai/users/25aec653-01c1-4318-9021-b2c5525acceb/generations/d6646d0e-517f-49c7-b071-57c16b0a670a/Leonardo_Phoenix_10_In_a_breathtakingly_poetic_scene_a_sleek_c_2.jpg',
      alt:'technology - car',
      category:'technology',
      title: {
        ar: 'سيارة المستقبل',
        en: 'Future Car'
      }
    },
    {
      url:'https://cdn.leonardo.ai/users/25aec653-01c1-4318-9021-b2c5525acceb/generations/d7256549-5679-4ef0-b908-7c8b0b23de04/51000e15-0287-491a-a852-e5afdaaceea6.jpg?w=512',
      alt:'animals - wolf',
      category: 'Animals',
      title: {
        ar: 'ذئب في البرية',
        en: 'Wolf in the Wild'
      }
    },
    {
      url: 'https://cdn.leonardo.ai/users/25aec653-01c1-4318-9021-b2c5525acceb/generations/986298f9-4971-4ac1-a641-4bc859017862/Leonardo_Phoenix_10_The_image_presents_a_stunningly_magical_sc_2.jpg',
      alt:'Birds - birds',
      category:'Animals',
      title: {
        ar: 'طيور ملونة',
        en: 'Colorful Birds'
      }
    },
    {
      url: 'https://cdn.leonardo.ai/users/fae058b0-fcf5-45c3-aed3-8a05b2489590/generations/1264f9cb-9ed2-402e-ae60-86d498b3539e/Leonardo_Phoenix_10_A_delicate_basrelief_oil_painting_artwork_2.jpg?w=512',
      alt: 'creativity - butterflies',
      category: 'Creativity',
      title: {
        ar: 'فراشات إبداعية',
        en: 'Creative Butterflies'
      }
    },
    {
      url: 'https://cdn.leonardo.ai/users/25aec653-01c1-4318-9021-b2c5525acceb/generations/4acc0a90-e5c8-4830-85e9-132fd1eaadb4/Leonardo_Phoenix_10_A_highresolution_stock_photo_a_tight_close_1.jpg?w=512',
      alt: 'anime girl',
      category: 'Anime',
      title: {
        ar: 'فتاة أنمي',
        en: 'Anime Girl'
      }
    },
    {
      url: 'https://cdn.leonardo.ai/users/25aec653-01c1-4318-9021-b2c5525acceb/generations/77ef7e9e-a6f5-4066-8db5-03734c36d7a1/Leonardo_Phoenix_10_A_vibrant_ancient_forest_bathed_in_golden_3.jpg?w=512',
      alt: 'World - Landscape',
      category: 'World',
      title: {
        ar: 'منظر طبيعي',
        en: 'Natural Landscape'
      }
    },
    {
      url: 'https://cdn.leonardo.ai/users/25aec653-01c1-4318-9021-b2c5525acceb/generations/14b6f1c3-feaf-413b-942e-59599b75c82a/Leonardo_Phoenix_10_Amidst_the_shadows_that_devour_the_light_S_1.jpg?w=512',
      alt: 'Anime - Dark Man',
      category: 'Anime',
      title: {
        ar: 'شخصية غامضة',
        en: 'Mysterious Character'
      }
    },
    {
      url: 'https://cdn.leonardo.ai/users/25aec653-01c1-4318-9021-b2c5525acceb/generations/bd2c92a3-db8c-4574-99ac-9c59d985e382/Leonardo_Phoenix_10_A_dense_ancient_forest_shrouded_in_eternal_3.jpg?w=512',
      alt: 'World - Ancient Forest',
      category: 'World',
      title: {
        ar: 'غابة قديمة',
        en: 'Ancient Forest'
      }
    },
    {
      url: 'https://cdn.leonardo.ai/users/25aec653-01c1-4318-9021-b2c5525acceb/generations/e2ec85bf-0097-47f3-90c5-0b9096f1eaba/Leonardo_Phoenix_10_A_city_bursting_with_life_in_the_evening_i_3.jpg?w=512',
      alt: 'World - Beautiful City',
      category: 'World',
      title: {
        ar: 'مدينة جميلة',
        en: 'Beautiful City'
      }
    },
    {
      url: 'https://cdn.leonardo.ai/users/25aec653-01c1-4318-9021-b2c5525acceb/generations/14961cfe-b079-4f45-be2f-c927f43ec0b9/Leonardo_Kino_XL_A_stunning_highquality_digital_illustration_o_3.jpg?w=512',
      alt: 'Creativity - Moon of Water',
      category: 'Creativity',
      title: {
        ar: 'قمر الماء',
        en: 'Water Moon'
      }
    },
    {
      url: 'https://cdn.leonardo.ai/users/25aec653-01c1-4318-9021-b2c5525acceb/generations/02e5e1c3-5fdc-4e55-bdab-3a68e092df95/Leonardo_Kino_XL_A_stunning_highquality_digital_illustration_o_3.jpg?w=512',
      alt: 'Creativity - Moon and Water',
      category: 'Creativity',
      title: {
        ar: 'القمر والماء',
        en: 'Moon and Water'
      }
    },
    {
      url: 'https://cdn.leonardo.ai/users/25aec653-01c1-4318-9021-b2c5525acceb/generations/8bc939b1-dc41-4fed-b0a3-85e2467b0791/9ca25ef6-a143-4bd1-a421-fbda5371292e.jpg?w=512',
      alt: 'Animals - Cat and Flowers',
      category: 'Animals',
      title: {
        ar: 'قط مع زهور',
        en: 'Cat with Flowers'
      }
    },
    {
      url: 'https://cdn.leonardo.ai/users/25aec653-01c1-4318-9021-b2c5525acceb/generations/5a860309-297d-4754-9913-f4faf65785ca/Leonardo_Anime_XL_logo_2.jpg?w=512',
      alt: 'Anime - Veiled Girl',
      category: 'Anime',
      title: {
        ar: 'فتاة بحجاب',
        en: 'Veiled Girl'
      }
    },
    {
      url: 'https://cdn.leonardo.ai/users/25aec653-01c1-4318-9021-b2c5525acceb/generations/cb450271-02bf-4d3e-be12-55a1a3ebdf54/Leonardo_Phoenix_10_A_classicstyle_desktop_wallpaper_featuring_0.jpg',
      alt: 'Classic - Clock, Lamp and Book',
      category: 'Classic',
      title: {
        ar: 'ساعة ومصباح وكتاب',
        en: 'Clock, Lamp and Book'
      }
    }
  ];
  
  // تعيين المصفوفة إلى الكائن العالمي كـ imageData
  window.imageData = imageData;
  
  // تعيين galleryImages للتوافق مع الكود القديم
  window.galleryImages = imageData;
  
  // إضافة تصدير ES Modules بتنسيق default
  //export default imageData;
