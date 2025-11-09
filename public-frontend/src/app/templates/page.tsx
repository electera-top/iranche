'use client';

import { useState, useEffect } from 'react';
import { FiFilter, FiGrid, FiList, FiArrowRight } from 'react-icons/fi';
import Button from '@/components/ui/button/Button';
import CustomSelect, { SelectOption } from '@/components/ui/select/Select';
import TemplateBox, { Template } from '@/components/templates/TemplateBox';
import TemplatePreviewModal from '@/components/templates/TemplatePreviewModal';
import { AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header/Header';

// Mock templates data
const mockTemplates: Template[] = [
  {
    id: '1',
    title: 'مینیمال شاپ',
    thumbnail: '/images/themes/theme-1.jpg',
    isPremium: false,
    price: 0,
    category: 'فروشگاهی',
    rating: 4.7,
    downloads: 2345,
    createdAt: '1402/06/12',
    creator: {
      id: 'c1',
      name: 'استودیو طراحی نوین',
      avatar: '/avatars/creator1.jpg',
      rating: 4.8,
      totalTemplates: 24
    },
    tags: ['مینیمال', 'مدرن', 'ریسپانسیو'],
    description: 'قالبی مینیمال و مدرن برای فروشگاه‌های آنلاین با تمرکز بر تجربه کاربری عالی'
  },
  {
    id: '2',
    title: 'سوپر استور',
    thumbnail: '/images/themes/theme-2.jpg',
    isPremium: true,
    price: 380000,
    category: 'فروشگاهی',
    rating: 4.9,
    downloads: 1890,
    createdAt: '1402/08/05',
    creator: {
      id: 'c2',
      name: 'دیجیتال دیزاینرز',
      avatar: '/avatars/creator2.jpg',
      rating: 4.9,
      totalTemplates: 38
    },
    tags: ['فروشگاهی', 'چندمنظوره', 'حرفه‌ای'],
    description: 'قالبی کامل و حرفه‌ای برای فروشگاه‌های بزرگ با امکانات پیشرفته'
  },
  {
    id: '3',
    title: 'آرت گالری',
    thumbnail: '/images/themes/theme-3.jpg',
    isPremium: true,
    price: 290000,
    category: 'گالری',
    rating: 4.5,
    downloads: 1245,
    createdAt: '1402/07/18',
    creator: {
      id: 'c1',
      name: 'استودیو طراحی نوین',
      avatar: '/avatars/creator1.jpg',
      rating: 4.8,
      totalTemplates: 24
    },
    tags: ['هنری', 'گالری', 'خلاقانه'],
    description: 'قالبی ایده‌آل برای نمایش آثار هنری و محصولات خلاقانه با طراحی چشم‌نواز'
  },
  {
    id: '4',
    title: 'فشن پرو',
    thumbnail: '/images/themes/theme-4.png',
    isPremium: true,
    price: 450000,
    category: 'فشن',
    rating: 4.8,
    downloads: 1678,
    createdAt: '1402/09/01',
    creator: {
      id: 'c3',
      name: 'وب‌مستران پیشرو',
      avatar: '/avatars/creator3.jpg',
      rating: 4.7,
      totalTemplates: 19
    },
    tags: ['مد', 'لباس', 'لاکچری'],
    description: 'قالبی اختصاصی برای فروشگاه‌های مد و پوشاک با ظاهری لوکس و شیک'
  },
  {
    id: '5',
    title: 'تک استور',
    thumbnail: '/images/themes/theme-5.jpg',
    isPremium: false,
    price: 0,
    category: 'الکترونیک',
    rating: 4.4,
    downloads: 2130,
    createdAt: '1402/05/20',
    creator: {
      id: 'c2',
      name: 'دیجیتال دیزاینرز',
      avatar: '/avatars/creator2.jpg',
      rating: 4.9,
      totalTemplates: 38
    },
    tags: ['الکترونیک', 'گجت', 'دیجیتال'],
    description: 'قالبی مناسب برای فروشگاه‌های محصولات الکترونیکی و دیجیتال'
  },
  {
    id: '6',
    title: 'فودلند',
    thumbnail: '/images/themes/theme-6.jpg',
    isPremium: true,
    price: 320000,
    category: 'غذا',
    rating: 4.6,
    downloads: 980,
    createdAt: '1402/08/25',
    creator: {
      id: 'c3',
      name: 'وب‌مستران پیشرو',
      avatar: '/avatars/creator3.jpg',
      rating: 4.7,
      totalTemplates: 19
    },
    tags: ['غذا', 'رستوران', 'کافه'],
    description: 'قالبی جذاب برای رستوران‌ها، کافه‌ها و فروشگاه‌های مواد غذایی'
  }
];

// Categories for filtering
const categories = ['همه', 'فروشگاهی', 'گالری', 'فشن', 'الکترونیک', 'غذا', 'دکوراسیون', 'زیبایی'];

// Create category options for Select component
const categoryOptions: SelectOption[] = categories.map(category => ({
  value: category,
  label: category
}));

// Create premium filter options
const premiumOptions: SelectOption[] = [
  { value: 'all', label: 'همه قالب‌ها' },
  { value: 'free', label: 'فقط رایگان' },
  { value: 'premium', label: 'فقط پرمیوم' }
];

// Create sort options
const sortOptions: SelectOption[] = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'popular', label: 'محبوب‌ترین' },
  { value: 'price', label: 'قیمت (کم به زیاد)' }
];

// Create a new useState hook for preview modal
export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<SelectOption>(categoryOptions[0]);
  const [filterPremium, setFilterPremium] = useState<SelectOption>(premiumOptions[0]);
  const [sortBy, setSortBy] = useState<SelectOption>(sortOptions[0]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  // Ensure content rendering
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Filter templates based on category and premium status
  useEffect(() => {
    let filtered = [...mockTemplates];
    
    // Filter by category
    if (selectedCategory && selectedCategory.value !== 'همه') {
      filtered = filtered.filter(template => template.category === selectedCategory.value);
    }
    
    // Filter by premium status
    if (filterPremium && filterPremium.value === 'free') {
      filtered = filtered.filter(template => !template.isPremium);
    } else if (filterPremium && filterPremium.value === 'premium') {
      filtered = filtered.filter(template => template.isPremium);
    }
    
    // Sort templates
    if (sortBy) {
      switch (sortBy.value) {
        case 'newest':
          filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'popular':
          filtered.sort((a, b) => b.downloads - a.downloads);
          break;
        case 'price':
          filtered.sort((a, b) => a.price - b.price);
          break;
      }
    }
    
    setTemplates(filtered);
  }, [selectedCategory, filterPremium, sortBy]);

  // Function to handle preview
  const handlePreview = (template: Template) => {
    setPreviewTemplate(template);
  };

  // Function to close preview
  const closePreview = () => {
    setPreviewTemplate(null);
  };

  // Show loading until page is ready
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center p-12 min-h-[500px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-500/30 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-blue-500/30 rounded"></div>
        </div>
      </div>
    );
  }

  return (
   <div>
    <Header />
 <div className="container mx-auto px-4 py-8">
        
        {/* Page header */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-900 to-primary-950 p-6 mb-8 border border-primary-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white mb-3">قالب‌های فروشگاهی</h1>
            <p className="text-gray-300 mb-2">مجموعه‌ای از بهترین قالب‌های فروشگاهی برای کسب و کار شما</p>
            <p className="text-gray-400 text-sm">با استفاده از این قالب‌ها می‌توانید در کمترین زمان ممکن فروشگاه آنلاین خود را راه‌اندازی کنید.</p>
          </div>
        </div>
        
        {/* Filter and sorting bar */}
        <div className="bg-gradient-to-br from-primary-800/70 to-primary-900/90 rounded-xl border border-primary-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex items-center flex-wrap gap-2">
              <div className="flex items-center bg-primary-950/60 rounded-lg p-1 border border-primary-700/50">
                <button 
                  onClick={() => setDisplayMode('grid')} 
                  className={`p-2 rounded-md ${displayMode === 'grid' ? 'bg-secondary text-primary-950' : 'text-gray-300'}`}
                >
                  <FiGrid />
                </button>
                <button 
                  onClick={() => setDisplayMode('list')} 
                  className={`p-2 rounded-md ${displayMode === 'list' ? 'bg-secondary text-primary-950' : 'text-gray-300'}`}
                >
                  <FiList />
                </button>
              </div>
              
              <div className="w-44">
                <CustomSelect
                  options={categoryOptions}
                  value={selectedCategory}
                  onChange={(option) => setSelectedCategory(option as SelectOption)}
                  placeholder="انتخاب دسته‌بندی"
                  variant="dark"
                  size="sm"
                />
              </div>
              
              <div className="w-44">
                <CustomSelect
                  options={premiumOptions}
                  value={filterPremium}
                  onChange={(option) => setFilterPremium(option as SelectOption)}
                  placeholder="فیلتر قیمت"
                  variant="dark"
                  size="sm"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center text-gray-300 ml-2">
                <FiFilter className="ml-1" /> مرتب‌سازی:
              </div>
              <div className="w-44">
                <CustomSelect
                  options={sortOptions}
                  value={sortBy}
                  onChange={(option) => setSortBy(option as SelectOption)}
                  placeholder="مرتب‌سازی بر اساس"
                  variant="dark"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Templates grid view */}
        {templates.length === 0 ? (
          <div className="bg-primary-800/50 rounded-xl p-12 text-center">
            <div className="text-white mb-4 text-xl">نتیجه‌ای یافت نشد</div>
            <p className="text-gray-400">لطفاً معیارهای جستجوی خود را تغییر دهید.</p>
          </div>
        ) : displayMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {templates.map((template) => (
              <TemplateBox 
                key={template.id}
                template={template}
                displayMode="grid"
                onPreview={handlePreview}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {templates.map((template) => (
              <TemplateBox 
                key={template.id}
                template={template}
                displayMode="list"
                onPreview={handlePreview}
              />
            ))}
          </div>
        )}
        
        {/* Load more button */}
        {templates.length > 0 && (
          <div className="mt-8 text-center">
            <Button
              variant="outline-secondary"
              className="border border-primary-700/50 text-white hover:bg-primary-800/50 inline-flex items-center"
            >
              نمایش قالب‌های بیشتر
              <FiArrowRight className="mr-2" />
            </Button>
          </div>
        )}
        
        {/* Seller CTA Box - Compact & Luxurious */}
        <div className="mt-16 mb-8 overflow-hidden relative rounded-xl bg-primary-800 shadow-lg">
          
          <div className="relative flex items-center gap-4 p-6">
            {/* Left side - Image */}
            <div className="mr-5 hidden md:block">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-secondary/30 shadow-lg shadow-secondary/20">
                  <img 
                    src="/images/seller-icon.png" 
                    alt="طراح" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-secondary flex items-center justify-center shadow-lg">
                  <span className="text-primary-950 text-xs font-bold">+</span>
                </div>
              </div>
            </div>
            
            {/* Right side - Content */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row justify-between  items-start md:items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    <span className="text-secondary">طراح هستید؟</span> به تیم ما بپیوندید
                  </h3>
                  <p className="text-gray-300 text-sm mb-0 md:mb-0">
                    ۸۰٪ سهم از فروش + دسترسی به بیش از ۱۰۰ هزار کاربر فعال
                  </p>
                </div>
                
                <div className="mt-4 md:mt-0">
                  <Button
                    variant="secondary"
                    className="rounded-full bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary hover:to-secondary text-primary-950 font-bold text-sm px-6 py-2.5 shadow-xl shadow-secondary/20"
                  >
                    ثبت‌نام فروشندگان
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-secondary/10 blur-3xl rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full"></div>
          </div>
        </div>
        
        {/* Preview Modal */}
        <AnimatePresence mode="wait">
          {previewTemplate && (
            <TemplatePreviewModal 
              key="modal"
              template={previewTemplate}
              onClose={closePreview}
            />
          )}
        </AnimatePresence>
        
        <style jsx global>{`
          select option {
            background-color: #0f172a; /* primary-900 */
            color: white;
          }
        `}</style>
      </div>

   </div>
  );
} 