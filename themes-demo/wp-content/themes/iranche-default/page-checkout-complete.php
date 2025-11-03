<?php
/**
 * Checkout Complete Page Template
 *
 * @package Themee
 */

get_header(); ?>

<main class="pt-20 md:pt-40 lg:pt-[73px]">
    <div class="lg:px-20 lg:my-10 px-5">
        <!-- Header -->
        <div class="text-zinc-800 font-semibold text-lg bg-white shadow-large rounded-xl p-3 mb-7">
            سفارش تکمیل شد
            <div>
                <a class="text-sm text-zinc-500 hover:text-zinc-700 transition" href="<?php echo get_permalink(get_option('woocommerce_shop_page_id')); ?>">
                    فروشگاه
                </a>
                <span class="text-sm text-zinc-500"> / </span>
                <span class="text-sm text-zinc-500">تکمیل سفارش</span>
            </div>
        </div>
        
        <?php if (class_exists('WooCommerce')): ?>
            <!-- Success Message -->
            <div class="flex flex-col items-center justify-center p-8 bg-white shadow-large rounded-xl">
                <svg class="w-16 h-16 text-green-500 mb-4" xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M172.24,99.76a6,6,0,0,1,0,8.48l-56,56a6,6,0,0,1-8.48,0l-24-24a6,6,0,0,1,8.48-8.48L112,151.51l51.76-51.75A6,6,0,0,1,172.24,99.76Z"></path>
                </svg>
                <h3 class="text-xl font-semibold text-gray-700 mb-2">سفارش شما با موفقیت ثبت شد!</h3>
                <p class="text-gray-500 mb-6 text-center">سفارش شما دریافت شد و در حال پردازش است. کد پیگیری سفارش برای شما ارسال خواهد شد.</p>
                
                <div class="flex flex-col sm:flex-row gap-4">
                    <a href="<?php echo get_permalink(get_option('woocommerce_shop_page_id')); ?>" class="bg-blue-500 hover:bg-blue-400 transition text-white px-6 py-3 rounded-lg text-center">
                        ادامه خرید
                    </a>
                    <a href="<?php echo get_permalink(get_option('woocommerce_myaccount_page_id')); ?>" class="bg-gray-500 hover:bg-gray-400 transition text-white px-6 py-3 rounded-lg text-center">
                        مشاهده سفارشات
                    </a>
                </div>
            </div>
        <?php endif; ?>
    </div>
</main>

<?php get_footer(); ?>