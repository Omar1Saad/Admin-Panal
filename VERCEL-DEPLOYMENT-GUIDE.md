# 🚀 نشر لوحة الإدارة على Vercel - تعليمات سريعة

## الخطوات الأساسية:

### 1. إعداد المستودع
```bash
cd admin-panel
git init
git add .
git commit -m "Admin panel ready for Vercel"
git remote add origin https://github.com/yourusername/license-admin-panel.git
git push -u origin main
```

### 2. النشر على Vercel
1. اذهب إلى [vercel.com](https://vercel.com)
2. "New Project"
3. اربط المستودع `license-admin-panel`
4. الإعدادات:
   - **Framework Preset:** Vite
   - **Root Directory:** `admin-panel`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### 3. متغيرات البيئة
```
VITE_API_BASE_URL=https://license-y64y.onrender.com/api
VITE_APP_NAME=License Admin Panel
VITE_APP_VERSION=1.0.0
```

### 4. اختبار النشر
```bash
# اختبار محلي
npm run build
npm run preview

# اختبار على Vercel
# انتقل إلى الرابط المقدم من Vercel
```

## ✅ تم الإعداد بنجاح!

الآن يمكنك نشر لوحة الإدارة على Vercel واستخدامها لإدارة التراخيص.

## 🔑 بيانات تسجيل الدخول:
- **Username:** `admin`
- **Password:** `admin123`

## 📊 المميزات المتاحة:
- إدارة التراخيص (إنشاء، تعديل، حذف)
- عرض الإحصائيات المفصلة
- سجل العمليات مع التواريخ
- واجهة مستخدم حديثة ومتجاوبة
