<?php
/**
 * The template for displaying all pages
 *
 * @package Themee
 */

get_header(); ?>

<main class="pt-20 md:pt-40 lg:pt-[73px]">
    <div class="bg-white shadow-large lg:my-10 mx-5 rounded-xl md:rounded-2xl p-3 md:p-5 border">
        <?php while (have_posts()) : the_post(); ?>
            <?php if (has_post_thumbnail()) : ?>
                <div class="relative flex justify-center items-center mb-5">
                    <img class="w-full h-96 md:h-[500px] object-center object-cover rounded-xl blur-sm" src="<?php echo get_the_post_thumbnail_url(get_the_ID(), 'large'); ?>" alt="<?php the_title(); ?>">
                    <div class="absolute top-0 bg-zinc-400 bg-opacity-50 w-full h-full flex justify-center items-center text-white font-semibold rounded-xl">
                        <div class="text-center space-y-5">
                            <div class="text-3xl sm:text-3xl md:text-5xl"><?php the_title(); ?></div>
                            <?php if (get_the_excerpt()) : ?>
                                <div class="text-xl sm:text-2xl md:text-4xl"><?php echo wp_trim_words(get_the_excerpt(), 20); ?></div>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            <?php else : ?>
                <!-- Fallback header if no featured image -->
                <div class="relative flex justify-center items-center mb-5">
                    <img class="w-full h-96 md:h-[500px] object-center object-cover rounded-xl blur-sm" src="<?php echo get_template_directory_uri(); ?>/assets/image/workspace.jpg" alt="<?php the_title(); ?>">
                    <div class="absolute top-0 bg-zinc-400 bg-opacity-50 w-full h-full flex justify-center items-center text-white font-semibold rounded-xl">
                        <div class="text-center space-y-5">
                            <div class="text-3xl sm:text-3xl md:text-5xl"><?php the_title(); ?></div>
                            <?php if (get_the_excerpt()) : ?>
                                <div class="text-xl sm:text-2xl md:text-4xl"><?php echo wp_trim_words(get_the_excerpt(), 20); ?></div>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            <?php endif; ?>
            
            <div class="leading-10">
                <div class="mb-2 text-lg font-semibold text-zinc-800">
                    <?php the_title(); ?>
                </div>
                <div class="text-zinc-700" style="line-height: 1.8rem;">
                    <?php the_content(); ?>
                </div>
            </div>
        <?php endwhile; ?>
    </div>
</main>

<?php get_footer(); ?>
