<?php
/**
 * The template for displaying all single posts
 *
 * @package Themee
 */

get_header(); ?>

<main class="pt-20 md:pt-40 lg:pt-[73px]">
    <!-- blog content -->
    <div class="my-2 py-5 md:px-10 blog-layout mx-3">
        <!-- Main Content -->
        <div class="blog-main-content">
            <div class="bg-white rounded-xl shadow-lg p-4">
                <?php while (have_posts()) : the_post(); ?>
                    <div class="flex gap-4 pb-3 flex-wrap">
                        <div class="text-xs flex gap-x-1 items-center text-zinc-400">
                            <svg class="fill-zinc-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="" viewBox="0 0 256 256"><path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z"></path></svg>
                            <?php echo get_the_date('Y/m/d'); ?>
                        </div>
                        <div class="text-xs flex gap-x-1 items-center text-zinc-400">
                            <svg class="fill-zinc-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path></svg>
                            ارسال شده توسط <?php the_author(); ?>
                        </div>
                        <?php
                        $categories = get_the_category();
                        if (!empty($categories)) {
                            ?>
                            <div class="text-xs flex gap-x-1 items-center text-zinc-400">
                                <svg class="fill-zinc-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256"><path d="M224,64H154.67L126.93,43.2a16.12,16.12,0,0,0-9.6-3.2H72A16,16,0,0,0,56,72V88H40A16,16,0,0,0,24,104V200a16,16,0,0,0,16,16H192.89A15.13,15.13,0,0,0,208,200.89V184h16.89A15.13,15.13,0,0,0,240,168.89V80A16,16,0,0,0,224,64ZM192,200H40V104H85.33l27.74,20.8a16.12,16.12,0,0,0,9.6,3.2H192Zm32-32H208V112a16,16,0,0,0-16-16H122.67L94.93,75.2a16.12,16.12,0,0,0-9.6-3.2H72V56h45.33l27.74,20.8a16.12,16.12,0,0,0,9.6,3.2H224Z"></path></svg>
                                دسته بندی 
                                <a class="hover:text-blue-500 transition" href="<?php echo esc_url(get_category_link($categories[0]->term_id)); ?>">
                                    <?php echo esc_html($categories[0]->name); ?>
                                </a>
                            </div>
                            <?php
                        }
                        ?>
                        <div class="text-xs flex gap-x-1 items-center text-zinc-400">
                            <svg class="fill-zinc-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256"><path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
                            <?php echo get_post_meta(get_the_ID(), 'post_views_count', true) ?: '0'; ?>بازدید
                        </div>
                    </div>
                    
                    <?php if (has_post_thumbnail()) : ?>
                        <img class="rounded-lg w-full" src="<?php echo get_the_post_thumbnail_url(get_the_ID(), 'large'); ?>" alt="<?php the_title(); ?>">
                    <?php endif; ?>
                    
                    <div class="mt-7 text-sm">
                        <a href="<?php the_permalink(); ?>" class="text-xl md:text-2xl font-bold text-zinc-800">
                            <?php the_title(); ?>
                        </a>
                        <div class="bg-blue-400 w-6/12 h-1 mt-5"></div>
                        <div class="text-zinc-600 my-7 flex flex-wrap">
                            <?php the_content(); ?>
                        </div>
                    </div>
                <?php endwhile; ?>
            </div>
            
            <!-- Comments Section -->
            <div class="flex flex-col p-4 mt-5 rounded-2xl bg-white shadow-lg">
                <?php
                // Load comments template
                comments_template();
                ?>
            </div>
        </div>
        
        <!-- Sidebar -->
        <div class="blog-sidebar">
            <!-- Latest Articles -->
            <div class="p-3 bg-white rounded-xl shadow-lg mb-4">
                <div class="mx-auto flex gap-x-1 group items-center text-right w-full px-2 py-3 text-gray-600 rounded-lg mb-2 font-semibold">
                    <span class="w-44">
                        جدیدترین مقالات
                    </span>
                    <span class="bg-blue-400 w-full h-1"></span>
                </div>
                <ul class="grid w-full gap-3">
                    <?php
                    $recent_posts = new WP_Query(array(
                        'post_type' => 'post',
                        'posts_per_page' => 5,
                        'post__not_in' => array(get_the_ID()),
                        'post_status' => 'publish'
                    ));
                    
                    if ($recent_posts->have_posts()) {
                        while ($recent_posts->have_posts()) {
                            $recent_posts->the_post();
                            $post_image = get_the_post_thumbnail_url(get_the_ID(), 'thumbnail');
                            if (!$post_image) {
                                $post_image = get_template_directory_uri() . '/assets/image/no-image.png';
                            }
                            ?>
                            <li>
                                <a href="<?php the_permalink(); ?>" class="flex items-center justify-start gap-x-2 w-full p-2 text-gray-600 bg-white border border-gray-300 rounded-lg cursor-pointer hover:text-gray-600 hover:bg-gray-100">                           
                                    <img class="max-w-20 rounded-md" src="<?php echo esc_url($post_image); ?>" alt="<?php the_title(); ?>">
                                    <div class="text-center flex flex-col space-y-3">
                                        <div class="text-sm sm:text-base font-semibold"><?php the_title(); ?></div>
                                        <div class="flex items-start gap-x-1 text-xs text-zinc-400">
                                            <svg class="fill-gray-400" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"></path></svg>
                                            <span>
                                                <?php echo human_time_diff(get_the_time('U'), current_time('timestamp')) . ' پیش'; ?>
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            </li>
                            <?php
                        }
                        wp_reset_postdata();
                    }
                    ?>
                </ul>
            </div>
            
            <!-- Tags -->
            <div class="p-3 bg-white rounded-xl shadow-lg">
                <div class="mx-auto flex gap-x-1 group items-center text-right w-full px-2 py-3 text-gray-600 rounded-lg mb-2 font-semibold">
                    <span class="w-44">
                        برچسب ها
                    </span>
                    <span class="bg-blue-400 w-full h-1"></span>
                </div>
                <div class="flex gap-2 flex-wrap">
                    <?php
                    $tags = get_the_tags();
                    if ($tags && !empty($tags)) {
                        foreach ($tags as $tag) {
                            ?>
                            <a href="<?php echo esc_url(get_tag_link($tag->term_id)); ?>" class="bg-gray-200 text-gray-500 hover:text-gray-400 transition px-2 py-1 text-sm rounded-full w-fit">
                                #<?php echo esc_html($tag->name); ?>
                            </a>
                            <?php
                        }
                    } else {
                        // Get popular tags from all posts
                        $popular_tags = get_tags(array(
                            'orderby' => 'count',
                            'order' => 'DESC',
                            'number' => 8,
                            'hide_empty' => true
                        ));
                        
                        if ($popular_tags && !empty($popular_tags)) {
                            foreach ($popular_tags as $tag) {
                                ?>
                                <a href="<?php echo esc_url(get_tag_link($tag->term_id)); ?>" class="bg-gray-200 text-gray-500 hover:text-gray-400 transition px-2 py-1 text-sm rounded-full w-fit">
                                    #<?php echo esc_html($tag->name); ?>
                                </a>
                                <?php
                            }
                        } else {
                            // If no tags exist at all, show message
                            ?>
                            <div class="text-gray-500 text-sm">
                                هیچ برچسبی یافت نشد
                            </div>
                            <?php
                        }
                    }
                    ?>
                </div>
            </div>
        </div>
    </div>
</main>

<?php get_footer(); ?>