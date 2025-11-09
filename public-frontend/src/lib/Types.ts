/**
 * تایپ‌های مشترک برای استفاده در پروژه
 */

// تایپ طبقه
export interface Floor {
  id: string;
  title: string;
  description: string;
  storeCount: number;
  color: string;
  slug: string;
  isVIP?: boolean;
}

// تایپ فروشگاه
export interface Store {
  id: string;
  name: string;
  description: string;
  logo: string;
  bannerImage: string;
  rating: number;
  reviewCount: number;
  floorId: string;
  floorName: string;
  plaque: string;
  slug: string;
  category: string;
  isVIP?: boolean;
  isAds?: boolean;
  followersCount?: number;
  showcaseCount?: number;
} 