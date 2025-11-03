// Product Image Gallery Functions
function showImagesProduct() {
    document.getElementById('showImagesModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeImagesProduct() {
    document.getElementById('showImagesModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Image Gallery Slider Functions
let slideIndex = 1;

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("demo");
    
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" opacity-100", "");
    }
    
    if (slides[slideIndex-1]) {
        slides[slideIndex-1].style.display = "block";
    }
    
    if (dots[slideIndex-1]) {
        dots[slideIndex-1].className += " opacity-100";
    }
}

// Initialize gallery when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Show first slide by default
    showSlides(1);
    
    // Close modal when clicking outside
    document.getElementById('showImagesModal')?.addEventListener('click', function(e) {
        if (e.target === this) {
            closeImagesProduct();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeImagesProduct();
        }
    });
});

// Cart functionality
function updateCartItemQuantity(cartItemKey, newQuantity) {
    if (newQuantity < 1) {
        removeCartItem(cartItemKey);
        return;
    }
    
    // AJAX call to update cart
    fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: 'update_cart_item',
            cart_item_key: cartItemKey,
            quantity: newQuantity,
            nonce: '<?php echo wp_create_nonce('update_cart_nonce'); ?>'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update cart totals
            updateCartTotals(data.data);
        } else {
            alert('خطا در به‌روزرسانی سبد خرید');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('خطا در به‌روزرسانی سبد خرید');
    });
}

function removeCartItem(cartItemKey) {
    // AJAX call to remove cart item
    fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: 'remove_cart_item',
            cart_item_key: cartItemKey,
            nonce: '<?php echo wp_create_nonce('remove_cart_nonce'); ?>'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Reload page or update cart display
            location.reload();
        } else {
            alert('خطا در حذف محصول از سبد خرید');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('خطا در حذف محصول از سبد خرید');
    });
}

function updateCartTotals(cartData) {
    // Update cart totals display
    const cartTotalElement = document.querySelector('.cart-total');
    if (cartTotalElement && cartData.total) {
        cartTotalElement.textContent = cartData.total;
    }
    
    // Update cart count
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement && cartData.item_count) {
        cartCountElement.textContent = cartData.item_count;
    }
}

// Setup cart event listeners
function setupCartEventListeners() {
    // Quantity increment buttons
    document.querySelectorAll('[data-action="increment"]').forEach(button => {
        button.addEventListener('click', function() {
            const cartItemKey = this.closest('.cart-item').dataset.cartItemKey;
            const quantityInput = this.parentElement.querySelector('input[type="number"]');
            const currentQuantity = parseInt(quantityInput.value);
            updateCartItemQuantity(cartItemKey, currentQuantity + 1);
        });
    });
    
    // Quantity decrement buttons
    document.querySelectorAll('[data-action="decrement"]').forEach(button => {
        button.addEventListener('click', function() {
            const cartItemKey = this.closest('.cart-item').dataset.cartItemKey;
            const quantityInput = this.parentElement.querySelector('input[type="number"]');
            const currentQuantity = parseInt(quantityInput.value);
            updateCartItemQuantity(cartItemKey, currentQuantity - 1);
        });
    });
    
    // Remove item buttons
    document.querySelectorAll('.cart-remove-btn').forEach(button => {
        button.addEventListener('click', function() {
            const cartItemKey = this.closest('.cart-item').dataset.cartItemKey;
            if (confirm('آیا مطمئن هستید که می‌خواهید این محصول را از سبد خرید حذف کنید؟')) {
                removeCartItem(cartItemKey);
            }
        });
    });
}

// Initialize cart functionality when page loads
document.addEventListener('DOMContentLoaded', function() {
    setupCartEventListeners();
});
