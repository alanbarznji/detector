# دليل ربط الكاميرا الحقيقية 📹

## كيف يعمل النظام؟

النظام الآن **جاهز للاتصال المباشر** بالكاميرات الحقيقية! إليك كيفية عمل الاتصال:

```
كاميرا RTSP → Backend (FFmpeg) → Socket.IO → Frontend (عرض مباشر)
```

---

## ⚙️ الإعداد

### 1. تكوين الكاميرا في Backend

عدل ملف `backend/.env`:

```env
# معلومات كاميرتك الحقيقية
RTSP_URL=rtsp://mcbt:alan22@192.168.100.201:554/Streaming/Channels/101
FFMPEG_PATH=C:\\ffmpeg\\bin\\ffmpeg.exe
```

**ملاحظات مهمة:**
- استبدل `mcbt:alan22` باسم المستخدم وكلمة المرور الخاصة بك
- استبدل `192.168.100.201` بعنوان IP للكاميرا
- تأكد من تثبيت FFmpeg في المسار المحدد

---

### 2. تشغيل الخدمات

```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
npm run dev
```

---

## 🎥 كيف يعمل البث المباشر؟

### Frontend (React):
```javascript
// src/hooks/useCameraStream.js
const { currentFrame } = useCameraStream(camera);

// يستقبل الإطارات من Socket.IO
socket.on('camera:frame', (data) => {
  setLiveFrame(data.frame);
});
```

### Backend (Node.js):
```javascript
// backend/services/streamProcessor.js
ffmpeg(streamUrl)
  .setFfmpegPath(process.env.FFMPEG_PATH)
  .inputOptions(['-rtsp_transport', 'tcp'])
  .outputOptions(['-f', 'image2', '-vf', 'fps=1'])
  .on('data', (frame) => {
    // إرسال الإطار للواجهة
    io.emit('camera:frame', { cameraId, frame });
  });
```

---

## 📡 أنواع الكاميرات المدعومة

### RTSP Cameras:
- ✅ Hikvision
- ✅ Dahua
- ✅ Uniview
- ✅ Axis
- ✅ أي كاميرا تدعم RTSP

### أمثلة RTSP URLs:

**Hikvision:**
```
rtsp://username:password@192.168.1.64:554/Streaming/Channels/101
```

**Dahua:**
```
rtsp://username:password@192.168.1.108:554/cam/realmonitor?channel=1&subtype=0
```

**Uniview:**
```
rtsp://username:password@192.168.1.100:554/media/video1
```

---

## 🔧 تكوين الكاميرات في النظام

### إضافة كاميرا جديدة:

يمكنك إضافة كاميرات في `backend/server.js` أو من خلال API:

```javascript
POST /api/cameras
{
  "name": "كاميرا المدخل",
  "location": "المدخل الرئيسي",
  "rtspUrl": "rtsp://username:password@ip:port/path",
  "detectionCapabilities": ["fire", "smoke", "ppe"]
}
```

---

## 🎬 كيفية مشاهدة البث المباشر

### 1. من لوحة التحكم:
- افتح `http://localhost:5173`
- شاهد 4 كاميرات مباشرة
- البث سيتحدث تلقائياً كل ثانية

### 2. صفحة الكاميرات:
- اذهب إلى صفحة "الكاميرات"
- اختر التخطيط (1×1, 2×2, 3×3, 4×4)
- شاهد جميع الكاميرات في الوقت الفعلي

### 3. عرض كاميرا واحدة:
- انقر على أي كاميرا
- سيفتح عرض بالحجم الكامل
- أزرار التحكم (تشغيل/إيقاف، لقطة، ملء الشاشة)

---

## ⚡ سرعة الإطارات (FPS)

حالياً: **1 إطار في الثانية** (لتوفير النطاق)

### لزيادة السرعة:
عدل `backend/services/streamProcessor.js`:

```javascript
.outputOptions([
  '-f', 'image2',
  '-vf', 'fps=5',  // 5 إطارات في الثانية
  '-update', '1'
])
```

**الخيارات:**
- `fps=1` → 1 إطار/ثانية (توفير)
- `fps=5` → 5 إطارات/ثانية (متوسط)
- `fps=15` → 15 إطار/ثانية (سلس)
- `fps=30` → 30 إطار/ثانية (عالي - يستهلك الكثير)

---

## 🔄 معالجة إعادة الاتصال التلقائي

النظام يعيد الاتصال تلقائياً عند انقطاع الكاميرا:

```javascript
.on('error', (err) => {
  console.error('Stream error:', err.message);
  // إعادة الاتصال بعد 5 ثوانٍ
  setTimeout(() => {
    this.startStream(streamUrl, cameraId, io);
  }, 5000);
});
```

---

## 🧪 اختبار الكاميرا

### 1. اختبار RTSP يدوياً:
```bash
# باستخدام FFmpeg
ffmpeg -rtsp_transport tcp -i "rtsp://username:password@ip:port/path" -f image2 test.jpg

# باستخدام VLC
vlc "rtsp://username:password@ip:port/path"
```

### 2. اختبار من المتصفح:
```
افتح: http://localhost:5173
إذا ظهرت الكاميرات، البث يعمل! ✅
إذا لم تظهر، راجع console.log في Backend
```

---

## 🐛 حل المشاكل

### المشكلة: الكاميرا لا تظهر

**الحل:**
```bash
# 1. تحقق من FFmpeg
where ffmpeg  # في Windows
which ffmpeg  # في Linux/Mac

# 2. تحقق من اتصال الكاميرا
ping 192.168.100.201

# 3. تحقق من logs في Backend
cd backend
npm start
# راقب الرسائل
```

### المشكلة: البث بطيء

**الحل:**
- خفض FPS في `streamProcessor.js`
- استخدم جودة أقل من الكاميرا
- تأكد من قوة شبكة الإنترنت

### المشكلة: Socket.IO لا يتصل

**الحل:**
```javascript
// تحقق من console في المتصفح
// يجب أن ترى:
✅ Connected to backend: socket_id
```

---

## 🎯 الحالة الحالية

### ✅ ما يعمل الآن:
- استقبال الإطارات من Socket.IO
- عرض البث في Frontend
- إعادة الاتصال التلقائي
- معالجة الأخطاء

### 🔧 ما يحتاج تفعيل:
1. **تشغيل Backend** (npm start في مجلد backend)
2. **تكوين RTSP URL** في `.env`
3. **تثبيت FFmpeg** إذا لم يكن مثبتاً

### بمجرد تشغيل Backend:
```bash
cd backend
npm start

# ستبدأ معالجة RTSP تلقائياً
# Frontend سيستقبل الإطارات ويعرضها
```

---

## 📊 تدفق البيانات الكامل

```
1. كاميرا RTSP (192.168.100.201)
       ↓
2. FFmpeg يسحب البث (backend/services/streamProcessor.js)
       ↓
3. استخراج إطارات (1 fps)
       ↓
4. Socket.IO يرسل الإطارات (camera:frame)
       ↓
5. Frontend يستقبل (src/hooks/useCameraStream.js)
       ↓
6. React يعرض الصورة (src/components/CameraCard.jsx)
```

---

## 💡 نصائح مهمة

1. **احتفظ بـ FPS منخفض** (1-5) لتوفير النطاق
2. **استخدم TCP** للاتصال بـ RTSP (أكثر استقراراً)
3. **راقب logs** في Backend لمعرفة المشاكل
4. **اختبر الكاميرا** بـ VLC قبل الربط
5. **تأكد من الشبكة** بين الخادم والكاميرا

---

## 🚀 للبدء الآن

```bash
# 1. تحديث .env
cd backend
nano .env
# عدل RTSP_URL

# 2. تشغيل Backend
npm start

# 3. تشغيل Frontend (نافذة جديدة)
cd ..
npm run dev

# 4. افتح المتصفح
# http://localhost:5173

# 5. شاهد البث المباشر! 🎉
```

---

**الآن النظام جاهز للعمل مع كاميراتك الحقيقية!** 🎥✨
