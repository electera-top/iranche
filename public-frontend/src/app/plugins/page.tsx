'use client';

import { useState, useEffect } from 'react';
import { FiFilter, FiGrid, FiList, FiArrowRight } from 'react-icons/fi';
import Button from '@/components/ui/button/Button';
import CustomSelect, { SelectOption } from '@/components/ui/select/Select';
import TemplateBox, { Template } from '@/components/templates/TemplateBox';
import TemplatePreviewModal from '@/components/templates/TemplatePreviewModal';
import { AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header/Header';

// Mock plugins data using Template interface
const mockPlugins: Template[] = [
  {
    id: '1',
    title: 'اسلایدر پیشرفته',
    thumbnail: '/images/plugins/plugin-1.jpg',
    isPremium: false,
    price: 0,
    category: 'اسلایدر',
    rating: 4.7,
    downloads: 3245,
    createdAt: '1402/08/12',
    creator: {
      id: 'c1',
      name: 'توسعه دهندگان پیشرو',
      avatar: '/avatars/creator1.jpg',
      rating: 4.8,
      totalTemplates: 18
    },
    tags: ['اسلایدر', 'انیمیشن', 'ریسپانسیو'],
    description: 'افزونه اسلایدر پیشرفته با امکانات متنوع و قابلیت شخصی‌سازی بالا'
  },
  {
    id: '2',
    title: 'بلاک پست ویژه',
    thumbnail: '/images/plugins/plugin-2.jpg',
    isPremium: true,
    price: 190000,
    category: 'محتوا',
    rating: 4.9,
    downloads: 2190,
    createdAt: '1402/09/05',
    creator: {
      id: 'c2',
      name: 'کد نویسان خلاق',
      avatar: '/avatars/creator2.jpg',
      rating: 4.9,
      totalTemplates: 25
    },
    tags: ['محتوا', 'وبلاگ', 'پست'],
    description: 'نمایش پست‌های وبلاگ به صورت بلاک‌های جذاب با امکان شخصی‌سازی'
  },
  {
    id: '3',
    title: 'فرم تماس حرفه‌ای',
    thumbnail: '/images/plugins/plugin-3.jpg',
    isPremium: true,
    price: 250000,
    category: 'فرم',
    rating: 4.6,
    downloads: 1845,
    createdAt: '1402/07/18',
    creator: {
      id: 'c1',
      name: 'توسعه دهندگان پیشرو',
      avatar: '/avatars/creator1.jpg',
      rating: 4.8,
      totalTemplates: 18
    },
    tags: ['فرم', 'تماس', 'ولیدیشن'],
    description: 'افزونه فرم تماس با قابلیت اعتبارسنجی و ارسال ایمیل و پیامک'
  },
  {
    id: '4',
    title: 'گالری محصولات',
    thumbnail: '/images/plugins/plugin-4.jpg',
    isPremium: true,
    price: 320000,
    category: 'گالری',
    rating: 4.8,
    downloads: 1278,
    createdAt: '1402/09/10',
    creator: {
      id: 'c3',
      name: 'آرتیست وب',
      avatar: '/avatars/creator3.jpg',
      rating: 4.7,
      totalTemplates: 12
    },
    tags: ['گالری', 'محصولات', 'نمایش'],
    description: 'نمایش محصولات به صورت گالری جذاب با فیلترهای پیشرفته'
  },
  {
    id: '5',
    title: 'فیلتر محصولات پیشرفته',
    thumbnail: '/images/plugins/plugin-5.jpg',
    isPremium: false,
    price: 0,
    category: 'فیلتر',
    rating: 4.4,
    downloads: 2430,
    createdAt: '1402/06/20',
    creator: {
      id: 'c2',
      name: 'کد نویسان خلاق',
      avatar: '/avatars/creator2.jpg',
      rating: 4.9,
      totalTemplates: 25
    },
    tags: ['فیلتر', 'جستجو', 'دسته‌بندی'],
    description: 'افزونه فیلتر پیشرفته محصولات با امکان جستجو و فیلتر چندبعدی'
  },
  {
    id: '6',
    title: 'نقشه تعاملی',
    thumbnail: '/images/plugins/plugin-6.jpg',
    isPremium: true,
    price: 280000,
    category: 'نقشه',
    rating: 4.6,
    downloads: 980,
    createdAt: '1402/08/25',
    creator: {
      id: 'c3',
      name: 'آرتیست وب',
      avatar: '/avatars/creator3.jpg',
      rating: 4.7,
      totalTemplates: 12
    },
    tags: ['نقشه', 'مکان', 'تعاملی'],
    description: 'نمایش نقشه تعاملی با قابلیت نشانه‌گذاری و مسیریابی'
  }
];

// Categories for filtering
const categories = ['همه', 'اسلایدر', 'محتوا', 'فرم', 'گالری', 'فیلتر', 'نقشه', 'امنیتی', 'فروشگاهی'];

// Create category options for Select component
const categoryOptions: SelectOption[] = categories.map(category => ({
  value: category,
  label: category
}));

// Create premium filter options
const premiumOptions: SelectOption[] = [
  { value: 'all', label: 'همه افزونه‌ها' },
  { value: 'free', label: 'فقط رایگان' },
  { value: 'premium', label: 'فقط پرمیوم' }
];

// Create sort options
const sortOptions: SelectOption[] = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'popular', label: 'محبوب‌ترین' },
  { value: 'price', label: 'قیمت (کم به زیاد)' }
];

export default function PluginsPage() {
  const [plugins, setPlugins] = useState<Template[]>(mockPlugins);
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<SelectOption>(categoryOptions[0]);
  const [filterPremium, setFilterPremium] = useState<SelectOption>(premiumOptions[0]);
  const [sortBy, setSortBy] = useState<SelectOption>(sortOptions[0]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [previewPlugin, setPreviewPlugin] = useState<Template | null>(null);

  // Ensure content rendering
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Filter plugins based on category and premium status
  useEffect(() => {
    let filtered = [...mockPlugins];
    
    // Filter by category
    if (selectedCategory && selectedCategory.value !== 'همه') {
      filtered = filtered.filter(plugin => plugin.category === selectedCategory.value);
    }
    
    // Filter by premium status
    if (filterPremium && filterPremium.value === 'free') {
      filtered = filtered.filter(plugin => !plugin.isPremium);
    } else if (filterPremium && filterPremium.value === 'premium') {
      filtered = filtered.filter(plugin => plugin.isPremium);
    }
    
    // Sort plugins
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
    
    setPlugins(filtered);
  }, [selectedCategory, filterPremium, sortBy]);

  // Function to handle preview
  const handlePreview = (plugin: Template) => {
    setPreviewPlugin(plugin);
  };

  // Function to close preview
  const closePreview = () => {
    setPreviewPlugin(null);
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
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary-900 via-primary-900/95 to-primary-950 p-6 mb-8 border border-primary-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary/5 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white mb-3">افزونه‌های کاربردی</h1>
            <p className="text-gray-300 mb-2">مجموعه‌ای از بهترین افزونه‌ها برای ارتقای وب‌سایت شما</p>
            <p className="text-gray-400 text-sm">افزونه‌های ما با تمام قالب‌های ایرانچه سازگار هستند و به راحتی قابل نصب و استفاده می‌باشند.</p>
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
        
        {/* Plugins grid view */}
        {plugins.length === 0 ? (
          <div className="bg-primary-800/50 rounded-xl p-12 text-center">
            <div className="text-white mb-4 text-xl">نتیجه‌ای یافت نشد</div>
            <p className="text-gray-400">لطفاً معیارهای جستجوی خود را تغییر دهید.</p>
          </div>
        ) : displayMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {plugins.map((plugin) => (
              <TemplateBox 
                key={plugin.id}
                template={plugin}
                displayMode="grid"
                onPreview={handlePreview}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {plugins.map((plugin) => (
              <TemplateBox 
                key={plugin.id}
                template={plugin}
                displayMode="list"
                onPreview={handlePreview}
              />
            ))}
          </div>
        )}
        
        {/* Load more button */}
        {plugins.length > 0 && (
          <div className="mt-8 text-center">
            <Button
              variant="outline-secondary"
              className="border border-primary-700/50 text-white hover:bg-primary-800/50 inline-flex items-center"
            >
              نمایش افزونه‌های بیشتر
              <FiArrowRight className="mr-2" />
            </Button>
          </div>
        )}
        
        {/* Developer CTA Box */}
        <div className="mt-16 mb-8 overflow-hidden relative rounded-xl bg-black border border-purple-500/20 shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-primary-950/90 to-black"></div>
          
          <div className="relative flex items-center p-6">
            {/* Left side - Image */}
            <div className="mr-5 hidden md:block">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-purple-500/30 shadow-lg shadow-purple-500/20">
                  <img 
                    src="/images/developer-icon.png" 
                    alt="توسعه دهنده" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-bold">+</span>
                </div>
              </div>
            </div>
            
            {/* Right side - Content */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    <span className="text-purple-400">توسعه‌دهنده هستید؟</span> با ما همکاری کنید
                  </h3>
                  <p className="text-gray-300 text-sm mb-0 md:mb-0">
                    ۸۰٪ سهم از فروش + دسترسی به ابزارهای توسعه اختصاصی ایرانچه
                  </p>
                </div>
                
                <div className="mt-4 md:mt-0">
                  <Button
                    variant="secondary"
                    className="rounded-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold text-sm px-6 py-2.5 shadow-xl shadow-purple-500/20"
                  >
                    ثبت‌نام توسعه‌دهندگان
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full"></div>
          </div>
        </div>
        
        {/* Preview Modal */}
        <AnimatePresence mode="wait">
          {previewPlugin && (
            <TemplatePreviewModal 
              key="modal"
              template={previewPlugin}
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