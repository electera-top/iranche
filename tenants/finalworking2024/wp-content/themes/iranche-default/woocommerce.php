<?php
/**
 * WooCommerce Template Override
 *
 * @package Themee
 */

// Check if WooCommerce is active
if (!class_exists('WooCommerce')) {
    return;
}

// Get the current page template
$template_name = '';

if (is_cart()) {
    $template_name = 'cart';
} elseif (is_checkout()) {
    $template_name = 'checkout';
} elseif (is_account_page()) {
    $template_name = 'my-account';
} elseif (is_shop()) {
    $template_name = 'shop';
} elseif (is_product_category() || is_product_tag()) {
    $template_name = 'archive-product';
} elseif (is_product()) {
    $template_name = 'single-product';
}

// Load the appropriate template
if ($template_name) {
    $template_path = get_template_directory() . '/' . $template_name . '.php';
    
    if (file_exists($template_path)) {
        include $template_path;
    } else {
        // Fallback to default WooCommerce template
        wc_get_template($template_name . '.php');
    }
} else {
    // Default WooCommerce behavior
    wc_get_template('index.php');
}
