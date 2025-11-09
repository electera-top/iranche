'use client';

import { useState } from 'react';
import { FiMessageCircle, FiStar, FiEdit2, FiTrash2, FiFilter, FiCheck, FiX } from 'react-icons/fi';
import Button from '@/components/ui/button/Button';

// تعریف نوع داده‌ها
interface ProductReview {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  rating: number;
  comment: string;
  date: string;
  status: 'published' | 'pending' | 'rejected';
  likes: number;
  replies: number;
}

export default function ReviewsPage() {
  // داده‌های نمونه
  const [reviews, setReviews] = useState<ProductReview[]>([
    {
      id: 'REV-123456',
      productId: 'PROD-789',
      productName: 'دستبند طلا طرح کارتیه',
      productImage: '/images/products/bracelet1.jpg',
      rating: 4,
      comment: 'کیفیت ساخت بسیار عالی، دقیقا مطابق با توضیحات محصول بود. بسته‌بندی شیک و مرتب. ممنون از فروشگاه برای ارسال سریع.',
      date: '۱۲ فروردین ۱۴۰۲',
      status: 'published',
      likes: 8,
      replies: 1
    },
    {
      id: 'REV-123455',
      productId: 'PROD-456',
      productName: 'انگشتر طلا با نگین فیروزه',
      productImage: '/images/products/ring2.jpg',
      rating: 5,
      comment: 'فوق‌العاده زیبا و چشم‌نواز. نگین فیروزه از جنس عالی استفاده شده و رنگ آن بسیار زیباست. تشکر ویژه از فروشنده محترم.',
      date: '۵ فروردین ۱۴۰۲',
      status: 'published',
      likes: 12,
      replies: 2
    },
    {
      id: 'REV-123454',
      productId: 'PROD-123',
      productName: 'گردنبند طلا طرح ماه',
      productImage: '/images/products/necklace1.jpg',
      rating: 3,
      comment: 'کیفیت قفل گردنبند مناسب نبود و بعد از چند روز استفاده شل شد. از نظر ظاهری زیباست اما در ساخت قفل دقت بیشتری باید می‌شد.',
      date: '۱ فروردین ۱۴۰۲',
      status: 'pending',
      likes: 0,
      replies: 0
    },
    {
      id: 'REV-123453',
      productId: 'PROD-321',
      productName: 'النگو طلا نقش دار',
      productImage: '/images/products/bangle1.jpg',
      rating: 2,
      comment: 'اصلا راضی نبودم. رنگ محصول با تصویر تفاوت داشت و کیفیت پایین بود. بسته‌بندی نامناسب باعث خراشیدگی روی محصول شده بود.',
      date: '۲۸ اسفند ۱۴۰۱',
      status: 'rejected',
      likes: 0,
      replies: 1
    }
  ]);

  const [activeFilter, setActiveFilter] = useState<'all' | 'published' | 'pending' | 'rejected'>('all');
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editedComment, setEditedComment] = useState('');
  const [editedRating, setEditedRating] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // فیلتر کردن نظرات
  const filteredReviews = reviews.filter(review => {
    if (activeFilter === 'all') return true;
    return review.status === activeFilter;
  });

  // ویرایش نظر
  const startEdit = (review: ProductReview) => {
    setEditingReview(review.id);
    setEditedComment(review.comment);
    setEditedRating(review.rating);
  };

  // ذخیره تغییرات نظر
  const saveEdit = () => {
    if (!editingReview) return;
    
    setReviews(reviews.map(review => 
      review.id === editingReview 
        ? { ...review, comment: editedComment, rating: editedRating, status: 'pending' } 
        : review
    ));
    
    setEditingReview(null);
  };

  // لغو حذف نظر
  const cancelEdit = () => {
    setEditingReview(null);
  };

  // حذف نظر
  const deleteReview = (id: string) => {
    setReviews(reviews.filter(review => review.id !== id));
    setDeleteConfirm(null);
  };

  // ساخت ستاره‌های رتبه
  const renderStars = (rating: number, editable = false) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            className={`${
              editable ? 'cursor-pointer' : ''
            } ${
              star <= rating 
                ? 'text-amber-400' 
                : 'text-gray-500'
            }`}
            onClick={editable ? () => setEditedRating(star) : undefined}
          >
            <FiStar className={`${star <= rating ? 'fill-amber-400' : ''}`} />
          </span>
        ))}
      </div>
    );
  };

  // نمایش وضعیت نظر با رنگ مناسب
  const renderStatus = (status: ProductReview['status']) => {
    switch (status) {
      case 'published':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/30">
            منتشر شده
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/30">
            در انتظار تایید
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/30">
            رد شده
          </span>
        );
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
          <FiMessageCircle className="ml-2" />
          نظرات من
        </h1>
        <p className="text-gray-400">مدیریت نظرات و امتیازات شما در مورد محصولات</p>
      </div>

      {/* فیلترهای نظرات */}
      <div className="bg-primary-800/30 border border-primary-700/30 rounded-lg p-4 mb-6">
        <div className="flex gap-3 overflow-x-auto pb-2">
          <Button 
            variant={activeFilter === 'all' ? 'primary' : 'outline-primary'}
            className={`min-w-[100px] ${activeFilter === 'all' ? '' : 'border-primary-700/50 text-gray-300'}`}
            onClick={() => setActiveFilter('all')}
          >
            همه نظرات
          </Button>
          <Button 
            variant={activeFilter === 'published' ? 'primary' : 'outline-primary'}
            className={`min-w-[100px] ${activeFilter === 'published' ? 'bg-green-600 hover:bg-green-700 border-green-500' : 'border-primary-700/50 text-gray-300'}`}
            onClick={() => setActiveFilter('published')}
          >
            منتشر شده
          </Button>
          <Button 
            variant={activeFilter === 'pending' ? 'primary' : 'outline-primary'}
            className={`min-w-[100px] ${activeFilter === 'pending' ? 'bg-amber-600 hover:bg-amber-700 border-amber-500' : 'border-primary-700/50 text-gray-300'}`}
            onClick={() => setActiveFilter('pending')}
          >
            در انتظار تایید
          </Button>
          <Button 
            variant={activeFilter === 'rejected' ? 'primary' : 'outline-primary'}
            className={`min-w-[100px] ${activeFilter === 'rejected' ? 'bg-red-600 hover:bg-red-700 border-red-500' : 'border-primary-700/50 text-gray-300'}`}
            onClick={() => setActiveFilter('rejected')}
          >
            رد شده
          </Button>
        </div>
      </div>

      {/* لیست نظرات */}
      <div className="space-y-6">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div 
              key={review.id} 
              className={`bg-primary-800/30 border ${
                review.status === 'published' ? 'border-primary-700/30' : 
                review.status === 'pending' ? 'border-amber-700/30' : 
                'border-red-700/30'
              } rounded-lg p-5 hover:border-primary-600/50 transition-all`}
            >
              {/* اطلاعات محصول */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-20 h-20 rounded-lg bg-primary-700/70 overflow-hidden flex-shrink-0 border border-primary-600/40">
                  {/* در پروژه واقعی این تصویر باید جایگزین شود */}
                  <div className="w-full h-full bg-gradient-to-br from-amber-500/30 to-amber-700/30 flex items-center justify-center text-amber-300">
                    <FiStar size={24} />
                  </div>
                </div>
                
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-white text-lg">{review.productName}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-gray-400 text-sm">{review.date}</span>
                      </div>
                    </div>
                    
                    <div>
                      {renderStatus(review.status)}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* متن نظر */}
              {editingReview === review.id ? (
                <div className="mt-4">
                  <div className="mb-3">
                    <label className="block text-gray-300 mb-2 text-sm">امتیاز شما</label>
                    <div className="flex gap-1 text-2xl">
                      {renderStars(editedRating, true)}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2 text-sm">متن نظر</label>
                    <textarea
                      value={editedComment}
                      onChange={(e) => setEditedComment(e.target.value)}
                      className="w-full h-32 p-3 bg-primary-800/50 border border-primary-700/50 rounded-lg text-white resize-none focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button 
                      variant="outline-primary"
                      className="border-primary-700/50 text-gray-300"
                      onClick={cancelEdit}
                    >
                      انصراف
                    </Button>
                    <Button 
                      variant="primary"
                      className="bg-blue-600 hover:bg-blue-700 border-blue-500"
                      onClick={saveEdit}
                    >
                      ذخیره تغییرات
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-300 text-sm leading-relaxed mt-4">{review.comment}</p>
                  
                  {/* آمار و دکمه‌ها */}
                  <div className="flex flex-wrap justify-between items-center mt-4 pt-3 border-t border-primary-700/30">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{review.likes} پسند</span>
                      <span>{review.replies} پاسخ</span>
                    </div>
                    
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      {review.status !== 'rejected' && (
                        <Button 
                          variant="outline-primary"
                          className="text-sm border-primary-700/50 text-blue-400 hover:bg-blue-600/10"
                          onClick={() => startEdit(review)}
                        >
                          <FiEdit2 className="ml-1" size={16} />
                          ویرایش
                        </Button>
                      )}
                      
                      {deleteConfirm === review.id ? (
                        <div className="flex gap-2">
                          <Button 
                            variant="outline-primary"
                            className="text-sm border-primary-700/50 text-gray-300"
                            onClick={() => setDeleteConfirm(null)}
                          >
                            <FiX className="ml-1" size={16} />
                            انصراف
                          </Button>
                          <Button 
                            variant="primary"
                            className="text-sm bg-red-600 hover:bg-red-700 border-red-500"
                            onClick={() => deleteReview(review.id)}
                          >
                            <FiCheck className="ml-1" size={16} />
                            تایید حذف
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          variant="outline-primary"
                          className="text-sm border-red-500/30 text-red-400 hover:bg-red-500/10"
                          onClick={() => setDeleteConfirm(review.id)}
                        >
                          <FiTrash2 className="ml-1" size={16} />
                          حذف
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="bg-primary-800/30 border border-primary-700/30 rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <FiMessageCircle className="text-gray-400 text-5xl" />
            </div>
            <h3 className="text-white text-lg font-medium mb-2">نظری یافت نشد</h3>
            <p className="text-gray-400 mb-4">شما هنوز نظری برای محصولات ثبت نکرده‌اید یا نظری با فیلتر انتخاب شده وجود ندارد.</p>
            <Button
              variant="primary"
              className="inline-flex items-center justify-center gap-2"
              onClick={() => setActiveFilter('all')}
            >
              <FiFilter size={18} />
              نمایش همه نظرات
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 