'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowRight, FiArrowLeft, FiShoppingBag, FiLayout, FiMaximize2, FiCheck, FiGift, FiUserPlus } from 'react-icons/fi';
import Button from '@/components/ui/button/Button';
import Logo from '@/components/common/logo/Logo';
import StoreCategorySelect from '@/components/store/category/StoreCategorySelect';

// Removed unused PricingPlan type
// API bases (separate admin vs public)
const PUBLIC_API_BASE = process.env.NEXT_PUBLIC_PUBLIC_API_URL || '/api';
const THEME_DEMO_BASE = process.env.NEXT_PUBLIC_THEME_DEMO_BASE || 'https://themes.iranche.com/';

export default function StoreDetailsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [storeName, setStoreName] = useState('');
  const [storeNameEn, setStoreNameEn] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templates, setTemplates] = useState<Array<{ id: string; name: string; description?: string; image_url?: string; is_free?: boolean; demo_url?: string | null }>>([]);
  // Removed unused selectedFloor state
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBusinessType, setSelectedBusinessType] = useState('');
  const [area, setArea] = useState(10);
  const [error, setError] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [discountCode, setDiscountCode] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);
  const [appliedReferral, setAppliedReferral] = useState<number | null>(null);
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isCheckingSubdomain, setIsCheckingSubdomain] = useState(false);
  const [isSubdomainAvailable, setIsSubdomainAvailable] = useState<boolean | null>(null);
  const [subdomainMessage, setSubdomainMessage] = useState('');
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [progressBar, setProgressBar] = useState(0);
  const [progressSteps, setProgressSteps] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<{storeName: string, subdomain: string, adminUrl: string} | null>(null);

  // Calculate price based on area (10,000 per 10 square meters)
  const calculatePrice = (area: number) => {
    return Math.ceil(area / 10) * 10000;
  };

  const basePrice = calculatePrice(area);
  // Load templates from secure public API
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${PUBLIC_API_BASE}/public/themes`, { cache: 'no-store' });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json?.error || 'خطا در دریافت قالب‌ها');
        const items: Array<{ id?: number; slug?: string; name: string; description?: string; image_url?: string; is_free?: boolean; demo_url?: string | null }> = json?.data || [];
        const mapped = items.map((t) => ({ id: t.slug || String(t.id || ''), name: t.name, description: t.description, image_url: t.image_url, is_free: t.is_free, demo_url: t.demo_url || null }));
        setTemplates(mapped);
      } catch {
        setTemplates([{ id: 'iranche-default', name: 'قالب پیش‌فرض' }]);
      }
    })();
  }, []);

  const planFeatures = [
    'فروشگاه آنلاین',
    'پنل مدیریت',
    'پشتیبانی تلفنی',
    'گزارشات پیشرفته',
    'ابزارهای بازاریابی',
    'مدیریت موجودی پیشرفته',
    'پشتیبانی از چند فروشنده',
    'درگاه پرداخت'
  ];

  const handleNext = () => {
    setError('');
    
    if (step === 1) {
      if (!storeName || !storeNameEn || !subdomain || !selectedCategory || !selectedBusinessType || !ownerName || !ownerEmail || !adminPassword) {
        setError('لطفا تمام فیلدها را پر کنید');
        return;
      }
      
      // Validate subdomain structure
      const structureValidation = validateSubdomainStructure(subdomain);
      if (!structureValidation.isValid) {
        setError(structureValidation.message);
        return;
      }
      
      if (isSubdomainAvailable === false) {
        setError('زیردامنه انتخابی قبلاً ثبت شده است. لطفاً زیردامنه دیگری انتخاب کنید');
        return;
      }
      
      if (isCheckingSubdomain) {
        setError('در حال بررسی زیردامنه... لطفاً کمی صبر کنید');
        return;
      }
      
      if (isSubdomainAvailable === null && subdomain) {
        setError('لطفاً زیردامنه را بررسی کنید');
        return;
      }
      
      setStep(2);
    } else if (step === 2) {
      if (!selectedTemplate) {
        setError('لطفا یک قالب انتخاب کنید');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.push('/store/create');
    }
  };

  const handleApplyDiscount = () => {
    // Simulate discount validation
    if (discountCode === 'IRANCHE20') {
      setAppliedDiscount(20);
      setError('');
    } else {
      setError('کد تخفیف نامعتبر است');
    }
  };

  const handleApplyReferral = () => {
    // Simulate referral validation
    if (referralCode === 'FRIEND10') {
      setAppliedReferral(10);
      setError('');
    } else {
      setError('کد معرف نامعتبر است');
    }
  };

  const updateProgress = (text: string, progress: number, step: string) => {
    setProgressText(text);
    setProgressBar(progress);
    setProgressSteps(prev => [...prev, step]);
  };

  const handleSubmit = async () => {
    try {
      setError('');
      setLoading(true);
      setShowProgressModal(true);
      setProgressSteps([]);
      setProgressBar(0);
      
      // Step 1: Validating data
      updateProgress('در حال اعتبارسنجی اطلاعات...', 10, '✓ اعتبارسنجی اطلاعات');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Validate all required fields
      if (!storeName || !subdomain || !ownerName || !ownerEmail || !adminPassword) {
        throw new Error('لطفا تمام فیلدهای اجباری را پر کنید');
      }
      
      if (isSubdomainAvailable === false) {
        throw new Error('زیردامنه انتخابی قبلاً ثبت شده است');
      }
      
      if (isCheckingSubdomain) {
        throw new Error('در حال بررسی زیردامنه... لطفاً کمی صبر کنید');
      }
      
      const apiBase = '/api';
      // If later you need to call admin-only APIs from frontend, use ADMIN_API_BASE via a server route, not directly
      const payload = {
        subdomain,
        shop_name: storeName,
        shop_description: `${selectedCategory || ''} - ${selectedBusinessType || ''}`.trim(),
        owner_name: ownerName,
        owner_email: ownerEmail,
        owner_phone: undefined,
        admin_password: adminPassword,
        plan_type: 'basic',
        theme: selectedTemplate || 'iranche-default',
        plugins: [] as string[]
      };

      // Step 2: Creating database
      updateProgress('در حال ایجاد دیتابیس...', 20, '✓ ایجاد دیتابیس');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 3: Installing WordPress
      updateProgress('در حال نصب وردپرس...', 40, '✓ نصب وردپرس');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 4: Installing plugins
      updateProgress('در حال نصب افزونه‌ها...', 60, '✓ نصب افزونه‌ها');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 5: Configuring theme
      updateProgress('در حال پیکربندی قالب...', 80, '✓ پیکربندی قالب');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 6: Making API call
      updateProgress('در حال ارسال درخواست...', 90, '✓ ارسال درخواست');
      const res = await fetch(`${apiBase}/tenants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || data?.error || 'خطا در ایجاد فروشگاه');
      }

      // Step 7: Finalizing
      updateProgress('در حال تکمیل فرآیند...', 100, '✓ تکمیل فرآیند');
      await new Promise(resolve => setTimeout(resolve, 1000));

      const adminUrl = data?.data?.admin_url || `http://${subdomain}.localhost/wp-admin`;
      
      // Close progress modal and show success
      setShowProgressModal(false);
      setSuccessData({ storeName, subdomain, adminUrl });
      setShowSuccessModal(true);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'خطای ناشناخته رخ داد';
      setError(message);
      setShowProgressModal(false);
    } finally {
      setLoading(false);
    }
  };

  const validateSubdomainStructure = (value: string): { isValid: boolean; message: string } => {
    const clean = value.trim();
    
    if (!clean) {
      return { isValid: false, message: 'زیردامنه نمی‌تواند خالی باشد' };
    }
    
    if (clean.length < 3) {
      return { isValid: false, message: 'زیردامنه باید حداقل ۳ کاراکتر باشد' };
    }
    
    if (clean.length > 63) {
      return { isValid: false, message: 'زیردامنه نمی‌تواند بیش از ۶۳ کاراکتر باشد' };
    }
    
    if (!/^[a-z0-9-]+$/.test(clean)) {
      return { isValid: false, message: 'زیردامنه فقط می‌تواند شامل حروف کوچک، اعداد و خط تیره باشد' };
    }
    
    if (clean.startsWith('-') || clean.endsWith('-')) {
      return { isValid: false, message: 'زیردامنه نمی‌تواند با خط تیره شروع یا تمام شود' };
    }
    
    if (clean.includes('--')) {
      return { isValid: false, message: 'زیردامنه نمی‌تواند شامل خط تیره متوالی باشد' };
    }
    
    return { isValid: true, message: '' };
  };

  const checkSubdomainAvailability = async (value: string) => {
    const clean = (value || '').trim();
    setSubdomainMessage('');
    if (!clean) {
      setIsSubdomainAvailable(null);
      return;
    }
    
    // First validate structure
    const structureValidation = validateSubdomainStructure(clean);
    if (!structureValidation.isValid) {
      setIsSubdomainAvailable(false);
      setSubdomainMessage(structureValidation.message);
      return;
    }
    
    try {
      setIsCheckingSubdomain(true);
      const res = await fetch(`/api/tenants?check=subdomain&value=${encodeURIComponent(clean)}`, { cache: 'no-store' });
      const data: { success?: boolean; data?: { isAvailable?: boolean; message?: string } } = await res.json();
      const available = data?.data?.isAvailable;
      setIsSubdomainAvailable(Boolean(available));
      setSubdomainMessage(data?.data?.message || (available ? 'زیردامنه قابل استفاده است' : 'زیردامنه قبلاً گرفته شده است'));
    } catch (error) {
      console.error('Subdomain check error:', error);
      setIsSubdomainAvailable(null);
      setSubdomainMessage('خطا در بررسی زیردامنه');
    } finally {
      setIsCheckingSubdomain(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-gray-700 mb-8">
          <h1 className="text-2xl font-bold text-white text-center mb-6">
            اطلاعات فروشگاه
          </h1>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}
          
          {/* Progress indicator */}
          <div className="flex justify-between mb-8">
            <div className={`h-1 flex-1 rounded-l-lg ${step >= 1 ? 'bg-primary-500' : 'bg-gray-700'}`}></div>
            <div className={`h-1 flex-1 ${step >= 2 ? 'bg-primary-500' : 'bg-gray-700'}`}></div>
            <div className={`h-1 flex-1 ${step >= 3 ? 'bg-primary-500' : 'bg-gray-700'}`}></div>
            <div className={`h-1 flex-1 rounded-r-lg ${step >= 4 ? 'bg-primary-500' : 'bg-gray-700'}`}></div>
          </div>
          
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">اطلاعات پایه فروشگاه</h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="storeName" className="block text-gray-300 mb-2 text-sm">
                    نام فروشگاه
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FiShoppingBag className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="storeName"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full bg-white/5 border border-gray-700 rounded-lg px-4 py-3 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="نام فروشگاه خود را وارد کنید"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="storeNameEn" className="block text-gray-300 mb-2 text-sm">
                    نام انگلیسی فروشگاه
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FiShoppingBag className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="storeNameEn"
                      value={storeNameEn}
                      onChange={(e) => setStoreNameEn(e.target.value)}
                      className="w-full bg-white/5 border border-gray-700 rounded-lg px-4 py-3 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="نام انگلیسی فروشگاه خود را وارد کنید"
                      dir="ltr"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subdomain" className="block text-gray-300 mb-2 text-sm">
                    زیر دامنه فروشگاه
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="subdomain"
                      defaultValue={subdomain}
                      onChange={(e) => { 
                        const value = e.target.value.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
                        setSubdomain(value);
                        setIsSubdomainAvailable(null);
                        setSubdomainMessage('');
                      }}
                      onBlur={() => checkSubdomainAvailability(subdomain)}
                      className="flex-1 bg-white/5 border border-gray-700 rounded-r-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="shop-name"
                      dir="ltr"
                      required
                    />
                    <span className="px-3 py-3 bg-gray-800 border border-l-0 border-gray-700 rounded-l-lg text-gray-400 text-sm">
                      .localhost
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500">
                      آدرس فروشگاه شما: {subdomain ? `${subdomain}.localhost` : 'your-store.localhost'}
                    </p>
                    {isCheckingSubdomain && (
                      <p className="text-xs text-gray-400">در حال بررسی زیردامنه...</p>
                    )}
                    {subdomainMessage && (
                      <p className={`text-xs ${isSubdomainAvailable ? 'text-green-400' : 'text-red-400'}`}>
                        {subdomainMessage}
                      </p>
                    )}
                  </div>
                </div>

                <StoreCategorySelect
                  selectedCategory={selectedCategory}
                  selectedBusinessType={selectedBusinessType}
                  onCategoryChange={setSelectedCategory}
                  onBusinessTypeChange={setSelectedBusinessType}
                />

                <div>
                  <label htmlFor="ownerName" className="block text-gray-300 mb-2 text-sm">
                    نام مالک
                  </label>
                  <input
                    type="text"
                    id="ownerName"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full bg-white/5 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="نام و نام خانوادگی مالک"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="ownerEmail" className="block text-gray-300 mb-2 text-sm">
                    ایمیل مالک
                  </label>
                  <input
                    type="email"
                    id="ownerEmail"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    className="w-full bg-white/5 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="owner@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="adminPassword" className="block text-gray-300 mb-2 text-sm">
                    رمز عبور ادمین وردپرس
                  </label>
                  <input
                    type="password"
                    id="adminPassword"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-white/5 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="رمز عبور برای ورود به پنل ادمین"
                    required
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Template Selection */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">انتخاب قالب فروشگاه</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <div 
                    key={template.id}
                    className={`bg-white/5 rounded-lg p-4 border cursor-pointer transition-all ${
                      selectedTemplate === template.id 
                        ? 'border-primary-500 ring-2 ring-primary-500' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="relative aspect-square bg-gray-800 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                      {template.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={template.image_url} alt={template.name} className="w-full h-full object-cover" />
                      ) : (
                        <FiLayout className="w-12 h-12 text-gray-600" />
                      )}
                      {template.is_free && (
                        <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                          رایگان!
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{template.name}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{template.description}</p>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        className="px-3 py-1.5 text-xs rounded-md bg-primary-600 hover:bg-primary-500 text-white transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTemplate(template.id);
                        }}
                      >
                        انتخاب قالب
                      </button>
                      <button
                        type="button"
                        className={`px-3 py-1.5 text-xs rounded-md border ${THEME_DEMO_BASE ? 'border-gray-600 text-gray-200 hover:bg-white/5' : 'border-gray-800 text-gray-500 cursor-not-allowed'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          const target = template.demo_url ? template.demo_url : (THEME_DEMO_BASE ? `${THEME_DEMO_BASE}${template.id}` : '');
                          if (!target) return;
                          window.open(target, '_blank');
                        }}
                        disabled={!template.demo_url && !THEME_DEMO_BASE}
                      >
                        مشاهده دمو
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Step 3: Location and Area */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">موقعیت و متراژ فروشگاه</h2>
              
              <div className="space-y-6">
              
                
                <div>
                  <label htmlFor="area" className="block text-gray-300 mb-2 text-sm">
                    متراژ فروشگاه (متر مربع)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FiMaximize2 className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="area"
                      value={area}
                      onChange={(e) => setArea(Math.max(10, parseInt(e.target.value) || 10))}
                      className="w-full bg-white/5 border border-gray-700 rounded-lg px-4 py-3 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                      min="10"
                      step="10"
                      required
                    />
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500">
                      هزینه: {basePrice.toLocaleString()} تومان (هر ۱۰ متر مربع ۱۰,۰۰۰ تومان)
                    </p>
                    <p className="text-xs text-secondary-400 flex items-center">
                      <FiShoppingBag className="ml-1" />
                      هر ۱ متر مربع برابر با ۱۰ محصول
                    </p>
                    <p className="text-xs text-secondary-400">
                      تعداد کل محصولات مجاز: {area * 10} محصول
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Pricing and Payment */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">انتخاب پلن قیمت‌گذاری</h2>
              
              <div className="mb-6">
                <div className="flex justify-center space-x-4 mb-6">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      billingCycle === 'monthly'
                        ? 'bg-secondary-500 text-white shadow-lg shadow-secondary-500/30'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    پرداخت ماهانه
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      billingCycle === 'yearly'
                        ? 'bg-secondary-500 text-white shadow-lg shadow-secondary-500/30'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    پرداخت سالانه (20% تخفیف)
                  </button>
                </div>

                <div className="max-w-lg mx-auto">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-secondary-500 shadow-xl shadow-secondary-500/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-secondary-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      پلن استاندارد
                    </div>
                    
                    <div className="mb-6 mt-4">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-white">
                          {basePrice.toLocaleString()}
                        </span>
                        <span className="text-gray-400 mr-2"> تومان</span>
                        <span className="text-gray-400 text-sm">
                          {billingCycle === 'monthly' ? ' / ماه' : ' / سال'}
                        </span>
                      </div>
                      
                      {billingCycle === 'yearly' && (
                        <div className="text-center mt-2">
                          <span className="bg-green-500/20 text-green-400 text-sm px-3 py-1 rounded-full">
                            <FiGift className="inline-block ml-1" />
                            20% تخفیف
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4 mb-6">
                      <h4 className="text-white font-bold mb-3 flex items-center">
                        <FiCheck className="text-secondary-500 mr-2" />
                        تمام امکانات شامل می‌شود
                      </h4>
                      <ul className="space-y-3">
                        {planFeatures.map((feature, index) => (
                          <li key={index} className="flex items-center text-gray-300">
                            <FiCheck className="text-secondary-500 mr-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="text-center">
                      <Button
                        variant="secondary"
                        size="lg"
                        className="w-full flex justify-center"
                        onClick={handleSubmit}
                      >
                       تایید 
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <FiGift className="text-secondary-500 mr-2" />
                    کد تخفیف
                  </h3>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="کد تخفیف خود را وارد کنید"
                      className="flex-1 bg-white/5 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                    />
                    <Button
                      variant="secondary"
                      onClick={handleApplyDiscount}
                      className={!discountCode || !!appliedDiscount ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      اعمال تخفیف
                    </Button>
                  </div>
                  {appliedDiscount && (
                    <div className="mt-2 text-green-400 flex items-center">
                      <FiCheck className="mr-1" />
                      {appliedDiscount}% تخفیف اعمال شد
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <FiUserPlus className="text-secondary-500 mr-2" />
                    کد معرف
                  </h3>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      placeholder="کد معرف خود را وارد کنید"
                      className="flex-1 bg-white/5 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                    />
                    <Button
                      variant="secondary"
                      onClick={handleApplyReferral}
                      className={!referralCode || !!appliedReferral ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      اعمال معرف
                    </Button>
                  </div>
                  {appliedReferral && (
                    <div className="mt-2 text-green-400 flex items-center">
                      <FiCheck className="mr-1" />
                      {appliedReferral}% تخفیف معرف اعمال شد
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={handleBack}
            >
              <div className="flex items-center justify-center gap-2">
                <FiArrowRight/>
                <span>{step === 1 ? 'بازگشت' : 'مرحله قبل'}</span>
              </div>
            </Button>
            
            <Button
              type="button"
              variant="primary"
              size="lg"
              className={`${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={loading ? undefined : handleNext}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  <span>در حال پردازش...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>{step === 4 ? 'تکمیل ثبت نام' : 'مرحله بعد'}</span>
                  <FiArrowLeft />
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Modal */}
      {showProgressModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50" dir="rtl">
          <div className="relative top-20 mx-auto p-6 border border-gray-700 w-full max-w-md shadow-2xl rounded-lg bg-white/5 backdrop-blur-sm">
            <div className="text-center">
              <div className="mb-6">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto"></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">در حال ایجاد فروشگاه...</h3>
              <p className="text-sm text-gray-300 mb-6">{progressText}</p>
              
              <div className="w-full bg-gray-700 rounded-full h-3 mb-6">
                <div 
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${progressBar}%` }}
                ></div>
              </div>
              
              <div className="text-right text-sm space-y-3">
                {progressSteps.map((step, index) => (
                  <div key={index} className="flex items-center justify-start bg-white/5 rounded-lg p-3 border border-gray-700">
                    <div className="w-2 h-2 bg-green-400 rounded-full ml-3"></div>
                    <span className="text-green-400">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && successData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50" dir="rtl">
          <div className="relative top-20 mx-auto p-6 border border-gray-700 w-full max-w-md shadow-2xl rounded-lg bg-white/5 backdrop-blur-sm">
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <FiCheck className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">فروشگاه با موفقیت ساخته شد!</h3>
              <p className="text-sm text-gray-300 mb-6">
                فروشگاه &quot;{successData.storeName}&quot; آماده استفاده است
              </p>
              
              <div className="bg-white/5 rounded-lg p-4 mb-6 border border-gray-700">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">آدرس فروشگاه:</span>
                    <a 
                      href={`http://${successData.subdomain}.localhost`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300"
                    >
                      {successData.subdomain}.localhost
                    </a>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">پنل مدیریت:</span>
                    <a 
                      href={successData.adminUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary-400 hover:text-secondary-300"
                    >
                      ورود به پنل
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1"
                >
                  بستن
                </Button>
                <Button
                  variant="primary"
                  onClick={() => window.location.href = successData.adminUrl}
                  className="flex-1"
                >
                  ورود به پنل مدیریت
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 