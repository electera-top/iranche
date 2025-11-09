import { useState } from 'react';
import Select, { StylesConfig, GroupBase } from 'react-select';

type BusinessType = {
  value: string;
  label: string;
};

type Category = {
  value: string;
  label: string;
  businessType: string;
};

type StoreCategorySelectProps = {
  onCategoryChange: (category: string) => void;
  onBusinessTypeChange: (businessType: string) => void;
  selectedCategory?: string;
  selectedBusinessType?: string;
};

const businessTypes: BusinessType[] = [
  { value: 'physical', label: 'کالاهای فیزیکی' },
  { value: 'service', label: 'خدماتی' }
];

const categories: Category[] = [
  // Physical Goods Categories
  { value: 'home', label: 'خانه و آشپزخانه', businessType: 'physical' },
  { value: 'beauty', label: 'آرایشی و بهداشتی', businessType: 'physical' },
  { value: 'fashion', label: 'مد و پوشاک', businessType: 'physical' },
  { value: 'electronics', label: 'الکترونیک', businessType: 'physical' },
  { value: 'sports', label: 'ورزشی', businessType: 'physical' },
  { value: 'books', label: 'کتاب و لوازم التحریر', businessType: 'physical' },
  { value: 'toys', label: 'اسباب بازی', businessType: 'physical' },
  { value: 'supermarket', label: 'مواد غذایی', businessType: 'physical' },
  
  // Service Categories
  { value: 'education', label: 'آموزشی', businessType: 'service' },
  { value: 'health', label: 'سلامت و درمان', businessType: 'service' },
  { value: 'beauty_service', label: 'آرایشی و زیبایی', businessType: 'service' },
  { value: 'travel', label: 'مسافرتی و گردشگری', businessType: 'service' },
  { value: 'entertainment', label: 'سرگرمی', businessType: 'service' },
  { value: 'professional', label: 'خدمات حرفه‌ای', businessType: 'service' },
  { value: 'repair', label: 'تعمیرات', businessType: 'service' },
  { value: 'cleaning', label: 'نظافتی', businessType: 'service' }
];

const businessTypeStyles: StylesConfig<BusinessType, false, GroupBase<BusinessType>> = {
  control: (base) => ({
    ...base,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgb(55, 65, 81)',
    borderRadius: '0.5rem',
    padding: '0.5rem 0.75rem',
    minHeight: '2.75rem',
    '&:hover': {
      borderColor: 'rgb(75, 85, 99)'
    }
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'rgb(17, 24, 39)',
    border: '1px solid rgb(55, 65, 81)',
    borderRadius: '0.5rem',
    marginTop: '0.5rem'
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected 
      ? 'rgb(59, 130, 246)' 
      : state.isFocused 
        ? 'rgba(59, 130, 246, 0.1)' 
        : 'transparent',
    color: 'white',
    padding: '0.5rem 0.75rem',
    '&:active': {
      backgroundColor: 'rgb(59, 130, 246)'
    }
  }),
  singleValue: (base) => ({
    ...base,
    color: 'white',
    margin: '0',
    padding: '0'
  }),
  input: (base) => ({
    ...base,
    color: 'white',
    margin: '0',
    padding: '0'
  }),
  placeholder: (base) => ({
    ...base,
    color: 'rgb(107, 114, 128)',
    margin: '0',
    padding: '0'
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: '0.5rem',
    color: 'rgb(156, 163, 175)',
    '&:hover': {
      color: 'white'
    }
  }),
  clearIndicator: (base) => ({
    ...base,
    padding: '0.5rem',
    color: 'rgb(156, 163, 175)',
    '&:hover': {
      color: 'white'
    }
  })
};

const categoryStyles: StylesConfig<Category, false, GroupBase<Category>> = {
  control: (base) => ({
    ...base,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgb(55, 65, 81)',
    borderRadius: '0.5rem',
    padding: '0.5rem 0.75rem',
    minHeight: '2.75rem',
    '&:hover': {
      borderColor: 'rgb(75, 85, 99)'
    }
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'rgb(17, 24, 39)',
    border: '1px solid rgb(55, 65, 81)',
    borderRadius: '0.5rem',
    marginTop: '0.5rem'
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected 
      ? 'rgb(59, 130, 246)' 
      : state.isFocused 
        ? 'rgba(59, 130, 246, 0.1)' 
        : 'transparent',
    color: 'white',
    padding: '0.5rem 0.75rem',
    '&:active': {
      backgroundColor: 'rgb(59, 130, 246)'
    }
  }),
  singleValue: (base) => ({
    ...base,
    color: 'white',
    margin: '0',
    padding: '0'
  }),
  input: (base) => ({
    ...base,
    color: 'white',
    margin: '0',
    padding: '0'
  }),
  placeholder: (base) => ({
    ...base,
    color: 'rgb(107, 114, 128)',
    margin: '0',
    padding: '0'
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: '0.5rem',
    color: 'rgb(156, 163, 175)',
    '&:hover': {
      color: 'white'
    }
  }),
  clearIndicator: (base) => ({
    ...base,
    padding: '0.5rem',
    color: 'rgb(156, 163, 175)',
    '&:hover': {
      color: 'white'
    }
  })
};

export default function StoreCategorySelect({
  onCategoryChange,
  onBusinessTypeChange,
  selectedCategory,
  selectedBusinessType
}: StoreCategorySelectProps) {
  const [businessType, setBusinessType] = useState<string>(selectedBusinessType || '');
  
  const filteredCategories = categories.filter(
    category => category.businessType === businessType
  );

  const handleBusinessTypeChange = (option: BusinessType | null) => {
    const value = option?.value || '';
    setBusinessType(value);
    onBusinessTypeChange(value);
    // Reset category when business type changes
    onCategoryChange('');
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="businessType" className="block text-gray-300 mb-2 text-sm">
          نوع کسب و کار
        </label>
        <Select<BusinessType>
          id="businessType"
          options={businessTypes}
          value={businessTypes.find(type => type.value === businessType)}
          onChange={handleBusinessTypeChange}
          styles={businessTypeStyles}
          placeholder="نوع کسب و کار خود را انتخاب کنید"
          isSearchable
          isClearable
        />
      </div>

      {businessType && (
        <div>
          <label htmlFor="category" className="block text-gray-300 mb-2 text-sm">
            دسته‌بندی فروشگاه
          </label>
          <Select<Category>
            id="category"
            options={filteredCategories}
            value={filteredCategories.find(cat => cat.value === selectedCategory)}
            onChange={(option) => onCategoryChange(option?.value || '')}
            styles={categoryStyles}
            placeholder="دسته‌بندی فروشگاه خود را انتخاب کنید"
            isSearchable
            isClearable
          />
        </div>
      )}
    </div>
  );
} 