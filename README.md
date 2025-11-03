## راهنمای اجرای کامل پروژه Shop W2

این مخزن شامل چند سرویس Docker است که با هم یک سیستم فروشگاه چند-اجاره‌ای (Multi-Tenant) را اجرا می‌کنند.

### پیش‌نیازها
- Docker Desktop 4.x یا بالاتر
- Docker Compose v2 (همراه Docker Desktop)
- سیستم‌عامل: Windows 10/11 یا Linux/Mac


### ساخت فایل محیطی (.env)
در ریشه پروژه (`shop_w2/`) یک فایل `.env` ایجاد کنید. مقادیر زیر نمونه هستند؛ در محیط واقعی مقادیر امن انتخاب کنید.

```env
# پایگاه‌داده اصلی
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_USER=shop_user
MYSQL_PASSWORD=shop_password_123

# دامنه اصلی
MAIN_DOMAIN=localhost

# JWT برای سرویس tenant-manager
JWT_SECRET=change_this_secret

# مقادیر پیش‌فرض نصب تننت (در صورت نیاز به نصب خودکار)
TENANT_SUBDOMAIN=testshop3
TENANT_DB_NAME=shop_testshop3_1756754342655
TENANT_DB_USER=user_testshop3_7ccb34d3
TENANT_DB_PASSWORD=49ac2f39dc334979
TENANT_ADMIN_PASSWORD=admin123
TENANT_ADMIN_EMAIL=test3@example.com
TENANT_SHOP_NAME=فروشگاه نمونه 3
```

توضیح: برخی از متغیرهای بالا توسط سرویس `wordpress-installer` استفاده می‌شوند و برای نصب خودکار یک تننت نمونه به‌کار می‌روند.

### اجرای سریع
ترمینال را در ریشه مخزن (`shop_w2/`) باز کنید و اجرا کنید:

```bash
docker compose up -d --build
```

اولین اجرا کمی زمان‌بر است چون ایمیج‌ها بیلد و کانتینرها ساخته می‌شوند.

### سرویس‌ها و پورت‌ها
- tenant-manager: http://localhost:3000
- product-aggregator: http://localhost:3001
- content-sync: http://localhost:3002
- frontend (Next.js - dev): http://localhost:3003
- phpMyAdmin: http://localhost:9090
- Nginx: http://localhost و https://localhost
- MySQL: 3306 (برای دسترسی محلی)
- Redis: 6379

### بررسی سلامت سرویس‌ها
- سلامت `tenant-manager`:
  - Windows PowerShell:
    ```powershell
    (Invoke-WebRequest -UseBasicParsing http://localhost:3000/health).Content
    ```
  - خروجی نمونه:
    ```json
    {"status":"OK","timestamp":"..."}
    ```

- وضعیت همه سرویس‌ها:
```bash
docker compose ps
```

### ورود به phpMyAdmin
- آدرس: http://localhost:9090
- Host: `main-db`
- User: مقدار `MYSQL_USER` در `.env`
- Password: مقدار `MYSQL_PASSWORD` در `.env`

### توقف و راه‌اندازی مجدد
```bash
docker compose stop           # توقف بدون حذف
docker compose start          # شروع مجدد
docker compose restart        # ری‌استارت
```

### خاموشی کامل و پاک‌سازی
```bash
docker compose down           # حذف کانتینرها
docker compose down -v        # حذف کانتینرها + ولوم‌ها (داده‌ها پاک می‌شوند)
```

هشدار: دستور `-v` داده‌های دیتابیس را حذف می‌کند. در محیط واقعی با احتیاط استفاده کنید.

### نکات توسعه
- سرویس `frontend` به‌صورت توسعه (Dev) اجرا می‌شود و سورس آن مانت شده است؛ تغییرات UI را سریع می‌بینید.
- برای پایداری `tenant-manager` از `node_modules` داخل ایمیج استفاده می‌شود. از مانت کردن کل مسیر `./tenant-manager:/app` خودداری کنید، چون باعث ناپدید شدن `node_modules` ایمیج و خطای Module Not Found می‌شود.
- اگر نیاز به توسعه روی `tenant-manager` دارید، پیشنهاد می‌شود تنها دایرکتوری `src` را با یک پروفایل جداگانه مانت کنید و نصب پکیج‌ها داخل ایمیج یا با اسکریپت entrypoint انجام شود.

### خطاهای رایج و رفع آن‌ها
- خطا: `Error: Cannot find module 'ftp'`
  - علت: مانت شدن مسیر پروژه روی `/app` یا مانت شدن `/app/node_modules` باعث می‌شود `node_modules` ایمیج دیده نشود.
  - راه‌حل: ولوم‌های یادشده را برای `tenant-manager` حذف کنید (در فایل `docker-compose.yml` همین‌طور تنظیم شده است). سپس:
    ```bash
    docker compose build tenant-manager
    docker compose up -d tenant-manager
    ```

- PowerShell عملگرهای `&&` و `||` را نمی‌شناسد
  - در Windows از اجرای دستورات در دو خط جداگانه استفاده کنید یا از PowerShell معادل‌ها را جداگانه اجرا کنید.

- بیلد کند یا حجیم است
  - وجود فایل `.dockerignore` در `tenant-manager` کمک می‌کند تا `node_modules` محلی وارد کانتکست بیلد نشود و سرعت بیلد بهتر شود.

### ساخت مجدد یک سرویس خاص
برای مثال، ساخت مجدد `tenant-manager`:
```bash
docker compose build tenant-manager
docker compose up -d tenant-manager
```

### مسیرهای مهم پروژه
- `tenant-manager/`: سرویس Node.js مدیریت تننت‌ها (پورت 3000)
- `shared-services/product-aggregator/`: گردآوری محصولات (پورت 3001)
- `shared-services/content-sync/`: همگام‌سازی محتوا (پورت 3002)
- `public-frontend/`: فرانت‌اند (پورت 3003)
- `wordpress-core/`: هسته وردپرس برای تننت‌ها
- `nginx/`: پیکربندی Nginx و SSL

### گزارش باگ و پشتیبانی
در صورت بروز مشکل، خروجی این دستورات را ضمیمه کنید:
```bash
docker compose ps
docker compose logs --no-color --tail=200 tenant-manager
```

موفق باشید!

# Multi-Tenant Shop Builder (فروشگاه ساز چند مستأجری)

A comprehensive multi-tenant e-commerce platform that creates independent WordPress-based shops on subdomains with centralized product aggregation.

## 🏗️ Architecture

- **Database per Tenant** strategy for complete data isolation
- **WordPress core** for each tenant with full plugin/theme compatibility
- **Subdomain routing** (e.g., `shop.example.com`)
- **Centralized aggregation** of products, articles, and ratings
- **Docker-based deployment** for scalability

## 🚀 Key Features

### Multi-Tenant Management
- ✅ Subdomain-based shops with independent WordPress installations
- ✅ Separate databases for each tenant
- ✅ Centralized tenant management with admin panel
- ✅ Automatic WordPress provisioning with WooCommerce

### Product & Content Aggregation
- ✅ Global product catalog from all tenant shops
- ✅ Centralized search across all products and articles
- ✅ Category and brand management
- ✅ Rating and review aggregation
- ✅ Real-time synchronization

### Technical Features
- ✅ Docker & Docker Compose for easy deployment
- ✅ Nginx reverse proxy with SSL support
- ✅ Redis caching for performance optimization
- ✅ Health monitoring and system checks
- ✅ Backup and restore functionality

## 📁 Project Structure

```
shop_w2/
├── docker-compose.yml              # Main Docker orchestration
├── .env                           # Environment configuration
├── shared-database/               # Central database setup
├── tenant-manager/                # Tenant management service
├── wordpress-core/               # WordPress base image
├── nginx/                        # Nginx configuration
└── shared-services/              # Microservices
    ├── product-aggregator/       # Product aggregation service
    └── content-sync/             # Content synchronization service
```

## 🛠️ Quick Start

1. **Clone and configure**
   ```bash
   git clone <repository-url>
   cd shop_w2
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Start the system**
   ```bash
   docker-compose up -d
   ```

3. **Access services**
   - Main Admin Panel: `http://admin.example.com`
   - Tenant Manager API: `http://api.example.com`
   - Product Aggregator: `http://products.example.com`

## 🔌 API Endpoints

### Tenant Manager API
- `POST /api/tenants` - Create new tenant
- `GET /api/tenants` - List tenants
- `GET /api/tenants/:id` - Get tenant details
- `PUT /api/tenants/:id` - Update tenant
- `DELETE /api/tenants/:id` - Delete tenant

### Product Aggregator API
- `GET /api/products` - Get all products
- `GET /api/products/search` - Search products
- `GET /api/products/:id` - Get product details
- `GET /api/products/categories` - Get categories
- `GET /api/products/brands` - Get brands

### Content Sync API
- `GET /api/articles` - Get all articles
- `GET /api/articles/search` - Search articles
- `GET /api/articles/:id` - Get article details
- `GET /api/articles/categories/list` - Get categories

## 🔧 Management Commands

### Create New Shop
```bash
curl -X POST http://api.example.com/api/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain": "newshop",
    "shop_name": "New Shop",
    "owner_email": "owner@example.com",
    "admin_username": "admin",
    "admin_password": "password123"
  }'
```

### Health Checks
```bash
curl http://api.example.com/api/health/detailed
curl http://products.example.com/api/health
curl http://content.example.com/api/health
```

## 🔒 Security Features

- Helmet.js for security headers
- Rate limiting on all APIs
- CORS protection
- JWT authentication
- Input validation and sanitization
- SQL injection prevention

## 📈 Monitoring

### Health Check Endpoints
- `GET /health` - Basic health status
- `GET /health/detailed` - Detailed system status
- `GET /health/database` - Database connectivity
- `GET /health/redis` - Redis connectivity
- `GET /health/system` - System resources

## 🚀 Deployment

### Development
```bash
docker-compose up -d
```

### Production
```bash
export NODE_ENV=production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🔄 Backup & Restore

### Automated Backups
```bash
# System-wide backup
docker-compose exec tenant-manager npm run backup:system

# Tenant-specific backup
docker-compose exec tenant-manager npm run backup:tenant -- --tenant-id=1
```

## 🐛 Troubleshooting

### Common Issues

#### Service Won't Start
```bash
docker-compose logs tenant-manager
docker-compose logs main-db
docker-compose ps
```

#### Database Connection Issues
```bash
docker-compose exec tenant-manager npm run test:db
```

#### WordPress Issues
```bash
docker-compose exec tenant-manager npm run wp:check -- --tenant-id=1
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

**Built with ❤️ for scalable e-commerce solutions**
