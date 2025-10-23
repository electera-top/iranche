<?php
/**
 * Checkout Page Template
 *
 * @package Themee
 */

get_header(); ?>

<main class="pt-20 md:pt-40 lg:pt-[73px]">
    <div class="lg:px-20 lg:my-10 px-5">
        <!-- Header -->
        <div class="text-zinc-800 font-semibold text-lg bg-white shadow-large rounded-xl p-3 mb-7">
            تکمیل سفارش
            <div>
                <a class="text-sm text-zinc-500 hover:text-zinc-700 transition" href="<?php echo get_permalink(get_option('woocommerce_shop_page_id')); ?>">
                    فروشگاه
                </a>
                <span class="text-sm text-zinc-500"> / </span>
                <a class="text-sm text-zinc-500 hover:text-zinc-700 transition" href="<?php echo esc_url(wc_get_cart_url()); ?>">
                    سبد خرید
                </a>
                <span class="text-sm text-zinc-500"> / </span>
                <span class="text-sm text-zinc-500">تکمیل سفارش</span>
            </div>
        </div>
        
        <?php if (class_exists('WooCommerce')): ?>
            <?php if (WC()->cart->is_empty()): ?>
                <!-- Empty Cart -->
                <div class="flex flex-col items-center justify-center p-8 bg-white shadow-large rounded-xl">
                    <svg class="w-16 h-16 text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M134,120v56a6,6,0,0,1-12,0V120a6,6,0,0,1,12,0ZM237.88,97.85,224,201.85A14,14,0,0,1,210.13,214H45.87A14,14,0,0,1,32,201.85l-13.87-104A14,14,0,0,1,32,82H69.28l54.2-61.95a6,6,0,0,1,9,0l54.2,62H224a14,14,0,0,1,13.87,15.85ZM85.22,82h85.56L128,33.11ZM225.5,94.68A2,2,0,0,0,224,94H32a2,2,0,0,0-1.51.68A2,2,0,0,0,30,96.26l13.86,104a2,2,0,0,0,2,1.73H210.13a2,2,0,0,0,2-1.73L226,96.26A1.93,1.93,0,0,0,225.5,94.68ZM181.4,114a6,6,0,0,0-6.57,5.37l-5.6,56A6,6,0,0,0,174.6,182l.61,0a6,6,0,0,0,6-5.4l5.6-56A6,6,0,0,0,181.4,114ZM81.17,119.4a6,6,0,0,0-11.94,1.2l5.6,56a6,6,0,0,0,6,5.4l.61,0a6,6,0,0,0,5.37-6.57Z"></path>
                    </svg>
                    <h3 class="text-xl font-semibold text-gray-700 mb-2">سبد خرید شما خالی است</h3>
                    <p class="text-gray-500 mb-6">محصولی برای خرید انتخاب نکرده‌اید</p>
                    <a href="<?php echo get_permalink(get_option('woocommerce_shop_page_id')); ?>" class="bg-blue-500 hover:bg-blue-400 transition text-white px-6 py-3 rounded-lg">
                        شروع خرید
                    </a>
                </div>
            <?php else: ?>
                <!-- Checkout Form -->
                <div class="bg-white shadow-large rounded-xl p-6">
                    <?php
                    // Display WooCommerce checkout form
                    wc_get_template('checkout/form-checkout.php');
                    ?>
                </div>
            <?php endif; ?>
        <?php endif; ?>
    </div>
</main>

<?php get_footer(); ?>
