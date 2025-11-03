<?php
/**
 * Shop Page Template
 *
 * @package Themee
 */

get_header(); ?>

<main class="pt-20 md:pt-40 lg:pt-[73px]">
    <div class="lg:px-20 lg:my-10 px-5">
        <!-- Header -->
        <div class="text-zinc-800 font-semibold text-lg bg-white shadow-large rounded-xl p-3 mb-7">
            فروشگاه
            <div>
                <a class="text-sm text-zinc-500 hover:text-zinc-700 transition" href="<?php echo home_url(); ?>">
                    صفحه اصلی
                </a>
                <span class="text-sm text-zinc-500"> / </span>
                <span class="text-sm text-zinc-500">فروشگاه</span>
            </div>
        </div>
        
        <?php if (class_exists('WooCommerce')): ?>
            <!-- Shop Content -->
            <div class="bg-white shadow-large rounded-xl p-6">
                <?php
                // Get shop products
                $args = array(
                    'post_type' => 'product',
                    'posts_per_page' => 12,
                    'paged' => get_query_var('paged') ? get_query_var('paged') : 1,
                );
                
                $products = new WP_Query($args);
                
                if ($products->have_posts()): ?>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <?php while ($products->have_posts()): $products->the_post(); ?>
                            <?php global $product; ?>
                            <div class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                                <a href="<?php the_permalink(); ?>">
                                    <?php if (has_post_thumbnail()): ?>
                                        <img src="<?php echo get_the_post_thumbnail_url(get_the_ID(), 'medium'); ?>" alt="<?php the_title(); ?>" class="w-full h-48 object-cover">
                                    <?php else: ?>
                                        <div class="w-full h-48 bg-gray-200 flex items-center justify-center">
                                            <svg class="w-12 h-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    <?php endif; ?>
                                </a>
                                <div class="p-4">
                                    <h3 class="text-lg font-semibold mb-2">
                                        <a href="<?php the_permalink(); ?>" class="text-gray-800 hover:text-blue-600">
                                            <?php the_title(); ?>
                                        </a>
                                    </h3>
                                    <div class="text-blue-600 font-bold text-xl mb-4">
                                        <?php echo $product->get_price_html(); ?>
                                    </div>
                                    <a href="<?php echo esc_url($product->add_to_cart_url()); ?>" class="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition block text-center">
                                        افزودن به سبد خرید
                                    </a>
                                </div>
                            </div>
                        <?php endwhile; ?>
                    </div>
                    
                    <!-- Pagination -->
                    <?php
                    $pagination_args = array(
                        'total' => $products->max_num_pages,
                        'current' => get_query_var('paged') ? get_query_var('paged') : 1,
                        'format' => '?paged=%#%',
                        'show_all' => false,
                        'type' => 'list',
                        'end_size' => 2,
                        'mid_size' => 1,
                        'prev_next' => true,
                        'prev_text' => 'قبلی',
                        'next_text' => 'بعدی',
                    );
                    
                    echo '<div class="mt-8">';
                    echo paginate_links($pagination_args);
                    echo '</div>';
                    ?>
                    
                    <?php wp_reset_postdata(); ?>
                <?php else: ?>
                    <div class="text-center py-8">
                        <p class="text-gray-500">هیچ محصولی یافت نشد.</p>
                    </div>
                <?php endif; ?>
            </div>
        <?php endif; ?>
    </div>
</main>

<?php get_footer(); ?>
