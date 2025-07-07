/**
 * Intent Mapping System for Civil Defense Chatbot
 * This file contains structured intent mappings to improve query understanding
 */

// General Service Categories - add colloquial/dialect variations
const generalIntents = {
  license_intents: [
    "ترخيص", "رخصة", "اصدار ترخيص", "تجديد ترخيص", "تصريح", "موافقة", "اذن", "تصريح مزاولة",
    "استخراج رخصة", "طلب ترخيص", "تجديد رخصة", "موافقة مبدئية", "اصدار تصريح", "استصدار ترخيص",
    "شهادة ترخيص", "وثيقة ترخيص", "الحصول على ترخيص", "تقديم على رخصة",
    // Add Middle Eastern dialect variations
    "ابي رخصة", "ابغى ترخيص", "بدي رخصة", "عايز رخصة", "أريد رخصة", "محتاج تصريح", 
    "ودي أحصل على", "ممكن رخصة", "كيف أطلع رخصة", "بغيت ترخيص", "لازمني تصريح"
  ],
  certificate_intents: [
    "شهادة", "اصدار شهادة", "تجديد شهادة", "توثيق", "اعتماد",
    "وثيقة", "استخراج شهادة", "طلب شهادة", "تصديق", "شهادة رسمية",
    "استلام شهادة", "افادة", "تجديد وثيقة", "استصدار شهادة",
    // Add Middle Eastern dialect variations
    "ابي شهادة", "عايز شهادة", "بدي وثيقة", "محتاج اعتماد", "ودي شهادة",
    "بغيت شهادة", "أبغى أطلع شهادة", "كيف احصل على شهادة", "فيه شهادة"
  ],
  report_intents: [
    "تقرير", "استخراج تقرير", "طلب تقرير", "بلاغ", "حادث", "حوادث",
    // Add Middle Eastern dialect variations
    "ابي تقرير", "عايز تقرير", "بغيت بلاغ", "صار حادث", "بلغت عن", "ودي اسوي بلاغ",
    "كيف اسوي بلاغ", "عندي حادث", "صار عندي مشكلة", "حصل حادث", "فيه حريق"
  ],
  inspection_intents: [
    "فحص", "تفتيش", "معاينة", "كشف", "زيارة", "تدقيق",
    // Add Middle Eastern dialect variations
    "ابي فحص", "عايز معاينة", "بدي تفتيش", "محتاج كشف", "يجو يشوفون", 
    "لازم حد يجي يشوف", "متى بيجو يعاينون", "محتاجين زيارة", "ابغى يتفقدون"
  ],
  training_intents: [
    "تدريب", "دورة", "محاضرة", "ورشة", "تعليم", "تأهيل"
  ],
  blueprint_intents: [
    "خرائط", "مخططات", "رسومات", "تصاميم", "هندسية", "معمارية"
  ],
  fees_intents: [
    "رسوم", "تكلفة", "سعر", "كم يكلف", "المبلغ", "دفع"
  ],
  documents_intents: [
    "مستندات", "وثائق", "أوراق", "متطلبات", "احتياجات"
  ],
  duration_intents: [
    "مدة", "وقت", "فترة", "كم يستغرق", "متى"
  ],
  application_intents: [
    "تقديم", "طلب", "حجز", "موعد", "الاجراءات", "خطوات"
  ]
};

// Specific Service Categories
const serviceSpecificIntents = {
  fire_safety_intents: [
    "حريق", "اطفاء", "انذار", "طفايات", "سلامة", "حماية", "وقاية", 
    "مكافحة الحرائق", "الوقاية من الحريق", "نظام الإنذار", "كاشف دخان", "رش مائي",
    "مكافحة", "منظومة الإطفاء", "سلامة الأرواح", "مخارج الطوارئ", "خراطيم الإطفاء",
    // Add Middle Eastern dialect variations
    "الطفاية", "طفاية الحريق", "جرس الانذار", "صفارة", "الرشاشات", "بزبوز الماي", 
    "دشابة الحريق", "خرطوم الماي", "باب الطوارئ", "الاخلاء", "الحماية من النار"
  ],
  chemical_intents: [
    "مواد كيميائية", "مواد خطرة", "تخزين مواد", "كيماويات", "مواد سامة",
    "سوائل خطرة", "كيماويات صناعية", "مواد متفاعلة", "تخزين الكيماويات", 
    "مواد حارقة", "مواد ضارة", "مواد مؤكسدة", "تسرب كيميائي"
  ],
  gas_intents: [
    "غاز", "وقود", "ديزل", "بنزين", "محطات وقود", "خزانات غاز",
    "غاز الطهي", "أسطوانات غاز", "تمديدات الغاز", "شبكة الغاز", 
    "وقود سائل", "صهاريج الوقود", "غاز طبيعي", "غاز مسال", "توصيلات الغاز"
  ],
  technical_office_intents: [
    "مكتب فني", "مكتب هندسي", "استشارة", "مكاتب", "خدمات فنية"
  ],
  building_intents: [
    "مبنى", "منشأة", "عقار", "مجمع", "فندق", "مصنع", "مخزن", "محل", "مخبز"
  ],
  explosives_intents: [
    "متفجرات", "العاب نارية", "مفرقعات", "مواد متفجرة"
  ],
  transportation_intents: [
    "نقل", "سيارات", "مركبات", "شحن", "شحنات"
  ],
  translation_intents: [
    "ترجمة", "لغة", "انجليزي", "عربي"
  ]
};

// Service to Field Mappings
const serviceFieldMappings = {
  "اسم الخدمة": [
    "ما هي", "اريد معلومات عن", "تفاصيل", "شرح", "وصف", 
    "اخبرني عن", "ماذا تعني", "ما المقصود بـ", "تعريف", "ما هو",
    // Add Middle Eastern dialect variations
    "شنو هاي الخدمة", "ايش هي", "وش معناها", "شلون الخدمة", "اش قصدك بـ",
    "شو يعني", "ممكن توضيح", "عايز اعرف", "شنهي", "ايش تقصد بـ"
  ],
  "رسوم الخدمة": [
    "كم تكلف", "تكلفة", "رسوم", "سعر", "المبلغ", "هل هي مجانية", "كم رسوم",
    "كم تبلغ الرسوم", "التكاليف", "ما هي الرسوم", "هل هناك رسوم", "كم سعر", "مجانية أم لا",
    // Add Middle Eastern dialect variations
    "كم يكلف", "كم بيكلف", "بكم", "السعر", "شكم", "بكم الرسوم", "فيها فلوس",
    "مجانية ولا لا", "ببلاش", "فيها مصاري", "كم اكلف", "يبيلها فلوس", "مجاني ولا لا"
  ],
  "شروط الخدمة": [
    "شروط", "متطلبات", "ما هي شروط", "ما يجب توفره", "اشتراطات",
    "المعايير", "الضوابط", "متطلبات التقديم", "ما يلزم", "ما يشترط",
    // Add Middle Eastern dialect variations
    "شنو الشروط", "ايش لازم", "وش المطلوب", "شو بدهم", "وش يبغون", 
    "شلون اسوي", "ايش الشروط", "المتطلبات ايش هي", "ايش احتاج", "شنو احتاج"
  ],
  "كيفية التقديم": [
    "كيف اقدم", "طريقة التقديم", "آلية التقديم", "اجراءات", "خطوات",
    "ما هي الخطوات", "كيف يمكنني", "ما هي الإجراءات", "طريقة الحصول على", "كيفية الحجز",
    // Add Middle Eastern dialect variations
    "كيف اطلب", "شلون اقدم", "وين اروح", "كيف اسوي", "وش الطريقة", 
    "كيف اتقدم بطلب", "كيفية التقديم", "من وين اطلب", "كيف احجز", "وين اقدم"
  ],
  "المستندات المطلوبة": [
    "مستندات", "وثائق", "اوراق", "ما المطلوب", "الأوراق المطلوبة",
    "المرفقات", "الإثباتات", "الوثائق المطلوبة", "ما هي المستندات", "ماذا أحضر معي",
    // Add Middle Eastern dialect variations
    "ايش اجيب معي", "شنو الاوراق", "وش لازم اجيب", "الأوراق المطلوبة شنهي", 
    "شو بدي احضر", "اي ورق لازم", "المستندات شنو", "وش الأوراق", "ايش الأوراق"
  ],
  "مدة إنجاز الخدمة": [
    "كم تستغرق", "المدة", "متى تنتهي", "وقت الانجاز", "فترة الانتظار",
    "كم من الوقت", "فترة الإنجاز", "الوقت اللازم", "مدة استخراج", "متى تكون جاهزة",
    // Add Middle Eastern dialect variations
    "كم يبيلها", "متى تخلص", "وقتها كم", "كم تاخذ وقت", "متى تجهز", 
    "اكم يوم تاخذ", "وقت الاستلام", "متى استلم", "بعد كم يوم", "كم يوم بالضبط"
  ]
};

// Complex Intent Patterns
const complexIntentPatterns = [
  {
    pattern: "كيف احصل على {service_type}",
    intent: "application_process"
  },
  {
    pattern: "ما هي مستندات {service_type}",
    intent: "required_documents"
  },
  {
    pattern: "ما هي المستندات المطلوبة {service_type}",
    intent: "required_documents"
  },
  {
    pattern: "ما هي المستندات المطلوبة ل{service_type}",
    intent: "required_documents"
  },
  {
    pattern: "كم رسوم {service_type}",
    intent: "service_fees"
  },
  {
    pattern: "متى يتم الانتهاء من {service_type}",
    intent: "service_duration"
  },
  {
    pattern: "اريد {service_action} {service_type}",
    intent: "service_request"
  }
];

// Service Intent Examples - mapping specific service keywords to service IDs
const serviceIntentExamples = {
  // المجموعة الأولى - Group 1
  "fire_alarm_installation_license": {
    keywords: [
      "ترخيص تركيب أجهزة الإنذار", "صيانة أجهزة الإطفاء", "تركيب أنظمة الإنذار", "صيانة معدات الإطفاء",
      "أجهزة الإنذار والإطفاء", "تجديد ترخيص تركيب الإنذار", "شركات تركيب الإنذار", "رخصة تركيب أنظمة الإنذار",
      "صيانة نظام الإنذار", "تركيب إنذار الحريق", "شركة أنظمة الإنذار", "مقاول أنظمة إطفاء", 
      "تراخيص أنظمة الإنذار", "مزود خدمات الإطفاء", "تصريح صيانة إنذار الحريق", "أنظمة كشف الحريق",
      "تجديد رخصة الإنذار", "شهادة أنظمة الإنذار", "موافقة على تركيب أجهزة الإنذار"
    ],
    service_id: "المجموعة الأولى_1"
  },
  "fire_equipment_license": {
    keywords: [
      "ترخيص معدات الحريق", "أجهزة إطفاء", "ترخيص إنذار", "صيانة معدات السلامة",
      "أجهزة إنذار", "طفايات حريق", "رشاشات", "معدات سلامة", "أنظمة إطفاء", "تجديد ترخيص معدات الحريق",
      "أسطوانات إطفاء", "معدات مكافحة الحريق", "أدوات إطفاء", "مستلزمات السلامة", "طفايات يدوية",
      "أنظمة إطفاء تلقائي", "مضخات حريق", "خراطيم إطفاء", "تصريح بيع معدات الحريق", "صمامات الحريق",
      "رأس مرشة مياه", "معدات الحماية من الحريق", "صناديق خراطيم", "بودرة إطفاء",
      // Add Middle Eastern dialect variations
      "الطفايات", "برميل الطفاية", "جهاز الانذار", "صفارة الحريق", "طفايات البودرة", 
      "اسطوانة الاطفاء", "معدات الدفاع المدني", "رخصة طفايات", "تصريح معدات اطفاء",
      "اجهزة السلامة", "كواشف الدخان", "ابي اجهزة انذار", "عايز طفايات", "بغيت معدات السلامة"
    ],
    service_id: "المجموعة الأولى_2"
  },
  "fire_safety_equipment_approval": {
    keywords: [
      "عدم ممانعة لمعدات الحريق", "ترخيص عدم ممانعة", "تركيب معدات السلامة", "تجديد ترخيص معدات السلامة", 
      "موافقة على معدات الحريق", "شهادة عدم ممانعة", "تصريح معدات السلامة"
    ],
    service_id: "المجموعة الأولى_3"
  },
  "chemical_storage_approval": {
    keywords: [
      "تخزين مواد كيميائية", "مواد خطرة", "ترخيص مواد كيميائية", "تخزين مواد خطرة", 
      "مخزن كيماويات", "شهادة تخزين مواد", "عدم ممانعة للمواد الكيميائية", "تجديد ترخيص تخزين مواد",
      "تصريح تخزين كيماويات", "مستودع مواد خطرة", "رخصة مواد كيميائية", "موافقة تخزين مواد خطرة",
      "شهادة عدم ممانعة للكيماويات", "اشتراطات تخزين المواد", "موافقة على مخزن مواد خطرة",
      "تخزين سوائل كيميائية", "تصريح مواد متفاعلة", "مخازن المواد الكيميائية", "مواد قابلة للاشتعال",
      // Add Middle Eastern dialect variations
      "ابغى اخزن كيماويات", "مستودع كيماويات", "عندي مواد خطرة", "شلون اخزن مواد",
      "بدي تصريح تخزين", "محتاج رخصة تخزين", "كيف اخزن كيماويات", "مكان للمواد الخطرة",
      "خزن مواد كيميائية", "الكيماويات تخزين", "اشتراطات التخزين الكيميائي"
    ],
    service_id: "المجموعة الأولى_4"
  },
  "explosives_storage_license": {
    keywords: [
      "تخزين متفجرات", "ألعاب نارية", "ترخيص متفجرات", "تخزين ألعاب نارية", 
      "مواد متفجرة", "تصريح ألعاب نارية", "مواد قابلة للانفجار", "ترخيص مواد الاشتعال",
      "مخزن متفجرات", "تخزين مفرقعات", "مستودع ألعاب نارية", "تصريح مواد متفجرة",
      "تخزين المواد المتفجرة", "ألعاب الاحتفالات", "رخصة تخزين المتفجرات", "شهادة تخزين مواد متفجرة",
      "تصاريح المفرقعات", "مواد شديدة الاشتعال", "تخزين ديناميت", "شروط تخزين المتفجرات"
    ],
    service_id: "المجموعة الأولى_5"
  },
  "hazardous_materials_transport_day_license": {
    keywords: [
      "نقل مواد خطرة ليوم واحد", "ترخيص نقل شحنات", "نقل مواد كيميائية", "تصريح نقل مؤقت",
      "نقل مواد خطرة", "ترخيص نقل يومي", "تصريح شحنة مواد خطرة"
    ],
    service_id: "المجموعة الأولى_6"
  },
  "chemical_transport_vehicle_license": {
    keywords: [
      "ترخيص سيارات نقل مواد كيميائية", "سيارات نقل مواد خطرة", "مركبات نقل كيميائيات", 
      "تجديد ترخيص سيارات النقل", "شاحنات المواد الخطرة", "تصريح مركبات نقل المواد"
    ],
    service_id: "المجموعة الأولى_7"
  },
  "gas_diesel_tank_installation": {
    keywords: [
      "تركيب خزانات الغاز", "خزانات وقود", "خزانات ديزل", "ترخيص خزانات", 
      "تركيب خزانات الديزل", "تركيب خزانات الوقود", "موافقة نهائية على خزانات", "تجديد ترخيص خزانات"
    ],
    service_id: "المجموعة الأولى_8"
  },
  "gas_fuel_network_installation_license": {
    keywords: [
      "ترخيص مكتب فني تركيب شبكات الغاز", "صيانة شبكات الوقود", "تركيب شبكات المواد الخطرة",
      "مكتب صيانة شبكات الغاز", "تجديد ترخيص شبكات الوقود", "شركة تركيب شبكات الغاز"
    ],
    service_id: "المجموعة الأولى_9"
  },
  "engineering_office_fire_protection_license": {
    keywords: [
      "ترخيص مكتب هندسي", "استشارة في مجال الوقاية", "حماية من الحريق", "مكتب استشارات هندسية",
      "تجديد ترخيص مكتب هندسي", "استشارة مكافحة الحرائق", "مكتب هندسي للسلامة"
    ],
    service_id: "المجموعة الأولى_10"
  },
  
  // المجموعة الثانية - Group 2
  "local_fire_equipment_factory_license": {
    keywords: [
      "ترخيص مصنع محلي معدات إطفاء", "مصنع معدات الوقاية", "تصنيع معدات السلامة", "تجديد ترخيص مصنع",
      "مصنع معدات حريق", "تصنيع أجهزة إنذار", "تصنيع أجهزة إطفاء"
    ],
    service_id: "المجموعة الثانية_1"
  },
  "civil_defense_technical_office_license": {
    keywords: [
      "ترخيص مكاتب فنية للدفاع المدني", "مكتب فني دفاع مدني", "تجديد ترخيص مكتب فني",
      "خدمات فنية للدفاع المدني", "مكاتب فنية معتمدة", "مكتب فني للسلامة"
    ],
    service_id: "المجموعة الثانية_2"
  },
  "fuel_station_license": {
    keywords: [
      "ترخيص محطات تزويد الوقود", "محطات بنزين", "محطات وقود", "تجديد ترخيص محطة وقود",
      "محطات تعبئة الوقود", "محطة بترول", "محطة غاز", "رخصة محطة",
      "تصريح محطة بنزين", "موافقة إنشاء محطة وقود", "تشغيل محطة محروقات", "ترخيص بنزين",
      "شروط محطة وقود", "اشتراطات محطة بنزين", "فتح محطة", "رخصة محطة تعبئة",
      "شهادة سلامة محطة وقود", "متطلبات محطة تموين", "محطة تعبئة سيارات", "استثمار محطة وقود",
      // Add Middle Eastern dialect variations
      "ابي محطة بنزين", "عايز افتح بنزينة", "محطة بترول", "كراج بنزين", "تعبئة بنزين",
      "محطة تعبئة", "بغيت افتح محطة", "رخصة بنزينة", "بمب بنزين", "كم تكلف المحطة",
      "كيف اسوي محطة", "شروط البنزينة", "محطة ديزل", "محطة غاز", "تموين سيارات"
    ],
    service_id: "المجموعة الثانية_3"
  },
  "construction_factory_hotel_mall_inspection_certificate": {
    keywords: [
      "شهادة فحص المصانع قيد الإنشاء", "فحص الفنادق تحت الإنشاء", "شهادة فحص المجمعات التجارية",
      "فحص منشآت قيد البناء", "شهادة سلامة مبنى قيد الإنشاء", "فحص مباني جديدة"
    ],
    service_id: "المجموعة الثانية_4"
  },
  "renew_factory_hotel_mall_inspection_certificate": {
    keywords: [
      "تجديد شهادة فحص المصانع", "تجديد شهادة فحص الفنادق", "تجديد شهادات المجمعات التجارية",
      "تجديد شهادة فحص المباني الكبيرة", "تجديد شهادة سلامة", "إعادة فحص المنشآت الكبيرة"
    ],
    service_id: "المجموعة الثانية_5"
  },
  "gas_sales_repair_license": {
    keywords: [
      "ترخيص محلات بيع الغاز", "محلات تصليح أنظمة الغاز", "تجديد ترخيص محلات الغاز",
      "رخصة محل غاز", "محل بيع اسطوانات الغاز", "محلات صيانة أنظمة الغاز"
    ],
    service_id: "المجموعة الثانية_6"
  },
  "bakery_license": {
    keywords: [
      "ترخيص مخبز", "تصريح مخبز", "مخابز شعبية", "مخابز آلية", 
      "فتح مخبز", "تجديد رخصة مخبز", "مخبز آلي", "مخبز تقليدي", 
      "مخبز", "المخبز", "مخابز", "المخابز", "ترخيص مخابز", "ترخيص المخابز", 
      "رخصة مخبز", "رخصة مخابز", "مخبز شعبي", "مخابز شعبية", "المخابز الشعبية", 
      "المخابز الآلية", "مخابز تقليدية", "إصدار ترخيص المخابز", "تجديد ترخيص المخابز",
      "فرن خبز", "محل خبز", "مصنع خبز", "استخراج رخصة مخبز", "تصريح فرن", "اشتراطات المخبز",
      "متطلبات ترخيص مخبز", "فتح محل خبز", "تأسيس مخبز", "رخصة فرن", "موافقة مخبز",
      "إجراءات فتح مخبز", "شروط الحصول على رخصة مخبز", "مخبز جديد", "مخبز صغير",
      // Add Middle Eastern dialect variations
      "ابي افتح مخبز", "عايز اسوي مخبز", "بغيت افتح فرن", "كيف افتح مخبز", "ابغى رخصة مخبز", 
      "ودي اسوي مخبز", "بدي فرن خبز", "مخبز خبز", "الفرن", "فرن تنور", "بيع خبز",
      "مخبز الخبز الشعبي", "بيت الخبز", "مخبزنا", "الفرن الشعبي", "فرن البلدي"
    ],
    service_id: "المجموعة الثانية_7"
  },
  "certificate_translation": {
    keywords: [
      "ترجمة شهادة", "ترجمة شهادات الدفاع المدني", "شهادة مترجمة", 
      "خدمة ترجمة الشهادات", "ترجمة وثيقة", "ترجمة مستند رسمي"
    ],
    service_id: "المجموعة الثانية_8"
  },
  "report_translation": {
    keywords: [
      "ترجمة تقرير", "ترجمة تقارير الدفاع المدني", "تقرير مترجم", 
      "خدمة ترجمة التقارير", "ترجمة تقارير رسمية", "تقارير مترجمة"
    ],
    service_id: "المجموعة الثانية_9"
  },
  "license_translation": {
    keywords: [
      "ترجمة ترخيص", "ترجمة تراخيص الدفاع المدني", "ترخيص مترجم", 
      "خدمة ترجمة التراخيص", "ترجمة رخصة", "ترجمة تصاريح"
    ],
    service_id: "المجموعة الثانية_10"
  },
  
  // المجموعة الثالثة - Group 3
  "delayed_notification_report": {
    keywords: [
      "تقرير عن بلاغ متأخر", "بلاغ متأخر", "تقرير بلاغ قديم", 
      "طلب تقرير بلاغ سابق", "استخراج تقرير بلاغ", "تقرير عن حادث سابق",
      "بلاغ قديم", "تقرير حادث مضى عليه وقت", "شكوى متأخرة", "تسجيل بلاغ بعد فترة",
      "إبلاغ متأخر عن حادثة", "تقرير واقعة سابقة", "استعلام عن بلاغ سابق", "تقرير عن حدث مضى"
    ],
    service_id: "المجموعة الثالثة_1"
  },
  "large_facilities_incident_report": {
    keywords: [
      "تقرير حوادث المنشآت الكبيرة", "تقرير حوادث المصانع", "تقرير حوادث الفنادق", 
      "تقرير حوادث المجمعات التجارية", "إصدار تقرير حادث منشأة كبيرة", "تقرير حريق منشأة"
    ],
    service_id: "المجموعة الثالثة_2"
  },
  "small_facilities_incident_report": {
    keywords: [
      "تقرير حوادث المنشآت الصغيرة", "تقرير حوادث المنازل", "تقرير حريق منزل", 
      "إصدار تقرير حادث منشأة صغيرة", "تقرير حادث محل", "طلب تقرير حريق"
    ],
    service_id: "المجموعة الثالثة_3"
  },
  "one_day_training_certificate": {
    keywords: [
      "شهادة تدريب ليوم واحد", "دورة تدريبية يوم", "تدريب الدفاع المدني ليوم",
      "محاضرة الحماية والسلامة", "دورة سلامة قصيرة", "شهادة تدريب يومية",
      "ورشة تدريبية", "دورة توعوية", "تدريب مكافحة الحرائق", "محاضرة إسعافات أولية",
      "تدريب قصير للسلامة", "شهادة حضور دورة", "تدريب استخدام طفاية", "دورة يوم واحد للإخلاء",
      "دورة تعريفية بالسلامة", "محاضرة توعية", "تدريب مختصر", "شهادة محاضرة السلامة"
    ],
    service_id: "المجموعة الثالثة_4"
  },
  "one_week_training_certificate": {
    keywords: [
      "شهادة تدريب لمدة أسبوع", "دورة أسبوعية", "تدريب الدفاع المدني لأسبوع", 
      "برنامج تدريبي أسبوعي", "دورة سلامة أسبوع", "شهادة دورة أسبوعية"
    ],
    service_id: "المجموعة الثالثة_5"
  },
  "heavy_firefighting_vehicle_training_certificate": {
    keywords: [
      "تدريب قيادة مركبات الإطفاء الثقيلة", "دورة قيادة سيارات الإطفاء", "شهادة قيادة مركبات إطفاء",
      "تدريب أسبوعين للإطفاء", "تدريب سيارات الإطفاء", "شهادة قيادة آليات ثقيلة"
    ],
    service_id: "المجموعة الثالثة_6"
  },
  "sixteen_week_training_certificate": {
    keywords: [
      "شهادة تدريب لمدة ستة عشر أسبوعا", "دورة تدريبية مكثفة", "برنامج تدريبي طويل",
      "تدريب الدفاع المدني المتقدم", "دورة مهنية للإطفاء", "شهادة تدريب احترافية"
    ],
    service_id: "المجموعة الثالثة_7"
  },
  "building_evacuation_training": {
    keywords: [
      "تدريب على عمليات إخلاء المباني", "تدريب إخلاء المنشآت", "خطة إخلاء", 
      "تمرين إخلاء", "تدريب على الطوارئ", "تدريب السلامة للإخلاء",
      "خطة طوارئ", "تجربة إخلاء", "تدريبات الإخلاء", "ممارسة إخلاء المبنى",
      "تمرين حالات الطوارئ", "مناورة إخلاء", "تدريب على التعامل مع الحرائق", "تجهيز خطة إخلاء",
      "تنفيذ خطة الطوارئ", "تدريب موظفين على الإخلاء", "إجراءات السلامة للإخلاء", "كيفية إخلاء المبنى",
      // Add Middle Eastern dialect variations
      "كيف نسوي إخلاء", "تدريب الطوارئ", "تمرين هروب", "ابي اسوي تجربة إخلاء",
      "تدريب للموظفين على الحريق", "مناورة طوارئ", "تجربة إنذار", "خطة الهروب",
      "تدريب على الإنقاذ", "إجراءات الإخلاء", "تمرين صفارات", "علمنا كيف نخلي المبنى"
    ],
    service_id: "المجموعة الثالثة_8"
  },
  "tent_installation_license": {
    keywords: [
      "ترخيص نصب خيمة", "تصريح خيمة", "موافقة على نصب خيم البر", 
      "رخصة خيمة مؤقتة", "تصريح نصب خيمة", "موافقة خيمة عزاء"
    ],
    service_id: "المجموعة الثالثة_9"
  },
  "factory_warehouse_blueprint_license": {
    keywords: [
      "ترخيص خرائط المصانع", "ترخيص خرائط المخازن", "اعتماد مخططات مصنع",
      "موافقة على خرائط مخزن", "تجديد ترخيص خرائط", "مخططات منشآت صناعية"
    ],
    service_id: "المجموعة الثالثة_10"
  },
  
  // المجموعة الرابعة - Group 4
  "commercial_high_building_blueprint_license": {
    keywords: [
      "ترخيص خرائط المراكز التجارية", "ترخيص خرائط المباني العالية", "خرائط مباني أكثر من ألف متر",
      "اعتماد مخططات مول", "موافقة على خرائط برج", "اعتماد مخططات مبنى كبير",
      "مخططات مبنى مرتفع", "تصريح أبراج", "خرائط مجمعات تجارية", "ترخيص مبنى ضخم",
      "اعتماد مخططات مبنى عالي", "موافقة على مخططات مول", "ترخيص مخططات سوق تجاري",
      "تصريح مخططات مركز تسوق", "رخصة مخططات مبنى شاهق"
    ],
    service_id: "المجموعة الرابعة_1"
  },
  "residential_compound_ten_plus_villas_blueprint_license": {
    keywords: [
      "ترخيص خرائط المجمعات السكنية عشر فلل فأكثر", "اعتماد مخططات مجمع كبير",
      "موافقة على مخططات فلل متعددة", "ترخيص مجمع سكني كبير", "خرائط فلل متعددة"
    ],
    service_id: "المجموعة الرابعة_2"
  },
  "residential_compound_less_than_ten_villas_blueprint_license": {
    keywords: [
      "ترخيص خرائط المجمعات السكنية أقل من عشر فلل", "اعتماد مخططات مجمع صغير",
      "موافقة على خرائط عدة فلل", "ترخيص مجمع سكني صغير", "خرائط فلل قليلة"
    ],
    service_id: "المجموعة الرابعة_3"
  },
  "small_building_blueprint_license": {
    keywords: [
      "ترخيص خرائط المباني أقل من ألف متر", "اعتماد مخططات مبنى صغير",
      "موافقة على خرائط مبنى محدود المساحة", "ترخيص مبنى صغير", "مخططات مبنى تجاري صغير"
    ],
    service_id: "المجموعة الرابعة_4"
  },
  "two_to_four_apartments_blueprint_license": {
    keywords: [
      "ترخيص خرائط شقتين إلى أربع شقق", "اعتماد مخططات شقق قليلة", 
      "موافقة على خرائط عمارة صغيرة", "ترخيص مبنى به شقق محدودة", "مخططات بناية صغيرة"
    ],
    service_id: "المجموعة الرابعة_5"
  },
  "five_to_seven_apartments_blueprint_license": {
    keywords: [
      "ترخيص خرائط خمس إلى سبع شقق", "اعتماد مخططات شقق متوسطة", 
      "موافقة على خرائط عمارة متوسطة", "ترخيص مبنى به شقق متوسطة", "مخططات بناية متوسطة"
    ],
    service_id: "المجموعة الرابعة_6"
  },
  "eight_to_ten_apartments_blueprint_license": {
    keywords: [
      "ترخيص خرائط ثمان إلى عشر شقق", "اعتماد مخططات شقق عديدة", 
      "موافقة على خرائط عمارة كبيرة", "ترخيص مبنى به شقق كثيرة", "مخططات بناية كبيرة"
    ],
    service_id: "المجموعة الرابعة_7"
  },
  "eleven_plus_apartments_blueprint_license": {
    keywords: [
      "ترخيص خرائط إحدى عشرة شقة فأكثر", "اعتماد مخططات شقق كثيرة", 
      "موافقة على خرائط عمارة ضخمة", "ترخيص مبنى متعدد الشقق", "مخططات برج سكني"
    ],
    service_id: "المجموعة الرابعة_8"
  },
  "special_facility_blueprint_license": {
    keywords: [
      "ترخيص خرائط الأندية", "ترخيص خرائط المدارس", "ترخيص خرائط المستشفيات",
      "ترخيص خرائط مباني المجمعات", "مخططات منشآت خاصة", "خرائط مرافق عامة"
    ],
    service_id: "المجموعة الرابعة_9"
  },
  "residential_to_hotel_conversion_license": {
    keywords: [
      "ترخيص تحويل المباني السكنية إلى فنادق", "تحويل إلى شقق مفروشة", 
      "تغيير استخدام مبنى سكني", "تحويل عمارة إلى فندق", "رخصة تحويل استخدام"
    ],
    service_id: "المجموعة الرابعة_10"
  },
  
  // المجموعة الخامسة - Group 5
  "special_buildings_blueprint_study": {
    keywords: [
      "دراسة مخططات دور العبادة", "دراسة مخططات المحاكم", "دراسة مخططات المتاحف", "دراسة مخططات المسارح",
      "دراسة مخططات صالات العرض", "دراسة مخططات مواقف السيارات", "مخططات مباني خاصة"
    ],
    service_id: "المجموعة الخامسة_1"
  },
  "electrical_engineering_blueprint_study": {
    keywords: [
      "دراسة المخططات الهندسية الكهربائية", "فحص مخططات كهربائية", "تدقيق رسومات كهربائية", 
      "مراجعة أنظمة كهربائية", "اعتماد تصاميم كهربائية", "دراسة مخططات الطاقة"
    ],
    service_id: "المجموعة الخامسة_2"
  },
  "mechanical_blueprint_study": {
    keywords: [
      "دراسة المخططات الميكانيكية", "فحص مخططات ميكانيكية", "تدقيق رسومات ميكانيكية", 
      "مراجعة أنظمة ميكانيكية", "اعتماد تصاميم ميكانيكية", "دراسة أنظمة التكييف والتهوية"
    ],
    service_id: "المجموعة الخامسة_3"
  },
  "new_fuel_station_blueprint_study": {
    keywords: [
      "دراسة خرائط محطات الوقود الجديدة", "فحص مخططات محطات بنزين", "تدقيق تصميم محطة وقود",
      "اعتماد مخططات محطة جديدة", "دراسة مشروع محطة وقود", "تصميم محطة بترول"
    ],
    service_id: "المجموعة الخامسة_4"
  },
  "gas_pipeline_tank_blueprint_study": {
    keywords: [
      "دراسة خرائط تمديدات الغاز", "دراسة مخططات الخزانات", "فحص تمديدات الغاز", 
      "تدقيق تصميم خزانات", "اعتماد شبكة غاز", "مخططات أنابيب الغاز"
    ],
    service_id: "المجموعة الخامسة_5"
  },
  "certificate_replacement": {
    keywords: [
      "بدل فاقد للشهادات", "إصدار بديل للشهادة", "شهادة تالفة", "استخراج نسخة بديلة", 
      "طلب شهادة بدل ضائع", "إعادة إصدار شهادة", "نسخة جديدة من الشهادة"
    ],
    service_id: "المجموعة الخامسة_6"
  },
  "report_replacement": {
    keywords: [
      "بدل فاقد للتقارير", "إصدار بديل للتقرير", "تقرير تالف", "استخراج نسخة بديلة من تقرير", 
      "طلب تقرير بدل ضائع", "إعادة إصدار تقرير", "نسخة جديدة من التقرير"
    ],
    service_id: "المجموعة الخامسة_7"
  },
  "license_replacement": {
    keywords: [
      "بدل فاقد للتراخيص", "إصدار بديل للترخيص", "ترخيص تالف", "استخراج نسخة بديلة من رخصة", 
      "طلب رخصة بدل ضائع", "إعادة إصدار ترخيص", "نسخة جديدة من الترخيص"
    ],
    service_id: "المجموعة الخامسة_8"
  },
  "certificate_replacement_duplicate": {
    keywords: [
      "بدل فاقد للشهادات مكرر", "إصدار بديل للشهادة مكرر", "شهادة تالفة بديلة", 
      "استخراج نسخة بديلة مرة أخرى", "طلب شهادة بدل ضائع إضافية"
    ],
    service_id: "المجموعة الخامسة_9"
  },
  "gold_shop_workshop_license": {
    keywords: [
      "ترخيص محلات الذهب", "ترخيص ورش الذهب", "تجديد رخصة محل ذهب", 
      "تصريح ورشة ذهب", "رخصة محل مجوهرات", "تجديد ترخيص ورشة مجوهرات",
      "متجر ذهب", "محل مصوغات", "متجر حلي", "ورشة صياغة", "محل المجوهرات",
      "بيع الذهب", "متجر مجوهرات", "صائغ ذهب", "محل الحلي", "معرض مجوهرات",
      "ورشة صناعة المجوهرات", "متطلبات محلات الذهب", "اشتراطات محلات المجوهرات",
      // Add Middle Eastern dialect variations
      "محل دهب", "بغيت افتح محل ذهب", "ابي ورشة ذهب", "ترخيص بيع الذهب",
      "محل الدهب", "صايغ", "عايز افتح محل مجوهرات", "بيع المصاغ", "ورشة صايغ",
      "محل الشبكة", "متجر المشغولات", "الصاغة", "رخصة صياغة", "اشتراطات الذهب"
    ],
    service_id: "المجموعة الخامسة_10"
  },
  
  // المجموعة السادسة - Group 6
  "civil_defense_training_center_license_renewal": {
    keywords: [
      "تجديد ترخيص معاهد التدريب", "تجديد رخصة مراكز التدريب", "مركز تدريب الدفاع المدني", 
      "ترخيص معهد تدريب", "تجديد اعتماد مركز تدريب", "مركز تدريب على السلامة"
    ],
    service_id: "المجموعة السادسة_1"
  },
  "civil_defense_24_hour_preparedness_license": {
    keywords: [
      "ترخيص الاستعدادات لأجهزة الدفاع المدني", "تصريح احتياطات 24 ساعة", "موافقة استعدادات", 
      "رخصة جاهزية", "تصريح استعدادات طوارئ", "موافقة على خطة الطوارئ"
    ],
    service_id: "المجموعة السادسة_2"
  },
  "electrical_power_connection_certificate": {
    keywords: [
      "شهادة الفحص النهائي للتيار الكهربائي", "شهادة توصيل الكهرباء", "فحص المباني الجديدة للكهرباء",
      "موافقة توصيل الكهرباء", "شهادة جاهزية للكهرباء", "فحص سلامة التوصيلات الكهربائية",
      "إيصال التيار الكهربائي", "اعتماد سلامة الكهرباء", "شهادة صلاحية التوصيلات الكهربائية",
      "تصريح توصيل التيار", "موافقة هيئة الكهرباء", "فحص السلامة الكهربائية", 
      "معاينة التمديدات الكهربائية", "شهادة مطابقة التوصيلات", "فحص قبل إيصال الكهرباء",
      "اعتماد المنشأة للكهرباء", "فحص النظام الكهربائي", "تصريح توصيل كهرباء للمبنى الجديد"
    ],
    service_id: "المجموعة السادسة_3"
  },
  "small_facility_inspection_certificate": {
    keywords: [
      "شهادة فحص المنشآت الصغيرة", "تجديد شهادة فحص منشأة صغيرة", "فحص سلامة محل",
      "شهادة تفتيش مبنى صغير", "تجديد شهادة فحص محل", "تفتيش سلامة منشأة صغيرة"
    ],
    service_id: "المجموعة السادسة_4"
  },
  "fire_protection_requirements_certificate": {
    keywords: [
      "شهادة استيفاء شروط الحماية من الحريق", "شهادة وقاية من الحريق", "شهادة شروط السلامة",
      "تجديد شهادة الحماية", "شهادة استيفاء متطلبات السلامة", "شهادة احتياطات الحريق",
      "وثيقة السلامة من الحريق", "شهادة تدابير الحريق", "موافقة شروط الدفاع المدني",
      "اعتماد اشتراطات الحماية", "شهادة مكافحة الحريق", "موافقة معايير السلامة",
      "وثيقة متطلبات الحماية", "شهادة الأمان من الحرائق", "اعتماد تدابير الوقاية",
      "شهادة الالتزام بشروط الدفاع المدني"
    ],
    service_id: "المجموعة السادسة_5"
  },
  "large_facility_inspection_certificate": {
    keywords: [
      "شهادة فحص المنشآت الكبيرة", "تجديد شهادة فحص منشأة كبيرة", "فحص سلامة مجمع تجاري",
      "شهادة تفتيش مبنى كبير", "تجديد شهادة فحص مصنع", "تفتيش سلامة منشأة كبيرة",
      "معاينة مبنى كبير", "شهادة كشف مجمع", "تفتيش مبنى ضخم", "شهادة سلامة فندق",
      "فحص مول تجاري", "تقرير معاينة مصنع", "شهادة سلامة مبنى متعدد الطوابق",
      "تفتيش منشأة واسعة", "موافقة سلامة منشأة كبيرة", "كشف مباني ضخمة"
    ],
    service_id: "المجموعة السادسة_6"
  }
};

// Enhance named entity categories for better recognition
const namedEntityCategories = {
  service_entities: [
    "ترخيص", "شهادة", "تقرير", "تدريب", "فحص", "ترجمة", "خرائط", "دراسة",
    "موافقة", "تصريح", "إصدار", "تجديد", "استخراج", "اعتماد", "معاينة", "تفتيش"
  ],
  facility_entities: [
    "مصنع", "فندق", "مخبز", "المخبز", "مخابز", "المخابز", "محطة وقود", "مكتب فني", "مكتب هندسي", "محل", "مخزن", "منشأة", "مبنى", "مركز تجاري",
    "ورشة", "مجمع سكني", "مول", "برج", "بناية", "عمارة", "مستشفى", "مدرسة", "فيلا", "شقة", "مستودع", "محل تجاري"
  ],
  material_entities: [
    "مواد كيميائية", "غاز", "وقود", "ديزل", "متفجرات", "مواد خطرة", "ألعاب نارية",
    "بنزين", "كيماويات", "وقود سائل", "غاز مسال", "مواد سامة", "مواد حارقة", "مواد قابلة للاشتعال"
  ],
  equipment_entities: [
    "معدات إطفاء", "أجهزة إنذار", "خزانات", "أنظمة سلامة", "طفايات", "رشاشات",
    "مضخات", "كواشف دخان", "خراطيم", "صمامات", "مرشات", "أسطوانات إطفاء", "صناديق حريق"
  ],
  document_entities: [
    "سجل تجاري", "بطاقة هوية", "عقد إيجار", "مخططات", "رسومات هندسية", "شهادة صيانة",
    "بطاقة ذكية", "رسالة رسمية", "خطاب", "استمارة", "إفادة", "موافقة", "ملكية عقار", "وثيقة"
  ]
};

// Improve the getServiceIdByKeywords function for better matching
function getServiceIdByKeywords(keywords) {
  if (!keywords || keywords.length === 0) {
    return null;
  }

  console.log('Checking service match for keywords:', keywords);
  
  // Special case for bakery license which is commonly requested
  const hasBakeryTerm = keywords.some(kw => 
    kw === 'مخبز' || kw === 'المخبز' || kw === 'مخابز' || kw === 'المخابز' ||
    kw === 'فرن' || kw.includes('مخبز') || kw.includes('خبز')
  );
  
  if (hasBakeryTerm && keywords.some(kw => 
    kw.includes('ترخيص') || kw.includes('رخصة') || kw.includes('تصريح'))) {
    console.log('Bakery match found! المجموعة الثانية_7');
    return 'المجموعة الثانية_7'; // Bakery license
  }
  
  // Check for strong matches first (multiple keywords match the same service)
  const matchScores = {};
  
  for (const [serviceKey, serviceType] of Object.entries(serviceIntentExamples)) {
    let matchedKeywords = 0;
    let exactMatches = 0;
    let partialMatches = 0;
    
    for (const keyword of keywords) {
      // Check for exact matches
      if (serviceType.keywords.includes(keyword)) {
        matchedKeywords++;
        exactMatches++;
        continue;
      }
      
      // Check for partial matches (keyword is part of service keyword)
      for (const serviceKeyword of serviceType.keywords) {
        if (serviceKeyword.includes(keyword) || keyword.includes(serviceKeyword)) {
          matchedKeywords++;
          partialMatches++;
          break; // Count only once per keyword
        }
      }
    }
    
    // Calculate score: exact matches are worth more
    matchScores[serviceKey] = {
      score: exactMatches * 2 + partialMatches,
      serviceId: serviceType.service_id
    };
  }
  
  // Find service with highest score
  let bestMatch = null;
  let highestScore = 1; // Require at least a score of 2
  
  for (const [serviceKey, data] of Object.entries(matchScores)) {
    if (data.score > highestScore) {
      highestScore = data.score;
      bestMatch = data.serviceId;
    }
  }
  
  if (bestMatch) {
    console.log(`Best match found: ${bestMatch} with score ${highestScore}`);
    return bestMatch;
  }
  
  // Fall back to single keyword exact matches if no strong matches
  for (const serviceType of Object.values(serviceIntentExamples)) {
    for (const keyword of keywords) {
      if (serviceType.keywords.includes(keyword)) {
        console.log(`Exact keyword match found: ${keyword} -> ${serviceType.service_id}`);
        return serviceType.service_id;
      }
    }
  }
  
  return null;
}

function matchComplexPattern(text) {
  // Try to match text against complex patterns
  for (const pattern of complexIntentPatterns) {
    // Simple pattern matching - would be more sophisticated in production
    const patternRegex = pattern.pattern
      .replace(/\{service_type\}/g, '(.*?)')
      .replace(/\{service_action\}/g, '(.*?)');
    
    const regex = new RegExp(patternRegex);
    const match = text.match(regex);
    
    if (match) {
      return {
        intent: pattern.intent,
        service_type: match[1] || '',
        service_action: match[2] || ''
      };
    }
  }
  return null;
}

function getEntityType(word) {
  // Check which entity category a word belongs to
  for (const [category, entities] of Object.entries(namedEntityCategories)) {
    if (entities.some(entity => entity === word || word.includes(entity))) {
      return category;
    }
  }
  return null;
}

function extractEntities(text) {
  // Enhanced named entity recognition
  const words = text.split(/\s+/);
  const entities = {};
  
  // First pass: check individual words
  words.forEach(word => {
    const entityType = getEntityType(word);
    if (entityType) {
      if (!entities[entityType]) entities[entityType] = [];
      if (!entities[entityType].includes(word)) {
        entities[entityType].push(word);
      }
    }
  });
  
  // Second pass: check for phrases of 2-3 words
  for (let i = 0; i < words.length - 1; i++) {
    const twoWordPhrase = words[i] + ' ' + words[i + 1];
    const entityType = getEntityType(twoWordPhrase);
    if (entityType) {
      if (!entities[entityType]) entities[entityType] = [];
      if (!entities[entityType].includes(twoWordPhrase)) {
        entities[entityType].push(twoWordPhrase);
      }
    }
    
    if (i < words.length - 2) {
      const threeWordPhrase = twoWordPhrase + ' ' + words[i + 2];
      const entityType2 = getEntityType(threeWordPhrase);
      if (entityType2) {
        if (!entities[entityType2]) entities[entityType2] = [];
        if (!entities[entityType2].includes(threeWordPhrase)) {
          entities[entityType2].push(threeWordPhrase);
        }
      }
    }
  }
  
  // Check for bakery specifically in facility entities
  if (text.includes('مخبز') || text.includes('المخبز') || 
      text.includes('مخابز') || text.includes('المخابز')) {
    if (!entities['facility_entities']) entities['facility_entities'] = [];
    // Add the most specific form that's present in the text
    if (text.includes('المخابز') && !entities['facility_entities'].includes('المخابز')) {
      entities['facility_entities'].push('المخابز');
    } else if (text.includes('مخابز') && !entities['facility_entities'].includes('مخابز')) {
      entities['facility_entities'].push('مخابز');
    } else if (text.includes('المخبز') && !entities['facility_entities'].includes('المخبز')) {
      entities['facility_entities'].push('المخبز');
    } else if (text.includes('مخبز') && !entities['facility_entities'].includes('مخبز')) {
      entities['facility_entities'].push('مخبز');
    }
  }
  
  return entities;
}

// Helper functions for intent matching
function getAllIntentKeywords() {
  // Combine all keywords from all intent categories for easy searching
  const allKeywords = [];
  
  // Add general intents
  Object.values(generalIntents).forEach(keywords => {
    allKeywords.push(...keywords);
  });
  
  // Add service specific intents
  Object.values(serviceSpecificIntents).forEach(keywords => {
    allKeywords.push(...keywords);
  });
  
  // Add service field mappings
  Object.values(serviceFieldMappings).forEach(keywords => {
    allKeywords.push(...keywords);
  });
  
  // Add service intent examples
  Object.values(serviceIntentExamples).forEach(item => {
    allKeywords.push(...item.keywords);
  });
  
  return [...new Set(allKeywords)]; // Remove duplicates
}

function getIntentCategoryForKeyword(keyword) {
  // Find which category a keyword belongs to
  for (const [category, keywords] of Object.entries(generalIntents)) {
    if (keywords.includes(keyword)) return { type: 'general', category };
  }
  
  for (const [category, keywords] of Object.entries(serviceSpecificIntents)) {
    if (keywords.includes(keyword)) return { type: 'service', category };
  }
  
  for (const [field, keywords] of Object.entries(serviceFieldMappings)) {
    if (keywords.includes(keyword)) return { type: 'field', category: field };
  }
  
  for (const [serviceType, data] of Object.entries(serviceIntentExamples)) {
    // Check for exact matches
    if (data.keywords.includes(keyword)) {
      return { type: 'service_example', category: serviceType, service_id: data.service_id };
    }
    
    // Check for partial matches
    if (data.keywords.some(sk => sk.includes(keyword) || keyword.includes(sk))) {
      return { type: 'service_example', category: serviceType, service_id: data.service_id };
    }
  }
  
  return null;
}

// Export all intent structures and helper functions
module.exports = {
  generalIntents,
  serviceSpecificIntents,
  serviceFieldMappings,
  complexIntentPatterns,
  serviceIntentExamples,
  namedEntityCategories,
  getAllIntentKeywords,
  getIntentCategoryForKeyword,
  getServiceIdByKeywords,
  matchComplexPattern,
  extractEntities
}; 