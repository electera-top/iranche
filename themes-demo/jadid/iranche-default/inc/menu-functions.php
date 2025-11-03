<?php
/**
 * Default Menu Fallback
 *
 * @package Themee
 */

function themee_default_menu() {
    // اگر منوی اصلی وجود ندارد، منوی پیش‌فرض را نمایش دهید
    if (!has_nav_menu('primary')) {
        echo '<ul class="menu primary-menu flex gap-x-3 lg:gap-x-3 xl:gap-x-5">';
        echo '<li class="text-zinc-700 hover:text-blue-600 hover:bg-gray-100 transition p-2 rounded-lg"><a href="' . home_url() . '">صفحه اصلی</a></li>';
        if (class_exists('WooCommerce')) {
            echo '<li class="text-zinc-700 hover:text-blue-600 hover:bg-gray-100 transition p-2 rounded-lg"><a href="' . get_permalink(get_option('woocommerce_shop_page_id')) . '">فروشگاه</a></li>';
            echo '<li class="text-zinc-700 hover:text-blue-600 hover:bg-gray-100 transition p-2 rounded-lg"><a href="' . get_permalink(get_option('woocommerce_cart_page_id')) . '">سبد خرید</a></li>';
            echo '<li class="text-zinc-700 hover:text-blue-600 hover:bg-gray-100 transition p-2 rounded-lg"><a href="' . get_permalink(get_option('woocommerce_myaccount_page_id')) . '">حساب کاربری</a></li>';
        }
        echo '</ul>';
    }
}

function themee_default_mobile_menu() {
    // اگر منوی موبایل وجود ندارد، منوی پیش‌فرض را نمایش دهید
    if (!has_nav_menu('mobile')) {
        echo '<ul class="menu mobile-menu flex flex-col gap-y-3 px-2">';
        echo '<li class="text-zinc-700 hover:text-zinc-900 hover:bg-gray-200 transition p-2 rounded-lg"><a href="' . home_url() . '">صفحه اصلی</a></li>';
        if (class_exists('WooCommerce')) {
            echo '<li class="text-zinc-700 hover:text-zinc-900 hover:bg-gray-200 transition p-2 rounded-lg"><a href="' . get_permalink(get_option('woocommerce_shop_page_id')) . '">فروشگاه</a></li>';
            echo '<li class="text-zinc-700 hover:text-zinc-900 hover:bg-gray-200 transition p-2 rounded-lg"><a href="' . get_permalink(get_option('woocommerce_cart_page_id')) . '">سبد خرید</a></li>';
            echo '<li class="text-zinc-700 hover:text-zinc-900 hover:bg-gray-200 transition p-2 rounded-lg"><a href="' . get_permalink(get_option('woocommerce_myaccount_page_id')) . '">حساب کاربری</a></li>';
        }
        echo '</ul>';
    }
}

