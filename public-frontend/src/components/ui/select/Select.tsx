import React from 'react';
import Select, { 
  StylesConfig, 
  Props as ReactSelectProps,
  GroupBase,
  OptionProps,
  components,
  MultiValueProps,
  SingleValueProps,
  PlaceholderProps,
  MenuProps,
  DropdownIndicatorProps
} from 'react-select';
import { FiCheck, FiChevronDown } from 'react-icons/fi';

// تعریف آپشن‌های قابل استفاده در سلکت
export interface SelectOption {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  isDisabled?: boolean;
}

// تعریف پراپ های کامپوننت
export interface CustomSelectProps extends Omit<ReactSelectProps<SelectOption, boolean, GroupBase<SelectOption>>, 'theme'> {
  label?: string;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'secondary' | 'dark';
  fullWidth?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  isLoading?: boolean;
  bordered?: boolean;
  hasIcon?: boolean;
  icon?: React.ReactNode;
  direction?: 'rtl' | 'ltr';
}

// کامپوننت آپشن سفارشی
const CustomOption = (props: OptionProps<SelectOption, boolean, GroupBase<SelectOption>>) => {
  const { data, isSelected, isFocused } = props;
  
  return (
    <components.Option {...props}>
      <div className={`flex items-center gap-2 pr-2 ${isSelected ? 'text-white' : isFocused ? 'text-white' : 'text-gray-200'}`}>
        {data.icon && <span className="text-secondary">{data.icon}</span>}
        <span>{data.label}</span>
        {isSelected && <FiCheck className="mr-auto text-secondary" />}
      </div>
    </components.Option>
  );
};

// کامپوننت مقدار انتخاب شده (تک انتخابی)
const CustomSingleValue = (props: SingleValueProps<SelectOption, boolean, GroupBase<SelectOption>>) => {
  return (
    <components.SingleValue {...props}>
      <div className="flex items-center gap-2">
        {props.data.icon && <span>{props.data.icon}</span>}
        <span>{props.data.label}</span>
      </div>
    </components.SingleValue>
  );
};

// کامپوننت مقدار انتخاب شده (چند انتخابی)
const CustomMultiValue = (props: MultiValueProps<SelectOption, boolean, GroupBase<SelectOption>>) => {
  return (
    <components.MultiValue {...props}>
      <div className="flex items-center gap-1">
        {props.data.icon && <span className="text-sm">{props.data.icon}</span>}
        <span>{props.data.label}</span>
      </div>
    </components.MultiValue>
  );
};

// کامپوننت پلیس‌هولدر
const CustomPlaceholder = (props: PlaceholderProps<SelectOption, boolean, GroupBase<SelectOption>>) => {
  return (
    <components.Placeholder {...props}>
      <span className="text-gray-400">{props.children}</span>
    </components.Placeholder>
  );
};

// کامپوننت منو
const CustomMenu = (props: MenuProps<SelectOption, boolean, GroupBase<SelectOption>>) => {
  return (
    <components.Menu {...props}>
      <div className="py-1">
        {props.children}
      </div>
    </components.Menu>
  );
};

// ایندیکیتور کاستوم برای آیکون فلش پایین
const DropdownIndicator = (props: DropdownIndicatorProps<SelectOption, boolean, GroupBase<SelectOption>>) => {
  return (
    <components.DropdownIndicator {...props}>
      <FiChevronDown className={`${props.selectProps.menuIsOpen ? 'transform rotate-180' : ''} transition-transform duration-200`} />
    </components.DropdownIndicator>
  );
};

// کامپوننت اصلی سلکت
const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  error,
  hint,
  size = 'md',
  variant = 'default',
  fullWidth = false,
  rounded = 'md',
  isLoading = false,
  bordered = true, 
  hasIcon = false,
  icon,
  direction = 'rtl',
  ...props
}) => {
  // تعیین سایز بر اساس پراپ size
  const getControlHeight = (): number => {
    switch (size) {
      case 'sm': return 32;
      case 'lg': return 48;
      case 'md': 
      default: return 40;
    }
  };
  
  // تعیین فونت سایز بر اساس پراپ size
  const getFontSize = (): number => {
    switch (size) {
      case 'sm': return 12;
      case 'lg': return 16;
      case 'md':
      default: return 14;
    }
  };
  
  // تعیین پدینگ بر اساس پراپ size
  const getPadding = (): { x: number, y: number } => {
    switch (size) {
      case 'sm': return { x: 8, y: 2 };
      case 'lg': return { x: 16, y: 6 };
      case 'md':
      default: return { x: 12, y: 4 };
    }
  };
  
  // تعیین رنگ‌ها بر اساس واریانت
  const getVariantColors = () => {
    switch (variant) {
      case 'primary':
        return {
          primary: '#3b82f6', // blue-500
          primary80: '#60a5fa', // blue-400
          primary60: '#93c5fd', // blue-300
          primary30: '#bfdbfe', // blue-200
          primary15: '#dbeafe', // blue-100
          primary10: '#eff6ff', // blue-50
          neutral0: '#1e293b', // slate-800
          neutral5: '#334155', // slate-700
          neutral10: '#475569', // slate-600
          neutral20: '#64748b', // slate-500
          neutral30: '#94a3b8', // slate-400
          neutral40: '#cbd5e1', // slate-300
          neutral50: '#e2e8f0', // slate-200
          neutral60: '#f1f5f9', // slate-100
          neutral70: '#f8fafc', // slate-50
          neutral80: '#ffffff', // white
          neutral90: '#ffffff', // white
        };
      case 'secondary':
        return {
          primary: '#f59e0b', // amber-500
          primary80: '#fbbf24', // amber-400
          primary60: '#fcd34d', // amber-300
          primary30: '#fde68a', // amber-200
          primary15: '#fef3c7', // amber-100
          primary10: '#fffbeb', // amber-50
          neutral0: '#1e293b', // slate-800
          neutral5: '#334155', // slate-700
          neutral10: '#475569', // slate-600
          neutral20: '#64748b', // slate-500
          neutral30: '#94a3b8', // slate-400
          neutral40: '#cbd5e1', // slate-300
          neutral50: '#e2e8f0', // slate-200
          neutral60: '#f1f5f9', // slate-100
          neutral70: '#f8fafc', // slate-50
          neutral80: '#ffffff', // white
          neutral90: '#ffffff', // white
        };
      case 'dark':
        return {
          primary: '#6366f1', // indigo-500
          primary80: '#818cf8', // indigo-400
          primary60: '#a5b4fc', // indigo-300
          primary30: '#c7d2fe', // indigo-200
          primary15: '#e0e7ff', // indigo-100
          primary10: '#eef2ff', // indigo-50
          neutral0: '#0f172a', // slate-900
          neutral5: '#1e293b', // slate-800
          neutral10: '#334155', // slate-700
          neutral20: '#475569', // slate-600
          neutral30: '#64748b', // slate-500
          neutral40: '#94a3b8', // slate-400
          neutral50: '#cbd5e1', // slate-300
          neutral60: '#e2e8f0', // slate-200
          neutral70: '#f1f5f9', // slate-100
          neutral80: '#f8fafc', // slate-50
          neutral90: '#ffffff', // white
        };
      case 'default':
      default:
        return {
          primary: '#6366f1', // indigo-500
          primary80: '#818cf8', // indigo-400
          primary60: '#a5b4fc', // indigo-300
          primary30: '#c7d2fe', // indigo-200
          primary15: '#e0e7ff', // indigo-100
          primary10: '#eef2ff', // indigo-50
          neutral0: '#ffffff', // white
          neutral5: '#f8fafc', // slate-50
          neutral10: '#f1f5f9', // slate-100
          neutral20: '#e2e8f0', // slate-200
          neutral30: '#cbd5e1', // slate-300
          neutral40: '#94a3b8', // slate-400
          neutral50: '#64748b', // slate-500
          neutral60: '#475569', // slate-600
          neutral70: '#334155', // slate-700
          neutral80: '#1e293b', // slate-800
          neutral90: '#0f172a', // slate-900
        };
    }
  };
  
  // تعیین گردی گوشه‌ها
  const getBorderRadius = (): number => {
    switch (rounded) {
      case 'none': return 0;
      case 'sm': return 4;
      case 'lg': return 12;
      case 'full': return 9999;
      case 'md':
      default: return 8;
    }
  };

  // استایل‌های کامپوننت
  const customStyles: StylesConfig<SelectOption, boolean, GroupBase<SelectOption>> = {
    control: (provided, state) => {
      const colors = getVariantColors();
      return {
        ...provided,
        minHeight: getControlHeight(),
        fontSize: `${getFontSize()}px`,
        padding: `${getPadding().y}px ${hasIcon ? getPadding().x + 20 : getPadding().x}px`,
        backgroundColor: variant === 'dark' ? colors.neutral0 : colors.neutral0,
        borderColor: state.isFocused 
          ? colors.primary 
          : error 
            ? '#ef4444' 
            : bordered 
              ? (variant === 'dark' ? colors.neutral20 : colors.neutral30) 
              : 'transparent',
        borderRadius: getBorderRadius(),
        boxShadow: state.isFocused 
          ? `0 0 0 1px ${error ? '#ef4444' : colors.primary}` 
          : 'none',
        '&:hover': {
          borderColor: state.isFocused 
            ? colors.primary 
            : error 
              ? '#ef4444' 
              : (variant === 'dark' ? colors.neutral10 : colors.neutral40),
        },
        cursor: 'pointer',
        width: fullWidth ? '100%' : 'auto',
        direction: direction,
        paddingLeft: direction === 'rtl' ? 8 : undefined, // RTL support
        paddingRight: direction === 'ltr' ? 8 : undefined, // LTR support
      };
    },
    valueContainer: (provided) => ({
      ...provided,
      padding: '0 2px',
      gap: '0.25rem',
      position: 'relative',
      direction: direction,
    }),
    input: (provided) => ({
      ...provided,
      margin: '0',
      padding: '0',
      color: variant === 'dark' ? 'white' : 'inherit',
      direction: direction,
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      direction: 'ltr', // Icons are always LTR
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      padding: '0 4px',
      color: state.isFocused 
        ? getVariantColors().primary 
        : variant === 'dark' 
          ? getVariantColors().neutral40 
          : getVariantColors().neutral50,
      '&:hover': {
        color: getVariantColors().primary,
      },
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : undefined,
      transition: 'transform 200ms ease',
    }),
    clearIndicator: (provided) => ({
      ...provided,
      padding: '0 4px',
      color: variant === 'dark' ? getVariantColors().neutral40 : getVariantColors().neutral50,
      '&:hover': {
        color: variant === 'dark' ? getVariantColors().neutral60 : getVariantColors().neutral70,
      },
    }),
    option: (provided, state) => ({
      ...provided,
      padding: `${getPadding().y + 2}px ${getPadding().x}px`,
      fontSize: `${getFontSize()}px`,
      backgroundColor: state.isSelected 
        ? getVariantColors().primary 
        : state.isFocused 
          ? (variant === 'dark' ? getVariantColors().neutral10 : getVariantColors().primary10) 
          : 'transparent',
      color: state.isSelected 
        ? 'white' 
        : variant === 'dark' 
          ? (state.isFocused ? getVariantColors().neutral80 : getVariantColors().neutral60) 
          : (state.isFocused ? getVariantColors().primary : getVariantColors().neutral80),
      cursor: 'pointer',
      '&:active': {
        backgroundColor: state.isSelected 
          ? getVariantColors().primary 
          : getVariantColors().primary30,
      },
      direction: direction,
      textAlign: direction === 'rtl' ? 'right' : 'left',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: variant === 'dark' ? getVariantColors().neutral0 : getVariantColors().neutral0,
      borderRadius: getBorderRadius(),
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: 100,
      overflow: 'hidden',
      direction: direction,
    }),
    menuList: (provided) => ({
      ...provided,
      padding: '4px',
      direction: direction,
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: variant === 'dark' ? getVariantColors().neutral10 : getVariantColors().primary10,
      borderRadius: getBorderRadius() > 4 ? 4 : getBorderRadius(),
      direction: 'ltr', // For consistency
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: variant === 'dark' ? getVariantColors().neutral60 : getVariantColors().primary,
      padding: '0 4px',
      fontSize: `${getFontSize() - 1}px`,
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: variant === 'dark' ? getVariantColors().neutral40 : getVariantColors().primary60,
      '&:hover': {
        backgroundColor: variant === 'dark' ? getVariantColors().neutral20 : getVariantColors().primary30,
        color: variant === 'dark' ? 'white' : getVariantColors().primary,
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: variant === 'dark' ? getVariantColors().neutral40 : getVariantColors().neutral50,
      direction: direction,
    }),
    singleValue: (provided) => ({
      ...provided,
      color: variant === 'dark' ? getVariantColors().neutral70 : getVariantColors().neutral80,
      direction: direction,
    }),
    loadingIndicator: (provided) => ({
      ...provided,
      color: getVariantColors().primary,
    }),
  };
  
  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className={`block mb-1 font-medium ${
          variant === 'dark' ? 'text-gray-200' : 'text-gray-700'
        } ${
          size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
        }`}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {hasIcon && icon && (
          <div className={`absolute ${direction === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10`}>
            {icon}
          </div>
        )}
        
        <Select<SelectOption, boolean, GroupBase<SelectOption>>
          {...props}
          isLoading={isLoading}
          styles={customStyles}
          components={{
            Option: CustomOption,
            SingleValue: CustomSingleValue,
            MultiValue: CustomMultiValue,
            Placeholder: CustomPlaceholder,
            Menu: CustomMenu,
            DropdownIndicator,
            ...props.components
          }}
          classNamePrefix="react-select"
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              ...getVariantColors()
            },
            borderRadius: getBorderRadius(),
            spacing: {
              ...theme.spacing,
              controlHeight: getControlHeight(),
              baseUnit: 4,
            },
          })}
        />
      </div>
      
      {(error || hint) && (
        <div className={`mt-1 text-${size === 'sm' ? 'xs' : 'sm'} ${
          error ? 'text-red-500' : variant === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {error || hint}
        </div>
      )}
    </div>
  );
};

export default CustomSelect; 