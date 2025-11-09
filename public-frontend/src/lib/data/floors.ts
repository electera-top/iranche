import { Floor } from '@/lib/Types';

/**
 * داده‌های مربوط به طبقات مجتمع تجاری
 * در حالت واقعی این داده‌ها از API دریافت می‌شوند
 */
export const floors: Floor[] = [
  {
    id: '1',
    title: 'لوازم آرایشی و بهداشتی',
    description: 'انواع محصولات آرایشی، بهداشتی، مراقبت پوست و مو، عطر و ادکلن',
    storeCount: 32,
    color: 'pink',
    slug: 'cosmetics',
    isVIP: true
  },
  {
    id: '2',
    title: 'کالای دیجیتال',
    description: 'موبایل، لپ تاپ، تبلت، لوازم جانبی، گجت‌های هوشمند و تجهیزات الکترونیکی',
    storeCount: 45,
    color: 'blue',
    slug: 'electronics',
    isVIP: true
  },
  {
    id: '3',
    title: 'مد و پوشاک',
    description: 'لباس مردانه، زنانه، بچگانه، اکسسوری، کیف و کفش و جواهرات',
    storeCount: 56,
    color: 'purple',
    slug: 'fashion'
  },
  {
    id: '4',
    title: 'خانه و آشپزخانه',
    description: 'لوازم خانگی، دکوراسیون، ظروف آشپزخانه، مبلمان و تجهیزات منزل',
    storeCount: 29,
    color: 'yellow',
    slug: 'home'
  },
  {
    id: '5',
    title: 'ورزش و سلامت',
    description: 'تجهیزات ورزشی، پوشاک ورزشی، مکمل‌های غذایی و تجهیزات سلامت',
    storeCount: 22,
    color: 'green',
    slug: 'sports',
    isVIP: true
  },
  {
    id: '6',
    title: 'کتاب و لوازم تحریر',
    description: 'کتاب، مجله، لوازم تحریر، نوشت‌افزار و محصولات فرهنگی',
    storeCount: 18,
    color: 'orange',
    slug: 'books'
  },
  {
    id: '7',
    title: 'اسباب بازی و سرگرمی',
    description: 'اسباب بازی، بازی‌های فکری، لگو، عروسک و لوازم سرگرمی کودکان',
    storeCount: 15,
    color: 'red',
    slug: 'toys'
  },
  {
    id: '8',
    title: 'خوراکی و نوشیدنی',
    description: 'انواع خوراکی، شیرینی، نوشیدنی، خشکبار و محصولات غذایی',
    storeCount: 24,
    color: 'amber',
    slug: 'food'
  },
  {
    id: '9',
    title: 'ابزار و لوازم صنعتی',
    description: 'ابزارآلات، تجهیزات صنعتی، لوازم برقی و تعمیراتی',
    storeCount: 21,
    color: 'gray',
    slug: 'tools'
  }
]; 