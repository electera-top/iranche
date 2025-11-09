import React from 'react';
import { FiStar, FiDownload, FiHeart, FiClock, FiAward, FiEye, FiShoppingCart, FiUser } from 'react-icons/fi';
import Button from '@/components/ui/button/Button';

// Template creator interface
export interface TemplateCreator {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  totalTemplates: number;
}

// Template interface
export interface Template {
  id: string;
  title: string;
  thumbnail: string;
  isPremium: boolean;
  price: number;
  category: string;
  rating: number;
  downloads: number;
  createdAt: string;
  creator: TemplateCreator;
  tags: string[];
  description: string;
}

interface TemplateBoxProps {
  template: Template;
  displayMode?: 'grid' | 'list';
  onPreview?: (template: Template) => void;
  className?: string;
}

const TemplateBox: React.FC<TemplateBoxProps> = ({
  template,
  displayMode = 'grid',
  onPreview,
  className = '',
}) => {
  const isNew = new Date(template.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000;

  if (displayMode === 'grid') {
    return (
      <div 
        className={`group relative overflow-hidden rounded-xl bg-primary-900  hover:border-secondary/30 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/5 ${className}`}
      >
        {/* Premium ribbon */}
        {template.isPremium && (
          <div className="absolute top-3 left-3 z-20 bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1 rounded-full text-xs font-bold text-amber-950 shadow-lg flex items-center">
            <FiAward className="ml-1" />
            پرمیوم
          </div>
        )}
        
        {/* New icon */}
        {isNew && (
          <div className="absolute top-3 right-3 z-20 bg-gradient-to-r from-green-500 to-green-600 px-3 py-1 rounded-full text-xs font-bold text-green-950 shadow-lg flex items-center">
            <FiClock className="ml-1" />
            جدید
          </div>
        )}

        {/* Template image */}
        <div className="relative h-48 overflow-hidden">
          {/* Preview overlay and button */}
          <div className="absolute inset-0 bg-primary-950/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center">
            <Button
              variant="secondary"
              size="md"
              className="bg-secondary/90 hover:bg-secondary transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 flex items-center"
              onClick={() => onPreview && onPreview(template)}
            >
              <FiEye className="ml-2" /> مشاهده سریع
            </Button>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-950/90 z-10"></div>
          <div className="flex items-center justify-center h-full p-2">
            <img 
              src={template.thumbnail || '/templates/placeholder.jpg'} 
              alt={template.title}
              className="w-full h-full rounded-lg shadow-md shadow-primary-950/30"
            />
          </div>
          
          {/* Heart icon */}
          <button className="absolute top-3 right-3 z-30 bg-primary-950/50 p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-primary-900/70 transition-colors duration-300">
            <FiHeart size={16} />
          </button>
          
          {/* Creator info */}
          <div className="absolute bottom-3 left-3 z-30 flex items-center">
            <img 
              src={template.creator.avatar || '/avatars/default.jpg'}
              alt={template.creator.name}
              className="w-7 h-7 rounded-full border-2 border-white shadow-lg"
            />
            <span className="text-white text-xs mr-2 bg-primary-950/70 px-2 py-1 rounded-full">{template.creator.name}</span>
          </div>
        </div>
        
        {/* Template details */}
        <div className="p-4">
          <h3 className="text-white font-bold text-lg mb-2 line-clamp-1 group-hover:text-secondary transition-colors">{template.title}</h3>
          
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{template.description}</p>
          
          {/* Tags with more vibrant colors */}
          <div className="flex flex-wrap gap-1 mb-4">
            {template.tags.slice(0, 3).map((tag, idx) => (
              <span 
                key={idx} 
                className={`text-xs px-2 py-1 rounded-md ${
                  idx % 3 === 0 ? 'bg-blue-900/40 text-blue-300' : 
                  idx % 3 === 1 ? 'bg-purple-900/40 text-purple-300' : 
                  'bg-teal-900/40 text-teal-300'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center px-2 py-1 bg-primary-950/50 rounded-lg">
              <FiStar className="text-yellow-500 ml-1" />
              <span className="text-white text-sm">{template.rating}</span>
            </div>
            
            <div className="flex items-center px-2 py-1 bg-primary-950/50 rounded-lg">
              <FiDownload className="text-gray-400 ml-1" />
              <span className="text-gray-400 text-sm">{template.downloads.toLocaleString()}</span>
            </div>
          </div>
          
          {/* Price and buttons */}
          <div className="flex justify-between items-center">
            <div className="text-left">
              {template.isPremium ? (
                <div className="text-white font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">{template.price.toLocaleString()} تومان</div>
              ) : (
                <div className="text-green-500 font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">رایگان</div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                className="border border-primary-700/50 text-white hover:bg-primary-800/50 inline-flex items-center justify-center gap-1 px-2 py-1 text-xs"
                onClick={() => onPreview && onPreview(template)}
              >
                <FiEye size={14} /> پیش‌نمایش
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                className={`flex items-center justify-center gap-1 px-2 py-1 text-xs ${
                  template.isPremium 
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 border-none hover:from-amber-600 hover:to-amber-700 shadow-md shadow-amber-600/10' 
                    : 'bg-gradient-to-r from-green-500 to-green-600 text-green-950 border-none hover:from-green-600 hover:to-green-700 shadow-md shadow-green-600/10'
                }`}
              >
                {template.isPremium ? (
                  <>
                    <FiShoppingCart size={14} className="ml-1" /> خرید
                  </>
                ) : (
                  <>
                    <FiDownload size={14} className="ml-1" /> مشاهده و نصب
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // List view
  return (
    <div className={`group flex flex-col md:flex-row bg-primary-900 rounded-xl hover:border-secondary/30 transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-secondary/5 ${className}`}>
      {/* Template image */}
      <div className="relative w-full md:w-72 h-48 md:h-full overflow-hidden">
        {template.isPremium && (
          <div className="absolute top-3 left-3 z-20 bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1 rounded-full text-xs font-bold text-amber-950 shadow-lg flex items-center">
            <FiAward className="ml-1" />
            پرمیوم
          </div>
        )}
        
        {/* New icon */}
        {isNew && (
          <div className="absolute top-3 right-3 z-20 bg-gradient-to-r from-green-500 to-green-600 px-3 py-1 rounded-full text-xs font-bold text-green-950 shadow-lg flex items-center">
            <FiClock className="ml-1" />
            جدید
          </div>
        )}
        
        {/* Preview overlay and button */}
        <div className="absolute inset-0 bg-primary-950/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center">
          <Button
            variant="secondary"
            size="md"
            className="bg-secondary/90 hover:bg-secondary transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 flex items-center"
            onClick={() => onPreview && onPreview(template)}
          >
            <FiEye className="ml-2" /> مشاهده سریع
          </Button>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-transparent to-primary-950/80 z-10"></div>
        <div className="flex items-center justify-center h-full p-5">
          <img 
            src={template.thumbnail || '/templates/placeholder.jpg'} 
            alt={template.title}
            className="w-full h-full object-contain rounded-lg shadow-md shadow-primary-950/30"
          />
        </div>
        
        {/* Heart icon */}
        <button className="absolute top-14 right-3 z-30 bg-primary-950/50 p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-primary-900/70 transition-colors duration-300">
          <FiHeart size={16} />
        </button>
      </div>
      
      {/* Template details */}
      <div className="flex-1 p-5 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-white font-bold text-xl group-hover:text-secondary transition-colors">{template.title}</h3>
          <div className="flex items-center bg-primary-950/50 px-3 py-1 rounded-lg">
            <FiStar className="text-yellow-500 ml-1" />
            <span className="text-white">{template.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-400 text-sm mb-4">{template.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {template.tags.map((tag, idx) => (
            <span 
              key={idx} 
              className={`text-xs px-2 py-1 rounded-md ${
                idx % 3 === 0 ? 'bg-blue-900/40 text-blue-300' : 
                idx % 3 === 1 ? 'bg-purple-900/40 text-purple-300' : 
                'bg-teal-900/40 text-teal-300'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center mb-4">
          <img 
            src={template.creator.avatar || '/avatars/default.jpg'}
            alt={template.creator.name}
            className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
          />
          <div className="mr-2">
            <div className="text-white text-sm flex items-center">
              <FiUser className="ml-1 text-secondary" size={14} />
              {template.creator.name}
            </div>
            <div className="text-gray-400 text-xs flex items-center mt-0.5">
              <span>{template.creator.totalTemplates} قالب</span>
              <span className="mx-2">•</span>
              <div className="flex items-center">
                <FiStar className="text-yellow-500 ml-0.5" size={12} />
                <span>{template.creator.rating}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-auto flex justify-between items-center flex-wrap gap-4">
          <div className="flex flex-col">
            {template.isPremium ? (
              <div className="text-white font-bold text-lg bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">{template.price.toLocaleString()} تومان</div>
            ) : (
              <div className="text-green-500 font-bold text-lg bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">رایگان</div>
            )}
            <div className="flex items-center text-gray-400 text-xs">
              <FiDownload className="ml-1" size={12} />
              {template.downloads.toLocaleString()} دانلود
              <span className="mx-2">•</span>
              <span>تاریخ انتشار: {template.createdAt}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              className="border border-primary-700/50 text-white hover:bg-primary-800/50 inline-flex items-center justify-center gap-1 px-2 py-1 text-xs"
              onClick={() => onPreview && onPreview(template)}
            >
              <FiEye size={14} /> پیش‌نمایش
            </Button>
            
            <Button
              variant="secondary"
              className={`flex items-center justify-center gap-1 px-2 py-1 text-xs ${
                template.isPremium 
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 border-none hover:from-amber-600 hover:to-amber-700 shadow-md shadow-amber-600/10' 
                  : 'bg-gradient-to-r from-green-500 to-green-600 text-green-950 border-none hover:from-green-600 hover:to-green-700 shadow-md shadow-green-600/10'
              }`}
            >
              {template.isPremium ? (
                <>
                  <FiShoppingCart size={14} className="ml-1" /> خرید قالب
                </>
              ) : (
                <>
                  <FiDownload size={14} className="ml-1" /> مشاهده و نصب
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateBox; 