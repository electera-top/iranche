/**
 * Star Rating JavaScript
 * Handles interactive star rating functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize star rating
    initStarRating();
});

function initStarRating() {
    const starRatings = document.querySelectorAll('.star-rating');
    
    starRatings.forEach(function(rating) {
        const stars = rating.querySelectorAll('label');
        const inputs = rating.querySelectorAll('input[type="radio"]');
        
        // Add hover effects
        stars.forEach(function(star, index) {
            star.addEventListener('mouseenter', function() {
                highlightStars(stars, index);
            });
            
            star.addEventListener('click', function() {
                const input = rating.querySelector(`input[value="${index + 1}"]`);
                if (input) {
                    input.checked = true;
                    highlightStars(stars, index);
                }
            });
        });
        
        // Reset on mouse leave
        rating.addEventListener('mouseleave', function() {
            const checkedInput = rating.querySelector('input:checked');
            if (checkedInput) {
                const value = parseInt(checkedInput.value);
                highlightStars(stars, value - 1);
            } else {
                resetStars(stars);
            }
        });
    });
}

function highlightStars(stars, index) {
    stars.forEach(function(star, i) {
        if (i <= index) {
            star.style.color = '#fbbf24';
            star.style.setProperty('color', '#fbbf24', 'important');
        } else {
            star.style.color = '#d1d5db';
            star.style.setProperty('color', '#d1d5db', 'important');
        }
    });
}

function resetStars(stars) {
    stars.forEach(function(star) {
        star.style.color = '#d1d5db';
        star.style.setProperty('color', '#d1d5db', 'important');
    });
}

// Form validation for star rating
function validateStarRating() {
    const starInputs = document.querySelectorAll('input[name="rating"]');
    let isSelected = false;
    
    starInputs.forEach(function(input) {
        if (input.checked) {
            isSelected = true;
        }
    });
    
    if (!isSelected) {
        alert('لطفاً امتیاز خود را انتخاب کنید');
        return false;
    }
    
    return true;
}

// Add validation to comment form
document.addEventListener('DOMContentLoaded', function() {
    const commentForm = document.querySelector('#commentform');
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            if (!validateStarRating()) {
                e.preventDefault();
            }
        });
    }
});
