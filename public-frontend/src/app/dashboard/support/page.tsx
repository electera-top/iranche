'use client';

import { useState } from 'react';
import { FiSend, FiHeadphones, FiActivity } from 'react-icons/fi';
import Button from '@/components/ui/button/Button';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'normal',
    attachments: null as File[] | null,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        attachments: Array.from(e.target.files as FileList)
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // در اینجا ارسال اطلاعات به API انجام می‌شود
      console.log('Submitting support request:', formData);
      
      // شبیه‌سازی تأخیر در ارسال درخواست
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // پاکسازی فرم و نمایش پیام موفقیت
      setFormData({
        subject: '',
        message: '',
        priority: 'normal',
        attachments: null,
      });
      setSubmitSuccess(true);
      
      // پس از چند ثانیه پیام موفقیت را پنهان کن
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting support request:', error);
      setSubmitError('خطا در ارسال درخواست. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="p-6 dashboard-content">
      {/* هدر صفحه */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-900 to-primary-950 p-6 mb-8 border border-primary-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl"></div>
        <h2 className="text-2xl font-bold text-white mb-3 flex items-center relative z-10">
          <FiHeadphones className="ml-2 text-secondary" />
          پشتیبانی
        </h2>
        <p className="text-gray-300 mb-2 relative z-10">ارسال درخواست پشتیبانی</p>
        <p className="text-gray-400 text-sm relative z-10">از طریق این فرم می‌توانید درخواست‌های خود را برای تیم پشتیبانی ارسال کنید. کارشناسان ما در کمتر از ۲۴ ساعت پاسخگوی شما خواهند بود.</p>
      </div>
      
      {/* بخش فرم */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* فرم پشتیبانی */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-800/70 to-primary-900/90 p-6 border border-primary-700/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <FiActivity className="ml-2 text-secondary" />
            فرم درخواست پشتیبانی
          </h3>
          
          {submitSuccess ? (
            <div className="bg-green-900/30 border border-green-700/50 text-green-300 rounded-lg p-4 mb-4 flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-800/50 flex items-center justify-center ml-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-green-300">درخواست شما با موفقیت ثبت شد</h3>
                <p className="text-sm mt-1 text-green-400/80">کارشناسان ما در اسرع وقت به درخواست شما رسیدگی خواهند کرد.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {submitError && (
                <div className="bg-red-900/30 border border-red-700/50 text-red-300 rounded-lg p-4 mb-4">
                  {submitError}
                </div>
              )}
              
              <div>
                <label htmlFor="subject" className="block text-gray-300 font-medium mb-2">موضوع</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-primary-950/60 border border-primary-700/50 focus:border-secondary/70 focus:ring-2 focus:ring-secondary/20 transition-all outline-none text-white placeholder-gray-500"
                  placeholder="موضوع درخواست خود را وارد کنید"
                />
              </div>
              
              <div>
                <label htmlFor="priority" className="block text-gray-300 font-medium mb-2">اولویت</label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-primary-950/60 border border-primary-700/50 focus:border-secondary/70 focus:ring-2 focus:ring-secondary/20 transition-all outline-none text-white"
                >
                  <option value="low">کم - غیر فوری</option>
                  <option value="normal">متوسط - معمولی</option>
                  <option value="high">زیاد - فوری</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-gray-300 font-medium mb-2">متن پیام</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-primary-950/60 border border-primary-700/50 focus:border-secondary/70 focus:ring-2 focus:ring-secondary/20 transition-all outline-none resize-none text-white placeholder-gray-500"
                  placeholder="جزئیات درخواست خود را شرح دهید..."
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="attachments" className="block text-gray-300 font-medium mb-2">فایل‌های پیوست (اختیاری)</label>
                <div className="border border-dashed border-primary-700/70 rounded-lg p-4 bg-primary-950/30 hover:bg-primary-950/50 transition-all">
                  <input
                    type="file"
                    id="attachments"
                    name="attachments"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="attachments" className="flex flex-col items-center justify-center cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                    </svg>
                    <span className="text-sm text-gray-400 font-medium mb-1">برای آپلود فایل کلیک کنید یا فایل را اینجا رها کنید</span>
                    <span className="text-xs text-gray-500">حداکثر اندازه هر فایل: 5MB</span>
                  </label>
                  
                  {formData.attachments && formData.attachments.length > 0 && (
                    <div className="mt-4 border-t border-primary-700/30 pt-4">
                      <p className="text-xs text-gray-400 mb-2">{formData.attachments.length} فایل انتخاب شده:</p>
                      <ul className="text-xs text-gray-400">
                        {formData.attachments.map((file, index) => (
                          <li key={index} className="mb-1 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {file.name} ({(file.size / 1024).toFixed(1)} KB)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant={isSubmitting ? "disabled" : "secondary"}
                  className={`w-full flex items-center justify-center ${
                    isSubmitting 
                      ? 'bg-primary-700/50 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-secondary/90 to-secondary text-primary-950 font-bold border-none hover:from-secondary hover:to-secondary/90'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      در حال ارسال...
                    </>
                  ) : (
                    <>
                      <FiSend className="ml-2" />
                      ارسال درخواست پشتیبانی
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
        
        {/* راهنما و اطلاعات تماس */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-800/70 to-primary-900/90 p-6 border border-primary-700/30">
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary/5 rounded-full blur-2xl"></div>
          <h3 className="text-lg font-bold text-white mb-6 flex items-center">
            <FiHeadphones className="ml-2 text-secondary" />
            اطلاعات تماس
          </h3>
          
          <div className="space-y-6">
            <div className="p-4 bg-primary-950/50 rounded-lg border border-primary-800/30 hover:border-primary-700/50 transition-all duration-300">
              <h4 className="text-white font-bold mb-3">ساعات پاسخگویی</h4>
              <p className="text-gray-400 text-sm mb-2">شنبه تا چهارشنبه: ۸ صبح تا ۸ شب</p>
              <p className="text-gray-400 text-sm">پنجشنبه: ۸ صبح تا ۱۳ ظهر</p>
            </div>
            
            <div className="p-4 bg-primary-950/50 rounded-lg border border-primary-800/30 hover:border-primary-700/50 transition-all duration-300">
              <h4 className="text-white font-bold mb-3">راه‌های ارتباطی</h4>
              <p className="text-gray-400 text-sm mb-2">تلفن: ۰۲۱-۱۲۳۴۵۶۷۸</p>
              <p className="text-gray-400 text-sm">پست الکترونیکی: support@example.com</p>
            </div>
            
            <div className="p-4 bg-primary-950/50 rounded-lg border border-primary-800/30 hover:border-primary-700/50 transition-all duration-300">
              <h4 className="text-white font-bold mb-3">راهنمای ارسال درخواست</h4>
              <ul className="list-disc list-inside text-gray-400 text-sm space-y-2">
                <li>موضوع درخواست را به صورت مختصر و مفید بنویسید</li>
                <li>در متن پیام جزئیات کامل مشکل را شرح دهید</li>
                <li>در صورت امکان، تصاویر مرتبط با مشکل را پیوست کنید</li>
                <li>اولویت درخواست را به درستی انتخاب کنید</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .dashboard-content {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
} 