<?php
/**
 * WooCommerce Template Overrides
 *
 * @package Themee
 */

// Remove default WooCommerce styles
add_filter('woocommerce_enqueue_styles', '__return_empty_array');

// Customize WooCommerce templates
function themee_woocommerce_locate_template($template, $template_name, $template_path) {
    $plugin_path = WC()->plugin_path() . '/templates/';
    $theme_path = get_template_directory() . '/woocommerce/';
    
    if (file_exists($theme_path . $template_name)) {
        return $theme_path . $template_name;
    }
    
    return $template;
}
add_filter('woocommerce_locate_template', 'themee_woocommerce_locate_template', 10, 3);

// Customize WooCommerce product loop
remove_action('woocommerce_before_shop_loop_item', 'woocommerce_template_loop_product_link_open', 10);
remove_action('woocommerce_after_shop_loop_item', 'woocommerce_template_loop_product_link_close', 5);

// Customize WooCommerce single product
remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_title', 5);
remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_price', 10);
remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_excerpt', 20);
remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30);

// Add custom WooCommerce hooks
add_action('woocommerce_single_product_summary', 'themee_single_product_title', 5);
add_action('woocommerce_single_product_summary', 'themee_single_product_price', 10);
add_action('woocommerce_single_product_summary', 'themee_single_product_excerpt', 20);
add_action('woocommerce_single_product_summary', 'themee_single_product_add_to_cart', 30);

function themee_single_product_title() {
    echo '<h1 class="product_title entry-title text-zinc-800 text-lg md:text-2xl font-semibold">' . get_the_title() . '</h1>';
}

function themee_single_product_price() {
    global $product;
    echo '<div class="text-zinc-600 text-left"><span class="font-semibold text-xl">' . $product->get_price_html() . '</span></div>';
}

function themee_single_product_excerpt() {
    global $product;
    if ($product->get_short_description()) {
        echo '<div class="text-zinc-400 text-sm mt-4">' . $product->get_short_description() . '</div>';
    }
}

function themee_single_product_add_to_cart() {
    global $product;
    if ($product->is_in_stock()) {
        echo '<a href="' . esc_url($product->add_to_cart_url()) . '" class="mx-auto w-full px-2 py-3 text-sm bg-blue-500 hover:bg-blue-400 transition text-gray-100 rounded-lg text-center block">افزودن به سبد خرید</a>';
    } else {
        echo '<button class="mx-auto w-full px-2 py-3 text-sm bg-gray-400 text-gray-100 rounded-lg cursor-not-allowed">موجود نیست</button>';
    }
}

