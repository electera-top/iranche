<?php
/**
 * The template for displaying archive pages
 *
 * @package Themee
 */

get_header(); ?>

<main class="pt-20 md:pt-40 lg:pt-[73px]">
    <!-- Archive Header -->
    <div class="px-3 my-10">
        <div class="flex justify-between items-center pb-3">
            <div class="px-4 py-2 flex justify-center items-center gap-x-1 font-bold md:text-lg text-zinc-700 relative">
                <div class="z-10">
                    <?php
                    if (is_category()) {
                        echo 'دسته‌بندی: ' . single_cat_title('', false);
                    } elseif (is_tag()) {
                        echo 'برچسب: ' . single_tag_title('', false);
                    } elseif (is_author()) {
                        echo 'نویسنده: ' . get_the_author();
                    } elseif (is_date()) {
                        if (is_year()) {
                            echo 'سال: ' . get_the_date('Y');
                        } elseif (is_month()) {
                            echo 'ماه: ' . get_the_date('F Y');
                        } elseif (is_day()) {
                            echo 'روز: ' . get_the_date('j F Y');
                        }
                    } else {
                        echo 'آرشیو';
                    }
                    ?>
                </div>
                <div class="w-20 h-2 bg-blue-300 shadow-lg absolute right-5 top-5 rounded-sm">
                </div>
            </div>
        </div>
        
        <!-- Archive Description -->
        <?php if (is_category() || is_tag()) : ?>
            <div class="mb-6 p-4 bg-gray-50 rounded-lg">
                <?php
                if (is_category()) {
                    $category_description = category_description();
                    if ($category_description) {
                        echo '<div class="text-gray-600">' . $category_description . '</div>';
                    }
                } elseif (is_tag()) {
                    $tag_description = tag_description();
                    if ($tag_description) {
                        echo '<div class="text-gray-600">' . $tag_description . '</div>';
                    }
                }
                ?>
            </div>
        <?php endif; ?>
        
        <!-- Blog Posts -->
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            <?php
            if (have_posts()) {
                while (have_posts()) {
                    the_post();
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
                
                // Pagination
                ?>
                <div class="col-span-full flex justify-center mt-8">
                    <?php
                    echo paginate_links(array(
                        'total' => $wp_query->max_num_pages,
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
