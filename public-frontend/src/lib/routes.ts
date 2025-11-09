/**
 * تمام مسیرهای برنامه
 * 
 * این فایل تمام مسیرهای برنامه را در یک مکان مدیریت می‌کند و امکان استفاده مجدد از آنها را فراهم می‌سازد.
 */

// مسیرهای اصلی
export const HOME = '/'
export const ABOUT = '/about'
export const CONTACT = '/contact'

// مسیرهای مربوط به فروشگاه‌ها
export const STORES = '/stores'
export const STORE_DETAILS = (id: string | number) => `/stores/${id}`
export const STORE_CATEGORIES = '/stores/categories'
export const STORE_CATEGORY = (category: string) => `/stores/categories/${category}`
export const SHOP = '/shop'
// مسیرهای مربوط به محصولات
export const PRODUCTS = '/products'
export const PRODUCT_DETAILS = (id: string | number) => `/products/${id}`
export const PRODUCT_CATEGORIES = '/products/categories'
export const PRODUCT_CATEGORY = (category: string) => `/products/categories/${category}`

// مسیرهای مربوط به کاربر
export const USER = {
  LOGIN: '/user/login',
  REGISTER: '/user/register',
  PROFILE: '/user/profile',
  ORDERS: '/user/orders',
  ORDER_DETAILS: (id: string | number) => `/user/orders/${id}`,
  FAVORITES: '/user/favorites',
}

// مسیرهای سبد خرید
export const CART = '/cart'
export const CHECKOUT = '/checkout'

// مسیرهای API داخلی (برای استفاده در API calls)
export const API = {
  BASE: '/api',
  PRODUCTS: '/api/products',
  STORES: '/api/stores',
  AUTH: '/api/auth',
  USER: '/api/user',
}

// مجموعه تمام مسیرها (برای استفاده در نقشه سایت یا موارد مشابه)
export const ALL_ROUTES = {
  HOME,
  ABOUT,
  CONTACT,
  STORES,
  STORE_CATEGORIES,
  PRODUCTS,
  PRODUCT_CATEGORIES,
  USER,
  CART,
  CHECKOUT,
}

export default ALL_ROUTES 