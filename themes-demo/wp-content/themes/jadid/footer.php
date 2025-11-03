    <footer class="rounded-t-2xl border shadow-xl mt-5 py-5 mx-3 bg-white">
        <div class="flex flex-wrap gap-y-4 justify-between items-center px-6">
            <div class="flex flex-col">
                <div>
                    <?php 
                    $footer_logo_image = get_theme_mod('footer_logo_image');
                    $custom_logo_id    = get_theme_mod('custom_logo');
                    $custom_logo_src   = $custom_logo_id ? wp_get_attachment_image_url($custom_logo_id, 'full') : '';
                    $legacy_logo       = get_theme_mod('themee_logo');
                    $legacy_footer_url = get_theme_mod('footer_logo');

                    $logo_src = '';
                    if ($footer_logo_image) {
                        $logo_src = $footer_logo_image;
                    } elseif ($custom_logo_src) {
                        $logo_src = $custom_logo_src;
                    } elseif ($legacy_footer_url) {
                        $logo_src = $legacy_footer_url;
                    } elseif ($legacy_logo) {
                        $logo_src = $legacy_logo;
                    } else {
                        $logo_src = get_template_directory_uri() . '/assets/image/logo.png';
                    }
                    ?>
                    <img class="w-32" src="<?php echo esc_url($logo_src); ?>" alt="<?php bloginfo('name'); ?>">
                </div>
                <div class="text-sm text-zinc-600 mt-3">
                    <?php echo esc_html( get_theme_mod('footer_support_phone', '44444444-021') ); ?>
                </div>
            </div>
            <div>
                <button type="button" class="flex items-center gap-x-1 border border-gray-500 rounded-lg px-3 py-2 text-zinc-600 text-sm md:text-base" id="btn-back-to-top">
                    برو به بالا
                    <svg class="fill-gray-600" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="" viewBox="0 0 256 256"><path d="M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26Zm0,192a90,90,0,1,1,90-90A90.1,90.1,0,0,1,128,218Zm44.24-78.24a6,6,0,1,1-8.48,8.48L128,112.49,92.24,148.24a6,6,0,0,1-8.48-8.48l40-40a6,6,0,0,1,8.48,0Z"></path></svg>
                </button>
            </div>
        </div>
        
        <div class="bg-blue-700 grid justify-items-center gap-y-7 grid-cols-1 md:grid-cols-3 lg:grid-cols-5 p-5 my-7 shadow-lg">
            <div class="flex gap-x-2 pr-20 md:pr-0 md:justify-center items-center w-full lg:border-l">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="#ffffff" viewBox="0 0 256 256"><path d="M200.47,56.07A101.37,101.37,0,0,0,128.77,26H128A102,102,0,0,0,26,128v56a22,22,0,0,0,22,22H64a22,22,0,0,0,22-22V144a22,22,0,0,0-22-22H38.2A90,90,0,0,1,128,38h.68a89.71,89.71,0,0,1,89.13,84H192a22,22,0,0,0-22,22v40a22,22,0,0,0,22,22h26v2a26,26,0,0,1-26,26H136a6,6,0,0,0,0,12h56a38,38,0,0,0,38-38V128A101.44,101.44,0,0,0,200.47,56.07ZM64,134a10,10,0,0,1,10,10v40a10,10,0,0,1-10,10H48a10,10,0,0,1-10-10V134Zm118,50V144a10,10,0,0,1,10-10h26v60H192A10,10,0,0,1,182,184Z"></path></svg>
                </div>
                <div>
                    <div class="text-sm mb-1 text-white">
                        <?php echo esc_html( get_theme_mod('footer_feat_1_title', 'پشتیبانی 24 ساعته') ); ?>
                    </div>
                    <div class="text-xs text-gray-200">
                        <?php echo esc_html( get_theme_mod('footer_feat_1_subtitle', '7 روز هفته 24 ساعته') ); ?>
                    </div>
                </div>
            </div>
            <div class="flex gap-x-2 pr-20 md:pr-0 md:justify-center items-center w-full lg:border-l">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="#ffffff" viewBox="0 0 256 256"><path d="M222.72,67.91l-88-48.18a13.9,13.9,0,0,0-13.44,0l-88,48.18A14,14,0,0,0,26,80.18v95.64a14,14,0,0,0,7.28,12.27l88,48.18a13.92,13.92,0,0,0,13.44,0l88-48.18A14,14,0,0,0,230,175.82V80.18A14,14,0,0,0,222.72,67.91ZM127,30.25a2,2,0,0,1,1.92,0L212.51,76,178.57,94.57,94.05,48.31ZM122,223,39,177.57a2,2,0,0,1-1-1.75V86.66l84,46ZM43.49,76,81.56,55.15l84.51,46.26L128,122.24ZM218,175.82a2,2,0,0,1-1,1.75h0L134,223V132.64l36-19.71V152a6,6,0,0,0,12,0V106.37l36-19.71Z"></path></svg>
                </div>
                <div>
                    <div class="text-sm mb-1 text-white">
                        <?php echo esc_html( get_theme_mod('footer_feat_2_title', 'تحویل سریع') ); ?>
                    </div>
                    <div class="text-xs text-gray-200">
                        <?php echo esc_html( get_theme_mod('footer_feat_2_subtitle', 'ارسال فوری') ); ?>
                    </div>
                </div>
            </div>
            <div class="flex gap-x-2 pr-20 md:pr-0 md:justify-center items-center w-full lg:border-l">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="#ffffff" viewBox="0 0 256 256"><path d="M208,42H48A14,14,0,0,0,34,56v58.77c0,88.24,74.68,117.52,89.65,122.49a13.5,13.5,0,0,0,8.7,0c15-5,89.65-34.25,89.65-122.49V56A14,14,0,0,0,208,42Zm2,72.79c0,80-67.84,106.59-81.44,111.1a1.55,1.55,0,0,1-1.12,0C113.84,221.38,46,194.79,46,114.79V56a2,2,0,0,1,2-2H208a2,2,0,0,1,2,2Zm-37.76-15a6,6,0,0,1,0,8.48l-56,56a6,6,0,0,1-8.48,0l-24-24a6,6,0,0,1,8.48-8.48l40-40a6,6,0,0,1,8.48,0Z"></path></svg>
                </div>
                <div>
                    <div class="text-sm mb-1 text-white">
                        <?php echo esc_html( get_theme_mod('footer_feat_3_title', 'امنیت بالا') ); ?>
                    </div>
                    <div class="text-xs text-gray-200">
                        <?php echo esc_html( get_theme_mod('footer_feat_3_subtitle', 'پرداخت امن') ); ?>
                    </div>
                </div>
            </div>
            <div class="flex gap-x-2 pr-20 md:pr-0 md:justify-center items-center w-full lg:border-l">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="#ffffff" viewBox="0 0 256 256"><path d="M224,74H206V64a22,22,0,0,0-22-22H40A22,22,0,0,0,18,64v96a22,22,0,0,0,22,22H154v10a22,22,0,0,0,22,22h48a22,22,0,0,0,22-22V96A22,22,0,0,0,224,74ZM40,170a10,10,0,0,1-10-10V64A10,10,0,0,1,40,54H184a10,10,0,0,1,10,10V74H176a22,22,0,0,0-22,22v74Zm194,22a10,10,0,0,1-10,10H176a10,10,0,0,1-10-10V96a10,10,0,0,1,10-10h48a10,10,0,0,1,10,10ZM134,208a6,6,0,0,1-6,6H88a6,6,0,0,1,0-12h40A6,6,0,0,1,134,208Zm80-96a6,6,0,0,1-6,6H192a6,6,0,0,1,0-12h16A6,6,0,0,1,214,112Z"></path></svg>
                </div>
                <div>
                    <div class="text-sm mb-1 text-white">
                        <?php echo esc_html( get_theme_mod('footer_feat_4_title', 'پشتیبانی چندگانه') ); ?>
                    </div>
                    <div class="text-xs text-gray-200">
                        <?php echo esc_html( get_theme_mod('footer_feat_4_subtitle', 'موبایل، لپ تاپ و...') ); ?>
                    </div>
                </div>
            </div>
            <div class="flex gap-x-2 pr-20 md:pr-0 md:justify-center items-center w-full">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="#ffffff" viewBox="0 0 256 256"><path d="M62,106.6V40a6,6,0,0,0-12,0v66.6a30,30,0,0,0,0,58.8V216a6,6,0,0,0,12,0V165.4a30,30,0,0,0,0-58.8ZM56,154a18,18,0,1,1,18-18A18,18,0,0,1,56,154Zm78-95.4V40a6,6,0,0,0-12,0V58.6a30,30,0,0,0,0,58.8V216a6,6,0,0,0,12,0V197.4a30,30,0,0,0,0-58.8ZM128,106a18,18,0,1,1,18-18A18,18,0,0,1,128,106Zm102,62a30.05,30.05,0,0,0-24-29.4V40a6,6,0,0,0-12,0v98.6a30,30,0,0,0,0,58.8V216a6,6,0,0,0,12,0V197.4A30.05,30.05,0,0,0,230,168Zm-30,18a18,18,0,1,1,18-18A18,18,0,0,1,200,186Z"></path></svg>
                </div>
                <div>
                    <div class="text-sm mb-1 text-white">
                        <?php echo esc_html( get_theme_mod('footer_feat_5_title', 'شخصی سازی کامل') ); ?>
                    </div>
                    <div class="text-xs text-gray-200">
                        <?php echo esc_html( get_theme_mod('footer_feat_5_subtitle', 'تغییر با دلخواه شما') ); ?>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-7 lg:grid-cols-4 px-10">
            <div>
                <div class="text-blue-700 mb-4 text-lg font-bold">
                    <?php echo esc_html( get_theme_mod('footer_quick_links_title', 'دسترسی سریع') ); ?>
                </div>
                <div class="">
                    <?php
                    if ( has_nav_menu('footer_quick_links') ) {
                        wp_nav_menu([
                            'theme_location' => 'footer_quick_links',
                            'container'      => false,
                            'menu_class'     => 'flex flex-col gap-y-4',
                            'fallback_cb'    => false,
                        ]);
                    } else {
                        $links = [];
                        for ( $i = 1; $i <= 4; $i++ ) {
                            $label = get_theme_mod("footer_quick_link_{$i}_label", '');
                            $url   = get_theme_mod("footer_quick_link_{$i}_url", '');
                            if ( $label && $url ) {
                                $links[] = [ 'label' => $label, 'url' => $url ];
                            }
                        }
                        if ( empty($links) ) {
                            ?>
                            <ul class="flex flex-col gap-y-4">
                                <li><a class="text-gray-800 hover:text-blue-600 transition" href="<?php echo home_url(); ?>">صفحه اصلی</a></li>
                                <li><a class="text-gray-800 hover:text-blue-600 transition" href="<?php echo get_permalink(get_option('woocommerce_shop_page_id')); ?>">فروشگاه</a></li>
                                <li><a class="text-gray-800 hover:text-blue-600 transition" href="<?php echo get_permalink(get_option('woocommerce_cart_page_id')); ?>">سبد خرید</a></li>
                                <li><a class="text-gray-800 hover:text-blue-600 transition" href="<?php echo get_permalink(get_option('woocommerce_myaccount_page_id')); ?>">حساب کاربری</a></li>
                            </ul>
                            <?php
                        } else {
                            echo '<ul class="flex flex-col gap-y-4">';
                            foreach ( $links as $item ) {
                                echo '<li><a class="text-gray-800 hover:text-blue-600 transition" href="' . esc_url($item['url']) . '">' . esc_html($item['label']) . '</a></li>';
                            }
                            echo '</ul>';
                        }
                    }
                    ?>
                </div>
            </div>
            <div>
                <div class="text-blue-700 mb-4 text-lg font-bold">
                    ارتباط مستقیم
                </div>
                <div class="">
                    <ul class="flex flex-col gap-y-4">
                        <li>
                            <a class="text-gray-800 hover:text-blue-600 transition flex items-center gap-x-1 group w-fit" href="#">
                                <svg class="group-hover:fill-blue-600" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000" viewBox="0 0 256 256"><path d="M128,66a38,38,0,1,0,38,38A38,38,0,0,0,128,66Zm0,64a26,26,0,1,1,26-26A26,26,0,0,1,128,130Zm0-112a86.1,86.1,0,0,0-86,86c0,30.91,14.34,63.74,41.47,94.94a252.32,252.32,0,0,0,41.09,38,6,6,0,0,0,6.88,0,252.32,252.32,0,0,0,41.09-38c27.13-31.2,41.47-64,41.47-94.94A86.1,86.1,0,0,0,128,18Zm0,206.51C113,212.93,54,163.62,54,104a74,74,0,0,1,148,0C202,163.62,143,212.93,128,224.51Z"></path></svg>
                                <?php echo esc_html( get_theme_mod('footer_contact_address', 'تهران-خیابان دماوند') ); ?>
                            </a>
                        </li>
                        <li>
                            <a class="text-gray-800 hover:text-blue-600 transition flex items-center gap-x-1 group w-fit" href="mailto:<?php echo antispambot( get_theme_mod('footer_contact_email', 'info@example.com') ); ?>">
                                <svg class="group-hover:fill-blue-600" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000" viewBox="0 0 256 256"><path d="M128,26a102,102,0,0,0,0,204c21.13,0,43.31-6.35,59.32-17a6,6,0,0,0-6.65-10c-13.9,9.25-34.09,15-52.67,15a90,90,0,1,1,90-90c0,29.58-13.78,34-22,34s-22-4.42-22-34V88a6,6,0,0,0-12,0v9a46,46,0,1,0,4.34,56.32C171.76,166.6,182,174,196,174c21.29,0,34-17.2,34-46A102.12,102.12,0,0,0,128,26Zm0,136a34,34,0,1,1,34-34A34,34,0,0,1,128,162Z"></path></svg>
                                <?php echo esc_html( get_theme_mod('footer_contact_email', 'info@example.com') ); ?>
                            </a>
                        </li>
                        <li>
                            <a class="text-gray-800 hover:text-blue-600 transition flex items-center gap-x-1 group w-fit" href="tel:<?php echo esc_attr( preg_replace('/\D+/', '', get_theme_mod('footer_contact_phone', '0912345678')) ); ?>">
                                <svg class="group-hover:fill-blue-600" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#050505" viewBox="0 0 256 256"><path d="M176,18H80A22,22,0,0,0,58,40V216a22,22,0,0,0,22,22h96a22,22,0,0,0,22-22V40A22,22,0,0,0,176,18Zm10,198a10,10,0,0,1-10,10H80a10,10,0,0,1-10-10V40A10,10,0,0,1,80,30h96a10,10,0,0,1,10,10ZM138,60a10,10,0,1,1-10-10A10,10,0,0,1,138,60Z"></path></svg>
                                <?php echo esc_html( get_theme_mod('footer_contact_phone', '0912345678') ); ?>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div>
                <div class="text-blue-700 text-lg font-bold">
                    ما را دنبال کنید
                </div>
                <div class="my-5 text-zinc-800">
                    <?php 
                    $socials = array(
                        'instagram' => get_theme_mod('footer_social_instagram'),
                        'telegram'  => get_theme_mod('footer_social_telegram'),
                        'whatsapp'  => get_theme_mod('footer_social_whatsapp'),
                        'linkedin'  => get_theme_mod('footer_social_linkedin'),
                        'x'         => get_theme_mod('footer_social_x'),
                    );
                    $has_any = array_filter($socials);
                    if (!$has_any) {
                        echo 'ما را در شبکه‌های اجتماعی دنبال کنید';
                    }
                    ?>
                </div>
                <div class="flex gap-x-3 items-center">
                    <?php if (!empty($socials['instagram'])): ?>
                        <a href="<?php echo esc_url($socials['instagram']); ?>" target="_blank" aria-label="Instagram" class="p-2 rounded-full bg-zinc-100 hover:bg-blue-100 transition">
                        <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
    >
      <path
        fill="currentColor"
        d="M16 12a4 4 0 1 0-1.172 2.829A3.84 3.84 0 0 0 16 12.06l-.001-.063zm2.16 0a6.135 6.135 0 1 1-1.797-4.359a5.92 5.92 0 0 1 1.798 4.256l-.001.109zm1.687-6.406v.002a1.44 1.44 0 1 1-.422-1.018c.256.251.415.601.415.988v.029v-.001zm-7.84-3.44l-1.195-.008q-1.086-.008-1.649 0t-1.508.047c-.585.02-1.14.078-1.683.17l.073-.01c-.425.07-.802.17-1.163.303l.043-.014a4.12 4.12 0 0 0-2.272 2.254l-.01.027a6 6 0 0 0-.284 1.083l-.005.037a12 12 0 0 0-.159 1.589l-.001.021q-.039.946-.047 1.508t0 1.649t.008 1.195t-.008 1.195t0 1.649t.047 1.508c.02.585.078 1.14.17 1.683l-.01-.073c.07.425.17.802.303 1.163l-.014-.043a4.12 4.12 0 0 0 2.254 2.272l.027.01c.318.119.695.219 1.083.284l.037.005c.469.082 1.024.14 1.588.159l.021.001q.946.039 1.508.047t1.649 0l1.188-.024l1.195.008q1.086.008 1.649 0t1.508-.047c.585-.02 1.14-.078 1.683-.17l-.073.01c.425-.07.802-.17 1.163-.303l-.043.014a4.12 4.12 0 0 0 2.272-2.254l.01-.027c.119-.318.219-.695.284-1.083l.005-.037c.082-.469.14-1.024.159-1.588l.001-.021q.039-.946.047-1.508t0-1.649t-.008-1.195t.008-1.195t0-1.649t-.047-1.508c-.02-.585-.078-1.14-.17-1.683l.01.073a6.3 6.3 0 0 0-.303-1.163l.014.043a4.12 4.12 0 0 0-2.254-2.272l-.027-.01a6 6 0 0 0-1.083-.284l-.037-.005a12 12 0 0 0-1.588-.159l-.021-.001q-.946-.039-1.508-.047t-1.649 0zM24 12q0 3.578-.08 4.953a6.64 6.64 0 0 1-6.985 6.968l.016.001q-1.375.08-4.953.08t-4.953-.08a6.64 6.64 0 0 1-6.968-6.985l-.001.016q-.08-1.375-.08-4.953t.08-4.953A6.64 6.64 0 0 1 7.061.079L7.045.078q1.375-.08 4.953-.08t4.953.08a6.64 6.64 0 0 1 6.968 6.985l.001-.016Q24 8.421 24 12"
      ></path>
    </svg>
                        </a>
                    <?php endif; ?>
                    <?php if (!empty($socials['telegram'])): ?>
                        <a href="<?php echo esc_url($socials['telegram']); ?>" target="_blank" aria-label="Telegram" class="p-2 rounded-full bg-zinc-100 hover:bg-blue-100 transition">
                        <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
    >
      <path
        fill="currentColor"
        d="m16.463 8.846l-1.09 6.979a.588.588 0 0 1-.894.407l-3.65-2.287a.588.588 0 0 1-.095-.923l3.03-2.904c.034-.032-.006-.085-.046-.061l-4.392 2.628a1.23 1.23 0 0 1-.87.153l-1.59-.307c-.574-.111-.653-.899-.114-1.122l8.502-3.515a.882.882 0 0 1 1.21.952"
      ></path>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 1.706C6.315 1.706 1.706 6.315 1.706 12S6.315 22.294 12 22.294S22.294 17.685 22.294 12S17.685 1.706 12 1.706M3.47 12a8.53 8.53 0 1 1 17.06 0a8.53 8.53 0 0 1-17.06 0"
        clipRule="evenodd"
      ></path>
    </svg>
                    </a>
                    <?php endif; ?>
                    <?php if (!empty($socials['whatsapp'])): ?>
                        <a href="<?php echo esc_url($socials['whatsapp']); ?>" target="_blank" aria-label="WhatsApp" class="p-2 rounded-full bg-zinc-100 hover:bg-blue-100 transition">
                        <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 12 12"
      width="20"
      height="20"
    >
      <path
        fill="currentColor"
        d="M6 0a6 6 0 1 1-3.002 11.196l-2.34.778a.5.5 0 0 1-.632-.632l.779-2.339A6 6 0 0 1 6 0m0 1a5 5 0 0 0-4.226 7.674a.5.5 0 0 1 .053.426l-.537 1.61l1.611-.536a.5.5 0 0 1 .426.052A5 5 0 1 0 6 1M3.93 3.003c.099 0 .197 0 .282.004c.09.006.212-.038.333.272c.123.319.418 1.104.455 1.183s.062.172.013.278c-.05.107-.075.173-.148.264c-.074.094-.155.209-.222.28c-.074.079-.15.164-.064.324c.085.158.382.68.821 1.101c.564.543 1.04.712 1.188.791s.234.064.319-.04c.086-.105.368-.464.467-.624c.098-.158.197-.133.332-.079c.135.053.862.437 1.009.516c.148.081.247.121.283.188c.038.066.038.385-.085.755c-.123.373-.712.712-.996.757a1.9 1.9 0 0 1-.931-.064a8 8 0 0 1-.84-.335c-1.482-.69-2.45-2.296-2.523-2.4c-.074-.106-.603-.863-.603-1.646s.38-1.167.516-1.325c.135-.16.296-.2.394-.2"
      ></path>
    </svg>
                    </a>
                    <?php endif; ?>
                    <?php if (!empty($socials['linkedin'])): ?>
                        <a href="<?php echo esc_url($socials['linkedin']); ?>" target="_blank" aria-label="LinkedIn" class="p-2 rounded-full bg-zinc-100 hover:bg-blue-100 transition">
                        <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width="20"
      height="20"
    >
      <path
        fill="currentColor"
        d="M15 0a1 1 0 0 1 .993.883L16 1v14a1 1 0 0 1-.883.993L15 16H1a1 1 0 0 1-.993-.883L0 15V1A1 1 0 0 1 .883.007L1 0zm0 1H1v14h14zm-4.56 5.082c2.032 0 2.462 1.292 2.488 3.004v3.843h-2.074V9.464c-.01-.731-.11-1.556-1.079-1.556c-1.029 0-1.227.766-1.244 1.592l-.001 3.429H6.455v-6.68h1.992v.912h.028a2.18 2.18 0 0 1 1.964-1.079zm-5.288.166v6.68H3.075v-6.68zm-1.038-3.32a1.204 1.204 0 1 1 0 2.407a1.204 1.204 0 0 1 0-2.408z"
      ></path>
    </svg>
                    </a>
                    <?php endif; ?>
                    <?php if (!empty($socials['x'])): ?>
                        <a href="<?php echo esc_url($socials['x']); ?>" target="_blank" aria-label="X" class="p-2 rounded-full bg-zinc-100 hover:bg-blue-100 transition">
                        <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width="20"
      height="20"
    >
      <path
        fill="currentColor"
        d="M389.2 48h70.6L305.6 224.2L487 464H345L233.7 318.6L106.5 464H35.8l164.9-188.5L26.8 48h145.6l100.5 132.9zm-24.8 373.8h39.1L151.1 88h-42z"
      ></path>
    </svg>
                        </a>
                    <?php endif; ?>
                </div>
            </div>
            <div class="flex md:justify-end gap-x-5">
                <?php 
                $symbol1 = get_theme_mod('footer_symbol_1');
                $symbol2 = get_theme_mod('footer_symbol_2');
                $symbol1_src = $symbol1 ? $symbol1 : get_template_directory_uri() . '/assets/image/service/symbol-01.png';
                $symbol2_src = $symbol2 ? $symbol2 : get_template_directory_uri() . '/assets/image/service/symbol-02.png';
                ?>
                <img class="max-w-32 h-fit" src="<?php echo esc_url( $symbol1_src ); ?>" alt="">
                <img class="max-w-32 h-fit" src="<?php echo esc_url( $symbol2_src ); ?>" alt="">
            </div>
        </div>
        
        <div class="mt-5 border-t w-full text-xs text-zinc-500 pr-5 pt-5">
            تمامی حقوق محفوظ است <?php echo date('Y'); ?> - <?php bloginfo('name'); ?>
        </div>
    </footer>
    
    <?php wp_footer(); ?>
</body>
</html>

