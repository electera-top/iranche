<!DOCTYPE html>
<html <?php language_attributes(); ?> dir="<?php echo themee_get_direction(); ?>">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title><?php wp_title('|', true, 'right'); ?></title>
    <?php wp_head(); ?>
</head>
<body <?php body_class('max-w-[1600px] mx-auto bg-[#fcfcfc]'); ?>>
    <header class="fixed w-full max-w-[1600px] border-b z-50 bg-white">
        <!-- search bar -->
        <div class="items-center z-50 flex-wrap gap-y-5 bg-white rounded-lg overflow-hidden p-2 justify-between drop-shadow-md absolute top-0 left-3 w-11/12 max-w-4xl hidden" id="searchBar">
            <svg class="fill-blue-500" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="" viewBox="0 0 256 256"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path></svg>
            <?php get_search_form(); ?>
        </div>
        
        <!-- header -->
        <div class="flex flex-row-reverse sm:flex-row items-center justify-between py-4 max-w-[1600px] gap-y-5 flex-wrap lg:flex-nowrap">
            <!-- btn menu mobile -->
            <svg class="order-2 sm:order-none md:hidden" onclick="showNavbar()" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path></svg>
            
            <!-- navbar mobile -->
            <div class="flex absolute w-full h-screen z-50 -right-full top-0 transition-all ease-out duration-500" id="navbar">
                <div class="bg-white w-9/12 h-screen py-5 drop-shadow-2xl max-w-md">
                    <div class="mx-auto mb-5">
                        <?php if ( function_exists('has_custom_logo') && has_custom_logo() ) : ?>
                            <?php echo get_custom_logo(); ?>
                        <?php else : ?>
                            <a href="<?php echo home_url(); ?>">
                                <?php 
                                $theme_logo_src  = get_theme_mod('themee_logo');
                                $fallback_src    = $theme_logo_src ? $theme_logo_src : get_template_directory_uri() . '/assets/image/logo.png';
                                ?>
                                <img class="w-32 md:w-44" src="<?php echo esc_url($fallback_src); ?>" alt="<?php bloginfo('name'); ?>">
                            </a>
                        <?php endif; ?>
                    </div>
                    <?php
                    wp_nav_menu(array(
                        'theme_location' => 'mobile',
                        'menu_class' => 'menu mobile-menu flex flex-col gap-y-3 px-2',
                        'container' => false,
                        'fallback_cb' => 'themee_default_mobile_menu',
                    ));
                    ?>
                </div>
                <div class="bg-white/30 w-3/12 sm:w-5/12 backdrop-blur-sm" onclick="bgNavbar()"></div>
            </div>
            
            <!-- logo -->
            <div class="order-2 pr-5 md:pr-10">
            <?php if ( function_exists('has_custom_logo') && has_custom_logo() ) : ?>
                            <?php echo get_custom_logo(); ?>
                        <?php else : ?>
                            <a href="<?php echo home_url(); ?>">
                                <?php 
                                $theme_logo_src  = get_theme_mod('themee_logo');
                                $fallback_src    = $theme_logo_src ? $theme_logo_src : get_template_directory_uri() . '/assets/image/logo.png';
                                ?>
                                <img class="w-32 md:w-44" src="<?php echo esc_url($fallback_src); ?>" alt="<?php bloginfo('name'); ?>">
                            </a>
                        <?php endif; ?>
                
            </div>
            
            <!-- menu -->
            <div class="hidden md:block order-3 lg:order-2 mt-5 lg:mt-0">
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'primary',
                    'menu_class' => 'menu primary-menu flex gap-x-3 lg:gap-x-3 xl:gap-x-5',
                    'container' => false,
                    'fallback_cb' => 'themee_default_menu',
                ));
                ?>
            </div>
            
            <!-- buttons -->
            <div class="flex items-center justify-center gap-x-5 order-1 sm:order-2 pl-5 md:pl-10">
                <!-- search -->
                <button class="flex items-center p-2 rounded-xl bg-blue-500 hover:bg-blue-400 transition shadow-lg shadow-blue-500/50 group relative" type="button" onclick="searchBTN()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#ffffff" viewBox="0 0 256 256"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path></svg>
                </button>
                
                <!-- cart -->
                <?php if (class_exists('WooCommerce')): ?>
                <div class="flex items-center p-2 rounded-xl bg-blue-500 hover:bg-blue-400 transition shadow-lg shadow-blue-500/50 group relative">
                    <a href="<?php echo wc_get_cart_url(); ?>" class="relative">
                        <span class="cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#ffffff" viewBox="0 0 256 256"><path d="M134,120v56a6,6,0,0,1-12,0V120a6,6,0,0,1,12,0ZM237.88,97.85,224,201.85A14,14,0,0,1,210.13,214H45.87A14,14,0,0,1,32,201.85l-13.87-104A14,14,0,0,1,32,82H69.28l54.2-61.95a6,6,0,0,1,9,0l54.2,62H224a14,14,0,0,1,13.87,15.85ZM85.22,82h85.56L128,33.11ZM225.5,94.68A2,2,0,0,0,224,94H32a2,2,0,0,0-1.51.68A2,2,0,0,0,30,96.26l13.86,104a2,2,0,0,0,2,1.73H210.13a2,2,0,0,0,2-1.73L226,96.26A1.93,1.93,0,0,0,225.5,94.68ZM181.4,114a6,6,0,0,0-6.57,5.37l-5.6,56A6,6,0,0,0,174.6,182l.61,0a6,6,0,0,0,6-5.4l5.6-56A6,6,0,0,0,181.4,114ZM81.17,119.4a6,6,0,0,0-11.94,1.2l5.6,56a6,6,0,0,0,6,5.4l.61,0a6,6,0,0,0,5.37-6.57Z"></path></svg>
                        </span>
                        <?php if (WC()->cart->get_cart_contents_count() > 0): ?>
                        <span class="absolute -right-3 -top-3 flex h-5 w-5 drop-shadow-lg cursor-pointer items-center justify-center rounded-full bg-white text-sm font-semibold text-blue-500">
                            <?php echo WC()->cart->get_cart_contents_count(); ?>
                        </span>
                        <?php endif; ?>
                    </a>
                </div>
                <?php endif; ?>
                
                <!-- account -->
                <div class="flex items-center py-2 px-2 rounded-xl bg-blue-500 hover:bg-blue-400 transition shadow-lg shadow-blue-500/50 group relative">
                    <?php if (is_user_logged_in()): ?>
                        <a href="<?php echo get_permalink(get_option('woocommerce_myaccount_page_id')); ?>" class="text-gray-100 flex gap-x-1 items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#ffffff" viewBox="0 0 256 256"><path d="M229.19,213c-15.81-27.32-40.63-46.49-69.47-54.62a70,70,0,1,0-63.44,0C67.44,166.5,42.62,185.67,26.81,213a6,6,0,1,0,10.38,6C56.4,185.81,90.34,166,128,166s71.6,19.81,90.81,53a6,6,0,1,0,10.38-6ZM70,96a58,58,0,1,1,58,58A58.07,58.07,0,0,1,70,96Z"></path></svg>
                            <span class="hidden md:block text-sm">حساب کاربری</span>
                        </a>
                    <?php else: ?>
                        <a href="<?php echo get_permalink(get_option('woocommerce_myaccount_page_id')); ?>" class="text-gray-100 flex gap-x-1 items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#ffffff" viewBox="0 0 256 256"><path d="M229.19,213c-15.81-27.32-40.63-46.49-69.47-54.62a70,70,0,1,0-63.44,0C67.44,166.5,42.62,185.67,26.81,213a6,6,0,1,0,10.38,6C56.4,185.81,90.34,166,128,166s71.6,19.81,90.81,53a6,6,0,1,0,10.38-6ZM70,96a58,58,0,1,1,58,58A58.07,58.07,0,0,1,70,96Z"></path></svg>
                            <span class="hidden md:block text-sm">ورود / ثبت نام</span>
                        </a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </header>

