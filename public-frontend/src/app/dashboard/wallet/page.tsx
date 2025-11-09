'use client';

import { useState } from 'react';
import { FiPlus, FiArrowDown, FiArrowUp, FiCheck, FiX, FiDownload, FiFilter, FiCalendar, FiBriefcase } from 'react-icons/fi';
import Button from '@/components/ui/button/Button';

// تعریف نوع تراکنش
interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'deposit' | 'withdraw' | 'purchase' | 'refund' | 'gold_exchange';
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

export default function WalletPage() {
  const [balance, setBalance] = useState(8560000); // موجودی به تومان
  const [goldBalance, setGoldBalance] = useState(120.5); // موجودی طلا به گرم
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'deposits' | 'withdraws' | 'purchases'>('all');

  // داده‌های نمونه تراکنش‌ها
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TRX-123456',
      date: '۱۲ فروردین ۱۴۰۲',
      amount: 1500000,
      type: 'deposit',
      status: 'completed',
      description: 'شارژ کیف پول'
    },
    {
      id: 'TRX-123455',
      date: '۱۰ فروردین ۱۴۰۲',
      amount: -850000,
      type: 'purchase',
      status: 'completed',
      description: 'خرید محصول - سفارش #ORD-789456'
    },
    {
      id: 'TRX-123454',
      date: '۵ فروردین ۱۴۰۲',
      amount: -500000,
      type: 'withdraw',
      status: 'pending',
      description: 'درخواست برداشت وجه'
    },
    {
      id: 'TRX-123453',
      date: '۲۸ اسفند ۱۴۰۱',
      amount: 350000,
      type: 'refund',
      status: 'completed',
      description: 'بازگشت وجه - سفارش #ORD-789123'
    },
    {
      id: 'TRX-123452',
      date: '۲۵ اسفند ۱۴۰۱',
      amount: -10.5,
      type: 'gold_exchange',
      status: 'completed',
      description: 'تبدیل طلا به اعتبار'
    }
  ]);

  // افزودن تراکنش جدید
  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      id: `TRX-${Math.floor(Math.random() * 1000000)}`,
      date: '۱۵ فروردین ۱۴۰۲', // در پروژه واقعی باید تاریخ امروز باشد
      ...transaction
    };
    
    setTransactions([newTransaction, ...transactions]);
    
    // بروزرسانی موجودی
    if (transaction.type === 'deposit') {
      setBalance(prev => prev + transaction.amount);
    } else if (transaction.type === 'withdraw') {
      setBalance(prev => prev + transaction.amount); // مقدار منفی از قبل اعمال شده
    }
  };

  // شارژ کیف پول
  const handleDeposit = () => {
    const amount = parseInt(depositAmount.replace(/,/g, ''));
    if (amount > 0) {
      addTransaction({
        amount: amount,
        type: 'deposit',
        status: 'completed',
        description: 'شارژ کیف پول'
      });
      setShowDepositModal(false);
      setDepositAmount('');
    }
  };

  // برداشت از کیف پول
  const handleWithdraw = () => {
    const amount = parseInt(withdrawAmount.replace(/,/g, ''));
    if (amount > 0 && amount <= balance) {
      addTransaction({
        amount: -amount,
        type: 'withdraw',
        status: 'pending',
        description: 'درخواست برداشت وجه'
      });
      setShowWithdrawModal(false);
      setWithdrawAmount('');
    }
  };

  // فرمت کردن اعداد به فرمت مبلغ
  const formatCurrency = (amount: number): string => {
    return Math.abs(amount).toLocaleString('fa-IR');
  };

  // نمایش آیکون مناسب برای هر نوع تراکنش
  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit': return <FiPlus className="text-green-500" />;
      case 'withdraw': return <FiArrowDown className="text-red-500" />;
      case 'purchase': return <FiArrowUp className="text-red-500" />;
      case 'refund': return <FiArrowDown className="text-green-500" />;
      case 'gold_exchange': return <FiBriefcase className="text-yellow-500" />;
    }
  };

  // نمایش کلاس رنگ مناسب برای هر وضعیت تراکنش
  const getStatusClass = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      case 'failed': return 'bg-red-500/10 text-red-500 border-red-500/30';
    }
  };

  // فیلتر کردن تراکنش‌ها
  const filteredTransactions = transactions.filter(transaction => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'deposits') return transaction.type === 'deposit' || transaction.type === 'refund';
    if (activeFilter === 'withdraws') return transaction.type === 'withdraw';
    if (activeFilter === 'purchases') return transaction.type === 'purchase';
    return true;
  });

  // محاسبه ارزش طلا به تومان (فرضی)
  const goldValue = goldBalance * 5000000; // هر گرم 5 میلیون تومان (فرضی)

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
          <FiBriefcase className="ml-2" />
          کیف پول من
        </h1>
        <p className="text-gray-400">مدیریت موجودی و تراکنش‌های کیف پول</p>
      </div>

      {/* کارت‌های موجودی */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* کارت موجودی تومان */}
        <div className="bg-gradient-to-r from-primary-800/90 via-primary-700/80 to-primary-800/90 rounded-xl p-6 border border-primary-600/30 shadow-lg backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-gray-300 text-sm mb-2">موجودی کیف پول</h3>
              <p className="text-white text-2xl font-bold">
                {formatCurrency(balance)} <span className="text-sm font-normal">تومان</span>
              </p>
            </div>
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
              <FiBriefcase className="text-blue-300" size={24} />
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button
              variant="primary"
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600/90 hover:bg-blue-600 border border-blue-500/20"
              onClick={() => setShowDepositModal(true)}
            >
              <FiPlus size={18} />
              شارژ کیف پول
            </Button>
            
            <Button
              variant="outline-primary"
              className="flex-1 flex items-center justify-center gap-2 bg-primary-800/50 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
              onClick={() => setShowWithdrawModal(true)}
            >
              <FiArrowDown size={18} />
              برداشت وجه
            </Button>
          </div>
        </div>
        
        {/* کارت موجودی طلا */}
        <div className="bg-gradient-to-r from-amber-900/40 via-yellow-800/40 to-amber-900/40 rounded-xl p-6 border border-yellow-700/30 shadow-lg backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-amber-300/90 text-sm mb-2">طلای 18 عیار</h3>
              <p className="text-white text-2xl font-bold">
                {goldBalance.toLocaleString('fa-IR')} <span className="text-sm font-normal">گرم</span>
              </p>
              <p className="text-amber-300/80 text-sm mt-1">
                معادل {formatCurrency(goldValue)} تومان
              </p>
            </div>
            <div className="p-2 bg-yellow-500/10 rounded-lg backdrop-blur-md">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 text-amber-300">
                <path fill="currentColor" d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-18C6.477 0 2 4.477 2 10c0 4.991 3.657 9.128 8.438 9.878V24h3.124v-4.122C18.343 19.128 22 14.991 22 10c0-5.523-4.477-10-10-10z"/>
              </svg>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button
              variant="primary"
              className="flex-1 flex items-center justify-center gap-2 bg-amber-600/90 hover:bg-amber-600 border border-amber-500/20"
            >
              <FiPlus size={18} />
              خرید طلا
            </Button>
            
            <Button
              variant="outline-primary"
              className="flex-1 flex items-center justify-center gap-2 bg-amber-900/50 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
            >
              <FiArrowDown size={18} />
              برداشت
            </Button>
          </div>
        </div>
      </div>
      
      {/* بخش تراکنش‌ها */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <FiDownload className="ml-2" />
            تاریخچه تراکنش‌ها
          </h2>
          
          <div className="flex gap-2">
            <Button
              variant="outline-primary"
              className="flex items-center gap-1 p-2 border-primary-700/50 text-white hover:bg-primary-800/70"
            >
              <FiCalendar size={18} />
            </Button>
            <Button
              variant="outline-primary"
              className="flex items-center gap-1 p-2 border-primary-700/50 text-white hover:bg-primary-800/70"
            >
              <FiFilter size={18} />
            </Button>
          </div>
        </div>
        
        {/* فیلترهای تراکنش */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2">
            <Button
              variant={activeFilter === 'all' ? 'primary' : 'outline-primary'}
              className={`min-w-[100px] ${activeFilter === 'all' ? '' : 'border-primary-700/50 text-gray-300'}`}
              onClick={() => setActiveFilter('all')}
            >
              همه تراکنش‌ها
            </Button>
            <Button
              variant={activeFilter === 'deposits' ? 'primary' : 'outline-primary'}
              className={`min-w-[100px] ${activeFilter === 'deposits' ? 'bg-green-600 hover:bg-green-700 border-green-500' : 'border-primary-700/50 text-gray-300'}`}
              onClick={() => setActiveFilter('deposits')}
            >
              واریز‌ها
            </Button>
            <Button
              variant={activeFilter === 'withdraws' ? 'primary' : 'outline-primary'}
              className={`min-w-[100px] ${activeFilter === 'withdraws' ? 'bg-red-600 hover:bg-red-700 border-red-500' : 'border-primary-700/50 text-gray-300'}`}
              onClick={() => setActiveFilter('withdraws')}
            >
              برداشت‌ها
            </Button>
            <Button
              variant={activeFilter === 'purchases' ? 'primary' : 'outline-primary'}
              className={`min-w-[100px] ${activeFilter === 'purchases' ? 'bg-blue-600 hover:bg-blue-700 border-blue-500' : 'border-primary-700/50 text-gray-300'}`}
              onClick={() => setActiveFilter('purchases')}
            >
              خریدها
            </Button>
          </div>
        </div>
        
        {/* لیست تراکنش‌ها */}
        <div className="space-y-4">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="bg-primary-800/30 border border-primary-700/30 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-primary-600/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    transaction.amount > 0 
                      ? 'bg-green-500/20 text-green-400' 
                      : transaction.type === 'gold_exchange'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                  }`}>
                    {getTransactionIcon(transaction.type)}
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium">{transaction.description}</h4>
                    <span className="text-gray-400 text-sm">{transaction.date} | {transaction.id}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 ml-0 sm:ml-auto">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusClass(transaction.status)}`}>
                    {transaction.status === 'completed' ? 'تکمیل شده' : 
                     transaction.status === 'pending' ? 'در حال انجام' : 'ناموفق'}
                  </span>
                  
                  <span className={`font-bold ${
                    transaction.amount > 0 
                      ? 'text-green-400' 
                      : transaction.type === 'gold_exchange'
                        ? 'text-yellow-400' 
                        : 'text-red-400'
                  }`}>
                    {transaction.type === 'gold_exchange' 
                      ? `${Math.abs(transaction.amount).toLocaleString('fa-IR')} گرم` 
                      : `${transaction.amount > 0 ? '+' : '-'} ${formatCurrency(transaction.amount)} تومان`
                    }
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-primary-800/30 border border-primary-700/30 rounded-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <FiBriefcase className="text-gray-400 text-5xl" />
              </div>
              <h3 className="text-white text-lg font-medium mb-2">تراکنشی یافت نشد</h3>
              <p className="text-gray-400">تراکنشی با معیارهای انتخاب شده وجود ندارد.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* مدال شارژ کیف پول */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-primary-900 border border-primary-700/50 rounded-lg w-full max-w-md overflow-hidden shadow-xl animate-fadeIn">
            <div className="border-b border-primary-800 p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">شارژ کیف پول</h3>
              <button 
                className="p-1 text-gray-400 hover:text-white"
                onClick={() => setShowDepositModal(false)}
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-gray-300 mb-2 text-sm">مبلغ به تومان</label>
                <input
                  type="text"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value.replace(/\D/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'))}
                  className="w-full bg-primary-800/50 border border-primary-700/50 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-all"
                  placeholder="مبلغ را وارد کنید"
                  dir="ltr"
                />
              </div>
              
              <div className="flex gap-3 justify-between">
                <Button 
                  variant="outline-primary"
                  className="flex-1 border-primary-700/50 text-gray-300 hover:bg-primary-800"
                  onClick={() => setShowDepositModal(false)}
                >
                  انصراف
                </Button>
                <Button 
                  variant="primary"
                  className={`flex-1 flex items-center justify-center gap-2 ${(!depositAmount || parseInt(depositAmount.replace(/,/g, '')) <= 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={depositAmount && parseInt(depositAmount.replace(/,/g, '')) > 0 ? handleDeposit : undefined}
                >
                  <FiCheck size={18} />
                  تایید و پرداخت
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* مدال برداشت از کیف پول */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-primary-900 border border-primary-700/50 rounded-lg w-full max-w-md overflow-hidden shadow-xl animate-fadeIn">
            <div className="border-b border-primary-800 p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">برداشت وجه</h3>
              <button 
                className="p-1 text-gray-400 hover:text-white"
                onClick={() => setShowWithdrawModal(false)}
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <div className="bg-primary-800/50 rounded-lg p-3 mb-6">
                  <p className="text-gray-300 text-sm mb-1">موجودی قابل برداشت</p>
                  <p className="text-white font-bold">{formatCurrency(balance)} تومان</p>
                </div>
                
                <label className="block text-gray-300 mb-2 text-sm">مبلغ برداشت (تومان)</label>
                <input
                  type="text"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value.replace(/\D/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'))}
                  className="w-full bg-primary-800/50 border border-primary-700/50 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-all"
                  placeholder="مبلغ را وارد کنید"
                  dir="ltr"
                />
                
                {parseInt(withdrawAmount.replace(/,/g, '') || '0') > balance && (
                  <p className="text-red-400 text-sm mt-2">مبلغ وارد شده بیشتر از موجودی است</p>
                )}
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-300 mb-2 text-sm">شماره شبا</label>
                <input
                  type="text"
                  className="w-full bg-primary-800/50 border border-primary-700/50 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-all"
                  placeholder="IR---------------------------------"
                  dir="ltr"
                />
              </div>
              
              <div className="flex gap-3 justify-between">
                <Button 
                  variant="outline-primary"
                  className="flex-1 border-primary-700/50 text-gray-300 hover:bg-primary-800"
                  onClick={() => setShowWithdrawModal(false)}
                >
                  انصراف
                </Button>
                <Button 
                  variant="primary"
                  className={`flex-1 flex items-center justify-center gap-2 ${(!withdrawAmount || parseInt(withdrawAmount.replace(/,/g, '')) <= 0 || parseInt(withdrawAmount.replace(/,/g, '')) > balance) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={withdrawAmount && parseInt(withdrawAmount.replace(/,/g, '')) > 0 && parseInt(withdrawAmount.replace(/,/g, '')) <= balance ? handleWithdraw : undefined}
                >
                  <FiCheck size={18} />
                  ثبت درخواست برداشت
                </Button>
          </div>
            </div>
          </div>
        </div>
      )}
      </div>
  );
} 