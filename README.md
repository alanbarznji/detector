# Detector - نظام مراقبة وكشف متقدم

نظام شامل لمراقبة الكاميرات والمستشعرات مع كشف الحرائق والدخان ومخالفات معدات السلامة باستخدام YOLO.

## 🚀 المميزات

- **مراقبة الكاميرات**: بث مباشر من كاميرات RTSP مع معالجة الإطارات باستخدام FFmpeg
- **كشف ذكي**: تكامل مع YOLO للكشف عن:
  - الحرائق
  - الدخان
  - مخالفات معدات السلامة (الخوذة، السترة، القفازات، الأحذية، النظارات، الكمامة)
- **مراقبة المستشعرات**: قراءات فورية من المستشعرات مع تنبيهات تلقائية
- **التنبيهات**: نظام تنبيهات شامل مع تصنيف حسب الخطورة
- **الأرشيف**: حفظ وتصدير السجلات بصيغة CSV
- **التحليلات**: رسوم بيانية تفاعلية للإحصائيات
- **الوضع الليلي**: دعم كامل للوضع المظلم
- **الواجهة العربية**: واجهة RTL كاملة باللغة العربية

## 📋 المتطلبات

### Backend:
- Node.js 18+
- FFmpeg (المسار: `C:\\ffmpeg\\bin\\ffmpeg.exe`)
- Python 3.8+ (للـ YOLO - اختياري)

### Frontend:
- Node.js 18+
- npm أو yarn

## 🛠️ التثبيت

### 1. تثبيت Frontend

```bash
# تثبيت المكتبات
npm install

# إنشاء ملف .env
echo "VITE_BACKEND_URL=http://localhost:5000" > .env
```

### 2. تثبيت Backend

```bash
cd backend

# تثبيت المكتبات
npm install

# تكوين ملف .env
# تحديث الملف بمعلومات الكاميرا الخاصة بك
```

**ملف backend/.env:**
```env
PORT=5000
FRONTEND_URL=http://localhost:5173

# إعدادات RTSP
RTSP_URL=rtsp://mcbt:alan22@192.168.100.201:554/Streaming/Channels/101
FFMPEG_PATH=C:\\ffmpeg\\bin\\ffmpeg.exe

# إعدادات YOLO (اختياري)
YOLO_API_URL=http://localhost:8000
YOLO_CONFIDENCE_THRESHOLD=0.5
```

### 3. تثبيت YOLO (اختياري - للكشف الذكي)

اتبع الدليل التفصيلي في: `backend/YOLO_INTEGRATION_GUIDE.md`

**خطوات سريعة:**

```bash
# إنشاء مجلد خدمة YOLO
mkdir yolo-service
cd yolo-service

# تثبيت المكتبات
pip install ultralytics flask flask-cors opencv-python pillow numpy

# إنشاء ملف app.py (راجع الدليل للكود الكامل)
# تشغيل الخدمة
python app.py
```

## 🚀 تشغيل المشروع

### تشغيل كامل المشروع:

**1. تشغيل Backend:**
```bash
cd backend
npm start
```
سيعمل على: `http://localhost:5000`

**2. تشغيل Frontend (نافذة جديدة):**
```bash
npm run dev
```
سيعمل على: `http://localhost:5173`

**3. تشغيل YOLO Service (اختياري - نافذة ثالثة):**
```bash
cd yolo-service
python app.py
```
سيعمل على: `http://localhost:8000`

## 📁 هيكل المشروع

```
detector/
├── src/                          # Frontend React
│   ├── components/              # مكونات React
│   │   ├── layout/             # مكونات التخطيط
│   │   ├── ui/                 # مكونات UI
│   │   ├── CameraCard.jsx      # بطاقة الكاميرا
│   │   ├── AlertItem.jsx       # عنصر التنبيه
│   │   └── SensorCard.jsx      # بطاقة المستشعر
│   ├── pages/                  # صفحات التطبيق
│   │   ├── Dashboard.jsx       # لوحة التحكم
│   │   ├── Cameras.jsx         # صفحة الكاميرات
│   │   ├── Sensors.jsx         # صفحة المستشعرات
│   │   ├── Archive.jsx         # الأرشيف
│   │   ├── Analytics.jsx       # التحليلات
│   │   └── Settings.jsx        # الإعدادات
│   ├── store/                  # Redux Store
│   │   ├── store.js           # تكوين Store
│   │   ├── slices/            # Redux Slices
│   │   │   ├── cameraSlice.js
│   │   │   ├── alertSlice.js
│   │   │   ├── sensorSlice.js
│   │   │   └── settingsSlice.js
│   │   └── middleware/        # Middleware
│   │       └── socketMiddleware.js  # Socket.IO
│   ├── services/              # خدمات API
│   │   └── api.js            # طبقة API
│   ├── hooks/                # Custom Hooks
│   └── utils/                # أدوات مساعدة
│
├── backend/                   # Backend Node.js
│   ├── server.js             # الخادم الرئيسي
│   ├── routes/               # API Routes
│   │   ├── cameraRoutes.js
│   │   ├── alertRoutes.js
│   │   ├── sensorRoutes.js
│   │   └── streamRoutes.js
│   ├── services/             # الخدمات
│   │   ├── streamProcessor.js    # معالجة RTSP
│   │   └── socketService.js      # Socket.IO
│   └── YOLO_INTEGRATION_GUIDE.md # دليل تكامل YOLO
│
└── yolo-service/             # خدمة YOLO (اختياري)
    ├── app.py               # Flask API
    └── models/              # نماذج YOLO
```

## 🔌 API Endpoints

### Cameras
- `GET /api/cameras` - جلب كل الكاميرات
- `POST /api/cameras` - إضافة كاميرا
- `PUT /api/cameras/:id` - تحديث كاميرا
- `DELETE /api/cameras/:id` - حذف كاميرا
- `POST /api/cameras/:id/stream/start` - بدء البث
- `POST /api/cameras/:id/stream/stop` - إيقاف البث
- `POST /api/cameras/:id/snapshot` - التقاط صورة

### Alerts
- `GET /api/alerts` - جلب التنبيهات (مع فلاتر)
- `POST /api/alerts` - إنشاء تنبيه
- `PUT /api/alerts/:id/resolve` - حل تنبيه
- `DELETE /api/alerts/:id` - حذف تنبيه
- `GET /api/alerts/stats/summary` - إحصائيات التنبيهات

### Sensors
- `GET /api/sensors` - جلب المستشعرات
- `POST /api/sensors` - إضافة مستشعر
- `PUT /api/sensors/:id` - تحديث مستشعر
- `DELETE /api/sensors/:id` - حذف مستشعر
- `POST /api/sensors/:id/reading` - تحديث قراءة

## 🔄 WebSocket Events

### من الخادم للعميل:
- `connected` - اتصال ناجح
- `alert:new` - تنبيه جديد
- `alert:resolved` - تنبيه محلول
- `camera:frame` - إطار جديد من الكاميرا
- `camera:status` - تحديث حالة الكاميرا
- `sensor:update` - تحديث قراءة المستشعر
- `detection:result` - نتيجة كشف YOLO

### من العميل للخادم:
- `detection:subscribe` - الاشتراك في كشف كاميرا
- `detection:unsubscribe` - إلغاء الاشتراك

## 🎨 التقنيات المستخدمة

### Frontend:
- React 18
- Redux Toolkit
- React Router
- Socket.IO Client
- Tailwind CSS
- Recharts
- Axios
- Lucide React Icons
- date-fns

### Backend:
- Node.js
- Express.js
- Socket.IO
- fluent-ffmpeg
- CORS

### Detection (اختياري):
- Python
- Flask
- YOLOv8 (Ultralytics)
- OpenCV
- PyTorch

## 🔧 التخصيص

### إضافة كاميرا جديدة:

```javascript
const newCamera = {
  name: 'اسم الكاميرا',
  location: 'الموقع',
  rtspUrl: 'rtsp://username:password@ip:port/path',
  detectionCapabilities: ['fire', 'smoke', 'ppe']
};
```

### تدريب نموذج YOLO مخصص:

راجع `backend/YOLO_INTEGRATION_GUIDE.md` للتفاصيل الكاملة

## 🐛 استكشاف الأخطاء

### Backend لا يتصل بالكاميرا:
- تأكد من صحة RTSP URL
- تحقق من تثبيت FFmpeg بشكل صحيح
- تأكد من إمكانية الوصول للكاميرا عبر الشبكة

### Socket.IO لا يتصل:
- تحقق من تطابق VITE_BACKEND_URL
- تأكد من تشغيل Backend
- افحص إعدادات CORS

### YOLO لا يكشف:
- تأكد من تشغيل خدمة YOLO
- تحقق من YOLO_API_URL في .env
- راجع دقة النموذج (confidence threshold)

## 📝 ملاحظات

- النظام يستخدم mock data افتراضياً
- يمكن ربط قاعدة بيانات (MongoDB/PostgreSQL) لاحقاً
- خدمة YOLO اختيارية - النظام يعمل بدونها
- يدعم كاميرات RTSP فقط حالياً

## 🔐 الأمان

- تأكد من تغيير بيانات الاعتماد الافتراضية
- استخدم HTTPS في الإنتاج
- قم بتفعيل المصادقة للـ API
- احمِ RTSP URLs من الوصول العام

## 📄 الترخيص

MIT License

---

**النسخة**: 3.0.0 (Redux + Backend Edition)
**التحديث الأخير**: يناير 2025
