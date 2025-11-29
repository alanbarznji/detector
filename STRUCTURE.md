# هيكل المشروع - Detector Dashboard

## شجرة الملفات الكاملة

```
detector/
│
├── public/                    # الملفات العامة
│
├── src/                       # مجلد المصدر الرئيسي
│   │
│   ├── components/            # المكونات
│   │   │
│   │   ├── ui/               # المكونات الأساسية القابلة لإعادة الاستخدام
│   │   │   ├── Card.tsx      # مكون البطاقة
│   │   │   ├── Button.tsx    # مكون الزر
│   │   │   ├── Badge.tsx     # مكون الشارة
│   │   │   ├── LoadingSpinner.tsx  # مكون التحميل
│   │   │   └── EmptyState.tsx      # مكون الحالة الفارغة
│   │   │
│   │   ├── layout/           # مكونات التخطيط
│   │   │   ├── Layout.tsx    # التخطيط الرئيسي
│   │   │   ├── Sidebar.tsx   # الشريط الجانبي
│   │   │   └── Header.tsx    # رأس الصفحة
│   │   │
│   │   ├── CameraCard.tsx    # بطاقة عرض الكاميرا
│   │   ├── SensorCard.tsx    # بطاقة عرض الحساس
│   │   └── AlertItem.tsx     # عنصر التنبيه
│   │
│   ├── pages/                # صفحات التطبيق
│   │   ├── Dashboard.tsx     # صفحة لوحة التحكم الرئيسية
│   │   ├── Cameras.tsx       # صفحة الكاميرات
│   │   ├── Sensors.tsx       # صفحة الحساسات
│   │   ├── Archive.tsx       # صفحة الأرشيف
│   │   ├── Analytics.tsx     # صفحة التحليلات
│   │   └── Settings.tsx      # صفحة الإعدادات
│   │
│   ├── context/              # إدارة الحالة عبر Context API
│   │   └── AppContext.tsx    # Context الرئيسي للتطبيق
│   │
│   ├── hooks/                # Custom React Hooks
│   │   ├── useCameraStream.ts    # Hook للتعامل مع بث الكاميرا
│   │   ├── useSensorData.ts      # Hook للتعامل مع بيانات الحساسات
│   │   └── useAlertFilter.ts     # Hook لتصفية التنبيهات
│   │
│   ├── types/                # TypeScript Types & Interfaces
│   │   └── index.ts          # جميع الأنواع المستخدمة في التطبيق
│   │
│   ├── utils/                # الأدوات المساعدة
│   │   ├── helpers.ts        # دوال مساعدة (تنسيق التواريخ، الألوان، التصدير)
│   │   └── mockData.ts       # البيانات التجريبية
│   │
│   ├── App.tsx               # المكون الرئيسي للتطبيق
│   ├── main.tsx              # نقطة الدخول الرئيسية
│   ├── index.css             # ملف الـ CSS الرئيسي
│   └── vite-env.d.ts         # تعريفات TypeScript لـ Vite
│
├── .eslintrc.cjs             # إعدادات ESLint
├── .gitignore                # ملفات ومجلدات Git المتجاهلة
├── index.html                # صفحة HTML الرئيسية
├── package.json              # المكتبات والإعدادات
├── postcss.config.js         # إعدادات PostCSS
├── tailwind.config.js        # إعدادات Tailwind CSS
├── tsconfig.json             # إعدادات TypeScript
├── tsconfig.node.json        # إعدادات TypeScript للـ Node
├── vite.config.ts            # إعدادات Vite
├── README.md                 # دليل المشروع
└── STRUCTURE.md              # هذا الملف - شرح الهيكل
```

## شرح المجلدات والملفات

### 📁 src/components/

#### ui/ - المكونات الأساسية
- **Card.tsx**: مكون بطاقة قابل لإعادة الاستخدام مع خيارات padding وhover
- **Button.tsx**: مكون زر بـ variants متعددة (primary, secondary, danger, success, ghost)
- **Badge.tsx**: مكون شارة للحالات والأنواع
- **LoadingSpinner.tsx**: مكون دائرة التحميل
- **EmptyState.tsx**: مكون عرض الحالة الفارغة

#### layout/ - التخطيط
- **Layout.tsx**: التخطيط الرئيسي الذي يحتوي على Sidebar وHeader
- **Sidebar.tsx**: القائمة الجانبية للتنقل
- **Header.tsx**: رأس الصفحة مع معلومات المستخدم والإشعارات

#### المكونات الخاصة
- **CameraCard.tsx**: بطاقة عرض الكاميرا مع البث المباشر والتنبيهات
- **SensorCard.tsx**: بطاقة عرض الحساس مع القراءات المباشرة
- **AlertItem.tsx**: عنصر عرض التنبيه مع التفاصيل

### 📁 src/pages/

- **Dashboard.tsx**: الصفحة الرئيسية - عرض شامل للنظام
- **Cameras.tsx**: إدارة ومراقبة الكاميرات مع خيارات Grid
- **Sensors.tsx**: إدارة ومراقبة الحساسات
- **Archive.tsx**: أرشيف التنبيهات مع الفلاتر والتصدير
- **Analytics.tsx**: صفحة التحليلات مع الرسوم البيانية
- **Settings.tsx**: صفحة الإعدادات الشاملة

### 📁 src/context/

- **AppContext.tsx**: إدارة الحالة العامة للتطبيق:
  - الكاميرات (cameras)
  - الحساسات (sensors)
  - التنبيهات (alerts)
  - المستخدم (user)
  - الإعدادات (settings)

### 📁 src/hooks/

- **useCameraStream.ts**: إدارة حالة بث الكاميرا
- **useSensorData.ts**: إدارة بيانات الحساسات الحية
- **useAlertFilter.ts**: تصفية وبحث التنبيهات

### 📁 src/types/

- **index.ts**: جميع TypeScript interfaces و types:
  - Camera
  - Sensor
  - Alert
  - User
  - TimelineEvent
  - AnalyticsData
  - AppSettings

### 📁 src/utils/

- **helpers.ts**: دوال مساعدة:
  - تنسيق التواريخ
  - الألوان حسب الحالة
  - تصدير CSV
  - Grid Layout

- **mockData.ts**: بيانات تجريبية:
  - mockCameras
  - mockSensors
  - mockAlerts
  - mockTimelineEvents
  - mockAnalytics

## المميزات الرئيسية

### 🎨 التصميم
- Tailwind CSS مع نظام ألوان مخصص
- Dark Mode كامل
- RTL Support للغة العربية
- Responsive Design

### 🔄 إدارة الحالة
- Context API للحالة العامة
- Custom Hooks لإعادة الاستخدام
- TypeScript للأمان

### 📊 المكونات
- مكونات UI قابلة لإعادة الاستخدام
- تصميم Component-based
- Props typing كامل

### 🚀 الأداء
- Vite للبناء السريع
- Lazy Loading جاهز
- Optimized Bundle

## التطوير

```bash
# تثبيت المكتبات
npm install

# تشغيل التطوير
npm run dev

# البناء للإنتاج
npm run build

# معاينة النسخة المبنية
npm run preview
```

## المكتبات المستخدمة

- **React 18**: مكتبة UI
- **TypeScript**: Type Safety
- **React Router**: Routing
- **Tailwind CSS**: Styling
- **Recharts**: Charts
- **Lucide React**: Icons
- **date-fns**: Date formatting
- **clsx**: Class utilities
