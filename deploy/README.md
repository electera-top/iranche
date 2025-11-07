# راهنمای دیپلوی iranche.com

این راهنما مراحل کامل نصب و راه‌اندازی پروژه Next.js روی سرور Alma Linux را شرح می‌دهد.

## مشخصات سرور

- **IP:** 178.239.147.72
- **Port:** 12111002
- **User:** root
- **OS:** Alma Linux
- **Domain:** iranche.com

## پیش‌نیازها

- دسترسی SSH به سرور
- DNS دامنه iranche.com به IP سرور اشاره کرده باشد
- پورت‌های 80 و 443 باز باشند

## مراحل نصب

### 1. اتصال به سرور

```bash
ssh -p 12111002 root@178.239.147.72
```

### 2. دانلود اسکریپت‌های دیپلوی

ابتدا Git را نصب کنید (اگر نصب نیست):

```bash
dnf install -y git
```

سپس اسکریپت‌های دیپلوی را دانلود کنید:

```bash
cd /root
git clone https://github.com/electera-top/iranche.git
cd iranche/deploy
chmod +x *.sh
```

### 3. نصب نیازمندی‌های سرور

این اسکریپت Node.js، Nginx، PM2 و Certbot را نصب می‌کند:

```bash
./server-setup.sh
```

این مرحله حدود 5-10 دقیقه طول می‌کشد.

### 4. دیپلوی برنامه

این اسکریپت کد را کلون کرده، build می‌گیرد و با PM2 اجرا می‌کند:

```bash
./deploy-app.sh
```

### 5. تنظیم Nginx

```bash
./setup-nginx.sh
```

### 6. تنظیم SSL (اختیاری اما توصیه می‌شود)

**توجه:** قبل از اجرای این مرحله، مطمئن شوید DNS دامنه به سرور اشاره می‌کند.

```bash
./setup-ssl.sh
```

اگر DNS هنوز propagate نشده، می‌توانید این مرحله را بعداً انجام دهید.

## بررسی وضعیت

بعد از دیپلوی، می‌توانید وضعیت برنامه را چک کنید:

```bash
# بررسی وضعیت PM2
pm2 status

# مشاهده لاگ‌ها
pm2 logs iranche-frontend

# بررسی وضعیت Nginx
systemctl status nginx

# بررسی اتصال
curl http://localhost:3000
```

## دستورات مفید

### مدیریت برنامه

```bash
# شروع مجدد برنامه
pm2 restart iranche-frontend

# توقف برنامه
pm2 stop iranche-frontend

# مشاهده لاگ‌های زنده
pm2 logs iranche-frontend --lines 100

# مشاهده استفاده منابع
pm2 monit
```

### به‌روزرسانی برنامه

برای به‌روزرسانی برنامه با آخرین تغییرات:

```bash
cd /root/iranche/deploy
./deploy-app.sh
```

### مدیریت Nginx

```bash
# تست تنظیمات Nginx
nginx -t

# Reload کردن Nginx
systemctl reload nginx

# Restart کردن Nginx
systemctl restart nginx

# مشاهده لاگ‌های Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### مدیریت SSL

```bash
# بررسی وضعیت گواهی
certbot certificates

# تمدید دستی گواهی
certbot renew

# تست تمدید خودکار
certbot renew --dry-run
```

### مدیریت Firewall

```bash
# بررسی وضعیت فایروال
firewall-cmd --list-all

# باز کردن پورت جدید
firewall-cmd --permanent --add-port=8080/tcp
firewall-cmd --reload
```

## عیب‌یابی

### برنامه اجرا نمی‌شود

```bash
# بررسی لاگ‌های PM2
pm2 logs iranche-frontend --err

# بررسی پورت 3000 آزاد است
netstat -tlnp | grep 3000

# اجرای دستی برای دیباگ
cd /var/www/iranche/public-frontend
npm start
```

### Nginx خطا می‌دهد

```bash
# بررسی لاگ خطای Nginx
tail -n 50 /var/log/nginx/error.log

# تست تنظیمات
nginx -t

# بررسی وضعیت
systemctl status nginx
```

### SSL کار نمی‌کند

```bash
# بررسی DNS
dig iranche.com

# بررسی دسترسی به پورت 80
curl -I http://iranche.com

# بررسی گواهی
openssl s_client -connect iranche.com:443 -servername iranche.com
```

## ساختار پروژه

```
/var/www/iranche/
├── public-frontend/      # برنامه Next.js اصلی
├── admin-panel/          # پنل مدیریت
├── tenant-manager/       # مدیریت tenants
└── ...
```

## پورت‌ها

- **3000:** برنامه Next.js (localhost only)
- **80:** HTTP (redirect به HTTPS)
- **443:** HTTPS (اصلی)

## امنیت

- فایروال فعال است و فقط پورت‌های ضروری باز هستند
- SSL/TLS فعال است (بعد از اجرای setup-ssl.sh)
- PM2 به صورت خودکار برنامه را restart می‌کند
- تمدید خودکار SSL تنظیم شده است

## پشتیبان‌گیری

توصیه می‌شود به صورت دوره‌ای از موارد زیر backup بگیرید:

- `/var/www/iranche/` - کد برنامه
- `/etc/nginx/conf.d/` - تنظیمات Nginx
- `/etc/letsencrypt/` - گواهی‌های SSL

## پشتیبانی

در صورت بروز مشکل، لطفاً لاگ‌های زیر را بررسی کنید:

- PM2 logs: `pm2 logs`
- Nginx error log: `/var/log/nginx/error.log`
- System log: `journalctl -xe`

---

**نکته مهم:** همیشه قبل از تغییرات مهم، از تنظیمات و دیتابیس backup بگیرید.

