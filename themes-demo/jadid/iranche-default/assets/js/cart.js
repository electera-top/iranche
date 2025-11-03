// Cart functionality for WooCommerce
document.addEventListener('DOMContentLoaded', function() {
  // Cart quantity controls
  const quantityControls = document.querySelectorAll('.cart-quantity-controls');
  
  // Find all quantity control containers
  const quantityContainers = document.querySelectorAll('.flex.h-10.w-24');
  
  quantityContainers.forEach(container => {
    const forms = container.querySelectorAll('form');
    const quantityInput = container.querySelector('input[type="number"]');
    
    if (forms.length >= 2 && quantityInput) {
      // First form is decrement button
      const decrementForm = forms[0];
      const decrementBtn = decrementForm.querySelector('button[type="submit"]');
      
      // Second form is increment button  
      const incrementForm = forms[1];
      const incrementBtn = incrementForm.querySelector('button[type="submit"]');
      
      if (decrementBtn && incrementBtn) {
        // Get cart item key from the first form
        const cartItemKey = decrementForm.querySelector('input[name="cart_item_key"]').value;
        console.log('Found quantity controls for cart item:', cartItemKey);
        
        decrementBtn.addEventListener('click', function(e) {
          e.preventDefault();
          console.log('Decrement button clicked');
          const currentQuantity = parseInt(quantityInput.value);
          console.log('Current quantity:', currentQuantity);
          if (currentQuantity > 1) {
            updateCartQuantity(cartItemKey, currentQuantity - 1);
          } else {
            removeFromCart(cartItemKey);
          }
        });
        
        incrementBtn.addEventListener('click', function(e) {
          e.preventDefault();
          console.log('Increment button clicked');
          const currentQuantity = parseInt(quantityInput.value);
          console.log('Current quantity:', currentQuantity);
          updateCartQuantity(cartItemKey, currentQuantity + 1);
        });
      }
    }
  });
  
  // Cart remove buttons
  const removeButtons = document.querySelectorAll('button[name="remove_item"]');
  
  removeButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const form = this.closest('form');
      const cartItemKey = form.querySelector('input[name="cart_item_key"]').value;
      removeFromCart(cartItemKey);
    });
  });
  
  // Update cart button
  const updateCartBtn = document.querySelector('button[name="update_cart"]');
  if (updateCartBtn) {
    updateCartBtn.addEventListener('click', function(e) {
      e.preventDefault();
      // Show loading state
      this.textContent = 'در حال بروزرسانی...';
      this.disabled = true;
      
      // Submit the form
      const form = this.closest('form');
      if (form) {
        form.submit();
      }
    });
  }
  
  // Add to cart buttons
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Show loading state
      const originalText = this.textContent;
      this.textContent = 'در حال افزودن...';
      this.disabled = true;
      
      // Get product URL
      const productUrl = this.getAttribute('href');
      
      // Redirect to product page or handle AJAX
      if (productUrl) {
        window.location.href = productUrl;
      }
      
      // Reset button after delay
      setTimeout(() => {
        this.textContent = originalText;
        this.disabled = false;
      }, 2000);
    });
  });
  
  // Cart item quantity update
  const quantityInputs = document.querySelectorAll('.cart-quantity-controls input[type="number"]');
  
  quantityInputs.forEach(input => {
    input.addEventListener('change', function() {
      const form = this.closest('form');
      if (form) {
        form.submit();
      }
    });
  });
  
  // Cart summary update
  function updateCartSummary() {
    // This would typically be handled by WooCommerce AJAX
    // For now, we'll just refresh the page
    location.reload();
  }
  
  // Handle cart updates
  const cartForms = document.querySelectorAll('form[action*="cart"]');
  
  cartForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'در حال بروزرسانی...';
        submitBtn.disabled = true;
      }
    });
  });
});

// Utility functions for cart
function addToCart(productId, quantity = 1) {
  // This would typically use WooCommerce AJAX
  // For now, redirect to product page
  window.location.href = `?add-to-cart=${productId}&quantity=${quantity}`;
}

function removeFromCart(cartItemKey) {
  if (confirm('آیا مطمئن هستید که می‌خواهید این محصول را از سبد خرید حذف کنید؟')) {
    // Show loading state
    const removeBtn = document.querySelector(`button[name="remove_item"]`);
    if (removeBtn) {
      removeBtn.disabled = true;
      removeBtn.innerHTML = '<svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
    }
    
    // AJAX request
    fetch(ajax_object.ajax_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        action: 'themee_update_cart',
        action_type: 'remove',
        cart_item_key: cartItemKey
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Reload page to update cart
        location.reload();
      } else {
        alert('خطا در حذف محصول: ' + data.data.message);
        // Reset button
        if (removeBtn) {
          removeBtn.disabled = false;
          removeBtn.innerHTML = '<svg class="fill-red-500 size-8 lg:size-7" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>';
        }
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('خطا در ارتباط با سرور');
      // Reset button
      if (removeBtn) {
        removeBtn.disabled = false;
        removeBtn.innerHTML = '<svg class="fill-red-500 size-8 lg:size-7" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>';
      }
    });
  }
}

function updateCartQuantity(cartItemKey, quantity) {
  // Show loading state
  const container = document.querySelector(`input[name="cart_item_key"][value="${cartItemKey}"]`).closest('.flex.h-10.w-24');
  const quantityInput = container.querySelector('input[type="number"]');
  const buttons = container.querySelectorAll('button[type="submit"]');
  
  if (quantityInput) {
    quantityInput.disabled = true;
  }
  
  // Disable buttons
  buttons.forEach(btn => {
    btn.disabled = true;
    btn.style.opacity = '0.5';
  });
  
  // AJAX request
  fetch(ajax_object.ajax_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      action: 'themee_update_cart',
      action_type: 'update_quantity',
      cart_item_key: cartItemKey,
      quantity: quantity
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Update quantity display
      if (quantityInput) {
        quantityInput.value = quantity;
        quantityInput.disabled = false;
      }
      // Reload page to update totals
      location.reload();
    } else {
      alert('خطا در به‌روزرسانی تعداد: ' + data.data.message);
      // Reset input and buttons
      if (quantityInput) {
        quantityInput.disabled = false;
      }
      buttons.forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
      });
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('خطا در ارتباط با سرور');
    // Reset input and buttons
    if (quantityInput) {
      quantityInput.disabled = false;
    }
    buttons.forEach(btn => {
      btn.disabled = false;
      btn.style.opacity = '1';
    });
  });
}
