<?php
/**
 * The main template file
 *
 * @package Themee
 */

get_header(); ?>

<main class="pt-20 md:pt-40 lg:pt-[73px]">
    <!-- Hero Slider -->
    <?php
    // Get MetaSlider slides
    $slider_id = get_option('themee_hero_slider_id', 73); // Default slider ID (updated to match user's slider)
    
    // Check if MetaSlider is active and get content
    $slider_html = themee_get_metaslider_content($slider_id);
    
    if ($slider_html !== false) {
        // MetaSlider is working and has content
        $slider_html = str_replace('class="metaslider', 'class="metaslider heroSlider rounded-lg', $slider_html);
        echo $slider_html;
    } else if (themee_check_metaslider_status()) {
        // MetaSlider is active but no content
        echo '<div class="hero-banner bg-gradient-to-r from-blue-500 to-blue-600 text-white py-20 rounded-lg">';
        echo '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">';
        echo '<div class="text-center">';
        echo '<h1 class="text-4xl md:text-6xl font-bold mb-6">MetaSlider تنظیم نشده</h1>';
        echo '<p class="text-xl md:text-2xl mb-8">لطفاً ابتدا اسلایدر خود را در MetaSlider ایجاد کنید</p>';
        echo '<p class="text-sm mb-4">شناسه اسلایدر فعلی: ' . $slider_id . '</p>';
        echo '<a href="' . admin_url('admin.php?page=metaslider') . '" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">تنظیم اسلایدر</a>';
        echo '</div>';
        echo '</div>';
        echo '</div>';
    } else {
        // MetaSlider is not installed
        echo '<div class="hero-banner bg-gradient-to-r from-blue-500 to-blue-600 text-white py-20 rounded-lg">';
        echo '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">';
        echo '<div class="text-center">';
        echo '<h1 class="text-4xl md:text-6xl font-bold mb-6">MetaSlider نصب نشده</h1>';
        echo '<p class="text-xl md:text-2xl mb-8">لطفاً ابتدا افزونه MetaSlider را نصب و فعال کنید</p>';
        echo '<a href="' . admin_url('plugin-install.php?s=metaslider&tab=search&type=term') . '" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">نصب MetaSlider</a>';
        echo '</div>';
        echo '</div>';
        echo '</div>';
    }
    ?>
    
    <!-- Animate Button -->
    <div class="flex justify-center my-10">
        <svg class="animate-bounce fill-blue-500" xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="#f7f7f7" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm37.66-85.66a8,8,0,0,1,0,11.32l-32,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32L120,148.69V88a8,8,0,0,1,16,0v60.69l18.34-18.35A8,8,0,0,1,165.66,130.34Z"></path></svg>
    </div>

    <!-- Popular Categories Section -->
    <?php if (class_exists('WooCommerce')): ?>
    <div class="pb-6 my-10">
        <div class="flex justify-center px-3 md:px-10 items-center">
            <div class="text-gray-900 pb-2 mb-5 text-2xl font-extrabold">
                محبوب ترین دسته ها
            </div>
        </div>
        <div class="flex flex-wrap gap-4 md:gap-x-8 justify-center">
            <?php
            // Get WooCommerce product categories
            $categories = get_terms(array(
                'taxonomy' => 'product_cat',
                'hide_empty' => true,
                'number' => 8, // Limit to 8 categories
                'orderby' => 'count',
                'order' => 'DESC'
            ));
            
            
            if (!empty($categories) && !is_wp_error($categories)) {
                foreach ($categories as $index => $category) {
                    $category_link = get_term_link($category);
                    
                    // Get category thumbnail image
                    $thumbnail_id = get_term_meta($category->term_id, 'thumbnail_id', true);
                    $thumbnail_url = '';
                    
                    if ($thumbnail_id) {
                        $thumbnail_url = wp_get_attachment_image_url($thumbnail_id, 'thumbnail');
                    }
                    
                    // Fallback to WooCommerce placeholder if no thumbnail
                    if (!$thumbnail_url) {
                        $thumbnail_url = wc_placeholder_img_src();
                    }
                    ?>
                    <div class="flex flex-col gap-y-2 items-center justify-center">
                        <a class="border-2 border-gray-300 hover:border-blue-600 rounded-full hover:shadow-md group hover:bg-blue-600 hover:text-white transition duration-200 w-24 md:w-28 h-24 md:h-28 p-1 opacity-90 text-zinc-800 text-sm font-semibold flex flex-col items-center justify-center overflow-hidden" href="<?php echo esc_url($category_link); ?>">
                            <div class="rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                                <img src="<?php echo esc_url($thumbnail_url); ?>" alt="<?php echo esc_attr($category->name); ?>" class="w-full object-cover w-24 md:w-28 h-24 md:h-28" />
                            </div>
                        </a>
                        <span class="text-center leading-tight"><?php echo esc_html($category->name); ?></span>

                    </div>
                    <?php
                }
            } else {
                // Fallback categories if no WooCommerce categories exist
                $fallback_categories = array(
                    array('name' => 'سوپر مارکت', 'link' => '#'),
                    array('name' => 'لوازم خانگی', 'link' => '#'),
                    array('name' => 'عینک', 'link' => '#'),
                    array('name' => 'پوشاک', 'link' => '#'),
                    array('name' => 'موبایل', 'link' => '#'),
                    array('name' => 'لوازم آرایشی', 'link' => '#'),
                    array('name' => 'ابزار آلات', 'link' => '#')
                );
                
                foreach ($fallback_categories as $fallback) {
                    // Use WooCommerce placeholder for fallback categories
                    $thumbnail_url = wc_placeholder_img_src();
                    ?>
                    <a class="border-2 border-gray-300 hover:border-blue-600 rounded-full hover:shadow-md group hover:bg-blue-600 hover:text-white transition duration-200 w-24 md:w-28 h-24 md:h-28 opacity-90 text-zinc-800 text-sm font-semibold flex flex-col gap-y-2 items-center justify-center overflow-hidden" href="<?php echo esc_url($fallback['link']); ?>">
                        <div class="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                            <img src="<?php echo esc_url($thumbnail_url); ?>" alt="<?php echo esc_attr($fallback['name']); ?>" class="w-full h-full object-cover" />
                        </div>
                        <span class="text-center leading-tight"><?php echo esc_html($fallback['name']); ?></span>
                    </a>
                    <?php
                }
            }
            ?>
        </div>
    </div>
    <?php endif; ?>

    <!-- Latest Products Section -->
    <?php if (class_exists('WooCommerce')): ?>
    <div class="my-10 px-3">
        <!-- TOP SLIDER -->
        <div class="flex justify-between items-center pb-3">
            <div class="px-4 py-2 flex justify-center items-center gap-x-1 font-bold md:text-lg text-zinc-700 relative">
                <div class="z-10">
                    آخرین محصولات
                </div>
                <div class="w-20 h-2 bg-blue-300 shadow-lg absolute right-5 top-5 rounded-sm">
                </div>
            </div>
            <a href="<?php echo get_permalink(get_option('woocommerce_shop_page_id')); ?>">
                <div class="transition px-4 py-2 flex justify-center items-center text-zinc-700 hover:text-zinc-600">
                    مشاهده همه
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#292929" viewBox="0 0 256 256"><path d="M164.24,203.76a6,6,0,1,1-8.48,8.48l-80-80a6,6,0,0,1,0-8.48l80-80a6,6,0,0,1,8.48,8.48L88.49,128Z"></path></svg>
                </div>
            </a>
        </div>
        <!-- SLIDER -->
        <div class="containerPSlider swiper">
            <div class="product-slider1">
                <div class="card-wrapper swiper-wrapper">
                    <?php
                    // Get latest products using helper function
                    $latest_products = themee_get_latest_products(8);
                   
                    
                    // Debug: Check if products are found
                    if ($latest_products->have_posts()) {
                        // Debug: Show product count
                        echo '<!-- Found ' . $latest_products->post_count . ' products -->';
                        
                        // Collect product IDs for universal product card
                        $product_ids = array();
                        while ($latest_products->have_posts()) {
                            $latest_products->the_post();
                            $product_ids[] = get_the_ID();
                        }
                        wp_reset_postdata();
                        
                        // Display products using universal product card
                        foreach ($product_ids as $product_id) {
                            echo '<div class="swiper-slide">';
                            echo themee_product_card($product_id, array(
                                'show_wishlist' => true,
                                'show_rating' => true,
                                'show_sale_badge' => true,
                                'show_add_to_cart' => true,
                                'card_class' => 'my-2 p-2 md:p-4'
                            ));
                            echo '</div>';
                        }
                    } else {
                        // Fallback: Show message if no products found
                        echo '<div class="swiper-slide text-center p-8">';
                        echo '<p class="text-gray-500">هیچ محصولی یافت نشد. لطفاً ابتدا محصولی اضافه کنید.</p>';
                        echo '</div>';
                    }
                    ?>
                </div>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <!-- Banner Section -->
    <?php if (get_theme_mod('themee_banners_enabled', true)): ?>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 px-3 my-10">
        <?php
        $banner_1_image = get_theme_mod('themee_banner_1_image', '');
        $banner_1_link = get_theme_mod('themee_banner_1_link', '#');
        $banner_2_image = get_theme_mod('themee_banner_2_image', '');
        $banner_2_link = get_theme_mod('themee_banner_2_link', '#');
        
        // Banner 1
        if ($banner_1_image) {
            ?>
            <a href="<?php echo esc_url($banner_1_link); ?>">
                <img class="rounded-md w-full h-auto" src="<?php echo esc_url($banner_1_image); ?>" alt="بنر اول">
            </a>
            <?php
        } else {
            // Fallback banner 1
            ?>
            <a href="<?php echo esc_url($banner_1_link); ?>">
                <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-md h-32 md:h-40 flex items-center justify-center text-white">
                    <span class="text-lg font-semibold">بنر اول</span>
                </div>
            </a>
            <?php
        }
        
        // Banner 2
        if ($banner_2_image) {
            ?>
            <a href="<?php echo esc_url($banner_2_link); ?>">
                <img class="rounded-md w-full h-auto" src="<?php echo esc_url($banner_2_image); ?>" alt="بنر دوم">
            </a>
            <?php
        } else {
            // Fallback banner 2
            ?>
            <a href="<?php echo esc_url($banner_2_link); ?>">
                <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-md h-32 md:h-40 flex items-center justify-center text-white">
                    <span class="text-lg font-semibold">بنر دوم</span>
                </div>
            </a>
            <?php
        }
        ?>
    </div>
    <?php endif; ?>

    <!-- Best Selling Products -->
    <?php if (class_exists('WooCommerce')): ?>
    <div class="my-10 border rounded-lg border-gray-300 py-5 mx-3">
        <div class="text-center text-lg md:text-2xl font-semibold text-zinc-700 mb-3">
            پرفروش ترین کالا ها
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 px-3 gap-5">
            <?php
            // Get best selling products
            $best_selling_products = wc_get_products(array(
                'limit' => 12,
                'orderby' => 'popularity',
                'order' => 'DESC',
                'status' => 'publish'
            ));
            
            if (!empty($best_selling_products)) {
                // Split products into 4 columns (3 products each)
                $columns = array_chunk($best_selling_products, 3);
                
                foreach ($columns as $column_products) {
                    echo '<div class="flex flex-col divide-y">';
                    foreach ($column_products as $index => $product) {
                        $product_id = $product->get_id();
                        $product_title = $product->get_name();
                        $product_image = wp_get_attachment_image_url($product->get_image_id(), 'medium');
                        $product_link = get_permalink($product_id);
                        $rank = ($index + 1) + (array_search($column_products, $columns) * 3);
                        
                        if (!$product_image) {
                            $product_image = wc_placeholder_img_src();
                        }
                        ?>
                        <a href="<?php echo esc_url($product_link); ?>" class="flex items-center py-3">
                            <div>
                                <img class="max-w-32 rounded-md" src="<?php echo esc_url($product_image); ?>" alt="<?php echo esc_attr($product_title); ?>">
                            </div>
                            <div class="mx-3 text-blue-500 text-4xl font-bold">
                                <?php echo $rank; ?>
                            </div>
                            <div class="text-zinc-700">
                                <?php echo esc_html($product_title); ?>
                            </div>
                        </a>
                        <?php
                    }
                    echo '</div>';
                }
            } else {
                // Fallback if no products found
                echo '<div class="col-span-full text-center py-8">';
                echo '<p class="text-gray-500">هیچ محصولی یافت نشد.</p>';
                echo '</div>';
            }
            ?>
        </div>
    </div>
    <?php endif; ?>

    <!-- Products by Categories -->
    <?php if (class_exists('WooCommerce')): ?>
    <div class="my-10 px-3">
        <?php
        // Get all product categories
        $categories = get_terms(array(
            'taxonomy' => 'product_cat',
            'hide_empty' => false,
            'orderby' => 'count',
            'order' => 'DESC'
        ));
        
        if (!empty($categories) && !is_wp_error($categories)) {
            foreach ($categories as $category) {
                // Get products from this category
                $category_products = wc_get_products(array(
                    'limit' => 8,
                    'category' => array($category->slug),
                    'status' => 'publish'
                ));
                
                // Only show category if it has products
                if (!empty($category_products)) {
                    ?>
                    <div class="mb-12">
                        <!-- Category Title -->
                        <div class="flex justify-between items-center pb-3 mb-6">
                            <div class="px-4 py-2 flex justify-center items-center gap-x-1 font-bold md:text-lg text-zinc-700 relative">
                                <div class="z-10">
                                    <?php echo esc_html($category->name); ?>
                                </div>
                                <div class="w-20 h-2 bg-blue-300 shadow-lg absolute right-5 top-5 rounded-sm">
                                </div>
                            </div>
                            <a href="<?php echo esc_url(get_term_link($category)); ?>">
                                <div class="transition px-4 py-2 flex justify-center items-center text-zinc-700 hover:text-zinc-600">
                                    مشاهده همه
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#292929" viewBox="0 0 256 256"><path d="M164.24,203.76a6,6,0,1,1-8.48,8.48l-80-80a6,6,0,0,1,0-8.48l80-80a6,6,0,0,1,8.48,8.48L88.49,128Z"></path></svg>
                                </div>
                            </a>
                        </div>
                        
                        <!-- Products Slider -->
                        <div class="category-products-slider swiper">
                            <div class="product-slider swiper-wrapper">
                                <?php
                                foreach ($category_products as $product) {
                                    $product_id = $product->get_id();
                                    echo '<div class="swiper-slide">';
                                    echo themee_product_card($product_id, array(
                                        'show_wishlist' => true,
                                        'show_rating' => true,
                                        'show_sale_badge' => true,
                                        'show_add_to_cart' => true,
                                        'card_class' => 'my-2 p-2 md:p-4'
                                    ));
                                    echo '</div>';
                                }
                                ?>
                            </div>
                        </div>
                    </div>
                    <?php
                }
            }
        } else {
            // Fallback if no categories found
            echo '<div class="text-center py-8">';
            echo '<p class="text-gray-500">هیچ دسته‌بندی‌ای یافت نشد.</p>';
            echo '</div>';
        }
        ?>
    </div>
    <?php endif; ?>

 

    <!-- Blog Posts -->
    <div class="px-3 my-10">
        <!-- top blog -->
        <div class="flex justify-between items-center pb-3">
            <div class="px-4 py-2 flex justify-center items-center gap-x-1 font-bold md:text-lg text-zinc-700 relative">
                <div class="z-10">
                    خواندنی ها
                </div>
                <div class="w-20 h-2 bg-blue-300 shadow-lg absolute right-5 top-5 rounded-sm">
                </div>
            </div>
            <a href="<?php echo get_permalink(get_option('page_for_posts')); ?>">
                <div class="transition px-4 py-2 flex justify-center items-center text-zinc-700 hover:text-zinc-600">
                    مشاهده همه
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#292929" viewBox="0 0 256 256"><path d="M164.24,203.76a6,6,0,1,1-8.48,8.48l-80-80a6,6,0,0,1,0-8.48l80-80a6,6,0,0,1,8.48,8.48L88.49,128Z"></path></svg>
                </div>
            </a>
        </div>
        <!-- blogs -->
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            <?php
            $blog_posts = new WP_Query(array(
                'post_type' => 'post',
                'posts_per_page' => 4,
                'post_status' => 'publish'
            ));
            
            if ($blog_posts->have_posts()) {
                while ($blog_posts->have_posts()) {
                    $blog_posts->the_post();
                    $post_id = get_the_ID();
                    $post_title = get_the_title();
                    $post_link = get_permalink();
                    $post_date = get_the_date('j F Y');
                    $post_image = get_the_post_thumbnail_url($post_id, 'medium');
                    
                    if (!$post_image) {
                        $post_image = get_template_directory_uri() . '/assets/image/no-image.png'; // Fallback image
                    }
                    ?>
                    <div class="bg-white rounded-2xl border border-zinc-300 group">
                        <div class="image-box">
                            <img class="rounded-t-2xl w-full object-cover" style="height: 200px;" src="<?php echo esc_url($post_image); ?>" alt="<?php echo esc_attr($post_title); ?>" />
                        </div>
                        <div class="p-2 md:p-4 mt-2">
                            <a href="<?php echo esc_url($post_link); ?>" class="font-semibold text-zinc-800 hover:text-blue-600 transition">
                                <?php echo esc_html($post_title); ?>
                            </a>
                            <div class="flex items-center justify-between mt-2">
                                <div class="text-xs text-zinc-500">
                                    <?php echo esc_html($post_date); ?>
                                </div>
                                <a href="<?php echo esc_url($post_link); ?>" class="flex items-center justify-center gap-x-1 text-sm w-fit py-2 px-5 rounded-lg text-white bg-blue-500 hover:bg-blue-400 transition">
                                   مطالعه بیشتر
                                </a>
                            </div>
                        </div>
                    </div>
                    <?php
                }
                wp_reset_postdata();
            } else {
                // Fallback if no posts found
                echo '<div class="col-span-full text-center py-8">';
                echo '<p class="text-gray-500">هیچ مطلبی یافت نشد.</p>';
                echo '</div>';
            }
            ?>
        </div>
    </div>
</main>

<?php get_footer(); ?>

