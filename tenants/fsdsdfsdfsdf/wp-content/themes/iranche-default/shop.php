<?php
/**
 * The template for displaying shop pages
 *
 * @package Themee
 */

get_header(); ?>

<main class="pt-20 md:pt-40 lg:pt-[73px]">
    <div class="shop-container">
        <!-- Sidebar Filters -->
        <div class="shop-sidebar">
            <div class="mb-4 rounded-2xl bg-white border">
                <div class="flex flex-col overflow-y-auto overflow-x-hidden p-4">
                    <div>
                        <!-- title -->
                        <div class="mb-6 flex items-center justify-between">
                            <h3 class="text-zinc-700 font-semibold text-lg">
                                فیلتر ها
                            </h3>
                            <button class="py-2 text-sm text-red-400 hover:text-red-500 transition">
                                حذف همه
                            </button>
                        </div>
                        <ul class="space-y-2">
                            <!-- category -->
                            <li>
                                <details class="group border rounded-md">
                                    <summary class="flex cursor-pointer items-center justify-between rounded-lg py-4 px-2 text-zinc-700">
                                        <span class="font-semibold"> دسته بندی </span>
                                        <span class="shrink-0 transition duration-200 group-open:-rotate-90">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256"><path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path></svg>
                                        </span>
                                    </summary>
                                    <div class="mt-2 max-h-60 overflow-y-auto px-2 pb-2">
                                        <ul class="space-y-2 rounded-lg">
                                            <?php
                                            $categories = get_terms(array(
                                                'taxonomy' => 'product_cat',
                                                'hide_empty' => false,
                                                'parent' => 0
                                            ));
                                            
                                            if ($categories && !is_wp_error($categories)) {
                                                foreach ($categories as $index => $category) {
                                                    ?>
                                                    <li>
                                                        <div class="flex w-full items-center gap-x-2 pr-4 bg-gray-50 rounded-md">
                                                            <input id="c<?php echo $index + 1; ?>" type="checkbox" value="<?php echo esc_attr($category->slug); ?>" class="h-4 w-4 cursor-pointer rounded-xl border-gray-300 bg-gray-100">
                                                            <label for="c<?php echo $index + 1; ?>" class="w-full cursor-pointer py-2 pl-4 text-zinc-600">
                                                                <span><?php echo esc_html($category->name); ?></span>
                                                            </label>
                                                        </div>
                                                    </li>
                                                    <?php
                                                }
                                            }
                                            ?>
                                        </ul>
                                    </div>
                                </details>
                            </li>
                            <!-- brand -->
                            <li>
                                <details class="group border rounded-md">
                                    <summary class="flex cursor-pointer items-center justify-between rounded-lg py-4 px-2 text-zinc-700">
                                        <span class="font-semibold"> برند </span>
                                        <span class="shrink-0 transition duration-200 group-open:-rotate-90">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256"><path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path></svg>
                                        </span>
                                    </summary>
                                    <div class="mt-2 max-h-60 overflow-y-auto px-2 pb-2">
                                        <ul class="space-y-2 rounded-lg" id="brandListFilterDesktop">
                                            <li class="p-2 relative">
                                                <input id="brandListFilterDesktopSearchInput" class="w-full pr-10 rounded-lg border border-none bg-gray-100 px-7 py-3 text-zinc-600 outline-none placeholder:text-sm placeholder:text-zinc-500 focus:ring-0" placeholder="جستجوی برند ..." type="text">
                                                <svg class="absolute top-6 right-4 fill-zinc-600" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="" viewBox="0 0 256 256"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path></svg>
                                            </li>
                                            <?php
                                            $brands = get_terms(array(
                                                'taxonomy' => 'pa_brand',
                                                'hide_empty' => false
                                            ));
                                            
                                            if ($brands && !is_wp_error($brands)) {
                                                foreach ($brands as $brand) {
                                                    ?>
                                                    <li>
                                                        <div class="flex w-full items-center gap-x-2 pr-4 bg-gray-50 rounded-md">
                                                            <input id="brand-<?php echo esc_attr($brand->slug); ?>" type="checkbox" value="<?php echo esc_attr($brand->slug); ?>" class="h-4 w-4 cursor-pointer rounded-xl border-gray-300 bg-gray-100">
                                                            <label for="brand-<?php echo esc_attr($brand->slug); ?>" class="flex w-full cursor-pointer items-center justify-between py-2 pl-4 font-medium text-zinc-600">
                                                                <span><?php echo esc_html($brand->name); ?></span>
                                                                <span><?php echo esc_html($brand->slug); ?></span>
                                                            </label>
                                                        </div>
                                                    </li>
                                                    <?php
                                                }
                                            } else {
                                                ?>
                                                <li>
                                                    <div class="flex w-full items-center gap-x-2 pr-4 bg-gray-50 rounded-md">
                                                        <input id="brand-nike" type="checkbox" value="" class="h-4 w-4 cursor-pointer rounded-xl border-gray-300 bg-gray-100">
                                                        <label for="brand-nike" class="flex w-full cursor-pointer items-center justify-between py-2 pl-4 font-medium text-zinc-600">
                                                            <span>نایک</span>
                                                            <span>nike</span>
                                                        </label>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div class="flex w-full items-center gap-x-2 pr-4 bg-gray-50 rounded-md">
                                                        <input id="brand-adidas" type="checkbox" value="" class="h-4 w-4 cursor-pointer rounded-xl border-gray-300 bg-gray-100">
                                                        <label for="brand-adidas" class="flex w-full cursor-pointer items-center justify-between py-2 pl-4 font-medium text-zinc-600">
                                                            <span>آدیداس</span>
                                                            <span>adidas</span>
                                                        </label>
                                                    </div>
                                                </li>
                                                <?php
                                            }
                                            ?>
                                        </ul>
                                    </div>
                                </details>
                            </li>
                         
                            <!-- available -->
                            <li>
                                <label class="flex cursor-pointer items-center justify-between py-5 px-2" for="onlyAvailableDesktop">
                                    <div class="text-zinc-700 font-semibold">
                                        فقط کالا های موجود
                                    </div>
                                    <div class="relative inline-flex cursor-pointer items-center">
                                        <input class="peer sr-only" id="onlyAvailableDesktop" type="checkbox">
                                        <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-400 peer-checked:after:translate-x-full peer-focus:ring-blue-400"></div>
                                    </div>
                                </label>
                            </li>
                            <!-- special -->
                            <li>
                                <label class="flex cursor-pointer items-center justify-between pt-5 px-2" for="onlySpecialDesktop">
                                    <div class="text-zinc-700 font-semibold">
                                       فقط محصولات موجود در انبار
                                    </div>
                                    <div class="relative inline-flex cursor-pointer items-center">
                                        <input class="peer sr-only" id="onlySpecialDesktop" type="checkbox">
                                        <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-400 peer-checked:after:translate-x-full peer-focus:ring-blue-400"></div>
                                    </div>
                                </label>
                            </li>
                        </ul>
                        
                        <!-- Apply Filters Button -->
                        <div class="mt-6 pt-4 border-t border-gray-200">
                            <button id="applyFiltersBtn" class="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition font-medium">
                                اعمال فیلترها
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Main Content -->
        <div class="shop-main-content">
            <!-- filter -->
            <div class="bg-white border rounded-2xl grid place-items-start p-5">
                <div class="flex flex-wrap gap-5 justify-start items-center">
                    <div class="text-zinc-600 font-semibold">
                        مرتب سازی:
                    </div>
                    <?php
                    $current_orderby = isset($_GET['orderby']) ? $_GET['orderby'] : 'menu_order';
                    $sort_options = array(
                        'menu_order' => 'محبوب ترین',
                        'sales' => 'پرفروش ترین',
                        'price' => 'ارزان ترین',
                        'price-desc' => 'گران ترین',
                        'date' => 'جدیدترین',
                        'rating' => 'پربازدیدترین'
                    );
                    
                    foreach ($sort_options as $value => $label):
                        $is_active = ($current_orderby === $value);
                        $class = $is_active ? 'text-red-500' : 'text-zinc-500 hover:text-red-400';
                    ?>
                        <div class="<?php echo $class; ?> transition text-sm cursor-pointer sort-option" data-sort="<?php echo esc_attr($value); ?>">
                            <?php echo esc_html($label); ?>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
            
            <!-- products -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
                <?php
                // Get products for shop page with sorting
                $orderby = isset($_GET['orderby']) ? sanitize_text_field($_GET['orderby']) : 'menu_order';
                
                $args = array(
                    'post_type' => 'product',
                    'posts_per_page' => 12,
                    'paged' => get_query_var('paged') ? get_query_var('paged') : 1,
                );
                
                // Apply sorting
                switch ($orderby) {
                    case 'popularity':
                        $args['meta_key'] = 'total_sales';
                        $args['orderby'] = 'meta_value_num';
                        $args['order'] = 'DESC';
                        break;
                    case 'sales':
                        $args['meta_key'] = 'total_sales';
                        $args['orderby'] = 'meta_value_num';
                        $args['order'] = 'DESC';
                        break;
                    case 'price':
                        $args['meta_key'] = '_price';
                        $args['orderby'] = 'meta_value_num';
                        $args['order'] = 'ASC';
                        break;
                    case 'price-desc':
                        $args['meta_key'] = '_price';
                        $args['orderby'] = 'meta_value_num';
                        $args['order'] = 'DESC';
                        break;
                    case 'date':
                        $args['orderby'] = 'date';
                        $args['order'] = 'DESC';
                        break;
                    case 'rating':
                        $args['meta_key'] = '_wc_average_rating';
                        $args['orderby'] = 'meta_value_num';
                        $args['order'] = 'DESC';
                        break;
                    default:
                        $args['orderby'] = 'menu_order';
                        $args['order'] = 'ASC';
                        break;
                }
                
                $products = new WP_Query($args);
                
                if ($products->have_posts()): 
                    while ($products->have_posts()): $products->the_post();
                        // Use the existing product card function
                        echo themee_product_card(get_the_ID(), array(
                            'show_title' => true,
                            'show_price' => true,
                            'show_add_to_cart' => true,
                            'show_rating' => true,
                            'show_sale_badge' => true,
                            'show_wishlist' => true,
                            'show_compare' => false,
                            'image_size' => 'medium',
                            'title_length' => 2,
                            'card_class' => 'group',
                            'link_target' => '_self',
                            'custom_button_text' => '',
                            'custom_button_url' => '',
                            'custom_button_class' => '',
                        ));
                    endwhile;
                    wp_reset_postdata();
                else: ?>
                    <div class="col-span-full text-center py-8">
                        <p class="text-gray-500">هیچ محصولی یافت نشد.</p>
                    </div>
                <?php endif; ?>
            </div>
            
            <!-- Pagination -->
            <div class="mt-8">
                <ul class="flex items-center justify-center gap-x-2 md:gap-x-3 h-8 text-sm">
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
                        'prev_text' => '<svg class="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"></path></svg>',
                        'next_text' => '<svg class="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"></path></svg>',
                    );
                    
                    echo paginate_links($pagination_args);
                    ?>
                </ul>
            </div>
        </div>
    </div>
</main>

<?php get_footer(); ?>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Sort functionality
    const sortItems = document.querySelectorAll('.sort-option');
    sortItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            sortItems.forEach(i => {
                i.classList.remove('text-red-500');
                i.classList.add('text-zinc-500', 'hover:text-red-400');
            });
            
            // Add active class to clicked item
            this.classList.remove('text-zinc-500', 'hover:text-red-400');
            this.classList.add('text-red-500');
            
            // Add visual feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Apply sorting using data-sort attribute
            const sortValue = this.dataset.sort;
            applySorting(sortValue);
        });
    });
    
    // Apply Filters Button
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            // Add loading state
            this.innerHTML = '<span class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>در حال اعمال...';
            this.disabled = true;
            
            // Apply filters
            applyFilters();
            
            // Reset button after 2 seconds
            setTimeout(() => {
                this.innerHTML = 'اعمال فیلترها';
                this.disabled = false;
            }, 2000);
        });
    }
    
    // Filter functionality
    const filterInputs = document.querySelectorAll('input[type="checkbox"]');
    filterInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Add visual feedback
            this.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Update filter count
            updateFilterCount();
        });
    });
    
    // Clear all filters
    const clearAllBtn = document.querySelector('.text-red-400.hover\\:text-red-500');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', function() {
            if (confirm('آیا مطمئن هستید که می‌خواهید تمام فیلترها را پاک کنید؟')) {
                filterInputs.forEach(input => {
                    input.checked = false;
                    input.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        input.style.transform = 'scale(1)';
                    }, 100);
                });
                
                updateFilterCount();
                console.log('All filters cleared');
            }
        });
    }
    
    // Brand search functionality
    const brandSearchInput = document.getElementById('brandListFilterDesktopSearchInput');
    if (brandSearchInput) {
        brandSearchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            const brandItems = document.querySelectorAll('#brandListFilterDesktop li:not(:first-child)');
            
            brandItems.forEach(item => {
                const label = item.querySelector('label');
                const text = label.textContent.toLowerCase();
                
                if (text.includes(query)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // Details toggle animation
    const detailsElements = document.querySelectorAll('details');
    detailsElements.forEach(details => {
        details.addEventListener('toggle', function() {
            const summary = this.querySelector('summary');
            const arrow = summary.querySelector('svg');
            
            if (this.open) {
                arrow.style.transform = 'rotate(-90deg)';
            } else {
                arrow.style.transform = 'rotate(0deg)';
            }
        });
    });
    
    // Initialize filter count
    updateFilterCount();
});

// Apply filters function
function applyFilters() {
    const selectedCategories = [];
    const selectedBrands = [];
    const selectedSellerTypes = [];
    let onlyAvailable = false;
    let onlyInStock = false;
    
    // Get category filters
    const categoryInputs = document.querySelectorAll('input[id^="c"]:checked');
    categoryInputs.forEach(input => {
        selectedCategories.push(input.value);
    });
    
    // Get brand filters
    const brandInputs = document.querySelectorAll('input[id^="brand-"]:checked');
    brandInputs.forEach(input => {
        selectedBrands.push(input.value);
    });
    
    // Seller type filters removed by user
    
    // Get availability filters
    const onlyAvailableInput = document.getElementById('onlyAvailableDesktop');
    if (onlyAvailableInput) {
        onlyAvailable = onlyAvailableInput.checked;
    }
    
    const onlyInStockInput = document.getElementById('onlySpecialDesktop');
    if (onlyInStockInput) {
        onlyInStock = onlyInStockInput.checked;
    }
    
    // Build filter data
    const filterData = {
        categories: selectedCategories,
        brands: selectedBrands,
        sellerTypes: selectedSellerTypes,
        onlyAvailable: onlyAvailable,
        onlyInStock: onlyInStock
    };
    
    console.log('Applying filters:', filterData);
    
    // Show loading message
    showFilterMessage('فیلترها در حال اعمال...');
    
    // Simulate API call (replace with actual AJAX call)
    setTimeout(() => {
        // Update products based on filters
        updateProducts(filterData);
        showFilterMessage('فیلترها اعمال شد!');
    }, 1500);
}

// Apply sorting function
function applySorting(sortValue) {
    console.log('Sorting by:', sortValue);
    
    // Show loading message
    showFilterMessage('در حال مرتب‌سازی...');
    
    // Get current URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    // Set sort parameter
    urlParams.set('orderby', sortValue);
    
    // Update URL without page reload
    const newUrl = window.location.pathname + '?' + urlParams.toString();
    window.history.pushState({}, '', newUrl);
    
    // Make AJAX call to get sorted products
    fetchSortedProducts(urlParams.toString());
}

// Fetch sorted products via AJAX
function fetchSortedProducts(queryString) {
    const productGrid = document.querySelector('.grid.grid-cols-1');
    if (!productGrid) return;
    
    // Add loading state
    productGrid.style.opacity = '0.5';
    productGrid.style.pointerEvents = 'none';
    
    // Create loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'col-span-full text-center py-8';
    loadingDiv.innerHTML = '<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div><p class="mt-2 text-gray-500">در حال بارگذاری...</p>';
    
    // Clear current products and show loading
    productGrid.innerHTML = '';
    productGrid.appendChild(loadingDiv);
    
    // Make AJAX request
    fetch(window.location.pathname + '?' + queryString, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    })
    .then(response => response.text())
    .then(data => {
        // Parse the response to extract product grid
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const newProductGrid = doc.querySelector('.grid.grid-cols-1');
        
        if (newProductGrid) {
            // Replace current products with new ones
            productGrid.innerHTML = newProductGrid.innerHTML;
            
            // Re-initialize product card interactions
            initializeProductCards();
            
            showFilterMessage('مرتب‌سازی اعمال شد!');
        } else {
            throw new Error('No products found');
        }
    })
    .catch(error => {
        console.error('Error fetching products:', error);
        productGrid.innerHTML = '<div class="col-span-full text-center py-8"><p class="text-red-500">خطا در بارگذاری محصولات</p></div>';
        showFilterMessage('خطا در مرتب‌سازی!');
    })
    .finally(() => {
        // Remove loading state
        productGrid.style.opacity = '1';
        productGrid.style.pointerEvents = 'auto';
    });
}

// Initialize product card interactions
function initializeProductCards() {
    // Re-attach event listeners to new product cards
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.dataset.productId;
            addToCart(productId);
        });
    });
    
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.dataset.productId;
            toggleWishlist(productId);
        });
    });
}

// Update products function
function updateProducts(filters) {
    // This would normally make an AJAX call to get filtered products
    // For now, we'll just simulate the update
    
    const productGrid = document.querySelector('.grid.grid-cols-1');
    if (productGrid) {
        // Add loading class
        productGrid.style.opacity = '0.5';
        productGrid.style.pointerEvents = 'none';
        
        setTimeout(() => {
            productGrid.style.opacity = '1';
            productGrid.style.pointerEvents = 'auto';
        }, 500);
    }
}

// Update filter count
function updateFilterCount() {
    const checkedInputs = document.querySelectorAll('input[type="checkbox"]:checked');
    const applyBtn = document.getElementById('applyFiltersBtn');
    
    if (applyBtn) {
        if (checkedInputs.length > 0) {
            applyBtn.textContent = `اعمال فیلترها (${checkedInputs.length})`;
            applyBtn.classList.add('bg-blue-600');
        } else {
            applyBtn.textContent = 'اعمال فیلترها';
            applyBtn.classList.remove('bg-blue-600');
        }
    }
}

// Show filter message
function showFilterMessage(message) {
    // Remove existing message
    const existingMessage = document.querySelector('.filter-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = 'filter-message fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300';
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 3000);
}
</script>
