<?php
/**
 * Themee Theme Functions
 * 
 * @package Themee
 * @version 1.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Theme setup
function themee_setup() {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
    
    // Add RTL support
    add_theme_support('rtl');
    
    // Custom Logo support (WordPress standard)
    add_theme_support('custom-logo', array(
        'height'      => 100,
        'width'       => 300,
        'flex-height' => true,
        'flex-width'  => true,
    ));
    
    // WooCommerce support
    add_theme_support('woocommerce');
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');
    
    // Enable WooCommerce reviews
    add_theme_support('woocommerce', array(
        'thumbnail_image_width' => 300,
        'single_image_width' => 600,
        'product_grid' => array(
            'default_rows' => 3,
            'min_rows' => 2,
            'max_rows' => 8,
            'default_columns' => 4,
            'min_columns' => 2,
            'max_columns' => 5,
        ),
    ));
    
    // Enable product reviews
    add_filter('woocommerce_product_tabs', 'themee_custom_product_tabs');
    
    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('منوی اصلی', 'themee'),
        'mobile' => __('منوی موبایل', 'themee'),
        'footer_quick_links' => __('منوی فوتر (دسترسی سریع)', 'themee'),
    ));
}
add_action('after_setup_theme', 'themee_setup');

// Enqueue scripts and styles
function themee_scripts() {
    wp_enqueue_style('themee-style', get_stylesheet_uri(), array(), '1.0');
    wp_enqueue_style('themee-main', get_template_directory_uri() . '/assets/css/main.css', array(), '1.0');
    
    // Enqueue Swiper CSS and JS
    wp_enqueue_style('swiper-css', get_template_directory_uri() . '/assets/css/swiper.min.css', array(), '1.0');
    wp_enqueue_script('swiper-js', get_template_directory_uri() . '/assets/js/swiper.min.js', array(), '1.0', true);
    
    wp_enqueue_script('themee-main', get_template_directory_uri() . '/assets/js/main.js', array('jquery'), '1.0', true);
    wp_enqueue_script('themee-sliders', get_template_directory_uri() . '/assets/js/sliders.js', array('swiper-js'), '1.0', true);
    wp_enqueue_script('themee-cart', get_template_directory_uri() . '/assets/js/cart.js', array(), '1.0', true);
    
    // Localize script for AJAX
    wp_localize_script('themee-cart', 'ajax_object', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('themee_cart_nonce')
    ));
    
    // Enqueue single product script
    if (is_product()) {
        wp_enqueue_script('themee-single-product', get_template_directory_uri() . '/assets/js/single-product.js', array('jquery'), '1.0', true);
        wp_enqueue_script('themee-star-rating', get_template_directory_uri() . '/assets/js/star-rating.js', array(), '1.0', true);
    }
}
add_action('wp_enqueue_scripts', 'themee_scripts');

// Register widget areas
function themee_widgets_init() {
    register_sidebar(array(
        'name'          => __('سایدبار اصلی', 'themee'),
        'id'            => 'sidebar-1',
        'description'   => __('سایدبار اصلی سایت', 'themee'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ));
    
    register_sidebar(array(
        'name'          => __('فوتر', 'themee'),
        'id'            => 'footer-1',
        'description'   => __('محتوای فوتر', 'themee'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ));
}
add_action('widgets_init', 'themee_widgets_init');

// Custom post types and taxonomies
function themee_custom_post_types() {
    // Add any custom post types here if needed
}
add_action('init', 'themee_custom_post_types');

// WooCommerce customizations
function themee_woocommerce_setup() {
    // Remove default WooCommerce styles
    add_filter('woocommerce_enqueue_styles', '__return_empty_array');
    
    // Customize WooCommerce templates
    add_filter('woocommerce_locate_template', 'themee_woocommerce_locate_template', 10, 3);
}
add_action('after_setup_theme', 'themee_woocommerce_setup');

// Helper functions
function themee_get_template_part($slug, $name = null) {
    get_template_part('template-parts/' . $slug, $name);
}

// MetaSlider Helper Function
function themee_get_hero_slider() {
    $slider_id = get_option('themee_hero_slider_id', 1);
    
    if (function_exists('metaslider')) {
        // Get MetaSlider HTML
        $slider_html = do_shortcode("[metaslider id={$slider_id}]");
        
        // Wrap MetaSlider content in Swiper structure
        if (!empty($slider_html)) {
            return '<div class="swiper-slide">' . $slider_html . '</div>';
        }
    }
    
    return false;
}

// Hero Slider Fallback Function
function themee_hero_slider_fallback() {
    // Only show fallback banner, not WordPress media images
    $shop_url = get_permalink(get_option('woocommerce_shop_page_id'));
    ?>
    <div class="hero-banner bg-gradient-to-r from-blue-500 to-blue-600 text-white py-20 rounded-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <h1 class="text-4xl md:text-6xl font-bold mb-6">
                    <?php bloginfo('name'); ?>
                </h1>
                <p class="text-xl md:text-2xl mb-8">
                    <?php bloginfo('description'); ?>
                </p>
                <a href="<?php echo $shop_url; ?>" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                    شروع خرید
                </a>
            </div>
        </div>
    </div>
    <?php
}

// Include helper files
require_once get_template_directory() . '/inc/menu-functions.php';
require_once get_template_directory() . '/inc/woocommerce-functions.php';

// Customizer options
function themee_customize_register($wp_customize) {
    // Add customizer options here
    $wp_customize->add_section('themee_options', array(
        'title' => __('تنظیمات قالب', 'themee'),
        'priority' => 30,
    ));
    
    $wp_customize->add_setting('themee_logo', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    
    $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'themee_logo', array(
        'label' => __('لوگو سایت', 'themee'),
        'section' => 'themee_options',
        'settings' => 'themee_logo',
    )));
    
    // Hero Slider Settings
    $wp_customize->add_setting('themee_hero_slider_id', array(
        'default' => 73, // Updated to match user's actual slider ID
        'sanitize_callback' => 'absint',
    ));
    
    // Get available sliders for dropdown
    $available_sliders = themee_get_available_sliders();
    
    if (!empty($available_sliders)) {
        $wp_customize->add_control('themee_hero_slider_id', array(
            'label' => __('شناسه اسلایدر هیرو', 'themee'),
            'description' => __('اسلایدر MetaSlider که می‌خواهید در صفحه اصلی نمایش داده شود', 'themee'),
            'section' => 'themee_options',
            'type' => 'select',
            'choices' => $available_sliders,
        ));
    } else {
        $wp_customize->add_control('themee_hero_slider_id', array(
            'label' => __('شناسه اسلایدر هیرو', 'themee'),
            'description' => __('شناسه اسلایدر MetaSlider که می‌خواهید در صفحه اصلی نمایش داده شود (شناسه فعلی: 73)', 'themee'),
            'section' => 'themee_options',
            'type' => 'number',
        ));
    }

    // Banner Settings
    $wp_customize->add_section('themee_banners', array(
        'title' => __('بنرهای صفحه اصلی', 'themee'),
        'priority' => 35,
    ));

    // Banner Display Toggle
    $wp_customize->add_setting('themee_banners_enabled', array(
        'default' => true,
        'sanitize_callback' => 'wp_validate_boolean',
    ));
    $wp_customize->add_control('themee_banners_enabled', array(
        'label' => __('نمایش بنرها', 'themee'),
        'section' => 'themee_banners',
        'type' => 'checkbox',
    ));

    // Banner 1 Image
    $wp_customize->add_setting('themee_banner_1_image', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'themee_banner_1_image', array(
        'label' => __('تصویر بنر اول', 'themee'),
        'section' => 'themee_banners',
        'settings' => 'themee_banner_1_image',
    )));

    // Banner 1 Link
    $wp_customize->add_setting('themee_banner_1_link', array(
        'default' => '#',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('themee_banner_1_link', array(
        'label' => __('لینک بنر اول', 'themee'),
        'section' => 'themee_banners',
        'type' => 'url',
    ));

    // Banner 2 Image
    $wp_customize->add_setting('themee_banner_2_image', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'themee_banner_2_image', array(
        'label' => __('تصویر بنر دوم', 'themee'),
        'section' => 'themee_banners',
        'settings' => 'themee_banner_2_image',
    )));

    // Banner 2 Link
    $wp_customize->add_setting('themee_banner_2_link', array(
        'default' => '#',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('themee_banner_2_link', array(
        'label' => __('لینک بنر دوم', 'themee'),
        'section' => 'themee_banners',
        'type' => 'url',
    ));
    
    // Default Warranty Settings
    $wp_customize->add_setting('themee_default_warranty', array(
        'default' => '18 ماهه',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('themee_default_warranty', array(
        'label' => __('گارانتی پیش‌فرض', 'themee'),
        'description' => __('گارانتی پیش‌فرض برای محصولاتی که گارانتی مشخصی ندارند', 'themee'),
        'section' => 'themee_options',
        'type' => 'text',
    ));

    // Footer Settings
    $wp_customize->add_section('themee_footer', array(
        'title' => __('تنظیمات فوتر', 'themee'),
        'priority' => 36,
    ));

    $wp_customize->add_setting('footer_support_phone', array(
        'default' => '44444444-021',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('footer_support_phone', array(
        'label' => __('تلفن پشتیبانی فوتر', 'themee'),
        'section' => 'themee_footer',
        'type' => 'text',
    ));

    $wp_customize->add_setting('footer_newsletter_text', array(
        'default' => 'برای دریافت آخرین اخبار و آفرها ایمیل خود را وارد کنید تا در خبرنامه عضو شوید.',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('footer_newsletter_text', array(
        'label' => __('متن خبرنامه در فوتر', 'themee'),
        'section' => 'themee_footer',
        'type' => 'text',
    ));

    // Footer Social Links
    $wp_customize->add_setting('footer_social_instagram', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('footer_social_instagram', array(
        'label' => __('لینک اینستاگرام', 'themee'),
        'section' => 'themee_footer',
        'type' => 'url',
    ));

    $wp_customize->add_setting('footer_social_telegram', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('footer_social_telegram', array(
        'label' => __('لینک تلگرام', 'themee'),
        'section' => 'themee_footer',
        'type' => 'url',
    ));

    $wp_customize->add_setting('footer_social_whatsapp', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('footer_social_whatsapp', array(
        'label' => __('لینک واتس‌اپ', 'themee'),
        'section' => 'themee_footer',
        'type' => 'url',
    ));

    $wp_customize->add_setting('footer_social_linkedin', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('footer_social_linkedin', array(
        'label' => __('لینک لینکدین', 'themee'),
        'section' => 'themee_footer',
        'type' => 'url',
    ));

    $wp_customize->add_setting('footer_social_x', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('footer_social_x', array(
        'label' => __('لینک X/Twitter', 'themee'),
        'section' => 'themee_footer',
        'type' => 'url',
    ));

    // Footer Contact Info
    $wp_customize->add_setting('footer_contact_address', array(
        'default' => 'تهران-خیابان دماوند',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('footer_contact_address', array(
        'label' => __('آدرس تماس در فوتر', 'themee'),
        'section' => 'themee_footer',
        'type' => 'text',
    ));

    $wp_customize->add_setting('footer_contact_email', array(
        'default' => 'info@example.com',
        'sanitize_callback' => 'sanitize_email',
    ));
    $wp_customize->add_control('footer_contact_email', array(
        'label' => __('ایمیل تماس در فوتر', 'themee'),
        'section' => 'themee_footer',
        'type' => 'email',
    ));

    $wp_customize->add_setting('footer_contact_phone', array(
        'default' => '0912345678',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('footer_contact_phone', array(
        'label' => __('تلفن تماس در فوتر', 'themee'),
        'section' => 'themee_footer',
        'type' => 'text',
    ));

    // Footer Quick Links (fallback when no menu)
    $wp_customize->add_setting('footer_quick_links_title', array(
        'default' => 'دسترسی سریع',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('footer_quick_links_title', array(
        'label' => __('عنوان بخش دسترسی سریع', 'themee'),
        'section' => 'themee_footer',
        'type' => 'text',
    ));

    for ( $i = 1; $i <= 4; $i++ ) {
        $wp_customize->add_setting("footer_quick_link_{$i}_label", array(
            'default' => '',
            'sanitize_callback' => 'sanitize_text_field',
        ));
        $wp_customize->add_control("footer_quick_link_{$i}_label", array(
            'label' => sprintf(__('لینک %d - عنوان', 'themee'), $i),
            'section' => 'themee_footer',
            'type' => 'text',
        ));

        $wp_customize->add_setting("footer_quick_link_{$i}_url", array(
            'default' => '',
            'sanitize_callback' => 'esc_url_raw',
        ));
        $wp_customize->add_control("footer_quick_link_{$i}_url", array(
            'label' => sprintf(__('لینک %d - آدرس', 'themee'), $i),
            'section' => 'themee_footer',
            'type' => 'url',
        ));
    }

    // Footer Symbols (images on the right)
    $wp_customize->add_setting('footer_symbol_1', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('footer_symbol_1', array(
        'label' => __('آدرس تصویر نماد 1 فوتر (URL)', 'themee'),
        'section' => 'themee_footer',
        'type' => 'url',
    ));

    $wp_customize->add_setting('footer_symbol_2', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('footer_symbol_2', array(
        'label' => __('آدرس تصویر نماد 2 فوتر (URL)', 'themee'),
        'section' => 'themee_footer',
        'type' => 'url',
    ));

    // Footer Feature Boxes (titles/subtitles)
    for ( $i = 1; $i <= 5; $i++ ) {
        $wp_customize->add_setting("footer_feat_{$i}_title", array(
            'default' => (
                $i === 1 ? 'پشتیبانی 24 ساعته' : (
                $i === 2 ? 'تحویل سریع' : (
                $i === 3 ? 'امنیت بالا' : (
                $i === 4 ? 'پشتیبانی چندگانه' : 'شخصی سازی کامل')))),
            'sanitize_callback' => 'sanitize_text_field',
        ));
        $wp_customize->add_control("footer_feat_{$i}_title", array(
            'label' => sprintf(__('باکس %d - عنوان', 'themee'), $i),
            'section' => 'themee_footer',
            'type' => 'text',
        ));

        $wp_customize->add_setting("footer_feat_{$i}_subtitle", array(
            'default' => (
                $i === 1 ? '7 روز هفته 24 ساعته' : (
                $i === 2 ? 'ارسال فوری' : (
                $i === 3 ? 'پرداخت امن' : (
                $i === 4 ? 'موبایل، لپ تاپ و...' : 'تغییر با دلخواه شما')))),
            'sanitize_callback' => 'sanitize_text_field',
        ));
        $wp_customize->add_control("footer_feat_{$i}_subtitle", array(
            'label' => sprintf(__('باکس %d - زیرعنوان', 'themee'), $i),
            'section' => 'themee_footer',
            'type' => 'text',
        ));
    }

    // Footer Logo (Media Image)
    $wp_customize->add_setting('footer_logo_image', array(
        'default'           => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'footer_logo_image', array(
        'label'    => __('لوگوی فوتر (انتخاب تصویر)', 'themee'),
        'section'  => 'themee_footer',
        'settings' => 'footer_logo_image',
    )));

    // Backward compatibility: keep footer_logo (URL) if previously used
    $wp_customize->add_setting('footer_logo', array(
        'default'           => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('footer_logo', array(
        'label'   => __('(قدیمی) آدرس لوگوی فوتر - URL', 'themee'),
        'section' => 'themee_footer',
        'type'    => 'url',
    ));
}
add_action('customize_register', 'themee_customize_register');

// Helper function to get latest products
function themee_get_latest_products($limit = 8) {
    $args = array(
        'post_type' => 'product',
        'posts_per_page' => $limit,
        'post_status' => 'publish',
        'orderby' => 'date',
        'order' => 'DESC',
        'meta_query' => array(
            'relation' => 'OR',
            array(
                'key' => '_visibility',
                'value' => array('catalog', 'visible'),
                'compare' => 'IN'
            ),
            array(
                'key' => '_visibility',
                'compare' => 'NOT EXISTS'
            )
        )
    );
    
    return new WP_Query($args);
}

// Helper function to check if WooCommerce is properly configured
function themee_check_woocommerce_setup() {
    if (!class_exists('WooCommerce')) {
        return false;
    }
    
    // Check if shop page exists
    $shop_page_id = get_option('woocommerce_shop_page_id');
    if (!$shop_page_id) {
        return false;
    }
    
    // Check if products exist
    $products = get_posts(array(
        'post_type' => 'product',
        'post_status' => 'publish',
        'posts_per_page' => 1
    ));
    
    return !empty($products);
}

// Helper function to check if MetaSlider is active and working
function themee_check_metaslider_status() {
    // Multiple ways to check if MetaSlider is active
    $checks = array(
        'function_exists' => function_exists('metaslider'),
        'class_exists_plugin' => class_exists('MetaSliderPlugin'),
        'class_exists_main' => class_exists('MetaSlider'),
        'shortcode_exists' => shortcode_exists('metaslider'),
        'plugin_active' => is_plugin_active('ml-slider/ml-slider.php')
    );
    
    // Return true if any check passes
    return in_array(true, $checks);
}

// Helper function to get MetaSlider slider content
function themee_get_metaslider_content($slider_id = 73) {
    if (!themee_check_metaslider_status()) {
        return false;
    }
    
    $slider_html = do_shortcode("[metaslider id={$slider_id}]");
    
    // Check if the shortcode returned actual content
    if (empty($slider_html) || strpos($slider_html, 'metaslider') === false) {
        return false;
    }
    
    return $slider_html;
}

// Helper function to get all available MetaSlider sliders
function themee_get_available_sliders() {
    if (!themee_check_metaslider_status()) {
        return array();
    }
    
    // Get all MetaSlider posts
    $sliders = get_posts(array(
        'post_type' => 'ml-slider',
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'orderby' => 'date',
        'order' => 'DESC'
    ));
    
    $slider_list = array();
    foreach ($sliders as $slider) {
        $slider_list[$slider->ID] = $slider->post_title;
    }
    
    return $slider_list;
}

// Helper function to check if site is RTL
function themee_is_rtl() {
    return is_rtl() || get_locale() === 'fa_IR' || get_locale() === 'ar';
}

// Helper function to get RTL direction
function themee_get_direction() {
    return themee_is_rtl() ? 'rtl' : 'ltr';
}

// Template redirect for WooCommerce pages
function themee_template_redirect() {
    if (!class_exists('WooCommerce')) {
        return;
    }
    
    // Handle cart page
    if (is_cart()) {
        $cart_template = locate_template('cart.php');
        if ($cart_template) {
            include($cart_template);
            exit;
        }
    }
    
    // Handle checkout page
    if (is_checkout()) {
        $checkout_template = locate_template('checkout.php');
        if ($checkout_template) {
            include($checkout_template);
            exit;
        }
    }
    
    // Handle my account page
    if (is_account_page()) {
        $account_template = locate_template('my-account.php');
        if ($account_template) {
            include($account_template);
            exit;
        }
    }
}
add_action('template_redirect', 'themee_template_redirect');

// Custom product tabs
function themee_custom_product_tabs($tabs) {
    // Reviews tab
    if (isset($tabs['reviews'])) {
        $tabs['reviews']['title'] = 'دیدگاه‌ها';
        $tabs['reviews']['priority'] = 30;
    }
    
    // Description tab
    if (isset($tabs['description'])) {
        $tabs['description']['title'] = 'توضیحات';
        $tabs['description']['priority'] = 10;
    }
    
    // Additional information tab
    if (isset($tabs['additional_information'])) {
        $tabs['additional_information']['title'] = 'مشخصات';
        $tabs['additional_information']['priority'] = 20;
    }
    
    return $tabs;
}

// Enable product reviews
function themee_enable_product_reviews() {
    // Enable reviews for all products
    add_filter('woocommerce_product_review_comment_form_args', 'themee_custom_review_form');
    
    // Customize review form
    add_action('woocommerce_review_before', 'themee_review_before');
    add_action('woocommerce_review_after', 'themee_review_after');
    
    // Enable WooCommerce star rating
    add_filter('woocommerce_product_tabs', 'themee_custom_product_tabs');
    
    // Override WooCommerce review form
    add_action('woocommerce_review_comment_form', 'themee_woocommerce_review_form');
}

// Custom review form
function themee_custom_review_form($comment_form) {
    $comment_form['title_reply'] = 'دیدگاه خود را ثبت کنید';
    $comment_form['title_reply_to'] = 'پاسخ به %s';
    $comment_form['comment_notes_before'] = '';
    $comment_form['comment_notes_after'] = '';
    
    return $comment_form;
}

// Review before
function themee_review_before() {
    echo '<div class="review-item border-b border-gray-200 pb-4 mb-4">';
}

// Review after
function themee_review_after() {
    echo '</div>';
}

// WooCommerce review form override
function themee_woocommerce_review_form() {
    if (!is_product()) {
        return;
    }
    
    $commenter = wp_get_current_commenter();
    $comment_form = array(
        'title_reply' => 'دیدگاه خود را ثبت کنید',
        'title_reply_to' => 'پاسخ به %s',
        'comment_notes_before' => '',
        'comment_notes_after' => '',
        'fields' => array(
            'author' => '<p class="comment-form-author"><label for="author">نام *</label><input id="author" name="author" type="text" value="' . esc_attr($commenter['comment_author']) . '" size="30" required /></p>',
            'email' => '<p class="comment-form-email"><label for="email">ایمیل *</label><input id="email" name="email" type="email" value="' . esc_attr($commenter['comment_author_email']) . '" size="30" required /></p>',
        ),
        'comment_field' => '<p class="comment-form-comment"><label for="comment">دیدگاه شما *</label><textarea id="comment" name="comment" cols="45" rows="8" required></textarea></p>',
        'submit_button' => '<input name="submit" type="submit" id="submit" class="submit" value="ثبت" />',
    );
    
    // Add WooCommerce star rating
    $comment_form['comment_field'] .= '<p class="comment-form-rating">
        <label for="rating">امتیاز شما *</label>
        <div class="star-rating">
            <input type="radio" id="star5" name="rating" value="5" required>
            <label for="star5"></label>
            <input type="radio" id="star4" name="rating" value="4" required>
            <label for="star4"></label>
            <input type="radio" id="star3" name="rating" value="3" required>
            <label for="star3"></label>
            <input type="radio" id="star2" name="rating" value="2" required>
            <label for="star2"></label>
            <input type="radio" id="star1" name="rating" value="1" required>
            <label for="star1"></label>
        </div>
    </p>';
    
    comment_form($comment_form);
}

// Save WooCommerce rating
function themee_save_woocommerce_rating($comment_id) {
    if (isset($_POST['rating']) && is_product()) {
        $rating = intval($_POST['rating']);
        if ($rating >= 1 && $rating <= 5) {
            update_comment_meta($comment_id, 'rating', $rating);
        }
    }
}
add_action('comment_post', 'themee_save_woocommerce_rating');

// AJAX handlers for user account features
add_action('wp_ajax_add_favorite', 'themee_add_favorite');
add_action('wp_ajax_remove_favorite', 'themee_remove_favorite');
add_action('wp_ajax_send_user_message', 'themee_send_user_message');

// Add to favorites
function themee_add_favorite() {
    if (!wp_verify_nonce($_POST['nonce'], 'favorite_nonce')) {
        wp_die('Security check failed');
    }
    
    $product_id = intval($_POST['product_id']);
    $user_id = get_current_user_id();
    
    if (!$user_id) {
        wp_die('User not logged in');
    }
    
    $favorites = get_user_meta($user_id, 'favorite_products', true);
    if (!is_array($favorites)) {
        $favorites = array();
    }
    
    if (!in_array($product_id, $favorites)) {
        $favorites[] = $product_id;
        update_user_meta($user_id, 'favorite_products', $favorites);
    }
    
    wp_send_json_success();
}

// Remove from favorites
function themee_remove_favorite() {
    if (!wp_verify_nonce($_POST['nonce'], 'favorite_nonce')) {
        wp_die('Security check failed');
    }
    
    $product_id = intval($_POST['product_id']);
    $user_id = get_current_user_id();
    
    if (!$user_id) {
        wp_die('User not logged in');
    }
    
    $favorites = get_user_meta($user_id, 'favorite_products', true);
    if (is_array($favorites)) {
        $favorites = array_diff($favorites, array($product_id));
        update_user_meta($user_id, 'favorite_products', $favorites);
    }
    
    wp_send_json_success();
}

// Send user message
function themee_send_user_message() {
    if (!wp_verify_nonce($_POST['nonce'], 'send_message_nonce')) {
        wp_die('Security check failed');
    }
    
    $user_id = get_current_user_id();
    if (!$user_id) {
        wp_die('User not logged in');
    }
    
    $subject = sanitize_text_field($_POST['message_subject']);
    $content = sanitize_textarea_field($_POST['message_content']);
    
    if (empty($subject) || empty($content)) {
        wp_die('Subject and content are required');
    }
    
    // Create a comment as a message
    $comment_data = array(
        'comment_post_ID' => 0, // No post ID for messages
        'comment_author' => wp_get_current_user()->display_name,
        'comment_author_email' => wp_get_current_user()->user_email,
        'comment_content' => $content,
        'comment_type' => 'message',
        'user_id' => $user_id,
        'comment_meta' => array(
            'message_subject' => $subject,
            'is_read' => false,
        ),
    );
    
    $comment_id = wp_insert_comment($comment_data);
    
    if ($comment_id) {
        wp_send_json_success('Message sent successfully');
    } else {
        wp_send_json_error('Failed to send message');
    }
}

// Initialize reviews
add_action('init', 'themee_enable_product_reviews');

// WooCommerce Currency Settings for Iran
add_action('init', 'themee_setup_iranian_currency');

function themee_setup_iranian_currency() {
    if (!class_exists('WooCommerce')) {
        return;
    }
    
    // Set currency to Iranian Rial
    add_filter('woocommerce_currency', function($currency) {
        return 'IRR';
    });
    
    // Set currency symbol to empty (we'll add it in formatted price)
    add_filter('woocommerce_currency_symbol', function($currency_symbol, $currency) {
        if ($currency === 'IRR') {
            return '';
        }
        return $currency_symbol;
    }, 10, 2);
    
    // Format price for Iranian currency
    add_filter('woocommerce_price_format', function($format) {
        return '%2$s %1$s'; // Symbol before price
    });
    
    // Set number of decimals
    add_filter('woocommerce_price_decimals', function($decimals) {
        return 0; // No decimals for Toman
    });
    
    // Set thousand separator
    add_filter('woocommerce_price_thousand_separator', function($separator) {
        return ','; // Comma separator
    });
    
    // Set decimal separator
    add_filter('woocommerce_price_decimal_separator', function($separator) {
        return '.'; // Dot separator
    });
    
    // Custom price format for Toman
    add_filter('formatted_woocommerce_price', function($formatted_price, $price, $decimals, $decimal_separator, $thousand_separator) {
        if (get_woocommerce_currency() === 'IRR') {
            // Convert Rial to Toman (divide by 10)
            $toman_price = $price / 10;
            $formatted_price = number_format($toman_price, 0, $decimal_separator, $thousand_separator);
            return $formatted_price . ' تومان';
        }
        return $formatted_price;
    }, 10, 5);
    
    // Override WooCommerce price HTML to prevent double currency symbol
    add_filter('woocommerce_price_html', function($price_html, $product) {
        if (get_woocommerce_currency() === 'IRR') {
            $regular_price = $product->get_regular_price();
            $sale_price = $product->get_sale_price();
            
            if ($sale_price && $sale_price != $regular_price) {
                // Product is on sale
                $regular_toman = number_format($regular_price / 10, 0, '.', ',');
                $sale_toman = number_format($sale_price / 10, 0, '.', ',');
                return '<del>' . $regular_toman . ' تومان</del> <ins>' . $sale_toman . ' تومان</ins>';
            } else {
                // Regular price
                $price_toman = number_format($regular_price / 10, 0, '.', ',');
                return $price_toman . ' تومان';
            }
        }
        return $price_html;
    }, 10, 2);
    
    // Convert existing product prices from Rial to Toman
    add_action('woocommerce_product_get_price', 'themee_convert_price_to_toman', 10, 2);
    add_action('woocommerce_product_get_regular_price', 'themee_convert_price_to_toman', 10, 2);
    add_action('woocommerce_product_get_sale_price', 'themee_convert_price_to_toman', 10, 2);
}

// Convert price from Rial to Toman
function themee_convert_price_to_toman($price, $product) {
    if (get_woocommerce_currency() === 'IRR' && $price > 0) {
        return $price / 10; // Convert Rial to Toman
    }
    return $price;
}

// Admin function to convert all existing product prices to Toman
function themee_convert_all_prices_to_toman() {
    if (!current_user_can('manage_options')) {
        return;
    }
    
    $products = get_posts(array(
        'post_type' => 'product',
        'post_status' => 'publish',
        'posts_per_page' => -1,
    ));
    
    $converted_count = 0;
    
    foreach ($products as $product_post) {
        $product = wc_get_product($product_post->ID);
        
        if ($product) {
            // Convert regular price
            $regular_price = $product->get_regular_price();
            if ($regular_price && $regular_price > 0) {
                $product->set_regular_price($regular_price / 10);
            }
            
            // Convert sale price
            $sale_price = $product->get_sale_price();
            if ($sale_price && $sale_price > 0) {
                $product->set_sale_price($sale_price / 10);
            }
            
            // Convert variable product prices
            if ($product->is_type('variable')) {
                $variations = $product->get_children();
                foreach ($variations as $variation_id) {
                    $variation = wc_get_product($variation_id);
                    if ($variation) {
                        $var_regular_price = $variation->get_regular_price();
                        if ($var_regular_price && $var_regular_price > 0) {
                            $variation->set_regular_price($var_regular_price / 10);
                        }
                        
                        $var_sale_price = $variation->get_sale_price();
                        if ($var_sale_price && $var_sale_price > 0) {
                            $variation->set_sale_price($var_sale_price / 10);
                        }
                        
                        $variation->save();
                    }
                }
            }
            
            $product->save();
            $converted_count++;
        }
    }
    
    return $converted_count;
}

// Add admin notice for currency conversion
add_action('admin_notices', 'themee_currency_conversion_notice');

function themee_currency_conversion_notice() {
    if (get_woocommerce_currency() === 'IRR' && !get_option('themee_currency_converted')) {
        ?>
        <div class="notice notice-info">
            <p>
                <strong>توجه:</strong> ارز سایت به تومان تغییر یافته است. 
                برای تبدیل قیمت‌های موجود از ریال به تومان، 
                <a href="<?php echo admin_url('admin.php?page=wc-settings&tab=general&convert_currency=1'); ?>" 
                   onclick="return confirm('آیا مطمئن هستید که می‌خواهید تمام قیمت‌ها را از ریال به تومان تبدیل کنید؟')">
                    اینجا کلیک کنید
                </a>
            </p>
        </div>
        <?php
    }
}

// Handle currency conversion request
add_action('admin_init', 'themee_handle_currency_conversion');

function themee_handle_currency_conversion() {
    if (isset($_GET['convert_currency']) && $_GET['convert_currency'] == '1' && current_user_can('manage_options')) {
        $converted_count = themee_convert_all_prices_to_toman();
        update_option('themee_currency_converted', true);
        
        wp_redirect(admin_url('admin.php?page=wc-settings&tab=general&converted=' . $converted_count));
        exit;
    }
}

// Calculate product satisfaction percentage based on reviews
function themee_get_product_satisfaction($product_id) {
    if (!class_exists('WooCommerce')) {
        return 0;
    }
    
    $product = wc_get_product($product_id);
    if (!$product) {
        return 0;
    }
    
    // Get product reviews
    $reviews = get_comments(array(
        'post_id' => $product_id,
        'status' => 'approve',
        'type' => 'review',
        'meta_query' => array(
            array(
                'key' => 'rating',
                'value' => 0,
                'compare' => '>'
            )
        )
    ));
    
    if (empty($reviews)) {
        return 0;
    }
    
    $total_rating = 0;
    $review_count = 0;
    
    foreach ($reviews as $review) {
        $rating = get_comment_meta($review->comment_ID, 'rating', true);
        if ($rating && $rating > 0) {
            $total_rating += intval($rating);
            $review_count++;
        }
    }
    
    if ($review_count === 0) {
        return 0;
    }
    
    $average_rating = $total_rating / $review_count;
    
    // Convert 1-5 star rating to percentage
    // 5 stars = 100%, 4 stars = 80%, 3 stars = 60%, 2 stars = 40%, 1 star = 20%
    $satisfaction_percentage = ($average_rating / 5) * 100;
    
    return round($satisfaction_percentage);
}

// Get product satisfaction with review count
function themee_get_product_satisfaction_data($product_id) {
    if (!class_exists('WooCommerce')) {
        return array('percentage' => 0, 'review_count' => 0, 'average_rating' => 0);
    }
    
    $product = wc_get_product($product_id);
    if (!$product) {
        return array('percentage' => 0, 'review_count' => 0, 'average_rating' => 0);
    }
    
    // Get product reviews
    $reviews = get_comments(array(
        'post_id' => $product_id,
        'status' => 'approve',
        'type' => 'review',
        'meta_query' => array(
            array(
                'key' => 'rating',
                'value' => 0,
                'compare' => '>'
            )
        )
    ));
    
    if (empty($reviews)) {
        return array('percentage' => 0, 'review_count' => 0, 'average_rating' => 0);
    }
    
    $total_rating = 0;
    $review_count = 0;
    
    foreach ($reviews as $review) {
        $rating = get_comment_meta($review->comment_ID, 'rating', true);
        if ($rating && $rating > 0) {
            $total_rating += intval($rating);
            $review_count++;
        }
    }
    
    if ($review_count === 0) {
        return array('percentage' => 0, 'review_count' => 0, 'average_rating' => 0);
    }
    
    $average_rating = $total_rating / $review_count;
    $satisfaction_percentage = ($average_rating / 5) * 100;
    
    return array(
        'percentage' => round($satisfaction_percentage),
        'review_count' => $review_count,
        'average_rating' => round($average_rating, 1)
    );
}

// Get product warranty information
function themee_get_product_warranty($product_id) {
    if (!class_exists('WooCommerce')) {
        return null;
    }
    
    $product = wc_get_product($product_id);
    if (!$product) {
        return null;
    }
    
    $warranty_info = array();
    
    // Method 1: Check product attributes for warranty
    $attributes = $product->get_attributes();
    foreach ($attributes as $attribute) {
        if ($attribute->get_visible()) {
            $attribute_name = wc_attribute_label($attribute->get_name());
            $attribute_values = $attribute->get_options();
            
            // Check for warranty-related attributes
            if (stripos($attribute_name, 'گارانتی') !== false || 
                stripos($attribute_name, 'warranty') !== false ||
                stripos($attribute_name, 'ضمانت') !== false) {
                $warranty_info['type'] = 'attribute';
                $warranty_info['value'] = implode(', ', $attribute_values);
                $warranty_info['label'] = $attribute_name;
                return $warranty_info;
            }
        }
    }
    
    // Method 2: Check custom fields
    $custom_fields = get_post_meta($product_id);
    $warranty_fields = array(
        '_warranty',
        '_product_warranty',
        '_warranty_period',
        '_warranty_type',
        'warranty',
        'product_warranty',
        'warranty_period',
        'warranty_type'
    );
    
    foreach ($warranty_fields as $field) {
        if (isset($custom_fields[$field]) && !empty($custom_fields[$field][0])) {
            $warranty_info['type'] = 'custom_field';
            $warranty_info['value'] = $custom_fields[$field][0];
            $warranty_info['field'] = $field;
            return $warranty_info;
        }
    }
    
    // Method 3: Check product meta
    $warranty_meta = $product->get_meta('_warranty');
    if (!empty($warranty_meta)) {
        $warranty_info['type'] = 'meta';
        $warranty_info['value'] = $warranty_meta;
        return $warranty_info;
    }
    
    // Method 4: Default warranty (can be customized)
    $default_warranty = get_option('themee_default_warranty', '18 ماهه');
    if ($default_warranty) {
        $warranty_info['type'] = 'default';
        $warranty_info['value'] = $default_warranty;
        return $warranty_info;
    }
    
    return null;
}

// Add warranty field to product data
add_action('woocommerce_product_options_general_product_data', 'themee_add_warranty_field');

function themee_add_warranty_field() {
    global $post;
    
    echo '<div class="options_group">';
    
    woocommerce_wp_text_input(array(
        'id' => '_product_warranty',
        'label' => 'گارانتی محصول',
        'placeholder' => 'مثال: 18 ماهه، 2 ساله، بدون گارانتی',
        'desc_tip' => true,
        'description' => 'اطلاعات گارانتی محصول را وارد کنید'
    ));
    
    echo '</div>';
}

// Save warranty field
add_action('woocommerce_process_product_meta', 'themee_save_warranty_field');

function themee_save_warranty_field($post_id) {
    $warranty = $_POST['_product_warranty'];
    if (!empty($warranty)) {
        update_post_meta($post_id, '_product_warranty', sanitize_text_field($warranty));
    }
}

// Get upsell products (محصولات پیشنهادی)
function themee_get_upsell_products($product_id, $limit = 4) {
    if (!class_exists('WooCommerce')) {
        return array();
    }
    
    $product = wc_get_product($product_id);
    if (!$product) {
        return array();
    }
    
    $upsell_ids = $product->get_upsell_ids();
    
    if (empty($upsell_ids)) {
        return array();
    }
    
    $args = array(
        'post_type' => 'product',
        'posts_per_page' => $limit,
        'post__in' => $upsell_ids,
        'post_status' => 'publish',
        'orderby' => 'post__in',
    );
    
    $upsell_products = new WP_Query($args);
    
    return $upsell_products;
}

// Get cross-sell products (محصولات مشابه)
function themee_get_cross_sell_products($product_id, $limit = 4) {
    if (!class_exists('WooCommerce')) {
        return array();
    }
    
    $product = wc_get_product($product_id);
    if (!$product) {
        return array();
    }
    
    $cross_sell_ids = $product->get_cross_sell_ids();
    
    if (empty($cross_sell_ids)) {
        return array();
    }
    
    $args = array(
        'post_type' => 'product',
        'posts_per_page' => $limit,
        'post__in' => $cross_sell_ids,
        'post_status' => 'publish',
        'orderby' => 'post__in',
    );
    
    $cross_sell_products = new WP_Query($args);
    
    return $cross_sell_products;
}

// Get related products (محصولات مرتبط)
function themee_get_related_products($product_id, $limit = 4) {
    if (!class_exists('WooCommerce')) {
        return array();
    }
    
    $product = wc_get_product($product_id);
    if (!$product) {
        return array();
    }
    
    $related_ids = wc_get_related_products($product_id, $limit);
    
    if (empty($related_ids)) {
        return array();
    }
    
    $args = array(
        'post_type' => 'product',
        'posts_per_page' => $limit,
        'post__in' => $related_ids,
        'post_status' => 'publish',
        'orderby' => 'post__in',
    );
    
    $related_products = new WP_Query($args);
    
    return $related_products;
}

// Universal Product Card Component
function themee_product_card($product_id, $args = array()) {
    if (!class_exists('WooCommerce')) {
        return '';
    }
    
    $product = wc_get_product($product_id);
    if (!$product) {
        return '';
    }
    
    // Default arguments
    $defaults = array(
        'show_title' => true,
        'show_price' => true,
        'show_add_to_cart' => true,
        'show_rating' => true,
        'show_sale_badge' => true,
        'show_wishlist' => false,
        'show_compare' => false,
        'image_size' => 'medium',
        'title_length' => 2, // Number of lines for title
        'card_class' => '',
        'link_target' => '_self',
        'custom_button_text' => '',
        'custom_button_url' => '',
        'custom_button_class' => '',
    );
    
    $args = wp_parse_args($args, $defaults);
    
    // Get product data
    $product_title = get_the_title($product_id);
    $product_price = $product->get_price_html();
    $product_image = get_the_post_thumbnail_url($product_id, $args['image_size']);
    $product_link = get_permalink($product_id);
    $product_rating = $product->get_average_rating();
    $product_review_count = $product->get_review_count();
    $is_on_sale = $product->is_on_sale();
    $regular_price = $product->get_regular_price();
    $sale_price = $product->get_sale_price();
    
    // Calculate discount percentage
    $discount_percentage = 0;
    if ($is_on_sale && $regular_price && $sale_price) {
        $discount_percentage = round((($regular_price - $sale_price) / $regular_price) * 100);
    }
    
    // Build card classes
    $card_classes = array(
        'themee-product-card',
        'p-3',
        'bg-white',
        'rounded-lg',
        'shadow-lg',
        'overflow-hidden',
        'hover:shadow-xl',
        'transition-all',
        'duration-300',
        'hover:-translate-y-1',
        'flex',
        'flex-col',
        'h-full'
    );
    
    if (!empty($args['card_class'])) {
        $card_classes[] = $args['card_class'];
    }
    
    $card_class_string = implode(' ', $card_classes);
    
    // Start output
    ob_start();
    ?>
    <div class="<?php echo esc_attr($card_class_string); ?>">
        <!-- Top Section with Discount Badge and Action Buttons -->
        <div class="flex justify-between relative">
            <!-- Discount Badge -->
            <?php if ($args['show_sale_badge'] && $is_on_sale && $discount_percentage > 0): ?>
                <div class="bg-blue-500 rounded-full w-8 h-8 pt-1 text-white flex items-center justify-center text-xs absolute z-10">
                    % <?php echo $discount_percentage; ?>
                </div>
            <?php endif; ?>
            
            <!-- Action Buttons (Wishlist & Compare) -->
            <?php if ($args['show_wishlist']): ?>
                <div class="flex flex-col gap-y-2 absolute opacity-0 group-hover:opacity-100 left-0 transition-opacity duration-300 ease-out">
                    <!-- Wishlist Button -->
                    <svg class="bg-gray-200 rounded-full p-1 hover:fill-red-500 transition cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="33" height="33" fill="#2b2b2b" viewBox="0 0 256 256">
                        <path d="M178,34c-21,0-39.26,9.47-50,25.34C117.26,43.47,99,34,78,34A60.07,60.07,0,0,0,18,94c0,29.2,18.2,59.59,54.1,90.31a334.68,334.68,0,0,0,53.06,37,6,6,0,0,0,5.68,0,334.68,334.68,0,0,0,53.06-37C219.8,153.59,238,123.2,238,94A60.07,60.07,0,0,0,178,34ZM128,209.11C111.59,199.64,30,149.72,30,94A48.05,48.05,0,0,1,78,46c20.28,0,37.31,10.83,44.45,28.27a6,6,0,0,0,11.1,0C140.69,56.83,157.72,46,178,46a48.05,48.05,0,0,1,48,48C226,149.72,144.41,199.64,128,209.11Z"></path>
                    </svg>
                    <!-- Compare Button -->
                    <svg class="bg-gray-200 rounded-full p-1 hover:fill-zinc-500 transition cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="33" height="33" fill="#2b2b2b" viewBox="0 0 256 256">
                        <path d="M236.24,179.76a6,6,0,0,1,0,8.48l-24,24a6,6,0,0,1-8.48-8.48L217.52,190H200.94a70.16,70.16,0,0,1-57-29.31l-41.71-58.4A58.11,58.11,0,0,0,55.06,78H32a6,6,0,0,1,0-12H55.06a70.16,70.16,0,0,1,57,29.31l41.71,58.4A58.11,58.11,0,0,0,200.94,178h16.58l-13.76-13.76a6,6,0,0,1,8.48-8.48Zm-92.06-74.41a5.91,5.91,0,0,0,3.48,1.12,6,6,0,0,0,4.89-2.51l1.19-1.67A58.11,58.11,0,0,1,200.94,78h16.58L203.76,91.76a6,6,0,1,0,8.48,8.48l24-24a6,6,0,0,0,0-8.48l-24-24a6,6,0,0,0-8.48,8.48L217.52,66H200.94a70.16,70.16,0,0,0-57,29.31L142.78,97A6,6,0,0,0,144.18,105.35Zm-32.36,45.3a6,6,0,0,0-8.37,1.39l-1.19,1.67A58.11,58.11,0,0,1,55.06,178H32a6,6,0,0,0,0,12H55.06a70.16,70.16,0,0,0,57-29.31l1.19-1.67A6,6,0,0,0,111.82,150.65Z"></path>
                    </svg>
                </div>
            <?php endif; ?>
        </div>
        
        <!-- Product Image - Fixed Height -->
        <div class="image-box mb-6 flex-shrink-0">
            <a href="<?php echo esc_url($product_link); ?>" target="<?php echo esc_attr($args['link_target']); ?>">
                <?php if ($product_image): ?>
                    <img class="w-full h-48 object-cover" src="<?php echo esc_url($product_image); ?>" alt="<?php echo esc_attr($product_title); ?>">
                <?php else: ?>
                    <div class="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg">
                        <span class="text-gray-400">بدون تصویر</span>
                    </div>
                <?php endif; ?>
            </a>
        </div>
        
        <!-- Product Content - Flexible -->
        <div class="flex flex-col flex-grow">
            <!-- Product Title and Rating -->
            <div class="mb-2 h-16 flex justify-between">
                <a href="<?php echo esc_url($product_link); ?>" target="<?php echo esc_attr($args['link_target']); ?>" class="flex flex-col gap-y-2">
                    <?php if ($args['show_title']): ?>
                        <span class="text-sm font-semibold text-zinc-800 line-clamp-2">
                            <?php echo esc_html($product_title); ?>
                        </span>
                        <?php 
                        // Get product SKU or short description as subtitle
                        $product_subtitle = $product->get_sku() ? $product->get_sku() : 'محصول با کیفیت';
                        ?>
                        <span class="text-xs text-zinc-500">
                            <?php echo esc_html($product_subtitle); ?>
                        </span>
                    <?php endif; ?>
                </a>
                
                <!-- Product Rating -->
                <?php if ($args['show_rating'] && $product_rating > 0): ?>
                    <div class="flex items-start gap-x-1 text-xs text-zinc-500 flex-shrink-0">
                        <span class="pt-0.5">
                            <span>(<?php echo $product_review_count; ?>+)</span>
                            <span><?php echo $product_rating; ?></span>
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#f9bc00" viewBox="0 0 256 256">
                            <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                        </svg>
                    </div>
                <?php endif; ?>
            </div>
            
            <!-- Product Price -->
            <?php if ($args['show_price']): ?>
                <div class="flex items-center gap-x-2 mb-4">
                    <?php if ($is_on_sale && $regular_price && $sale_price): ?>
                        <!-- Regular Price (Crossed Out) -->
                        <div class="flex justify-center gap-x-1 text-xs text-zinc-400">
                            <div class="line-through"><?php echo number_format($regular_price / 10, 0, '.', ','); ?></div>
                            <div class="line-through">تومان</div>
                        </div>
                        <!-- Sale Price -->
                        <div class="flex justify-center gap-x-1 font-semibold text-zinc-800">
                            <div><?php echo number_format($sale_price / 10, 0, '.', ','); ?></div>
                            <div>تومان</div>
                        </div>
                    <?php else: ?>
                        <!-- Regular Price -->
                        <div class="flex justify-center gap-x-1 font-semibold text-zinc-800">
                            <div><?php echo number_format($regular_price / 10, 0, '.', ','); ?></div>
                            <div>تومان</div>
                        </div>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
            
            <!-- Spacer to push button to bottom -->
            <div class="flex-grow"></div>
            
            <!-- Action Button - Always at bottom -->
            <?php if ($args['show_add_to_cart'] || !empty($args['custom_button_text'])): ?>
                <div class="mt-auto">
                    <?php if (!empty($args['custom_button_text']) && !empty($args['custom_button_url'])): ?>
                        <!-- Custom Button -->
                        <a href="<?php echo esc_url($args['custom_button_url']); ?>" 
                           class="flex items-center justify-center gap-x-1 text-sm w-full py-2 px-2 rounded-lg text-white bg-blue-500 hover:bg-blue-400 transition <?php echo esc_attr($args['custom_button_class']); ?>">
                            <?php echo esc_html($args['custom_button_text']); ?>
                        </a>
                    <?php else: ?>
                        <!-- Product Link Button -->
                        <a href="<?php echo esc_url($product_link); ?>" 
                           class="flex items-center justify-center gap-x-1 text-sm w-full py-2 px-2 rounded-lg text-white bg-blue-500 hover:bg-blue-400 transition">
                            خرید محصول
                        </a>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>
    <?php
    
    return ob_get_clean();
}

// Helper function to display product cards in grid
function themee_product_grid($products, $args = array()) {
    if (empty($products)) {
        return '';
    }
    
    $defaults = array(
        'columns' => 4,
        'gap' => 6,
        'container_class' => '',
        'card_args' => array(),
    );
    
    $args = wp_parse_args($args, $defaults);
    
    // Build grid classes
    $grid_classes = array(
        'grid',
        'gap-' . $args['gap'],
    );
    
    // Responsive grid columns
    switch ($args['columns']) {
        case 1:
            $grid_classes[] = 'grid-cols-1';
            break;
        case 2:
            $grid_classes[] = 'grid-cols-1 sm:grid-cols-2';
            break;
        case 3:
            $grid_classes[] = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
            break;
        case 4:
        default:
            $grid_classes[] = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
            break;
    }
    
    if (!empty($args['container_class'])) {
        $grid_classes[] = $args['container_class'];
    }
    
    $grid_class_string = implode(' ', $grid_classes);
    
    ob_start();
    ?>
    <div class="<?php echo esc_attr($grid_class_string); ?>">
        <?php foreach ($products as $product_id): ?>
            <?php echo themee_product_card($product_id, $args['card_args']); ?>
        <?php endforeach; ?>
    </div>
    <?php
    
    return ob_get_clean();
}

// AJAX handler for cart operations
add_action('wp_ajax_themee_update_cart', 'themee_ajax_update_cart');
add_action('wp_ajax_nopriv_themee_update_cart', 'themee_ajax_update_cart');

function themee_ajax_update_cart() {
    if (!class_exists('WooCommerce')) {
        wp_send_json_error(array('message' => 'WooCommerce فعال نیست'));
    }
    
    $action = sanitize_text_field($_POST['action_type']);
    $cart_item_key = sanitize_text_field($_POST['cart_item_key']);
    
    if ($action === 'remove') {
        // Remove item from cart
        WC()->cart->remove_cart_item($cart_item_key);
        wp_send_json_success(array(
            'message' => 'محصول از سبد خرید حذف شد',
            'cart_count' => WC()->cart->get_cart_contents_count(),
            'cart_total' => WC()->cart->get_cart_total()
        ));
    } elseif ($action === 'update_quantity') {
        $quantity = intval($_POST['quantity']);
        if ($quantity <= 0) {
            WC()->cart->remove_cart_item($cart_item_key);
        } else {
            WC()->cart->set_quantity($cart_item_key, $quantity);
        }
        wp_send_json_success(array(
            'message' => 'تعداد محصول به‌روزرسانی شد',
            'cart_count' => WC()->cart->get_cart_contents_count(),
            'cart_total' => WC()->cart->get_cart_total()
        ));
    }
    
    wp_send_json_error(array('message' => 'عملیات نامعتبر'));
}

// Enable comments support
function themee_enable_comments() {
    add_theme_support('html5', array('comment-list', 'comment-form', 'search-form', 'gallery', 'caption'));
}
add_action('after_setup_theme', 'themee_enable_comments');

// Custom comment form fields
function themee_comment_form_defaults($defaults) {
    $defaults['title_reply'] = 'دیدگاه خود را بنویسید';
    $defaults['title_reply_to'] = 'پاسخ به %s';
    $defaults['cancel_reply_link'] = 'لغو پاسخ';
    $defaults['label_submit'] = 'ارسال دیدگاه';
    $defaults['comment_field'] = '<p class="comment-form-comment"><label for="comment">دیدگاه شما <span class="required">*</span></label><textarea id="comment" name="comment" cols="45" rows="8" required></textarea></p>';
    return $defaults;
}
add_filter('comment_form_defaults', 'themee_comment_form_defaults');

// Custom comment form fields
function themee_comment_form_fields($fields) {
    $commenter = wp_get_current_commenter();
    $req = get_option('require_name_email');
    $aria_req = ($req ? " aria-required='true'" : '');
    
    $fields['author'] = '<p class="comment-form-author"><label for="author">نام <span class="required">*</span></label><input id="author" name="author" type="text" value="' . esc_attr($commenter['comment_author']) . '" size="30"' . $aria_req . ' required /></p>';
    $fields['email'] = '<p class="comment-form-email"><label for="email">ایمیل <span class="required">*</span></label><input id="email" name="email" type="email" value="' . esc_attr($commenter['comment_author_email']) . '" size="30"' . $aria_req . ' required /></p>';
    $fields['url'] = '<p class="comment-form-url"><label for="url">وب‌سایت</label><input id="url" name="url" type="url" value="' . esc_attr($commenter['comment_author_url']) . '" size="30" /></p>';
    
    return $fields;
}
add_filter('comment_form_default_fields', 'themee_comment_form_fields');

// AJAX handler for sending verification code
add_action('wp_ajax_send_verification_code', 'themee_send_verification_code');
add_action('wp_ajax_nopriv_send_verification_code', 'themee_send_verification_code');

// AJAX handler for verifying code
add_action('wp_ajax_verify_code', 'themee_verify_code');
add_action('wp_ajax_nopriv_verify_code', 'themee_verify_code');

// Send verification code function
function themee_send_verification_code() {
    // Verify nonce
    if (!wp_verify_nonce($_POST['nonce'], 'verification_nonce')) {
        wp_send_json_error(array('message' => 'Nonce verification failed'));
    }
    
    $phone_number = sanitize_text_field($_POST['phone_number']);
    
    // Validate phone number
    if (empty($phone_number) || strlen($phone_number) !== 11 || !preg_match('/^09\d{9}$/', $phone_number)) {
        wp_send_json_error(array('message' => 'شماره موبایل نامعتبر است'));
    }
    
    // Generate verification code
    $verification_code = sprintf('%06d', wp_rand(100000, 999999));
    
    // Store verification code in transient (expires in 5 minutes)
    set_transient('verification_code_' . $phone_number, $verification_code, 300);
    
    // Store phone number for verification
    set_transient('phone_number_' . $phone_number, $phone_number, 300);
    
    // In a real application, you would send SMS here
    // For demo purposes, we'll just log it
    error_log('Verification code for ' . $phone_number . ': ' . $verification_code);
    
    // For development, you can also store it in a custom table or option
    update_option('last_verification_code_' . $phone_number, $verification_code);
    
    wp_send_json_success(array(
        'message' => 'کد تایید ارسال شد',
        'code' => $verification_code // Remove this in production
    ));
}

// Verify code function
function themee_verify_code() {
    // Verify nonce
    if (!wp_verify_nonce($_POST['nonce'], 'verification_nonce')) {
        wp_send_json_error(array('message' => 'Nonce verification failed'));
    }
    
    $phone_number = sanitize_text_field($_POST['phone_number']);
    $verification_code = sanitize_text_field($_POST['verification_code']);
    
    // Validate inputs
    if (empty($phone_number) || empty($verification_code)) {
        wp_send_json_error(array('message' => 'اطلاعات ناقص است'));
    }
    
    // Get stored verification code
    $stored_code = get_transient('verification_code_' . $phone_number);
    
    if (!$stored_code) {
        wp_send_json_error(array('message' => 'کد تایید منقضی شده است'));
    }
    
    // Verify code
    if ($stored_code !== $verification_code) {
        wp_send_json_error(array('message' => 'کد تایید اشتباه است'));
    }
    
    // Code is correct, now handle user login/registration
    $user = get_user_by('login', $phone_number);
    
    if (!$user) {
        // Create new user
        $user_id = wp_create_user($phone_number, wp_generate_password(), $phone_number . '@temp.com');
        
        if (is_wp_error($user_id)) {
            wp_send_json_error(array('message' => 'خطا در ایجاد حساب کاربری'));
        }
        
        // Update user meta
        update_user_meta($user_id, 'phone_number', $phone_number);
        update_user_meta($user_id, 'phone_verified', true);
        
        $user = get_user_by('id', $user_id);
    } else {
        // Update existing user
        update_user_meta($user->ID, 'phone_verified', true);
    }
    
    // Log user in
    wp_set_current_user($user->ID);
    wp_set_auth_cookie($user->ID, true);
    
    // Clear verification code
    delete_transient('verification_code_' . $phone_number);
    delete_transient('phone_number_' . $phone_number);
    
    // Determine redirect URL
    $redirect_url = themee_update_verification_redirect();
    
    wp_send_json_success(array(
        'message' => 'ورود موفقیت‌آمیز',
        'redirect_url' => $redirect_url,
        'user_id' => $user->ID
    ));
}

// Create login page on theme activation
function themee_create_login_page() {
    $page_title = 'ورود و ثبت نام';
    $page_slug = 'login';
    
    // Check if page already exists
    $existing_page = get_page_by_path($page_slug);
    
    if (!$existing_page) {
        $page_data = array(
            'post_title' => $page_title,
            'post_name' => $page_slug,
            'post_content' => '',
            'post_status' => 'publish',
            'post_type' => 'page',
            'post_author' => 1,
            'page_template' => 'page-login.php'
        );
        
        $page_id = wp_insert_post($page_data);
        
        if ($page_id && !is_wp_error($page_id)) {
            // Set page template
            update_post_meta($page_id, '_wp_page_template', 'page-login.php');
            
            // Add to theme options
            update_option('themee_login_page_id', $page_id);
        }
    }
}

// Hook to create login page
add_action('after_switch_theme', 'themee_create_login_page');

// Create verification codes page for development
function themee_create_verification_codes_page() {
    if (!defined('WP_DEBUG') || !WP_DEBUG) {
        return;
    }
    
    $page_title = 'نمایش کدهای تایید';
    $page_slug = 'verification-codes';
    
    // Check if page already exists
    $existing_page = get_page_by_path($page_slug);
    
    if (!$existing_page) {
        $page_data = array(
            'post_title' => $page_title,
            'post_name' => $page_slug,
            'post_content' => '',
            'post_status' => 'publish',
            'post_type' => 'page',
            'post_author' => 1,
            'page_template' => 'page-verification-codes.php'
        );
        
        $page_id = wp_insert_post($page_data);
        
        if ($page_id && !is_wp_error($page_id)) {
            // Set page template
            update_post_meta($page_id, '_wp_page_template', 'page-verification-codes.php');
        }
    }
}

// Hook to create verification codes page
add_action('after_switch_theme', 'themee_create_verification_codes_page');

// Force create login page immediately
function themee_force_create_login_page() {
    $login_page_id = get_option('themee_login_page_id');
    
    if (!$login_page_id) {
        themee_create_login_page();
    }
}
add_action('wp_loaded', 'themee_force_create_login_page');

// Create login page with /login slug
function themee_create_login_page_with_slug() {
    $login_page_id = get_option('themee_login_page_id');
    
    if ($login_page_id) {
        // Update the page slug to 'login'
        wp_update_post(array(
            'ID' => $login_page_id,
            'post_name' => 'login'
        ));
        
        // Flush rewrite rules
        flush_rewrite_rules();
    }
}
add_action('init', 'themee_create_login_page_with_slug');


// Redirect logout to home page
function themee_redirect_logout() {
    wp_redirect(home_url());
    exit;
}
add_action('wp_logout', 'themee_redirect_logout');


// Handle login redirect parameter
function themee_handle_login_redirect() {
    if (isset($_GET['redirect_to']) && !empty($_GET['redirect_to'])) {
        // Store redirect URL in session or transient
        set_transient('login_redirect_' . session_id(), esc_url_raw($_GET['redirect_to']), 300);
    }
}
add_action('init', 'themee_handle_login_redirect');

// Update verification success redirect
function themee_update_verification_redirect() {
    $redirect_url = home_url();
    
    // Check for stored redirect URL
    $stored_redirect = get_transient('login_redirect_' . session_id());
    if ($stored_redirect) {
        $redirect_url = $stored_redirect;
        delete_transient('login_redirect_' . session_id());
    }
    
    // Check for WooCommerce account page
    if (function_exists('wc_get_account_endpoint_url')) {
        $account_url = wc_get_account_endpoint_url('dashboard');
        if ($account_url) {
            $redirect_url = $account_url;
        }
    }
    
    return $redirect_url;
}


// Change WooCommerce logout URL
function themee_woocommerce_logout_url($logout_url) {
    return wp_logout_url(home_url());
}
add_filter('woocommerce_logout_url', 'themee_woocommerce_logout_url');


// Add login page to menu automatically
function themee_add_login_to_menu() {
    $login_page_id = get_option('themee_login_page_id');
    
    if ($login_page_id) {
        // Get primary menu
        $menu_locations = get_nav_menu_locations();
        $primary_menu_id = isset($menu_locations['primary']) ? $menu_locations['primary'] : null;
        
        if ($primary_menu_id) {
            $menu_items = wp_get_nav_menu_items($primary_menu_id);
            $login_exists = false;
            
            foreach ($menu_items as $item) {
                if ($item->object_id == $login_page_id) {
                    $login_exists = true;
                    break;
                }
            }
            
            if (!$login_exists) {
                wp_update_nav_menu_item($primary_menu_id, 0, array(
                    'menu-item-title' => 'ورود',
                    'menu-item-object-id' => $login_page_id,
                    'menu-item-object' => 'page',
                    'menu-item-type' => 'post_type',
                    'menu-item-status' => 'publish'
                ));
            }
        }
    }
}

// Add login link to header
function themee_add_login_link_to_header() {
    if (!is_user_logged_in()) {
        $login_url = themee_get_login_url();
        echo '<a href="' . esc_url($login_url) . '" class="login-link">ورود</a>';
    } else {
        $logout_url = themee_get_logout_url();
        echo '<a href="' . esc_url($logout_url) . '" class="logout-link">خروج</a>';
    }
}

// Helper function to get login URL
function themee_get_login_url() {
    $login_page_id = get_option('themee_login_page_id');
    
    if ($login_page_id) {
        return get_permalink($login_page_id);
    }
    
    return wp_login_url();
}

// Helper function to get logout URL
function themee_get_logout_url() {
    return wp_logout_url(home_url());
}

// Protect user account pages from non-logged-in users
function themee_protect_user_pages() {
    // List of pages that require login
    $protected_pages = array(
        'profile',
        'profile-favorites', 
        'profile-orders',
        'profile-messages',
        'profile-order-detail',
        'my-account'
    );
    
    // Check if current page is protected
    $current_page = get_post();
    if (!$current_page) return;
    
    $page_slug = $current_page->post_name;
    
    if (in_array($page_slug, $protected_pages) && !is_user_logged_in()) {
        // Redirect to login page
        $login_page_id = get_option('themee_login_page_id');
        if ($login_page_id) {
            $login_url = get_permalink($login_page_id);
            wp_redirect($login_url);
            exit;
        } else {
            wp_redirect(wp_login_url());
            exit;
        }
    }
}
add_action('template_redirect', 'themee_protect_user_pages');

// Protect WooCommerce account pages
function themee_protect_woocommerce_pages() {
    if (function_exists('is_account_page') && is_account_page() && !is_user_logged_in()) {
        $login_page_id = get_option('themee_login_page_id');
        if ($login_page_id) {
            $login_url = get_permalink($login_page_id);
            wp_redirect($login_url);
            exit;
        } else {
            wp_redirect(wp_login_url());
            exit;
        }
    }
}
add_action('template_redirect', 'themee_protect_woocommerce_pages');

// Protect cart and checkout pages
function themee_protect_cart_checkout() {
    if (function_exists('is_cart') && function_exists('is_checkout')) {
        if ((is_cart() || is_checkout()) && !is_user_logged_in()) {
            $login_page_id = get_option('themee_login_page_id');
            if ($login_page_id) {
                $login_url = get_permalink($login_page_id);
                wp_redirect($login_url);
                exit;
            } else {
                wp_redirect(wp_login_url());
                exit;
            }
        }
    }
}
add_action('template_redirect', 'themee_protect_cart_checkout');


// Custom login redirect
function themee_login_redirect($redirect_to, $request, $user) {
    if (is_wp_error($user)) {
        return $redirect_to;
    }
    
    // If user has admin capability, redirect to wp-admin
    if (user_can($user, 'administrator')) {
        return admin_url();
    }
    
    // For regular users, redirect to home or WooCommerce account
    if (function_exists('wc_get_account_endpoint_url')) {
        return wc_get_account_endpoint_url('dashboard');
    }
    
    return home_url();
}
add_filter('login_redirect', 'themee_login_redirect', 10, 3);

// Hide admin bar for non-admin users
function themee_hide_admin_bar() {
    if (!current_user_can('administrator')) {
        show_admin_bar(false);
    }
}
add_action('after_setup_theme', 'themee_hide_admin_bar');

// Custom user registration fields
function themee_add_phone_field($user) {
    ?>
    <h3>اطلاعات تماس</h3>
    <table class="form-table">
        <tr>
            <th><label for="phone_number">شماره موبایل</label></th>
            <td>
                <input type="tel" name="phone_number" id="phone_number" value="<?php echo esc_attr(get_user_meta($user->ID, 'phone_number', true)); ?>" class="regular-text" />
                <br><span class="description">شماره موبایل کاربر</span>
            </td>
        </tr>
    </table>
    <?php
}
add_action('show_user_profile', 'themee_add_phone_field');
add_action('edit_user_profile', 'themee_add_phone_field');

// Save phone number
function themee_save_phone_field($user_id) {
    if (current_user_can('edit_user', $user_id)) {
        update_user_meta($user_id, 'phone_number', sanitize_text_field($_POST['phone_number']));
    }
}
add_action('personal_options_update', 'themee_save_phone_field');
add_action('edit_user_profile_update', 'themee_save_phone_field');

// Add phone number to user list
function themee_add_phone_column($columns) {
    $columns['phone_number'] = 'شماره موبایل';
    return $columns;
}
add_filter('manage_users_columns', 'themee_add_phone_column');

function themee_show_phone_column($value, $column_name, $user_id) {
    if ($column_name === 'phone_number') {
        $phone = get_user_meta($user_id, 'phone_number', true);
        return $phone ? $phone : '—';
    }
    return $value;
}
add_filter('manage_users_custom_column', 'themee_show_phone_column', 10, 3);

// Set default country to Iran and hide country selects on checkout
function themee_checkout_default_country_and_hide_select( $fields ) {
    // Ensure WooCommerce is available
    if ( ! class_exists( 'WooCommerce' ) ) {
        return $fields;
    }

    // Helper to modify a country field
    $hide_country = function( &$section, $key ) {
        if ( isset( $section[ $key ] ) ) {
            $section[ $key ]['type']     = 'hidden';
            $section[ $key ]['required'] = false;
            $section[ $key ]['default']  = 'IR';
            $section[ $key ]['label']    = false;
            $section[ $key ]['class']    = array( 'form-row-wide' );
        }
    };

    // Billing country
    if ( isset( $fields['billing'] ) ) {
        $hide_country( $fields['billing'], 'billing_country' );
    }

    // Shipping country
    if ( isset( $fields['shipping'] ) ) {
        $hide_country( $fields['shipping'], 'shipping_country' );
    }

    return $fields;
}
add_filter( 'woocommerce_checkout_fields', 'themee_checkout_default_country_and_hide_select', 20 );

// Also set the customer default country during checkout rendering
function themee_force_customer_country_iran() {
    if ( function_exists( 'WC' ) && WC()->customer ) {
        if ( ! WC()->customer->get_billing_country() ) {
            WC()->customer->set_billing_country( 'IR' );
        }
        if ( ! WC()->customer->get_shipping_country() ) {
            WC()->customer->set_shipping_country( 'IR' );
        }
    }
}
add_action( 'woocommerce_before_checkout_form', 'themee_force_customer_country_iran', 5 );

// AJAX Add to Cart Handler
function themee_ajax_add_to_cart() {
    // Advanced debugging
    static $call_counter = 0;
    $call_counter++;
    
    error_log("=== AJAX ADD TO CART CALL #{$call_counter} ===");
    error_log('POST data: ' . print_r($_POST, true));
    error_log('Current cart contents before: ' . WC()->cart->get_cart_contents_count());
    
    // Log the exact time to detect rapid calls
    error_log('Timestamp: ' . microtime(true));

    if (!isset($_POST['add-to-cart']) || !is_numeric($_POST['add-to-cart'])) {
        error_log('ERROR: Invalid product ID');
        wp_send_json_error(array(
            'message' => 'شناسه محصول نامعتبر است'
        ));
        return;
    }

    $product_id = absint($_POST['add-to-cart']);
    $quantity = 1; // Force quantity to 1 to prevent double adding
    $variation_id = 0;
    $variations = array();
    
    error_log("Processing: Product ID={$product_id}, Quantity={$quantity}");

    // Validate product exists
    $product = wc_get_product($product_id);
    if (!$product) {
        wp_send_json_error(array(
            'message' => 'محصول یافت نشد - ID: ' . $product_id
        ));
        return;
    }

    // Handle variable products
    if ($product->is_type('variable')) {
        // Get variations from POST data
        foreach ($_POST as $key => $value) {
            if (strpos($key, 'attribute_') === 0 && !empty($value)) {
                $variations[$key] = sanitize_text_field($value);
            }
        }

        // Find matching variation
        if (!empty($variations)) {
            $data_store = WC_Data_Store::load('product');
            $variation_id = $data_store->find_matching_product_variation($product, $variations);
        }

        // Check if variation is required but not found
        if (empty($variation_id) && !empty($variations)) {
            wp_send_json_error(array(
                'message' => 'لطفاً تمام گزینه‌های محصول را انتخاب کنید'
            ));
            return;
        }
    }

    // Check if product already exists in cart
    $cart_contents = WC()->cart->get_cart();
    $existing_quantity = 0;
    foreach ($cart_contents as $key => $item) {
        if ($item['product_id'] == $product_id) {
            $existing_quantity = $item['quantity'];
            error_log("Product {$product_id} already exists in cart with quantity: {$existing_quantity}");
            break;
        }
    }
    
    // Alternative approach: Clear cart first (for testing)
    // WC()->cart->empty_cart();
    // error_log("Cart cleared for testing");
    
    // Add to cart with detailed logging
    error_log("About to call WC()->cart->add_to_cart() - Current quantity in cart: {$existing_quantity}");
    $cart_item_key = WC()->cart->add_to_cart($product_id, $quantity, $variation_id, $variations);
    error_log("WC add_to_cart returned: " . ($cart_item_key ? $cart_item_key : 'FALSE'));
    
    // Force set quantity to 1 if it was added
    if ($cart_item_key) {
        $cart_contents_after = WC()->cart->get_cart();
        foreach ($cart_contents_after as $key => $item) {
            if ($item['product_id'] == $product_id && $item['quantity'] > 1) {
                error_log("FIXING: Product quantity was {$item['quantity']}, setting to 1");
                WC()->cart->set_quantity($key, 1);
                break;
            }
        }
    }
    
    $cart_count_after = WC()->cart->get_cart_contents_count();
    error_log("Cart contents count after add_to_cart: {$cart_count_after}");
    
    // Check final quantity in cart
    $cart_contents_final = WC()->cart->get_cart();
    foreach ($cart_contents_final as $key => $item) {
        if ($item['product_id'] == $product_id) {
            error_log("FINAL: Product {$product_id} in cart with quantity: {$item['quantity']} (was {$existing_quantity})");
        }
    }

    if ($cart_item_key) {
        error_log("SUCCESS: Product added to cart");
        wp_send_json_success(array(
            'message' => 'محصول با موفقیت به سبد خرید اضافه شد',
            'cart_count' => $cart_count_after,
            'cart_total' => WC()->cart->get_cart_total()
        ));
    } else {
        // Get WooCommerce notices
        $notices = wc_get_notices('error');
        $error_message = 'خطا در افزودن محصول به سبد خرید';
        if (!empty($notices)) {
            $error_message = $notices[0]['notice'];
            wc_clear_notices();
        }

        wp_send_json_error(array(
            'message' => $error_message
        ));
    }
}
add_action('wp_ajax_themee_add_to_cart', 'themee_ajax_add_to_cart');
add_action('wp_ajax_nopriv_themee_add_to_cart', 'themee_ajax_add_to_cart');

// Debug WooCommerce hooks that might be adding products
function themee_debug_wc_add_to_cart_hooks($cart_item_key, $product_id, $quantity, $variation_id, $variation, $cart_item_data) {
    error_log("WC HOOK: woocommerce_add_to_cart fired - Product ID: {$product_id}, Quantity: {$quantity}");
    
    // Log the call stack to see what triggered this
    $backtrace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 10);
    $caller_info = array();
    foreach ($backtrace as $trace) {
        if (isset($trace['file']) && isset($trace['line'])) {
            $caller_info[] = basename($trace['file']) . ':' . $trace['line'];
        }
    }
    error_log("Call stack: " . implode(' -> ', $caller_info));
}
add_action('woocommerce_add_to_cart', 'themee_debug_wc_add_to_cart_hooks', 10, 6);

// Check if there are any other AJAX handlers
function themee_debug_ajax_requests() {
    if (defined('DOING_AJAX') && DOING_AJAX) {
        error_log("AJAX REQUEST: " . $_POST['action'] . " - " . print_r($_POST, true));
    }
}
add_action('init', 'themee_debug_ajax_requests');

// Disable WooCommerce default add to cart processing on single product pages
function themee_disable_wc_default_add_to_cart() {
    if (is_admin() || !is_product()) {
        return;
    }
    
    // Remove WooCommerce default add to cart handler
    remove_action('wp_loaded', array('WC_Form_Handler', 'add_to_cart_action'), 20);
    remove_action('wp_loaded', array('WC_Form_Handler', 'process_login'), 20);
    
    // Disable WooCommerce AJAX add to cart
    add_filter('woocommerce_is_ajax_add_to_cart_enabled', '__return_false');
}
add_action('init', 'themee_disable_wc_default_add_to_cart', 5);
