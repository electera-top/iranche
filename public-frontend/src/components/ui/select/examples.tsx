import React from 'react';
import { FiUser, FiHome, FiShoppingBag, FiSettings } from 'react-icons/fi';
import CustomSelect, { SelectOption } from './Select';

// مثال گزینه‌های سلکت به همراه آیکون
const options: SelectOption[] = [
  { value: 'profile', label: 'پروفایل', icon: <FiUser /> },
  { value: 'dashboard', label: 'داشبورد', icon: <FiHome /> },
  { value: 'products', label: 'محصولات', icon: <FiShoppingBag /> },
  { value: 'settings', label: 'تنظیمات', icon: <FiSettings /> },
];

// مثال گزینه‌های دسته‌بندی
const categoryOptions: SelectOption[] = [
  { value: 'all', label: 'همه دسته‌بندی‌ها' },
  { value: 'electronics', label: 'الکترونیک' },
  { value: 'clothing', label: 'پوشاک' },
  { value: 'books', label: 'کتاب' },
  { value: 'home', label: 'خانه و آشپزخانه' },
];

// گزینه‌های رنگی
const colorOptions: SelectOption[] = [
  { value: 'red', label: 'قرمز', color: '#ef4444' },
  { value: 'blue', label: 'آبی', color: '#3b82f6' },
  { value: 'green', label: 'سبز', color: '#22c55e' },
  { value: 'yellow', label: 'زرد', color: '#eab308' },
  { value: 'purple', label: 'بنفش', color: '#a855f7' },
];

// مثال استفاده از سلکت با انواع مختلف
export const SelectExamples: React.FC = () => {
  const [selectedOption, setSelectedOption] = React.useState<SelectOption | null>(null);
  const [multiSelected, setMultiSelected] = React.useState<SelectOption[]>([]);
  const [darkSelected, setDarkSelected] = React.useState<SelectOption | null>(null);
  
  return (
    <div className="space-y-8 p-4">
      <h1 className="text-2xl font-bold mb-6">مثال‌های استفاده از کامپوننت سلکت</h1>
      
      {/* مثال سلکت معمولی */}
      <div>
        <h2 className="text-lg font-semibold mb-3">سلکت ساده</h2>
        <CustomSelect 
          options={categoryOptions}
          placeholder="یک دسته‌بندی انتخاب کنید"
          isClearable
          value={selectedOption}
          onChange={(option) => setSelectedOption(option as SelectOption)}
          label="دسته‌بندی"
          hint="یک دسته‌بندی را برای محصول انتخاب کنید"
        />
      </div>
      
      {/* مثال سلکت با آیکون */}
      <div>
        <h2 className="text-lg font-semibold mb-3">سلکت با آیکون</h2>
        <CustomSelect 
          options={options}
          placeholder="یک گزینه انتخاب کنید"
          value={selectedOption}
          onChange={(option) => setSelectedOption(option as SelectOption)}
          label="منو"
          variant="primary"
          hasIcon
          icon={<FiSettings />}
        />
      </div>
      
      {/* مثال سلکت چند انتخابی */}
      <div>
        <h2 className="text-lg font-semibold mb-3">سلکت چند انتخابی</h2>
        <CustomSelect 
          options={colorOptions}
          placeholder="چند رنگ انتخاب کنید"
          isMulti
          closeMenuOnSelect={false}
          value={multiSelected}
          onChange={(selected) => setMultiSelected(selected as SelectOption[])}
          label="رنگ‌ها"
          variant="secondary"
          fullWidth
        />
      </div>
      
      {/* مثال سلکت دارک مود */}
      <div className="bg-gray-900 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3 text-white">سلکت دارک</h2>
        <CustomSelect 
          options={options}
          placeholder="یک گزینه انتخاب کنید"
          value={darkSelected}
          onChange={(option) => setDarkSelected(option as SelectOption)}
          variant="dark"
          rounded="lg"
          size="lg"
          fullWidth
        />
      </div>
      
      {/* سلکت با سایزهای مختلف */}
      <div>
        <h2 className="text-lg font-semibold mb-3">سایزهای مختلف</h2>
        <div className="space-y-3">
          <CustomSelect 
            options={categoryOptions}
            placeholder="سایز کوچک"
            size="sm"
            label="سایز کوچک"
          />
          
          <CustomSelect 
            options={categoryOptions}
            placeholder="سایز متوسط"
            size="md"
            label="سایز متوسط"
          />
          
          <CustomSelect 
            options={categoryOptions}
            placeholder="سایز بزرگ"
            size="lg"
            label="سایز بزرگ"
          />
        </div>
      </div>
      
      {/* سلکت با خطا */}
      <div>
        <h2 className="text-lg font-semibold mb-3">سلکت با خطا</h2>
        <CustomSelect 
          options={categoryOptions}
          placeholder="انتخاب کنید"
          label="فیلد اجباری"
          error="این فیلد نمی‌تواند خالی باشد"
        />
      </div>
      
      {/* سلکت با گوشه‌های مختلف */}
      <div>
        <h2 className="text-lg font-semibold mb-3">انواع گوشه (Rounded)</h2>
        <div className="space-y-3">
          <CustomSelect 
            options={categoryOptions}
            placeholder="بدون گوشه"
            rounded="none"
            label="بدون گوشه"
          />
          
          <CustomSelect 
            options={categoryOptions}
            placeholder="گوشه کم"
            rounded="sm"
            label="گوشه کم"
          />
          
          <CustomSelect 
            options={categoryOptions}
            placeholder="گوشه کامل"
            rounded="full"
            label="گوشه کامل"
          />
        </div>
      </div>
      
      {/* سلکت با حالت لودینگ */}
      <div>
        <h2 className="text-lg font-semibold mb-3">حالت بارگذاری</h2>
        <CustomSelect 
          options={categoryOptions}
          placeholder="در حال بارگذاری..."
          isLoading={true}
          label="بارگذاری داده‌ها"
        />
      </div>
    </div>
  );
}; 