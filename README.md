# 🎛️ لوحة إدارة التراخيص - License Admin Panel

لوحة إدارة شاملة لإدارة تراخيص نظام إدارة درجات الطلبة.

## 🚀 النشر على Vercel

### المتطلبات:
- حساب Vercel مجاني أو مدفوع
- مستودع Git يحتوي على الكود

### خطوات النشر:

1. **إنشاء مستودع Git:**
   ```bash
   git init
   git add .
   git commit -m "Admin panel ready for Vercel"
   git remote add origin https://github.com/yourusername/license-admin-panel.git
   git push -u origin main
   ```

2. **النشر على Vercel:**
   - اذهب إلى [vercel.com](https://vercel.com)
   - سجل دخول أو أنشئ حساب
   - انقر على "New Project"
   - اربط المستودع
   - استخدم الإعدادات التالية:
     - **Framework Preset:** Vite
     - **Root Directory:** `admin-panel`
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`

3. **إعداد متغيرات البيئة:**
   - `VITE_API_BASE_URL`: `https://license-y64y.onrender.com/api`
   - `VITE_APP_NAME`: `License Admin Panel`
   - `VITE_APP_VERSION`: `1.0.0`

## 🔧 التطوير المحلي

### التثبيت:
```bash
npm install
```

### التشغيل:
```bash
# وضع التطوير
npm run dev

# معاينة الإنتاج
npm run preview
```

### متغيرات البيئة:
انسخ `.env.example` إلى `.env.local` وحدث القيم:
```bash
cp .env.example .env.local
```

## 📡 API Endpoints

### تسجيل دخول Admin:
```http
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### إدارة التراخيص:
```http
# جلب جميع التراخيص
GET /api/admin/licenses
Authorization: Bearer YOUR_JWT_TOKEN

# إنشاء ترخيص جديد
POST /api/admin/licenses
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "user_email": "user@example.com",
  "user_name": "User Name",
  "notes": "Optional notes"
}

# تحديث ترخيص
PUT /api/admin/licenses/:licenseKey
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "user_name": "Updated Name",
  "notes": "Updated notes"
}

# حذف ترخيص
DELETE /api/admin/licenses/:licenseKey
Authorization: Bearer YOUR_JWT_TOKEN
```

### الإحصائيات والسجلات:
```http
# جلب الإحصائيات
GET /api/admin/stats
Authorization: Bearer YOUR_JWT_TOKEN

# جلب سجل التراخيص
GET /api/admin/logs
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🎨 المميزات

- ✅ **واجهة مستخدم حديثة** مع Tailwind CSS
- ✅ **تصميم متجاوب** يعمل على جميع الأجهزة
- ✅ **إدارة التراخيص** (إنشاء، تعديل، حذف)
- ✅ **عرض الإحصائيات** المفصلة
- ✅ **سجل العمليات** مع التواريخ
- ✅ **نظام تسجيل دخول** آمن
- ✅ **تصدير البيانات** بصيغة CSV
- ✅ **بحث وفلترة** متقدمة

## 🔒 الأمان

- JWT للتحقق من هوية Admin
- تشفير كلمات المرور
- CORS محدود للمصادر المسموحة
- حماية من XSS و CSRF

## 📊 الصفحات

1. **صفحة تسجيل الدخول** - تسجيل دخول آمن
2. **لوحة التحكم** - نظرة عامة على النظام
3. **إدارة التراخيص** - إنشاء وتعديل التراخيص
4. **الإحصائيات** - تقارير مفصلة وسجلات العمليات

## 🌐 CORS

المصادر المسموحة:
- `https://license-y64y.onrender.com` (خادم الترخيص)
- `https://your-admin-panel.vercel.app` (لوحة الإدارة)

## 🔄 التحديثات

للتحديث على Vercel:
```bash
git add .
git commit -m "Update admin panel"
git push origin main
```

سيتم النشر التلقائي إذا كان Auto Deploy مفعل.

## 📞 الدعم

للحصول على المساعدة:
1. تحقق من سجلات Vercel
2. اختبر API endpoints
3. تحقق من متغيرات البيئة
4. راجع سجلات التطبيق

---

**تم إعداد لوحة الإدارة للنشر على Vercel بنجاح!** 🎉