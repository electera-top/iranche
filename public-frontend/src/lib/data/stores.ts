import { Store } from '@/lib/Types';
import { floors } from './floors';

/**
 * داده‌های مربوط به فروشگاه‌ها
 * در حالت واقعی این داده‌ها از API دریافت می‌شوند
 */
export const stores: Store[] = [
  // طبقه لوازم آرایشی و بهداشتی
  {
    id: '101',
    name: 'میکاپ لند',
    description: 'فروشگاه تخصصی لوازم آرایشی و بهداشتی اورجینال',
    logo: '/images/stores/logos/makeup-land.png',
    bannerImage: '/images/stores/banners/makeup-land.jpg',
    rating: 4.7,
    reviewCount: 125,
    floorId: '1',
    floorName: 'لوازم آرایشی و بهداشتی',
    plaque: '101',
    slug: 'makeup-land',
    category: 'لوازم آرایشی',
    isVIP: true,
    followersCount: 1250,
    showcaseCount: 48
  },
  {
    id: '102',
    name: 'بیوتی شاپ',
    description: 'ارائه دهنده محصولات مراقبت پوست و مو با کیفیت',
    logo: '/images/stores/logos/beauty-shop.png',
    bannerImage: '/images/stores/banners/beauty-shop.jpg',
    rating: 4.5,
    reviewCount: 98,
    floorId: '1',
    floorName: 'لوازم آرایشی و بهداشتی',
    plaque: '102',
    slug: 'beauty-shop',
    category: 'مراقبت پوست و مو',
    followersCount: 850,
    showcaseCount: 32
  },
  {
    id: '103',
    name: 'عطر پاریس',
    description: 'بزرگترین مجموعه عطر و ادکلن های اورجینال',
    logo: '/images/stores/logos/paris-perfume.png',
    bannerImage: '/images/stores/banners/paris-perfume.jpg',
    rating: 4.8,
    reviewCount: 150,
    floorId: '1',
    floorName: 'لوازم آرایشی و بهداشتی',
    plaque: '103',
    slug: 'paris-perfume',
    category: 'عطر و ادکلن',
    isVIP: true,
    followersCount: 1480,
    showcaseCount: 65
  },
  {
    id: '104',
    name: 'کلینیک بیوتی',
    description: 'محصولات آرایشی و بهداشتی کلینیک با قیمت ویژه - فقط تا پایان هفته',
    logo: '/images/stores/logos/makeup-land.png',
    bannerImage: '/images/stores/banners/makeup-land.jpg',
    rating: 4.9,
    reviewCount: 85,
    floorId: '1',
    floorName: 'لوازم آرایشی و بهداشتی',
    plaque: '104',
    slug: 'clinique-beauty',
    category: 'لوازم آرایشی',
    isAds: true,
    followersCount: 1820,
    showcaseCount: 74
  },
  
  // طبقه کالای دیجیتال
  {
    id: '201',
    name: 'دیجی استور',
    description: 'فروشگاه تخصصی محصولات دیجیتال و موبایل',
    logo: '/images/stores/logos/digi-store.png',
    bannerImage: '/images/stores/banners/digi-store.jpg',
    rating: 4.6,
    reviewCount: 210,
    floorId: '2',
    floorName: 'کالای دیجیتال',
    plaque: '201',
    slug: 'digi-store',
    category: 'موبایل',
    isVIP: true,
    followersCount: 2340,
    showcaseCount: 112
  },
  {
    id: '202',
    name: 'تک لند',
    description: 'ارائه دهنده انواع گجت‌های هوشمند و لوازم جانبی',
    logo: '/images/stores/logos/tech-land.png',
    bannerImage: '/images/stores/banners/tech-land.jpg',
    rating: 4.3,
    reviewCount: 178,
    floorId: '2',
    floorName: 'کالای دیجیتال',
    plaque: '202',
    slug: 'tech-land',
    category: 'گجت هوشمند',
    followersCount: 920,
    showcaseCount: 54
  },
  {
    id: '203',
    name: 'لپ تاپ سنتر',
    description: 'مرکز تخصصی خرید انواع لپ تاپ و قطعات کامپیوتر',
    logo: '/images/stores/logos/laptop-center.png',
    bannerImage: '/images/stores/banners/laptop-center.jpg',
    rating: 4.7,
    reviewCount: 145,
    floorId: '2',
    floorName: 'کالای دیجیتال',
    plaque: '203',
    slug: 'laptop-center',
    category: 'لپ تاپ و کامپیوتر',
    followersCount: 1150,
    showcaseCount: 86
  },
  {
    id: '204',
    name: 'اپل شاپ',
    description: 'پیش فروش آیفون ۱۵ با هدیه ویژه - ۲۰٪ تخفیف برای سفارش‌های آنلاین',
    logo: '/images/stores/logos/digi-store.png',
    bannerImage: '/images/stores/banners/digi-store.jpg',
    rating: 4.9,
    reviewCount: 310,
    floorId: '2',
    floorName: 'کالای دیجیتال',
    plaque: '204',
    slug: 'apple-shop',
    category: 'موبایل',
    isAds: true,
    followersCount: 3450,
    showcaseCount: 96
  },
  
  // طبقه مد و پوشاک
  {
    id: '301',
    name: 'استایل هاب',
    description: 'فروشگاه پوشاک مردانه و زنانه با جدیدترین ترندهای روز',
    logo: '/images/stores/logos/style-hub.png',
    bannerImage: '/images/stores/banners/style-hub.jpg',
    rating: 4.6,
    reviewCount: 189,
    floorId: '3',
    floorName: 'مد و پوشاک',
    plaque: '301',
    slug: 'style-hub',
    category: 'پوشاک',
    followersCount: 1680,
    showcaseCount: 94
  },
  {
    id: '302',
    name: 'گلد شوز',
    description: 'فروشگاه تخصصی کیف و کفش با برندهای معتبر',
    logo: '/images/stores/logos/gold-shoes.png',
    bannerImage: '/images/stores/banners/gold-shoes.jpg',
    rating: 4.4,
    reviewCount: 156,
    floorId: '3',
    floorName: 'مد و پوشاک',
    plaque: '302',
    slug: 'gold-shoes',
    category: 'کیف و کفش',
    isVIP: true,
    followersCount: 2120,
    showcaseCount: 76
  },
  {
    id: '303',
    name: 'برند سنتر',
    description: 'فروش ویژه محصولات برندهای اصل - تخفیف ۴۰ درصدی فقط تا آخر ماه',
    logo: '/images/stores/logos/style-hub.png',
    bannerImage: '/images/stores/banners/style-hub.jpg',
    rating: 4.8,
    reviewCount: 245,
    floorId: '3',
    floorName: 'مد و پوشاک',
    plaque: '303',
    slug: 'brand-center',
    category: 'پوشاک',
    isAds: true,
    followersCount: 2560,
    showcaseCount: 120
  }
];

/**
 * تابع برای گرفتن فروشگاه‌های یک طبقه خاص
 */
export const getStoresByFloorId = (floorId: string): Store[] => {
  return stores.filter(store => store.floorId === floorId);
};

/**
 * تابع برای گرفتن یک طبقه با اسلاگ
 */
export const getFloorBySlug = (slug: string) => {
  return floors.find(floor => floor.slug === slug);
};

/**
 * تابع برای گرفتن دسته‌بندی‌های یک طبقه
 */
export const getCategoriesByFloorId = (floorId: string): string[] => {
  const floorStores = getStoresByFloorId(floorId);
  const categories = floorStores.map(store => store.category);
  return [...new Set(categories)]; // حذف موارد تکراری
};

/**
 * تابع برای گرفتن فروشگاه‌های یک طبقه با دسته‌بندی خاص
 */
export const getStoresByFloorAndCategory = (floorId: string, category: string): Store[] => {
  return stores.filter(store => store.floorId === floorId && store.category === category);
}; 