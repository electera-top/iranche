<?php
/**
 * Cart Template
 *
 * @package Themee
 */

get_header(); ?>

<main class="pt-20 md:pt-40 lg:pt-[73px]">
    <!-- main -->
    <div class="lg:px-20 lg:my-10 md:flex gap-5 px-5">
        <div class="md:w-8/12 px-2 sm:px-3">
            <!-- name -->
            <div class="text-zinc-800 font-semibold text-lg bg-white shadow-large rounded-xl p-3">
                سبد خرید شما
                <div>
                    <a class="text-sm text-zinc-500 hover:text-zinc-700 transition" href="<?php echo get_permalink(get_option('woocommerce_shop_page_id')); ?>">
                        فروشگاه
                    </a>
                    <span class="text-sm text-zinc-500">
                        /
                    </span>
                    <span class="text-sm text-zinc-500">
                        سبد خرید
                    </span>
                </div>
            </div>
            
            <?php if (class_exists('WooCommerce')): ?>
                <?php if (WC()->cart->is_empty()): ?>
                    <!-- Empty Cart -->
                    <div class="mt-7 flex flex-col items-center justify-center p-8 bg-white shadow-large rounded-xl">
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
                    <!-- Cart Items -->
                    <?php foreach (WC()->cart->get_cart() as $cart_item_key => $cart_item): ?>
                        <?php
                        $_product = apply_filters('woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key);
                        $product_id = apply_filters('woocommerce_cart_item_product_id', $cart_item['product_id'], $cart_item, $cart_item_key);
                        
                        if ($_product && $_product->exists() && $cart_item['quantity'] > 0 && apply_filters('woocommerce_cart_item_visible', true, $cart_item, $cart_item_key)):
                            $product_permalink = apply_filters('woocommerce_cart_item_permalink', $_product->is_visible() ? $_product->get_permalink($cart_item) : '', $cart_item, $cart_item_key);
                            ?>
                            <div class="mt-7 flex flex-col lg:flex-row gap-y-5 p-4 bg-white shadow-large rounded-xl">
                                <div class="w-10/12 mx-auto lg:max-w-36">
                                    <?php
                                    $thumbnail = apply_filters('woocommerce_cart_item_thumbnail', $_product->get_image(), $cart_item, $cart_item_key);
                                    if (!$product_permalink) {
                                        echo $thumbnail;
                                    } else {
                                        printf('<a href="%s">%s</a>', esc_url($product_permalink), $thumbnail);
                                    }
                                    ?>
                                </div>
                                <div class="mr-2 lg:mr-5 w-full flex flex-wrap gap-y-3">
                                    <div class="w-full lg:w-7/12">
                                        <div class="text-sm sm:text-base text-zinc-700 mb-5">
                                            <?php
                                            if (!$product_permalink) {
                                                echo wp_kses_post(apply_filters('woocommerce_cart_item_name', $_product->get_name(), $cart_item, $cart_item_key) . '&nbsp;');
                                            } else {
                                                echo wp_kses_post(apply_filters('woocommerce_cart_item_name', sprintf('<a href="%s">%s</a>', esc_url($product_permalink), $_product->get_name()), $cart_item, $cart_item_key));
                                            }
                                            ?>
                                        </div>
                                        <div>
                                            <span class="text-xl font-bold"><?php echo apply_filters('woocommerce_cart_item_price', WC()->cart->get_product_price($_product), $cart_item, $cart_item_key); ?></span>
                                        </div>
                                    </div>
                                    <div class="w-full lg:w-3/12 flex justify-center">
                                        <div class="text-gray-700">
                                            <div class="flex h-10 w-24 items-center justify-between rounded-lg border border-gray-100 px-2 py-1">
                                                <form method="post" action="<?php echo esc_url(wc_get_cart_url()); ?>">
                                                    <input type="hidden" name="cart_item_key" value="<?php echo esc_attr($cart_item_key); ?>">
                                                    <input type="hidden" name="quantity" value="<?php echo esc_attr($cart_item['quantity'] - 1); ?>">
                                                    <button type="submit" name="update_cart" class="fill-red-600">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                                                            <path d="M222,128a6,6,0,0,1-6,6H40a6,6,0,0,1,0-12H216A6,6,0,0,1,222,128Z"></path>
                                                        </svg>
                                                    </button>
                                                </form>
                                                <input value="<?php echo esc_attr($cart_item['quantity']); ?>" disabled="" type="number" class="flex h-5 w-full grow select-none items-center justify-center bg-transparent text-center text-sm text-zinc-700 outline-none">
                                                <form method="post" action="<?php echo esc_url(wc_get_cart_url()); ?>">
                                                    <input type="hidden" name="cart_item_key" value="<?php echo esc_attr($cart_item_key); ?>">
                                                    <input type="hidden" name="quantity" value="<?php echo esc_attr($cart_item['quantity'] + 1); ?>">
                                                    <button type="submit" name="update_cart" class="fill-green-600">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                                                            <path d="M222,128a6,6,0,0,1-6,6H134v82a6,6,0,0,1-12,0V134H40a6,6,0,0,1,0-12h82V40a6,6,0,0,1,12,0v82h82A6,6,0,0,1,222,128Z"></path>
                                                        </svg>
                                                    </button>
                                                </form>
                                            </div>
                                            <?php if ($_product->get_stock_quantity() && $_product->get_stock_quantity() < 5): ?>
                                                <div class="text-xs text-red-400 mt-3">تنها <?php echo $_product->get_stock_quantity(); ?> عدد در انبار باقی مانده</div>
                                            <?php endif; ?>
                                        </div>
                                    </div>
                                    <div class="w-full lg:w-2/12">
                                        <form method="post" action="<?php echo esc_url(wc_get_cart_url()); ?>">
                                            <input type="hidden" name="cart_item_key" value="<?php echo esc_attr($cart_item_key); ?>">
                                            <button type="submit" name="remove_item" class="flex justify-end">
                                                <svg class="fill-red-500 size-8 lg:size-7" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                                                    <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
                                                </svg>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        <?php endif; ?>
                    <?php endforeach; ?>
                <?php endif; ?>
            <?php endif; ?>
        </div>
        
        <!-- Cart Summary -->
        <div class="md:w-4/12 mt-8 md:mt-0">
            <?php if (class_exists('WooCommerce') && !WC()->cart->is_empty()): ?>
                <div class="px-2 sm:px-6 py-3 bg-white rounded-xl shadow-large">
                    <div class="flex justify-between items-center">
                        <div class="flex gap-x-1 items-center text-zinc-700">
                            <svg class="fill-blue-500" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="" viewBox="0 0 256 256">
                                <path d="M216,66H174V64a46,46,0,0,0-92,0v2H40A14,14,0,0,0,26,80V200a14,14,0,0,0,14,14H216a14,14,0,0,0,14-14V80A14,14,0,0,0,216,66ZM94,64a34,34,0,0,1,68,0v2H94ZM218,200a2,2,0,0,1-2,2H40a2,2,0,0,1-2-2V80a2,2,0,0,1,2-2H216a2,2,0,0,1,2,2Z"></path>
                            </svg>
                            هزینه ها
                        </div>
                        <!-- count product -->
                        <div class="text-zinc-400 text-sm mt-1">
                            <?php echo WC()->cart->get_cart_contents_count(); ?> کالا
                        </div>
                    </div>
                    
                    <div class="flex gap-x-1 justify-between items-center text-zinc-600 mt-5 bg-gray-100 rounded-lg px-2 py-3 text-sm">
                        <div>
                            قیمت کالاها (<?php echo WC()->cart->get_cart_contents_count(); ?>)
                        </div>
                        <div class="flex gap-x-1">
                            <div>
                                <?php echo WC()->cart->get_cart_subtotal(); ?>
                            </div>
                        </div>
                    </div>
                    
                    <?php if (WC()->cart->get_cart_discount_total() > 0): ?>
                        <div class="flex gap-x-1 justify-between items-center text-zinc-600 mt-3 bg-gray-100 rounded-lg px-2 py-3 text-sm">
                            <div>
                                تخفیف
                            </div>
                            <div class="flex gap-x-1">
                                <div>
                                    <?php echo '-' . WC()->cart->get_cart_discount_total(); ?>
                                </div>
                            </div>
                        </div>
                    <?php endif; ?>
                    
                    <div class="flex gap-x-1 justify-between items-center text-zinc-800 mt-3 bg-gray-100 rounded-lg px-2 py-3 text-sm">
                        <div>
                            جمع سبد خرید
                        </div>
                        <div class="flex gap-x-1">
                            <div>
                                <?php echo WC()->cart->get_cart_total(); ?>
                            </div>
                        </div>
                    </div>
                    
                    <a href="<?php echo esc_url(wc_get_checkout_url()); ?>" class="mx-auto block text-center w-full px-2 py-3 mt-5 text-sm bg-blue-500 hover:bg-blue-400 transition text-gray-100 rounded-lg">
                        تایید و تکمیل سفارش
                    </a>
                </div>
            <?php endif; ?>
        </div>
    </div>
</main>

<?php get_footer(); ?>
