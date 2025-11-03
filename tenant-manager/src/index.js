const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const db = require('./config/database');
const { runSqlFileOnce } = require('./config/db-sync');
const redis = require('./config/redis');
const tenantRoutes = require('./routes/tenants');
const adminRoutes = require('./routes/admin');
const healthRoutes = require('./routes/health');
const categoryRoutes = require('./routes/categories');
const fileRoutes = require('./routes/files');
const userRoutes = require('./routes/users');
const themesRoutes = require('./routes/themes');
const pluginsRoutes = require('./routes/plugins');
const themeCategoriesRoutes = require('./routes/themeCategories');
const pluginCategoriesRoutes = require('./routes/pluginCategories');
const frontThemesRoutes = require('./routes/front-req/themes');
const frontFilesRoutes = require('./routes/front-req/files');
const themeDemosRoutes = require('./routes/themeDemos');
const authRoutes = require('./routes/auth');
const staffRoutes = require('./routes/staff');
const plansRoutes = require('./routes/plans');
const subscriptionsRoutes = require('./routes/subscriptions');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost', 'http://localhost:80', 'null'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api/tenants', tenantRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/themes', themesRoutes);
app.use('/api/plugins', pluginsRoutes);
app.use('/api/theme-categories', themeCategoriesRoutes);
app.use('/api/plugin-categories', pluginCategoriesRoutes);
app.use('/api/front-req/themes', frontThemesRoutes);
app.use('/api/front-req/files', frontFilesRoutes);
app.use('/api/theme-demos', themeDemosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/plans', plansRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.message
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token or no token provided'
    });
  }
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

// Start server
const server = app.listen(PORT, async () => {
  console.log(`Tenant Manager running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Database: ${process.env.DB_HOST}:${process.env.DB_NAME}`);
  // Ensure DB connection and sync schema on boot
  try {
    await db.initDatabase();
    await runSqlFileOnce();
  } catch (e) {
    console.error('Startup DB init failed:', e);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

module.exports = app;
