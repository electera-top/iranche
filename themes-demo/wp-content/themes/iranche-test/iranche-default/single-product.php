<?php
/**
 * Single Product Template
 *
 * @package Themee
 */

get_header(); ?>

<style>
.product-info-box {
    display: none;
}

@media (min-width: 1024px) {
    .product-info-box {
        display: block;
    }
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-container {
    background: white;
    border-radius: 12px;
    padding: 24px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.modal-content {
    text-align: center;
}

.modal-product-section {
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
}

.modal-product-image {
    position: relative;
    display: inline-block;
}

.modal-product-image img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 12px;
    border: 2px solid #f3f4f6;
}

.success-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #10b981;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid white;
}

.success-icon {
    width: 16px;
    height: 16px;
    color: white;
}

.modal-title {
    font-size: 18px;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 8px;
}

.modal-product-info {
    color: #6b7280;
    margin-bottom: 24px;
    font-size: 14px;
}

.modal-buttons {
    display: flex;
    gap: 12px;
    flex-direction: column;
}

.btn-continue, .btn-checkout {
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    font-size: 14px;
}

.btn-continue {
    background-color: #f3f4f6;
    color: #374151;
}

.btn-continue:hover {
    background-color: #e5e7eb;
}

.btn-checkout {
    background-color: #3b82f6;
    color: white;
}

.btn-checkout:hover {
    background-color: #2563eb;
}

@media (min-width: 640px) {
    .modal-buttons {
        flex-direction: row;
        justify-content: center;
    }
}
</style>

<main class="pt-20 md:pt-40 lg:pt-[73px]">
    <div class="bg-white shadow-large lg:my-10 mx-5 rounded-xl md:rounded-2xl p-3 md:p-5 border">
        <?php if (class_exists('WooCommerce')): ?>
            <?php while (have_posts()) : the_post(); ?>
                <?php global $product; ?>
                
                <div class="single-product-container">
            <!-- Product Images -->
                    <div class="product-images-section">
                <div class="flex gap-x-4">
                            <!-- Wishlist Button -->
                    <a href="#" class="relative">
                        <div class="group cursor-pointer relative inline-block text-center">
                            <svg class="fill-zinc-700 hover:fill-red-400 transition" xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="" viewBox="0 0 256 256"><path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z"></path></svg>
                            <div class="opacity-0 w-28 transition-all bg-zinc-800 text-white text-center text-xs rounded-lg py-2 absolute z-10 -left-11 group-hover:opacity-100 px-3 pointer-events-none">
                                افزودن به علاقه مندی ها
                                <svg class="absolute text-black h-2 w-full left-0 bottom-full rotate-180" x="0px" y="0px" viewBox="0 0 255 255" xml:space="preserve"><polygon class="fill-current" points="0,0 127.5,127.5 255,0"></polygon></svg>
                            </div>
                        </div>
                    </a>
                            
                            <!-- Compare Button -->
                            <a href="#" class="relative">
                                <div class="group cursor-pointer relative inline-block text-center">
                                    <svg class="fill-zinc-700 hover:fill-zinc-800 transition" xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#000000" viewBox="0 0 256 256"><path d="M112,152a8,8,0,0,0-8,8v28.69L75.72,160.4A39.71,39.71,0,0,1,64,132.12V95a32,32,0,1,0-16,0v37.13a55.67,55.67,0,0,0,16.4,39.6L92.69,200H64a8,8,0,0,0,0,16h48a8,8,0,0,0,8-8V160A8,8,0,0,0,112,152ZM40,64A16,16,0,1,1,56,80,16,16,0,0,1,40,64Zm168,97V123.88a55.67,55.67,0,0,0-16.4-39.6L163.31,56H192a8,8,0,0,0,0-16H144a8,8,0,0,0-8,8V96a8,8,0,0,0,16,0V67.31L180.28,95.6A39.71,39.71,0,0,1,192,123.88V161a32,32,0,1,0,16,0Zm-8,47a16,16,0,1,1,16-16A16,16,0,0,1,200,208Z"></path></svg>
                                    <div class="opacity-0 w-28 transition-all bg-zinc-800 text-white text-center text-xs rounded-lg py-2 absolute z-10 -left-11 group-hover:opacity-100 px-3 pointer-events-none">
                                        افزودن به مقایسه
                                        <svg class="absolute text-black h-2 w-full left-0 bottom-full rotate-180" x="0px" y="0px" viewBox="0 0 255 255" xml:space="preserve"><polygon class="fill-current" points="0,0 127.5,127.5 255,0"></polygon></svg>
                                    </div>
                                </div>
                            </a>
                            
                            <!-- Share Button -->
                            <a href="#" class="relative">
                                <div class="group cursor-pointer relative inline-block text-center">
                                    <svg class="fill-zinc-700 hover:fill-zinc-800 transition" xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#000000" viewBox="0 0 256 256"><path d="M176,160a39.89,39.89,0,0,0-28.62,12.09l-46.1-29.63a39.8,39.8,0,0,0,0-28.92l46.1-29.63a40,40,0,1,0-8.66-13.45l-46.1,29.63a40,40,0,1,0,0,55.82l46.1,29.63A40,40,0,1,0,176,160Zm0-128a24,24,0,1,1-24,24A24,24,0,0,1,176,32ZM64,152a24,24,0,1,1,24-24A24,24,0,0,1,64,152Zm112,72a24,24,0,1,1,24-24A24,24,0,0,1,176,224Z"></path></svg>
                                    <div class="opacity-0 w-28 transition-all bg-zinc-800 text-white text-center text-xs rounded-lg py-2 absolute z-10 -left-11 group-hover:opacity-100 px-3 pointer-events-none">
                                        اشتراک گذاری
                                <svg class="absolute text-black h-2 w-full left-0 bottom-full rotate-180" x="0px" y="0px" viewBox="0 0 255 255" xml:space="preserve"><polygon class="fill-current" points="0,0 127.5,127.5 255,0"></polygon></svg>
                            </div>
                        </div>
                    </a>
                </div>
                
                        <!-- Main Product Image -->
                <?php if (has_post_thumbnail()): ?>
                    <img class="w-10/12 lg:w-full mx-auto border-2 rounded-xl" src="<?php echo get_the_post_thumbnail_url(get_the_ID(), 'large'); ?>" alt="<?php the_title(); ?>">
                        <?php else: ?>
                            <div class="w-10/12 lg:w-full mx-auto border-2 rounded-xl bg-gray-200 flex items-center justify-center aspect-square">
                                <svg class="w-24 h-24 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        <?php endif; ?>
                        
                        <!-- Product Gallery Thumbnails -->
                        <?php
                        $attachment_ids = $product->get_gallery_image_ids();
                        if ($attachment_ids): ?>
                            <div class="grid grid-cols-5 gap-x-2 mt-4">
                                <?php foreach ($attachment_ids as $index => $attachment_id): ?>
                                    <img onclick="showImagesProduct()" class="cursor-pointer border rounded-lg" src="<?php echo wp_get_attachment_image_url($attachment_id, 'thumbnail'); ?>" alt="Gallery Image <?php echo $index + 1; ?>">
                                <?php endforeach; ?>
                                
                                <!-- Show more images indicator -->
                                <?php if (count($attachment_ids) > 4): ?>
                                    <div onclick="showImagesProduct()" class="cursor-pointer border rounded-lg flex justify-center items-center relative">
                                        <img class="blur-sm" src="<?php echo wp_get_attachment_image_url($attachment_ids[4], 'thumbnail'); ?>">
                                        <svg class="fill-zinc-800 absolute" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#000000" viewBox="0 0 256 256"><path d="M144,128a16,16,0,1,1-16-16A16,16,0,0,1,144,128ZM60,112a16,16,0,1,0,16,16A16,16,0,0,0,60,112Zm136,0a16,16,0,1,0,16,16A16,16,0,0,0,196,112Z"></path></svg>
                                    </div>
                                <?php endif; ?>
                            </div>
                        <?php endif; ?>
                        
                        <!-- Product Images Modal -->
                        <div class="max-w-2xl mx-auto relative">
                            <!-- Main modal -->
                            <div id="showImagesModal" class="overflow-x-hidden overflow-y-auto z-50 fixed hidden h-modal h-full inset-0 justify-center items-center">
                                <div onclick="closeImagesProduct()" class="overflow-x-hidden overflow-y-auto fixed h-modal h-full inset-0 z-10 bg-gray-600 bg-opacity-50 w-full">
                                </div>
                                <div class="relative w-12/12 sm:w-10/12 lg:w-full lg:max-w-[1600px] px-2 mb-4 z-50 mt-2 lg:mt-2 mx-auto">
                                    <!-- Modal content -->
                                    <div class="bg-white rounded-lg shadow-lg relative">
                                        <div class="flex justify-between items-center p-4 border-b">
                                            <h3 class="text-gray-800 font-semibold">
                                                عکس های محصول
                                            </h3>
                                            <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center" onclick="closeImagesProduct()" id="closeSelectP">
                                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
                                            </button>
                                        </div>
                                        <div class="container relative">
                                            <!-- Main Product Image -->
                                            <div class="mySlides">
                                                <img src="<?php echo get_the_post_thumbnail_url(get_the_ID(), 'large'); ?>" class="w-5/12 lg:w-3/12 align-middle mx-auto" alt="<?php the_title(); ?>">
                                            </div>
                                            
                                            <!-- Gallery Images -->
                                            <?php if ($attachment_ids): ?>
                                                <?php foreach ($attachment_ids as $attachment_id): ?>
                                                    <div class="mySlides">
                                                        <img src="<?php echo wp_get_attachment_image_url($attachment_id, 'large'); ?>" class="w-5/12 lg:w-3/12 align-middle mx-auto" alt="Gallery Image">
                                                    </div>
                                                <?php endforeach; ?>
                                            <?php endif; ?>
                                              
                                            <div class="absolute top-32 w-full">
                                                <a class="next hover:bg-gray-300 absolute left-0 select-none p-3 rounded-r-md" onclick="plusSlides(1)">
                                                    <svg class="hover:bg-gray-300" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM149.66,93.66,115.31,128l34.35,34.34a8,8,0,0,1-11.32,11.32l-40-40a8,8,0,0,1,0-11.32l40-40a8,8,0,0,1,11.32,11.32Z"></path></svg>
                                                </a>
                                                <a class="prev hover:bg-gray-300 absolute right-0 select-none p-3 rounded-l-md" onclick="plusSlides(-1)">
                                                    <svg class="hover:bg-gray-300" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm29.66-93.66a8,8,0,0,1,0,11.32l-40,40a8,8,0,0,1-11.32-11.32L140.69,128,106.34,93.66a8,8,0,0,1,11.32-11.32Z"></path></svg>
                                                </a>
                                            </div>
                                            
                                            <div class="flex gap-x-3 overflow-x-scroll mt-32 md:mt-20 p-3">
                                                <!-- Main Image Thumbnail -->
                                                <img class="demo align-middle w-[20%] lg:w-[10%] h-auto opacity-60 hover:opacity-100 border border-gray-300 rounded-md" src="<?php echo get_the_post_thumbnail_url(get_the_ID(), 'thumbnail'); ?>" onclick="currentSlide(1)">
                                                
                                                <!-- Gallery Image Thumbnails -->
                                                <?php if ($attachment_ids): ?>
                                                    <?php foreach ($attachment_ids as $index => $attachment_id): ?>
                                                        <img class="demo align-middle w-[20%] lg:w-[10%] h-auto opacity-60 hover:opacity-100 border border-gray-300 rounded-md" src="<?php echo wp_get_attachment_image_url($attachment_id, 'thumbnail'); ?>" onclick="currentSlide(<?php echo $index + 2; ?>)">
                                                    <?php endforeach; ?>
                <?php endif; ?>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> 
                        </div>
            </div>
            
                    <!-- Product Information -->
                    <div class="product-info-section">
                        <!-- Breadcrumb -->
                <div class="mb-7 text-sm flex items-center gap-x-2 opacity-90">
                    <a href="<?php echo home_url(); ?>" class="text-zinc-800 hover:text-blue-500 transition">
                        خانه
                    </a>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#3d3d3d" viewBox="0 0 256 256"><path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path></svg>
                    </div>
                    <a href="<?php echo get_permalink(get_option('woocommerce_shop_page_id')); ?>" class="text-zinc-800 hover:text-blue-500 transition">
                        محصولات
                    </a>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#3d3d3d" viewBox="0 0 256 256"><path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path></svg>
                    </div>
                            <a class="text-blue-500" href="<?php the_permalink(); ?>">
                        <?php the_title(); ?>
                    </a>
                </div>
                
                        <!-- Product Title -->
                <div class="text-zinc-800 text-lg md:text-2xl font-semibold">
                    <?php the_title(); ?>
                </div>
                
                        <!-- Product SKU/Model -->
                        <?php if ($product && is_object($product) && $product->get_sku()): ?>
                    <div class="text-zinc-400 text-sm mt-4">
                                <?php echo $product->get_sku(); ?>
                    </div>
                        <?php endif; ?>
                    
                        <!-- Product Rating -->
                        <?php if ($product && is_object($product) && $product->get_average_rating() > 0): ?>
                    <div class="flex gap-x-4 mt-3">
                        <div class="flex items-start gap-x-1 text-sm text-zinc-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f9bc00" viewBox="0 0 256 256"><path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path></svg>
                            <span>
                                        <span>(<?php echo $product->get_review_count(); ?>+)</span>
                                        <span><?php echo $product->get_average_rating(); ?></span>
                            </span>
                        </div>
                                <a href="#comments" class="flex items-start gap-x-1 text-sm text-blue-400">
                                    <svg class="fill-blue-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="" viewBox="0 0 256 256"><path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM84,116a12,12,0,1,0,12,12A12,12,0,0,0,84,116Zm88,0a12,12,0,1,0,12,12A12,12,0,0,0,172,116Zm60,12A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-16,0A88,88,0,1,0,51.81,172.06a8,8,0,0,1,.66,6.54L40,216,77.4,203.53a7.85,7.85,0,0,1,2.53-.42,8,8,0,0,1,4,1.08A88,88,0,0,0,216,128Z"></path></svg>
                                    <span>
                                        <span><?php echo $product->get_review_count(); ?></span>
                                        <span>دیدگاه</span>
                                    </span>
                                </a>
                    </div>
                <?php endif; ?>
                
                        <!-- Product Features -->
                <div class="mt-8 text-zinc-700">
                    ویژگی های محصول:
                </div>
                        <div class="grid grid-cols-3 max-w-md py-3 mb-5 gap-3">
                            <?php
                            $attributes = $product->get_attributes();
                            $count = 0;
                            foreach ($attributes as $attribute):
                                if ($attribute->get_visible() && $count < 6):
                                    $attribute_name = wc_attribute_label($attribute->get_name());
                                    $attribute_values = $attribute->get_options();
                                    ?>
                                    <div class="flex flex-col gap-x-2 justify-center bg-gray-100 rounded-md px-2 py-3">
                                        <div class="text-zinc-500 text-xs">
                                            <?php echo $attribute_name; ?>:
                                        </div>
                                        <div class="text-zinc-700 text-sm">
                                            <?php echo implode(', ', array_slice($attribute_values, 0, 1)); ?>
                                        </div>
                                    </div>
                                    <?php
                                    $count++;
                                endif;
                            endforeach;
                            ?>
                </div>
                
                        <!-- Return Policy -->
                        <div class="flex gap-x-2 mt-2 pt-2 text-zinc-500 text-sm border-t leading-6">
                            <svg class="fill-zinc-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"></path></svg>
                            درخواست مرجوع کردن کالا در گروه محصولات با دلیل "انصراف از خرید" تنها در صورتی قابل تایید است که کالا در شرایط اولیه باشد.
                        </div>
            </div>
             
            <!-- Buy Section -->
                    <div class="product-buy-section">
                        <!-- Color Selection -->
                        <?php if ($product && is_object($product) && $product->is_type('variable')): ?>
                    <div class="lg:mt-8 lg:mb-8">
                                <div class="text-zinc-700">
                                    رنگ:
                                </div>
                                <ul class="flex flex-wrap gap-2">
                                    <?php
                                    $attributes = $product->get_variation_attributes();
                                    if (isset($attributes['pa_color'])):
                                        $colors = $attributes['pa_color'];
                                        foreach ($colors as $index => $color):
                                            $color_class = 'bg-gray-400';
                                            if (strpos($color, 'مشکی') !== false) $color_class = 'bg-gray-900';
                                            elseif (strpos($color, 'آبی') !== false) $color_class = 'bg-blue-400';
                                            elseif (strpos($color, 'قرمز') !== false) $color_class = 'bg-red-400';
                                            elseif (strpos($color, 'سبز') !== false) $color_class = 'bg-green-400';
                                            ?>
                                            <li>
                                                <input type="radio" id="color_<?php echo $index; ?>" name="color" value="<?php echo esc_attr($color); ?>" class="hidden peer" required="">
                                                <label for="color_<?php echo $index; ?>" class="inline-flex items-center justify-center px-2 py-3 text-gray-600 bg-white border-2 border-gray-200 rounded-full cursor-pointer peer-checked:border-blue-400 hover:text-gray-600 hover:bg-gray-100">
                                                    <div class="flex gap-x-2">
                                                        <div class="w-5 h-5 <?php echo $color_class; ?> rounded-full"></div>
                                                        <div class="text-sm"><?php echo $color; ?></div>
                                                    </div>
                                                </label>
                                            </li>
                                        <?php endforeach;
                                    endif; ?>
                                </ul>
                            </div>
                        <?php endif; ?>
                        <!-- Product Info Box -->
                        <div class="p-3 border rounded-xl mx-auto divide-y product-info-box">
                            <!-- Warranty -->
                            <?php 
                            $warranty_info = themee_get_product_warranty($product->get_id());
                            if ($warranty_info && !empty($warranty_info['value'])):

                            ?>
                            
                            <div class="flex gap-x-1 items-center text-zinc-600 text-sm pb-5 pt-3">
                                    <svg class="fill-zinc-700" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="" viewBox="0 0 256 256"><path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,104.62-80,109.18-13.53-4.51-80-30.69-80-109.18V56H208ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.68l50.34-50.34a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z"></path></svg>
                                    <div>
                                        <?php 
                                        if ($warranty_info['type'] === 'attribute' && isset($warranty_info['label'])) {
                                            echo $warranty_info['label'] . ': ' . $warranty_info['value'];
                                        } else {
                                            echo 'گارانتی ' . $warranty_info['value'];
                                        }
                                        ?>
                                    </div>
                                </div>
                            <?php else: ?>
                             
                            <?php endif; ?>
                            
                    
                            
                            <!-- Satisfaction -->
                            <?php 
                            $satisfaction_data = themee_get_product_satisfaction_data($product->get_id());
                            $satisfaction_percentage = $satisfaction_data['percentage'];
                            $review_count = $satisfaction_data['review_count'];
                            $average_rating = $satisfaction_data['average_rating'];
                            
                            // Determine satisfaction color based on percentage
                            $satisfaction_color = 'text-gray-400'; // Default for no reviews
                            if ($satisfaction_percentage >= 80) {
                                $satisfaction_color = 'text-green-500';
                            } elseif ($satisfaction_percentage >= 60) {
                                $satisfaction_color = 'text-yellow-500';
                            } elseif ($satisfaction_percentage >= 40) {
                                $satisfaction_color = 'text-orange-500';
                            } elseif ($satisfaction_percentage > 0) {
                                $satisfaction_color = 'text-red-500';
                            }
                            ?>
                            <div class="flex gap-x-1 items-center <?php echo $satisfaction_color; ?> text-sm py-5">
                                <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="" viewBox="0 0 256 256"><path d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32ZM223.94,97l-12,96a8,8,0,0,1-7.94,7H88V105.89l36.71-73.43A24,24,0,0,1,144,56V80a8,8,0,0,0,8,8h64a8,8,0,0,1,7.94,9Z"></path></svg>
                                <div>
                                    رضایت از محصول:
                                </div>
                                <span class="font-semibold">
                                    <?php if ($review_count > 0): ?>
                                        <?php echo $satisfaction_percentage; ?>%
                                        <span class="text-xs text-gray-500 mr-1">
                                            (<?php echo $average_rating; ?>/5 از <?php echo $review_count; ?> نظر)
                                        </span>
                                    <?php else: ?>
                                        <span class="text-gray-400 text-xs">
                                            (هنوز نظری ثبت نشده)
                                        </span>
                                    <?php endif; ?>
                                </span>
                            </div>
                            
                            <!-- Price -->
                            <div class="">
                                <?php 
                                $regular_price = $product->get_regular_price();
                                $sale_price = $product->get_sale_price();
                                $is_on_sale = $sale_price && $sale_price != $regular_price;
                                
                                if ($is_on_sale):
                                    $regular_toman = number_format($regular_price / 10, 0, '.', ',');
                                    $sale_toman = number_format($sale_price / 10, 0, '.', ',');
                                    $discount_percentage = round((($regular_price - $sale_price) / $regular_price) * 100);
                                ?>
                                    <!-- Sale Price Layout -->
                                    <div class="text-center space-y-2 flex justify-between items-center  py-2">
                                     
                                        
                                      <div class="flex flex-col justify-end items-end">
                                            <!-- Regular Price (Crossed Out) -->
                                            <div class="text-gray-400 text-lg line-through">
                                              <?php echo $regular_toman; ?> تومان
                                            </div>
                                        
                                            <!-- Sale Price (Highlighted) -->
                                            <div class="text-green-600 text-2xl font-bold">
                                                <?php echo $sale_toman; ?> تومان
                                </div>
                            </div>

                                <div>
                                         <!-- Discount Badge -->
                                         <div class="inline-block bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                                            <?php echo $discount_percentage; ?>% تخفیف
                                            </div>
                                       </div>
                                    </div>
                                <?php else: ?>
                                    <!-- Regular Price Layout -->
                                    <div class="flex justify-start py-2">
                                        <div class="text-zinc-600 text-2xl font-bold">
                                            <?php echo number_format($regular_price / 10, 0, '.', ','); ?> تومان
                                </div>
                            </div>
                                <?php endif; ?>
                                
                               
                                </div>
                            
                            <!-- Add to Cart Button -->
                            <?php if ($product->is_in_stock()): ?>
                                <form class="cart" action="" method="post" enctype='multipart/form-data'>
                                    <?php
                                    if ($product->is_type('variable')) {
                                        // Variable product variations will be handled by WooCommerce
                                        echo '<div class="variations">';
                                        $attributes = $product->get_variation_attributes();
                                        foreach ($attributes as $attribute_name => $options) {
                                            $attribute_label = wc_attribute_label($attribute_name);
                                            echo '<div class="variation mb-4">';
                                            echo '<label class="block text-sm font-medium text-gray-700 mb-2">' . $attribute_label . '</label>';
                                            echo '<select name="attribute_' . sanitize_title($attribute_name) . '" class="w-full border border-gray-300 rounded-md px-3 py-2">';
                                            echo '<option value="">انتخاب کنید...</option>';
                                            foreach ($options as $option) {
                                                echo '<option value="' . esc_attr($option) . '">' . esc_html($option) . '</option>';
                                            }
                                            echo '</select>';
                                            echo '</div>';
                                        }
                                        echo '</div>';
                                    } else {
                                        // Simple product
                                        echo '<div class="quantity mb-4">';
                                        echo '<label class="block text-sm font-medium text-gray-700 mb-2">تعداد:</label>';
                                        echo '<input type="number" name="quantity" value="1" min="1" class="w-20 border border-gray-300 rounded-md px-3 py-2">';
                                        echo '</div>';
                                    }
                                    ?>
                                    
                                    <button type="submit" name="add-to-cart" value="<?php echo esc_attr($product->get_id()); ?>" class="mx-auto w-full px-2 py-3 text-sm bg-blue-500 hover:bg-blue-400 transition text-gray-100 rounded-lg">
                                        افزودن به سبد خرید
                                    </button>
                                     <!-- Stock Status -->
                                <?php if (!$product->is_in_stock()): ?>
                                            <div class="text-xs text-red-400 text-center mt-3">
                                        موجود نیست
                                    </div>
                                        <?php else: ?>
                                            <div class="text-xs text-red-400 text-center mt-3">
                                                <?php echo $product->get_stock_quantity(); ?> عدد در انبار باقی مانده
                                            </div>
                                        <?php endif; ?>
                                </form>
                                <?php endif; ?>
                            </div>
                        
                        <!-- Shipping Info -->
                        <div class="flex items-center gap-x-2 mt-4 text-zinc-600 text-sm">
                            <svg class="fill-zinc-600" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"></path></svg>
                            هزینه پست برای سبد خرید بالای 400 هزار تومان رایگان میباشد.
                        </div>
                        
                        <!-- Mobile Buy Section -->
                        <div class="fixed flex bottom-0 right-0 lg:hidden bg-white border-t w-full px-5 py-3 gap-x-2">
                            <?php if ($product->is_in_stock()): ?>
                                <button type="submit" name="add-to-cart" value="<?php echo esc_attr($product->get_id()); ?>" class="mx-auto w-1/2 px-2 py-3 text-sm bg-blue-500 hover:bg-blue-400 transition text-gray-100 rounded-lg">
                                    افزودن به سبد خرید
                                </button>
                            <?php endif; ?>
                            <span class="flex flex-col justify-center items-center w-1/2 product-price-container">
                                <div class="text-zinc-600 text-center">
                                    <span class="font-semibold text-lg product-price-text"><?php echo $product->get_price_html(); ?></span>
                                </div>
                                <?php if ($product->is_in_stock()): ?>
                                    <div class="text-xs text-red-400 text-center">
                                        <?php echo $product->get_stock_quantity(); ?> عدد در انبار باقی مانده
                                    </div>
                                <?php endif; ?>
                            </span>
                        </div>
                    </div>
                </div>
                
                <!-- Product Tabs -->
                <div class="flex gap-x-8 mt-20 pb-2 border-b">
                    <a class="text-zinc-600 hover:text-zinc-800 transition" href="#proper">
                        مشخصات
                    </a>
                    <a class="text-zinc-600 hover:text-zinc-800 transition" href="#comments">
                        دیدگاه ها
                    </a>
                    <a class="text-zinc-600 hover:text-zinc-800 transition" href="#quest">
                        پرسش ها
                    </a>
                </div>
                
                <!-- Product Specifications -->
                <div class="p-4 border-b" id="proper">
                    <span class="border-b-blue-300 border-b text-zinc-800">
                        مشخصات محصول
                    </span>
                    <div class="text-gray-500 text-sm grid grid-cols-1 md:grid-cols-2 gap-x-5">
                        <?php
                        $attributes = $product->get_attributes();
                        foreach ($attributes as $attribute):
                            if ($attribute->get_visible()):
                                $attribute_name = wc_attribute_label($attribute->get_name());
                                $attribute_values = $attribute->get_options();
                                ?>
                                <div class="flex items-center justify-between border p-3 w-full my-3 mx-auto rounded-xl">
                                    <div class="text-sm text-zinc-700">
                                        <?php echo $attribute_name; ?>:
                                    </div>
                                    <div class="text-sm text-zinc-700">
                                        <?php echo implode(', ', $attribute_values); ?>
                                    </div>
                                </div>
                                <?php
                            endif;
                        endforeach;
                        ?>
                    </div>
                </div>
                
                <!-- Reviews Section -->
                <div class="p-4 border-b" id="comments">
                    <span class="border-b-blue-300 border-b text-zinc-800">
                        دیدگاه ها
                    </span>
                    <div class="lg:flex gap-5">
                        <div class="lg:w-3/12 py-5">
                            <!-- Review Summary -->
                            <?php if ($product && is_object($product) && $product->get_average_rating() > 0): ?>
                                <div class="flex items-start gap-x-1 text-sm text-zinc-600 mb-4">
                                    <span>
                                        <span>(از <?php echo $product->get_review_count(); ?> امتیاز)</span>
                                        <span><?php echo $product->get_average_rating(); ?></span>
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#f9bc00" viewBox="0 0 256 256"><path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path></svg>
                                </div>
                            <?php endif; ?>
                            
                            <!-- WooCommerce Review Form -->
                            <?php
                            if (comments_open() || get_comments_number()) {
                                // Use WooCommerce review form
                                if (function_exists('woocommerce_output_product_data_tabs')) {
                                    // Display WooCommerce review form
                                    themee_woocommerce_review_form();
                                } else {
                                    comments_template();
                                }
                            }
                            ?>
                        </div>
                        <div class="lg:w-9/12 divide-y-2 divide-blue-600">
                            <!-- Reviews will be loaded by WooCommerce -->
                            <div class="px-2 pt-5">
                                <div class="text-lg text-zinc-700 mb-4">
                                    دیدگاه‌های کاربران
                                </div>
                                <?php
                                // Display WooCommerce reviews
                                $reviews = get_comments(array(
                                    'post_id' => get_the_ID(),
                                    'status' => 'approve',
                                    'type' => 'review'
                                ));
                                
                                if ($reviews): ?>
                                    <?php foreach ($reviews as $review): ?>
                                        <div class="review-item border-b border-gray-200 pb-4 mb-4">
                                            <div class="flex items-center gap-x-2 mb-2">
                                                <div class="font-semibold text-zinc-800">
                                                    <?php echo get_comment_author($review); ?>
                                                </div>
                                                <div class="text-xs text-zinc-500">
                                                    <?php echo get_comment_date('j F Y', $review); ?>
                                                </div>
                                                <?php
                                                $rating = get_comment_meta($review->comment_ID, 'rating', true);
                                                if ($rating): ?>
                                                    <div class="review-stars">
                                                        <?php for ($i = 1; $i <= 5; $i++): ?>
                                                            <?php if ($i <= $rating): ?>
                                                                <span class="star">★</span>
                                                            <?php else: ?>
                                                                <span class="star empty">★</span>
                                                            <?php endif; ?>
                                                        <?php endfor; ?>
                                                    </div>
                            <?php endif; ?>
                        </div>
                                            <div class="text-zinc-600 text-sm">
                                                <?php echo get_comment_text($review); ?>
                                            </div>
                                        </div>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <div class="text-zinc-500 text-sm">
                                        هنوز دیدگاهی ثبت نشده است. اولین نفری باشید که دیدگاه خود را ثبت می‌کند.
                    </div>
                <?php endif; ?>
            </div>
        </div>
                    </div>
                </div>
                
                <!-- Q&A Section -->
                <div class="p-4" id="quest">
                    <span class="border-b-blue-300 border-b text-zinc-800">
                        پرسش ها
                    </span>
                    <div class="lg:flex gap-5">
                        <div class="lg:w-3/12 py-5">
                            <div class="mt-6 mb-2 text-sm text-zinc-700">
                                اگر سوالی دارید بپرسید
                            </div>
                            <textarea placeholder="متن پرسش" name="question_text" cols="30" rows="7" class="focus:shadow-primary-outline text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all focus:border-blue-400 focus:outline-none"></textarea>
                            <button class="mx-auto w-full px-2 py-3 mt-5 text-sm bg-blue-500 hover:bg-blue-400 transition text-gray-100 rounded-lg">
                                ارسال
                            </button>
                        </div>
                        <div class="lg:w-9/12 divide-y">
                            <div class="px-3 pt-5">
                                <div class="mt-2 text-zinc-600 text-sm">
                                    هنوز پرسشی ثبت نشده است. اولین نفری باشید که سوال خود را می‌پرسد.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Related Products Section -->
                <div class="mt-16">
                    <?php
                    $product_id = get_the_ID();
                    $upsell_products = themee_get_upsell_products($product_id, 4);
                    $cross_sell_products = themee_get_cross_sell_products($product_id, 4);
                    $related_products = themee_get_related_products($product_id, 4);
                    
                    // Display Upsell Products (محصولات پیشنهادی)
                    if ($upsell_products && $upsell_products->have_posts()):
                        $upsell_ids = array();
                        while ($upsell_products->have_posts()): 
                            $upsell_products->the_post();
                            $upsell_ids[] = get_the_ID();
                        endwhile;
                        wp_reset_postdata();
                    ?>
                        <div class="mb-12">
                            <h3 class="text-xl font-bold text-zinc-800 mb-6 text-center">
                                محصولات پیشنهادی
                            </h3>
                            <?php echo themee_product_grid($upsell_ids, array(
                                'columns' => 4,
                                'gap' => 6,
                                'card_args' => array(
                                    'show_wishlist' => true,
                                    'show_rating' => true,
                                    'show_sale_badge' => true,
                                )
                            )); ?>
                        </div>
                    <?php endif; ?>
                    
                    <!-- Display Cross-sell Products (محصولات مشابه) -->
                    <?php if ($cross_sell_products && $cross_sell_products->have_posts()): 
                        $cross_sell_ids = array();
                        while ($cross_sell_products->have_posts()): 
                            $cross_sell_products->the_post();
                            $cross_sell_ids[] = get_the_ID();
                        endwhile;
                        wp_reset_postdata();
                    ?>
                        <div class="mb-12">
                            <h3 class="text-xl font-bold text-zinc-800 mb-6 text-center">
                                محصولات مشابه
                            </h3>
                            <?php echo themee_product_grid($cross_sell_ids, array(
                                'columns' => 4,
                                'gap' => 6,
                                'card_args' => array(
                                    'show_wishlist' => true,
                                    'show_rating' => true,
                                    'show_sale_badge' => true,
                                )
                            )); ?>
                        </div>
                    <?php endif; ?>
                    
                    <!-- Display Related Products (محصولات مرتبط) -->
                    <?php if ($related_products && $related_products->have_posts()): 
                        $related_ids = array();
                        while ($related_products->have_posts()): 
                            $related_products->the_post();
                            $related_ids[] = get_the_ID();
                        endwhile;
                        wp_reset_postdata();
                    ?>
                        <div class="mb-12">
                            <h3 class="text-xl font-bold text-zinc-800 mb-6 text-center">
                                محصولات مرتبط
                            </h3>
                            <?php echo themee_product_grid($related_ids, array(
                                'columns' => 4,
                                'gap' => 6,
                                'card_args' => array(
                                    'show_wishlist' => true,
                                    'show_rating' => true,
                                    'show_sale_badge' => true,
                                )
                            )); ?>
                        </div>
                    <?php endif; ?>
                </div>
            <?php endwhile; ?>
        <?php endif; ?>
    </div>
</main>

<!-- Add to Cart Success Modal -->
<div id="addToCartModal" class="modal-overlay" style="display: none;">
    <div class="modal-container">
        <div class="modal-content">
            <!-- Product Image and Success Icon -->
            <div class="modal-product-section">
                <div class="modal-product-image">
                    <img id="modalProductImage" src="<?php echo esc_url(wp_get_attachment_image_url($product->get_image_id(), 'thumbnail')); ?>" alt="<?php echo esc_attr($product->get_name()); ?>" />
                    <div class="success-badge">
                        <svg class="success-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
            </div>
            
            <!-- Modal Title -->
            <h3 class="modal-title">محصول با موفقیت اضافه شد!</h3>
            
            <!-- Product Info -->
            <div class="modal-product-info">
                <span id="modalProductName">نام محصول</span> به سبد خرید اضافه شد
            </div>
            
            <!-- Modal Buttons -->
            <div class="modal-buttons">
                <button id="continueShoppingBtn" class="btn-continue">
                    ادامه خرید
                </button>
                <button id="goToCheckoutBtn" class="btn-checkout">
                    ثبت سفارش
                </button>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('addToCartModal');
    const continueBtn = document.getElementById('continueShoppingBtn');
    const checkoutBtn = document.getElementById('goToCheckoutBtn');
    const productNameSpan = document.getElementById('modalProductName');
    const productImageEl = document.getElementById('modalProductImage');
    
    // Function to show modal
    function showModal(productName, productImage) {
        productNameSpan.textContent = productName;
        if (productImage) {
            productImageEl.src = productImage;
            productImageEl.alt = productName;
        }
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    // Function to hide modal
    function hideModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
    
    // Continue Shopping Button
    continueBtn.addEventListener('click', function() {
        hideModal();
    });
    
    // Go to Checkout Button
    checkoutBtn.addEventListener('click', function() {
        window.location.href = '<?php echo esc_url(wc_get_checkout_url()); ?>';
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideModal();
        }
    });
    
    // AJAX Add to Cart
    const addToCartForms = document.querySelectorAll('form.cart');
    
    console.log('🔍 Found ' + addToCartForms.length + ' cart forms');
    
    let isProcessing = false;
    let submitCount = 0;
    
    addToCartForms.forEach(function(form, index) {
        console.log('📝 Setting up form #' + index);
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            submitCount++;
            console.log('🚀 Form submit event #' + submitCount + ' triggered');
            
            // Prevent multiple submissions
            if (isProcessing) {
                console.log('⚠️ Already processing, ignoring submission #' + submitCount);
                return;
            }
            
            console.log('✅ Processing submission #' + submitCount);
            isProcessing = true;
            
            const formData = new FormData(form);
            const productName = <?php echo json_encode($product->get_name()); ?>;
            const productImage = '<?php echo esc_url(wp_get_attachment_image_url($product->get_image_id(), 'thumbnail')); ?>';
            
            // Add required fields
            formData.append('action', 'themee_add_to_cart');
            
            // Ensure product ID is included
            if (!formData.has('add-to-cart')) {
                formData.append('add-to-cart', '<?php echo $product->get_id(); ?>');
            }
            
            // Debug: Log form data
            console.log('Form data being sent:');
            for (let [key, value] of formData.entries()) {
                console.log(key + ': ' + value);
            }
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'در حال افزودن...';
            submitBtn.disabled = true;
            
            fetch('<?php echo admin_url("admin-ajax.php"); ?>', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                console.log('Response status:', response.status);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text().then(text => {
                    console.log('Response text:', text);
                    try {
                        return JSON.parse(text);
                    } catch (e) {
                        console.error('JSON parse error:', e);
                        throw new Error('Invalid JSON response');
                    }
                });
            })
            .then(data => {
                // Restore button and flag
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                isProcessing = false;
                
                if (data.success) {
                    showModal(productName, productImage);
                    
                    // Update cart count if exists
                    const cartCount = document.querySelector('.cart-count');
                    if (cartCount && data.data.cart_count) {
                        cartCount.textContent = data.data.cart_count;
                    }
                } else {
                    alert(data.data.message || 'خطا در افزودن محصول به سبد خرید');
                }
            })
            .catch(error => {
                // Restore button and flag
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                isProcessing = false;
                
                console.error('Error:', error);
                alert('خطا در افزودن محصول به سبد خرید');
            });
        });
    });
});
</script>

<?php get_footer(); ?>
