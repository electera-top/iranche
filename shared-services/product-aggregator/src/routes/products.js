const express = require('express');
const { getAllProducts, getCategories, getBrands, getProductStats } = require('../config/database');
const { cache } = require('../config/redis');

const router = express.Router();

// Get all products with pagination and filters
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    const filters = {
      category: req.query.category,
      brand: req.query.brand,
      price_min: req.query.price_min ? parseFloat(req.query.price_min) : null,
      price_max: req.query.price_max ? parseFloat(req.query.price_max) : null,
      tenant_id: req.query.tenant_id ? parseInt(req.query.tenant_id) : null,
      limit,
      offset
    };

    // Check cache first
    const cacheKey = `products:${JSON.stringify(filters)}`;
    const cachedProducts = await cache.get(cacheKey);
    
    if (cachedProducts) {
      return res.json({
        success: true,
        data: cachedProducts,
        cached: true
      });
    }

    const products = await getAllProducts(filters);
    
    // Cache the result
    await cache.set(cacheKey, products, 1800); // 30 minutes

    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total: products.length,
        hasNext: products.length === limit
      }
    });

  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get products'
    });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    
    if (isNaN(productId)) {
      return res.status(400).json({
        error: 'Invalid product ID',
        message: 'Product ID must be a number'
      });
    }

    // Check cache first
    const cacheKey = `product:${productId}`;
    const cachedProduct = await cache.get(cacheKey);
    
    if (cachedProduct) {
      return res.json({
        success: true,
        data: cachedProduct,
        cached: true
      });
    }

    const products = await getAllProducts({ product_id: productId });
    
    if (products.length === 0) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'Product not found'
      });
    }

    const product = products[0];
    
    // Cache the result
    await cache.set(cacheKey, product, 3600); // 1 hour

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get product'
    });
  }
});

// Get product categories
router.get('/categories/list', async (req, res) => {
  try {
    // Check cache first
    const cacheKey = 'categories:list';
    const cachedCategories = await cache.get(cacheKey);
    
    if (cachedCategories) {
      return res.json({
        success: true,
        data: cachedCategories,
        cached: true
      });
    }

    const categories = await getCategories();
    
    // Cache the result
    await cache.set(cacheKey, categories, 7200); // 2 hours

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get categories'
    });
  }
});

// Get product brands
router.get('/brands/list', async (req, res) => {
  try {
    // Check cache first
    const cacheKey = 'brands:list';
    const cachedBrands = await cache.get(cacheKey);
    
    if (cachedBrands) {
      return res.json({
        success: true,
        data: cachedBrands,
        cached: true
      });
    }

    const brands = await getBrands();
    
    // Cache the result
    await cache.set(cacheKey, brands, 7200); // 2 hours

    res.json({
      success: true,
      data: brands
    });

  } catch (error) {
    console.error('Error getting brands:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get brands'
    });
  }
});

// Get product statistics
router.get('/stats/overview', async (req, res) => {
  try {
    // Check cache first
    const cacheKey = 'products:stats';
    const cachedStats = await cache.get(cacheKey);
    
    if (cachedStats) {
      return res.json({
        success: true,
        data: cachedStats,
        cached: true
      });
    }

    const stats = await getProductStats();
    
    // Cache the result
    await cache.set(cacheKey, stats, 3600); // 1 hour

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error getting product stats:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get product statistics'
    });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const filters = {
      category,
      limit,
      offset
    };

    // Check cache first
    const cacheKey = `products:category:${category}:${page}:${limit}`;
    const cachedProducts = await cache.get(cacheKey);
    
    if (cachedProducts) {
      return res.json({
        success: true,
        data: cachedProducts,
        cached: true
      });
    }

    const products = await getAllProducts(filters);
    
    // Cache the result
    await cache.set(cacheKey, products, 1800); // 30 minutes

    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total: products.length,
        hasNext: products.length === limit
      }
    });

  } catch (error) {
    console.error('Error getting products by category:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get products by category'
    });
  }
});

// Get products by brand
router.get('/brand/:brand', async (req, res) => {
  try {
    const { brand } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const filters = {
      brand,
      limit,
      offset
    };

    // Check cache first
    const cacheKey = `products:brand:${brand}:${page}:${limit}`;
    const cachedProducts = await cache.get(cacheKey);
    
    if (cachedProducts) {
      return res.json({
        success: true,
        data: cachedProducts,
        cached: true
      });
    }

    const products = await getAllProducts(filters);
    
    // Cache the result
    await cache.set(cacheKey, products, 1800); // 30 minutes

    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total: products.length,
        hasNext: products.length === limit
      }
    });

  } catch (error) {
    console.error('Error getting products by brand:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get products by brand'
    });
  }
});

// Get products by tenant
router.get('/tenant/:tenantId', async (req, res) => {
  try {
    const tenantId = parseInt(req.params.tenantId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    if (isNaN(tenantId)) {
      return res.status(400).json({
        error: 'Invalid tenant ID',
        message: 'Tenant ID must be a number'
      });
    }

    const filters = {
      tenant_id: tenantId,
      limit,
      offset
    };

    // Check cache first
    const cacheKey = `products:tenant:${tenantId}:${page}:${limit}`;
    const cachedProducts = await cache.get(cacheKey);
    
    if (cachedProducts) {
      return res.json({
        success: true,
        data: cachedProducts,
        cached: true
      });
    }

    const products = await getAllProducts(filters);
    
    // Cache the result
    await cache.set(cacheKey, products, 1800); // 30 minutes

    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total: products.length,
        hasNext: products.length === limit
      }
    });

  } catch (error) {
    console.error('Error getting products by tenant:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get products by tenant'
    });
  }
});

module.exports = router;
