<?php
/**
 * Template for displaying blog page
 *
 * @package Themee
 */

get_header(); ?>

<main class="pt-20 md:pt-40 lg:pt-[73px]">
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
        </div>
        <!-- blogs -->
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            <?php
            $blog_posts = new WP_Query(array(
                'post_type' => 'post',
                'posts_per_page' => 12,
                'post_status' => 'publish',
                'paged' => get_query_var('paged') ? get_query_var('paged') : 1
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
                        $post_image = get_template_directory_uri() . '/assets/image/no-image.png';
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
                            <div class="flex items-center justify-around mt-2">
                                <div class="text-xs text-zinc-500">
                                    <?php echo esc_html($post_date); ?>
                                </div>
                                <a href="<?php echo esc_url($post_link); ?>" class="flex items-center justify-center gap-x-1 text-sm w-fit py-2 px-5 mr-auto rounded-lg text-white bg-blue-500 hover:bg-blue-400 transition">
                                    مطالعه بیشتر
                                </a>
                            </div>
                        </div>
                    </div>
                    <?php
                }
                wp_reset_postdata();
                
                // Pagination
                ?>
                <div class="col-span-full flex justify-center mt-8">
                    <?php
                    echo paginate_links(array(
                        'total' => $blog_posts->max_num_pages,
                        'current' => max(1, get_query_var('paged')),
                        'format' => '?paged=%#%',
                        'show_all' => false,
                        'type' => 'plain',
                        'end_size' => 2,
                        'mid_size' => 1,
                        'prev_text' => 'قبلی',
                        'next_text' => 'بعدی',
                        'add_args' => false,
                        'add_fragment' => '',
                    ));
                    ?>
                </div>
                <?php
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
