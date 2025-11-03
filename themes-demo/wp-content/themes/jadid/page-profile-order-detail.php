<?php
/**
 * Template Name: Profile Order Detail
 * 
 * @package Themee
 */

get_header(); 

// Get order ID from URL
$order_id = get_query_var('view-order');
if (!$order_id) {
    wp_redirect(wc_get_account_endpoint_url('orders'));
    exit;
}

$order = wc_get_order($order_id);
if (!$order || $order->get_customer_id() !== get_current_user_id()) {
    wp_redirect(wc_get_account_endpoint_url('orders'));
    exit;
}
?>

<main class="pt-20 md:pt-40 lg:pt-[73px]">
    <div class="lg:my-10 mx-5 p-3 md:p-5 md:flex gap-5">
        <!-- Sidebar -->
        <div class="md:w-3/12 bg-white shadow-large rounded-2xl py-3">
            <svg class="fill-zinc-700 mx-auto" xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="" viewBox="0 0 256 256"><path d="M224,128a95.76,95.76,0,0,1-31.8,71.37A72,72,0,0,0,128,160a40,40,0,1,0-40-40,40,40,0,0,0,40,40,72,72,0,0,0-64.2,39.37h0A96,96,0,1,1,224,128Z" opacity="0.2"></path><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path></svg>
            <div class="text-center font-semibold text-lg md:text-xl text-zinc-700">
                <?php echo wp_get_current_user()->display_name; ?>
            </div>
            <ul class="px-5 py-3 space-y-1">
                <li class="px-3 py-2 group flex gap-x-2 group items-center">
                    <span class="w-1 h-0 group-hover:h-7 transition-all rounded-md bg-blue-700"></span>
                    <a class="flex gap-x-1 items-center text-zinc-700 hover:text-zinc-600 my-1 w-full" href="<?php echo wc_get_page_permalink('myaccount'); ?>">
                        <svg class="fill-zinc-600 group-hover:fill-zinc-700" xmlns="http://www.w3.org/2000/svg" width="16" height="16" width="12.25" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>
                        پروفایل
                    </a>
                </li>
                <li class="px-3 py-2 group flex gap-x-2 group items-center">
                    <span class="w-1 h-7 transition-all rounded-md bg-blue-700"></span>
                    <a class="flex gap-x-1 items-center text-blue-700 my-1 w-full" href="<?php echo wc_get_account_endpoint_url('orders'); ?>">
                        <svg class="fill-zinc-600 group-hover:fill-zinc-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="16" height="16"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>
                        سفارش ها
                    </a>
                </li>
                <li class="px-3 py-2 group flex gap-x-2 group items-center">
                    <span class="w-1 h-0 group-hover:h-7 transition-all rounded-md bg-blue-700"></span>
                    <a class="flex gap-x-1 items-center text-zinc-700 hover:text-zinc-600 my-1 w-full" href="<?php echo wc_get_account_endpoint_url('favorites'); ?>">
                        <svg class="fill-zinc-600 group-hover:fill-zinc-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>
                        علاقه مندی ها
                    </a>
                </li>
                <li class="px-3 py-2 group flex gap-x-2 group items-center">
                    <span class="w-1 h-0 group-hover:h-7 transition-all rounded-md bg-blue-700"></span>
                    <a class="flex gap-x-1 items-center text-zinc-700 hover:text-zinc-600 my-1 w-full" href="<?php echo wc_get_account_endpoint_url('messages'); ?>">
                        <svg class="fill-zinc-600 group-hover:fill-zinc-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16"><path d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64h96v80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64z"/></svg>
                        پیام ها
                    </a>
                </li>
                <li class="px-3 py-2 group flex gap-x-2 group items-center">
                    <span class="w-1 h-0 group-hover:h-7 transition-all rounded-md bg-blue-700"></span>
                    <a class="flex gap-x-1 items-center text-zinc-700 hover:text-zinc-600 my-1 w-full" href="<?php echo wc_get_account_endpoint_url('addresses'); ?>">
                        <svg class="fill-zinc-600 group-hover:fill-zinc-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="16" height="16"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>
                        آدرس های من
                    </a>
                </li>
                <li class="px-3 py-2 group flex gap-x-2 group items-center">
                    <span class="w-1 h-0 group-hover:h-7 transition-all rounded-md bg-blue-700"></span>
                    <a class="flex gap-x-1 items-center text-zinc-700 hover:text-zinc-600 my-1 w-full" href="<?php echo wc_get_account_endpoint_url('edit-account'); ?>">
                        <svg class="fill-zinc-600 group-hover:fill-zinc-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
                        اطلاعات شخصی
                    </a>
                </li>
                <li class="px-3 py-2 group flex gap-x-2 group items-center">
                    <span class="w-1 h-0 group-hover:h-7 transition-all rounded-md bg-red-700"></span>
                    <a class="flex gap-x-1 items-center text-red-600 my-1 w-full group-hover:text-red-700" href="<?php echo wp_logout_url(home_url()); ?>">
                        <svg class="fill-red-500 group-hover:fill-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="16" height="16"><path d="M320 32c0-9.9-4.5-19.2-12.3-25.2S289.8-1.4 280.2 1l-179.9 45C79 51.3 64 70.5 64 92.5V448H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H96 288h32V480 32zM256 256c0 17.7-10.7 32-24 32s-24-14.3-24-32s10.7-32 24-32s24 14.3 24 32zm96-128h96V480c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H512V128c0-35.3-28.7-64-64-64H352v64z"/></svg>
                        خروج
                    </a>
                </li>
            </ul>
        </div>
        
        <!-- Main Content -->
        <div class="md:w-9/12 bg-white shadow-large rounded-2xl p-5 mt-5 md:mt-0">
            <div class="">
                <div class="flex justify-between items-center mb-6">
                    <div class="text-zinc-800 text-lg font-semibold">
                        جزئیات سفارش #<?php echo $order->get_order_number(); ?>
                    </div>
                    <a href="<?php echo wc_get_account_endpoint_url('orders'); ?>" class="text-blue-500 hover:text-blue-600 text-sm">
                        ← بازگشت به سفارش‌ها
                    </a>
                </div>
                
                <!-- Order Status -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div class="flex items-center gap-x-2">
                        <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span class="text-blue-700 font-medium">
                            وضعیت سفارش: 
                            <?php
                            $status_texts = array(
                                'pending' => 'در انتظار پرداخت',
                                'processing' => 'در حال پردازش',
                                'on-hold' => 'در انتظار',
                                'completed' => 'تکمیل شده',
                                'cancelled' => 'لغو شده',
                                'refunded' => 'بازگردانده شده',
                                'failed' => 'ناموفق',
                            );
                            echo isset($status_texts[$order->get_status()]) ? $status_texts[$order->get_status()] : $order->get_status();
                            ?>
                        </span>
                    </div>
                </div>
                
                <!-- Order Details -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h3 class="font-semibold text-gray-800 mb-3">اطلاعات سفارش</h3>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-600">شماره سفارش:</span>
                                <span class="text-gray-800">#<?php echo $order->get_order_number(); ?></span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">تاریخ سفارش:</span>
                                <span class="text-gray-800"><?php echo $order->get_date_created()->date_i18n('Y/m/d H:i'); ?></span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">مبلغ کل:</span>
                                <span class="text-gray-800 font-semibold"><?php echo wc_price($order->get_total()); ?></span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">روش پرداخت:</span>
                                <span class="text-gray-800"><?php echo $order->get_payment_method_title(); ?></span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h3 class="font-semibold text-gray-800 mb-3">آدرس ارسال</h3>
                        <div class="text-sm text-gray-800">
                            <?php echo $order->get_formatted_shipping_address(); ?>
                        </div>
                    </div>
                </div>
                
                <!-- Order Items -->
                <div class="mb-6">
                    <h3 class="font-semibold text-gray-800 mb-4">محصولات سفارش</h3>
                    <div class="overflow-x-auto">
                        <table class="w-full border border-gray-200 rounded-lg">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="text-right p-3 text-sm font-medium text-gray-700">محصول</th>
                                    <th class="text-center p-3 text-sm font-medium text-gray-700">تعداد</th>
                                    <th class="text-left p-3 text-sm font-medium text-gray-700">قیمت</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($order->get_items() as $item): ?>
                                    <?php $product = $item->get_product(); ?>
                                    <tr class="border-t border-gray-200">
                                        <td class="p-3">
                                            <div class="flex items-center gap-x-3">
                                                <?php if ($product): ?>
                                                    <img src="<?php echo wp_get_attachment_image_url($product->get_image_id(), 'thumbnail'); ?>" alt="<?php echo $item->get_name(); ?>" class="w-12 h-12 rounded-lg object-cover">
                                                <?php endif; ?>
                                                <div>
                                                    <div class="font-medium text-gray-800"><?php echo $item->get_name(); ?></div>
                                                    <?php if ($product): ?>
                                                        <div class="text-sm text-gray-600"><?php echo $product->get_sku(); ?></div>
                                                    <?php endif; ?>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="p-3 text-center">
                                            <span class="bg-gray-100 px-2 py-1 rounded text-sm"><?php echo $item->get_quantity(); ?></span>
                                        </td>
                                        <td class="p-3 text-left">
                                            <span class="font-medium"><?php echo wc_price($item->get_total()); ?></span>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <!-- Order Totals -->
                <div class="bg-gray-50 rounded-lg p-4">
                    <h3 class="font-semibold text-gray-800 mb-3">خلاصه سفارش</h3>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">جمع کل محصولات:</span>
                            <span class="text-gray-800"><?php echo wc_price($order->get_subtotal()); ?></span>
                        </div>
                        <?php if ($order->get_total_shipping() > 0): ?>
                            <div class="flex justify-between">
                                <span class="text-gray-600">هزینه ارسال:</span>
                                <span class="text-gray-800"><?php echo wc_price($order->get_total_shipping()); ?></span>
                            </div>
                        <?php endif; ?>
                        <?php if ($order->get_total_tax() > 0): ?>
                            <div class="flex justify-between">
                                <span class="text-gray-600">مالیات:</span>
                                <span class="text-gray-800"><?php echo wc_price($order->get_total_tax()); ?></span>
                            </div>
                        <?php endif; ?>
                        <div class="flex justify-between border-t border-gray-300 pt-2">
                            <span class="text-gray-800 font-semibold">مبلغ قابل پرداخت:</span>
                            <span class="text-gray-800 font-semibold text-lg"><?php echo wc_price($order->get_total()); ?></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<?php get_footer(); ?>
