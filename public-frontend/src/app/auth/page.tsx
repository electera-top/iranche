'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowRight, FiPhone, FiLock, FiUser } from 'react-icons/fi';
import Button from '@/components/ui/button/Button';
import Logo from '@/components/common/logo/Logo';

type AuthStep = 'phone' | 'verification' | 'profile';
type AuthMode = 'login' | 'register';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('login');
  const [step, setStep] = useState<AuthStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhoneSubmit = () => {
    setLoading(true);
    setError('');
    
    // Validate phone number
    if (!phoneNumber || phoneNumber.length !== 11) {
      setError('لطفا شماره موبایل معتبر وارد کنید');
      setLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep('verification');
    }, 1500);
  };

  const handleVerificationSubmit = () => {
    setLoading(true);
    setError('');
    
    // Validate verification code
    if (!verificationCode || verificationCode.length !== 6) {
      setError('لطفا کد تایید معتبر وارد کنید');
      setLoading(false);
      return;
    }
    
    // If in register mode, go to profile step
    if (mode === 'register') {
      setLoading(false);
      setStep('profile');
    } else {
      // If in login mode, complete the process
      setTimeout(() => {
        setLoading(false);
        router.push('/');
      }, 1500);
    }
  };

  const handleProfileSubmit = () => {
    setLoading(true);
    setError('');
    
    // Validate full name
    if (!fullName || fullName.length < 3) {
      setError('لطفا نام کامل معتبر وارد کنید');
      setLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.push('/');
    }, 1500);
  };

  const resetForm = () => {
    setPhoneNumber('');
    setVerificationCode('');
    setFullName('');
    setError('');
    setStep('phone');
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    resetForm();
  };

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <h1 className="text-2xl font-bold text-white text-center mb-6">
            {mode === 'login' ? 'ورود به حساب کاربری' : 'ثبت نام'}
          </h1>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}
          
          {step === 'phone' && (
            <div>
              <div className="mb-6">
                <label htmlFor="phone" className="block text-gray-300 mb-2 text-sm">
                  شماره موبایل
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    className="w-full bg-white/5 border border-gray-700 rounded-lg px-4 py-3 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    dir="ltr"
                    maxLength={11}
                    required
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  کد تایید به شماره موبایل شما ارسال خواهد شد
                </p>
              </div>
              
              <Button
                type="button"
                variant="primary"
                size="lg"
                className={`w-full justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={loading ? undefined : handlePhoneSubmit}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    <span>در حال ارسال...</span>
                  </div>
                ) : (
                  <div className="text-center">
                    ارسال کد تایید
                  </div>
                )}
              </Button>
            </div>
          )}
          
          {step === 'verification' && (
            <div>
              <div className="mb-6">
                <label htmlFor="verification" className="block text-gray-300 mb-2 text-sm">
                  کد تایید
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="verification"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full bg-white/5 border border-gray-700 rounded-lg px-4 py-3 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="کد تایید را وارد کنید"
                    dir="ltr"
                    maxLength={6}
                    required
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    کد تایید به شماره {phoneNumber} ارسال شد
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="text-xs font-medium"
                    onClick={() => setStep('phone')}
                  >
                    تغییر شماره
                  </Button>
                </div>
              </div>
              
              <Button
                type="button"
                variant="primary"
                size="lg"
                className={`w-full justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={loading ? undefined : handleVerificationSubmit}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    <span>در حال تایید...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>{mode === 'login' ? ' ورود' : 'تایید و ادامه'}</span>
                  </div>
                )}
              </Button>
            </div>
          )}
          
          {step === 'profile' && (
            <div>
              <div className="mb-6">
                <label htmlFor="fullName" className="block text-gray-300 mb-2 text-sm">
                  نام کامل
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white/5 border border-gray-700 rounded-lg px-4 py-3 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="نام و نام خانوادگی خود را وارد کنید"
                    required
                  />
                </div>
              </div>
              
              <Button
                type="button"
                variant="primary"
                size="lg"
                className={`w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={loading ? undefined : handleProfileSubmit}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    <span>در حال ثبت نام...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>تکمیل ثبت نام</span>
                    <FiArrowRight />
                  </div>
                )}
              </Button>
            </div>
          )}
          
         
        </div>
      </div>
    </div>
  );
} 