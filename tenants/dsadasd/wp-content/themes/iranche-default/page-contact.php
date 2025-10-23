<?php
/**
 * Template for displaying Contact Us page
 *
 * @package Themee
 */

get_header(); ?>

<main class="pt-20 md:pt-40 lg:pt-[73px]">
    <div class="bg-white shadow-large lg:my-10 mx-5 rounded-xl md:rounded-2xl p-3 md:p-5 border">
        <div class="relative flex justify-center items-center mb-5">
            <img class="w-full h-96 md:h-[500px] object-center object-cover rounded-xl blur-sm" src="<?php echo get_template_directory_uri(); ?>/assets/image/bgConatactUs.jpg" alt="تماس با ما">
            <div class="absolute top-0 bg-zinc-400 bg-opacity-50 w-full h-full flex justify-center items-center text-white font-semibold rounded-xl">
                <div class="text-center space-y-5">
                    <div class="text-3xl sm:text-3xl md:text-5xl">تماس با ما</div>
                    <div class="text-xl sm:text-2xl md:text-4xl">ما اینجا هستیم تا به شما کمک کنیم</div>
                </div>
            </div>
        </div>
        
        <div class="leading-10">
            <div class="mb-2 text-lg font-semibold text-zinc-800">
                اطلاعات تماس
            </div>
            <div class="text-zinc-700" style="line-height: 1.8rem;">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <div class="flex items-center gap-x-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#3b82f6" viewBox="0 0 256 256">
                                <path d="M128,66a38,38,0,1,0,38,38A38,38,0,0,0,128,66Zm0,64a26,26,0,1,1,26-26A26,26,0,0,1,128,130Zm0-112a86.1,86.1,0,0,0-86,86c0,30.91,14.34,63.74,41.47,94.94a252.32,252.32,0,0,0,41.09,38,6,6,0,0,0,6.88,0,252.32,252.32,0,0,0,41.09-38c27.13-31.2,41.47-64,41.47-94.94A86.1,86.1,0,0,0,128,18Zm0,206.51C113,212.93,54,163.62,54,104a74,74,0,0,1,148,0C202,163.62,143,212.93,128,224.51Z"></path>
                            </svg>
                            <div>
                                <div class="font-semibold">آدرس:</div>
                                <div>تهران-خیابان دماوند</div>
                            </div>
                        </div>
                        
                        <div class="flex items-center gap-x-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#3b82f6" viewBox="0 0 256 256">
                                <path d="M128,26a102,102,0,0,0,0,204c21.13,0,43.31-6.35,59.32-17a6,6,0,0,0-6.65-10c-13.9,9.25-34.09,15-52.67,15a90,90,0,1,1,90-90c0,29.58-13.78,34-22,34s-22-4.42-22-34V88a6,6,0,0,0-12,0v9a46,46,0,1,0,4.34,56.32C171.76,166.6,182,174,196,174c21.29,0,34-17.2,34-46A102.12,102.12,0,0,0,128,26Zm0,136a34,34,0,1,1,34-34A34,34,0,0,1,128,162Z"></path>
                            </svg>
                            <div>
                                <div class="font-semibold">ایمیل:</div>
                                <div>example@gmail.com</div>
                            </div>
                        </div>
                        
                        <div class="flex items-center gap-x-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#3b82f6" viewBox="0 0 256 256">
                                <path d="M176,18H80A22,22,0,0,0,58,40V216a22,22,0,0,0,22,22h96a22,22,0,0,0,22-22V40A22,22,0,0,0,176,18Zm10,198a10,10,0,0,1-10,10H80a10,10,0,0,1-10-10V40A10,10,0,0,1,80,30h96a10,10,0,0,1,10,10ZM138,60a10,10,0,1,1-10-10A10,10,0,0,1,138,60Z"></path>
                            </svg>
                            <div>
                                <div class="font-semibold">تلفن:</div>
                                <div>0912345678</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="space-y-4">
                        <div class="mb-2 text-lg font-semibold text-zinc-800">
                            ساعات کاری
                        </div>
                        <div class="text-zinc-700">
                            <div class="mb-2">شنبه تا پنج‌شنبه: 8:00 - 18:00</div>
                            <div class="mb-2">جمعه: 9:00 - 14:00</div>
                            <div class="mb-2">پشتیبانی 24 ساعته</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mb-2 mt-8 text-lg font-semibold text-zinc-800">
                فرم تماس
            </div>
            <div class="text-zinc-700" style="line-height: 1.8rem;">
                <form class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">نام و نام خانوادگی</label>
                            <input type="text" id="name" name="name" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                        </div>
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">ایمیل</label>
                            <input type="email" id="email" name="email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                        </div>
                    </div>
                    <div>
                        <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">موضوع</label>
                        <input type="text" id="subject" name="subject" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    </div>
                    <div>
                        <label for="message" class="block text-sm font-medium text-gray-700 mb-2">پیام</label>
                        <textarea id="message" name="message" rows="5" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required></textarea>
                    </div>
                    <div>
                        <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition">
                            ارسال پیام
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</main>

<?php get_footer(); ?>
