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
