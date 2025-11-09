import { FiUser, FiLogOut, FiDollarSign, FiPackage, FiStar, FiCreditCard, FiArrowUpRight, FiShield, FiHome, FiTrendingUp, FiMapPin, FiUsers, FiMessageCircle, FiBell, FiEye, FiAward, FiHeadphones } from 'react-icons/fi';
import { useEffect, useState } from 'react';

interface DashboardSidebarProps {
  user: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
    joinDate: string;
    orders: number;
    favorites: number;
    messages: number;
    goldBalance: number;
    points: number;
    level?: number;
    username?: string;
    stores: Array<{
      id: number;
      name: string;
      status: string;
    }>;
    financialBalance?: number;
  };
  activeTab: 'overview' | 'profile' | 'orders' | 'favorites' | 'messages' | 'settings' | 'wallet' | 'addresses' | 'following' | 'reviews' | 'notifications' | 'recent-views' | 'club' | 'support' | 'income';
  onTabChange: (tab: 'overview' | 'profile' | 'orders' | 'favorites' | 'messages' | 'settings' | 'wallet' | 'addresses' | 'following' | 'reviews' | 'notifications' | 'recent-views' | 'club' | 'support' | 'income') => void;
  onLogout: () => void;
}

export default function DashboardSidebar({ user, activeTab, onTabChange, onLogout }: DashboardSidebarProps) {
  // انیمیشن دایره متحرک
  const [circlePosition, setCirclePosition] = useState(1);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCirclePosition(prev => prev === 3 ? 1 : prev + 1);
    }, 3000); // هر 3 ثانیه یک بار
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="bg-gradient-to-b from-primary-950 to-primary-900 backdrop-blur-sm rounded-2xl border border-primary-700 overflow-hidden shadow-xl flex flex-col h-full">
      <div className="p-6 text-center">
        {/* پروفایل کاربر */}
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary-800 to-primary-700 p-1 overflow-hidden ring-2 ring-secondary ring-offset-2 ring-offset-primary-900">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
        <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
        <p className="text-blue-300/80 text-sm mb-1">ali_mohammadi@</p>
        <p className="text-blue-300/80 text-sm mb-6 flex items-center justify-center">
          <FiShield className="ml-1 text-blue-400" size={14} />
          عضو از {user.joinDate}
        </p>
        
        {/* کیف پول‌های کاربر - یک باکس یکپارچه با سه بخش - لاکچری */}
        <div className="rounded-lg mb-5 overflow-hidden shadow-lg border border-gray-700/30 relative">
          {/* دایره متحرک مشترک */}
          <div className={`
            absolute w-8 h-8 rounded-full z-20 transition-all duration-1000 ease-in-out shadow-[0_0_15px_2px]
            ${circlePosition === 1 ? 'bottom-[85%] right-[15%] shadow-[#ffd700]/30 bg-[#ffd700]/20' : 
              circlePosition === 2 ? 'bottom-[25%] right-[75%] shadow-[#3a5cad]/30 bg-[#3a5cad]/20' : 
              'bottom-[25%] right-[25%] shadow-[#00a960]/30 bg-[#00a960]/20'}
          `}></div>
          
          {/* کیف پول طلا - بخش بالایی */}
          <div className="bg-gradient-to-r from-[#332100] to-[#473000] p-4 relative overflow-hidden transition-all border-b border-[#925f00]/50">
            {/* افکت‌های لاکچری طلایی */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/patterns/gold-pattern.png')] opacity-[0.07]"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#ffb700]/5 rounded-full blur-2xl"></div>
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#ffb700]/0 via-[#ffb700]/60 to-[#ffb700]/0"></div>
            
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="flex items-center">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#ffcc00] to-[#ff9500] flex items-center justify-center border border-[#ffcc00]/50 shadow-lg shadow-[#ffcc00]/10">
                  <FiDollarSign className="text-[#5c3c00]" size={20} />
                </div>
                <div className="mr-2 text-left">
                  <div className="text-[#ffcc00] text-sm font-bold tracking-wide">کیف پول طلا</div>
                  <div className="text-[#e6b012]/70 text-xs">امن و مطمئن</div>
                </div>
              </div>
              <div className="bg-[#8b6b00]/40 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-[#ffcc00] border border-[#ffcc00]/20 shadow-inner">
                طلای 18 عیار
              </div>
            </div>
            
            <div className="flex justify-between items-end relative z-10">
              <div>
                <div className="text-[#ffd700] font-bold text-2xl flex items-center drop-shadow-[0_0_3px_rgba(255,215,0,0.15)]">
                  {(user.goldBalance / 1000).toFixed(3)}
                  <span className="text-[#ffd700]/80 text-base mr-1">گرم</span>
                </div>
                <div className="flex items-center mt-1">
                  <div className="bg-[#5c3c00]/80 px-2 py-0.5 rounded-md text-[#ffd700]/90 text-xs border border-[#ffd700]/20">
                    معادل {Math.round(user.goldBalance * 0.005).toLocaleString()} تومان
                  </div>
                </div>
              </div>
              <button className="bg-gradient-to-r from-[#ffd700] to-[#ffb700] hover:from-[#ffcc00] hover:to-[#ff9500] transition-all px-3 py-1.5 rounded-lg text-[#5c3c00] font-medium border border-[#ffcc00]/50 shadow-md flex items-center group/btn hover:scale-105">
                <span className="text-xs">تبدیل و برداشت</span>
                <FiArrowUpRight className="mr-1 group-hover/btn:translate-x-[-2px] group-hover/btn:translate-y-[-2px] transition-transform" />
              </button>
            </div>
          </div>
          
          {/* کیف پول و درآمد - بخش‌های پایینی کنار هم با کنتراست رنگی */}
          <div className="grid grid-cols-2">
            {/* بخش کیف پول */}
            <div className="bg-gradient-to-b from-[#002366] to-[#001845] p-3 relative overflow-hidden transition-all border-l border-l-[#3a5cad]/30">
              {/* افکت‌های لاکچری آبی */}
              <div className="absolute top-0 left-0 w-full h-full bg-[url('/patterns/wave-pattern.png')] opacity-[0.07]"></div>
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#3a5cad]/10 rounded-full blur-xl"></div>
              <div className="absolute top-0 left-0 w-1/2 h-0.5 bg-gradient-to-r from-[#3a5cad]/0 via-[#3a5cad]/40 to-[#3a5cad]/0"></div>
              
              <div className="flex items-center justify-between mb-2 relative z-10">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3a5cad] to-[#1e40af] flex items-center justify-center border border-[#3a5cad]/60 shadow-lg shadow-[#3a5cad]/10">
                    <FiCreditCard className="text-[#c7d2fe]" size={16} />
                  </div>
                  <div className="mr-1.5 text-right">
                    <div className="text-[#c7d2fe] text-xs font-bold tracking-wide">کیف پول</div>
                  </div>
                </div>
                
              </div>
              
              <div className="flex flex-col relative z-10">
                <div className="text-[#dbeafe] font-bold text-xl drop-shadow-[0_0_3px_rgba(59,130,246,0.15)]">
                  {Math.round((user.financialBalance || 0) * 0.6).toLocaleString()}
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <button className="bg-gradient-to-r from-[#3a5cad] to-[#1e40af] hover:from-[#1e40af] hover:to-[#3a5cad] transition-all px-2 py-1 rounded-lg text-white text-xs font-medium border border-[#3a5cad]/50 shadow-md flex items-center group/btn hover:scale-105">
                    <span>شارژ</span>
                    <FiArrowUpRight className="mr-1 group-hover/btn:translate-x-[-2px] group-hover/btn:translate-y-[-2px] transition-transform" size={12} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* بخش درآمد */}
            <div className="bg-gradient-to-b from-[#004d29] to-[#003720] p-3 relative overflow-hidden transition-all">
              {/* افکت‌های لاکچری سبز */}
              <div className="absolute top-0 left-0 w-full h-full bg-[url('/patterns/dot-pattern.png')] opacity-[0.07]"></div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#00a960]/10 rounded-full blur-xl"></div>
              <div className="absolute top-0 right-0 w-1/2 h-0.5 bg-gradient-to-l from-[#00a960]/0 via-[#00a960]/40 to-[#00a960]/0"></div>
              
              <div className="flex items-center justify-between mb-2 relative z-10">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00a960] to-[#007541] flex items-center justify-center border border-[#00a960]/60 shadow-lg shadow-[#00a960]/10">
                    <FiTrendingUp className="text-[#e7fff3]" size={16} />
                  </div>
                  <div className="mr-1.5 text-right">
                    <div className="text-[#c1fde2] text-xs font-bold tracking-wide">درآمد</div>
                  </div>
                </div>
               
              </div>
              
              <div className="flex flex-col relative z-10">
                <div className="text-[#e7fff3] font-bold text-xl drop-shadow-[0_0_3px_rgba(0,169,96,0.15)]">
                  {Math.round((user.financialBalance || 0) * 0.4).toLocaleString()}
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <button className="bg-gradient-to-r from-[#00a960] to-[#007541] hover:from-[#007541] hover:to-[#00a960] transition-all px-2 py-1 rounded-lg text-white text-xs font-medium border border-[#00a960]/50 shadow-md flex items-center group/btn hover:scale-105">
                    <span>برداشت</span>
                    <FiArrowUpRight className="mr-1 group-hover/btn:translate-x-[-2px] group-hover/btn:translate-y-[-2px] transition-transform" size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* امتیازات */}
        <div className="bg-gradient-to-r from-green-700 to-emerald-600 rounded-xl p-3 mb-5 border border-emerald-500/30 flex justify-between items-center shadow-md overflow-hidden relative hover:shadow-emerald-500/20 hover:shadow-inner transition-all group hover:scale-[1.02]">
          <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-green-300/10 rounded-full blur-xl"></div>
          <div className="flex items-center relative z-10">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center border border-emerald-300/40">
              <FiStar className="text-green-900" size={16} />
            </div>
            <div className="mr-2 text-left">
              <div className="text-white text-sm font-bold">امتیازات مشتری</div>
              <div className="text-emerald-100 text-xs">باشگاه مشتریان</div>
            </div>
          </div>
          <div className="text-white font-bold text-xl relative z-10">
            {user.points.toLocaleString()}
          </div>
        </div>
      </div>
      
      {/* منوی اصلی */}
      <div className="border-t border-blue-800/30 flex-grow bg-gradient-to-b from-primary-900/70 to-primary-950/80 backdrop-blur-sm pt-3">
        <h3 className="text-white/80 text-xs font-bold px-6 mb-3 flex items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 ml-2"></span>
          منوی کاربری
        </h3>
        
        <div className="space-y-1 px-3">
          {[
            { id: 'overview', icon: FiHome, label: 'داشبورد', count: null, color: 'from-blue-500 to-blue-600' },
            { id: 'orders', icon: FiPackage, label: 'سفارشات', count: user.orders > 0 ? user.orders : null, color: 'from-amber-500 to-amber-600' },
            { id: 'wallet', icon: FiDollarSign, label: 'کیف پول', count: null, color: 'from-green-500 to-green-600' },
            { id: 'income', icon: FiTrendingUp, label: 'درآمد', count: null, color: 'from-emerald-600 to-emerald-700' },
            { id: 'favorites', icon: FiStar, label: 'علاقه‌مندی‌ها', count: user.favorites > 0 ? user.favorites : null, color: 'from-pink-500 to-pink-600' },
            { id: 'following', icon: FiUsers, label: 'دنبال شونده‌ها', count: null, color: 'from-indigo-500 to-indigo-600' },
            { id: 'addresses', icon: FiMapPin, label: 'آدرس‌ها', count: null, color: 'from-yellow-500 to-yellow-600' },
            { id: 'reviews', icon: FiMessageCircle, label: 'نظرات', count: null, color: 'from-purple-500 to-purple-600' },
            { id: 'notifications', icon: FiBell, label: 'اعلانات', count: 5, color: 'from-red-500 to-red-600' },
            { id: 'recent-views', icon: FiEye, label: 'بازدیدهای اخیر', count: null, color: 'from-teal-500 to-teal-600' },
            { id: 'club', icon: FiAward, label: 'باشگاه مشتریان', count: null, color: 'from-emerald-500 to-emerald-600' },
            { id: 'profile', icon: FiUser, label: 'اطلاعات حساب', count: null, color: 'from-blue-400 to-blue-500' },
            { id: 'support', icon: FiHeadphones, label: 'پشتیبانی', count: null, color: 'from-violet-500 to-violet-600' },
          ].map(item => (
            <button 
              key={item.id}
              className={`w-full p-3 flex items-center justify-between transition-all rounded-xl border border-transparent group relative overflow-hidden
                ${activeTab === item.id 
                  ? `bg-gradient-to-r ${item.color} text-white border-blue-400/20 shadow-lg shadow-blue-900/20` 
                  : `text-blue-300/90 hover:bg-primary-800/50 hover:text-white hover:border-blue-700/20`
                }`}
              onClick={() => onTabChange(item.id as 'overview' | 'profile' | 'orders' | 'favorites' | 'messages' | 'settings' | 'wallet' | 'addresses' | 'following' | 'reviews' | 'notifications' | 'recent-views' | 'club' | 'support' | 'income')}
            >
              {/* افکت گلیتر برای آیتم فعال */}
              {activeTab === item.id && (
                <>
                  <div className="absolute inset-0 overflow-hidden opacity-20">
                    <div className="glitter-grid absolute inset-0 w-[100%] h-[100%]"></div>
                  </div>
                  <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-400/10 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-blue-400/10 rounded-full blur-xl"></div>
                </>
              )}
              
              <span className="flex items-center relative z-10">
                <div className={`w-8 h-8 rounded-lg mr-1 flex items-center justify-center
                  ${activeTab === item.id 
                    ? `bg-white/10 shadow-inner`
                    : 'bg-primary-800/0 group-hover:bg-primary-800/40'
                  } transition-all duration-200`}
                >
                  <item.icon className={`${activeTab === item.id ? 'text-white' : 'text-blue-400/70 group-hover:text-blue-300'} transition-colors duration-200`} />
                </div>
                <span className={`${activeTab === item.id ? 'font-medium' : ''} transition-all`}>{item.label}</span>
              </span>
              
              <div className="flex items-center">
                {item.count !== null && (
                  <span className={`flex items-center justify-center min-w-6 h-6 rounded-lg text-xs
                    ${activeTab === item.id 
                      ? 'bg-white/20 text-white' 
                      : 'bg-blue-500/20 text-blue-200 group-hover:bg-blue-500/30'
                    } ml-2 transition-all duration-200`}>
                    {item.count}
                  </span>
                )}
              </div>
            </button>
          ))}
          
          {/* دکمه خروج در منو */}
          <button 
            className="w-full p-3 flex items-center justify-between transition-all rounded-xl border border-transparent 
              text-red-300/80 hover:text-red-200 hover:bg-red-900/20 hover:border-red-700/20 group mt-2"
            onClick={onLogout}
          >
            <span className="flex items-center">
              <div className="w-8 h-8 rounded-lg mr-1 flex items-center justify-center group-hover:bg-red-800/30 transition-all duration-200">
                <FiLogOut className="text-red-400/70 group-hover:text-red-300" />
              </div>
              <span>خروج از حساب کاربری</span>
            </span>
          </button>
        </div>
        
        {/* پانل راهنما */}
        <div className="mt-auto p-3">
          <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-3 text-blue-300/80 text-xs">
            <div className="text-white/90 font-bold mb-1 flex items-center">
              <FiShield className="ml-1 text-blue-400" size={14} />
              پشتیبانی حساب کاربری
            </div>
            <p className="leading-5">برای دریافت راهنمایی و پشتیبانی با ما در ارتباط باشید</p>
          </div>
        </div>
      </div>

  
    </div>
  );
} 