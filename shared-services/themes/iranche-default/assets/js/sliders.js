// Hero Slider - Support both MetaSlider and custom fallback
document.addEventListener('DOMContentLoaded', function() {
  const heroSlider = document.querySelector('.heroSlider');
  
  if (heroSlider) {
    // Check if it's a MetaSlider
    if (heroSlider.classList.contains('metaslider')) {
      // MetaSlider will handle its own functionality
      console.log('MetaSlider detected - using built-in functionality');
      
      // Ensure MetaSlider has proper height
      heroSlider.style.height = '400px';
      
      // Add responsive height for mobile
      if (window.innerWidth <= 768) {
        heroSlider.style.height = '250px';
      }
      
      // Force MetaSlider to work as a custom slider
      const slides = heroSlider.querySelectorAll('.slide');
      let currentSlide = 0;
      let autoSlideInterval;
      
      if (slides.length > 1) {
        console.log('Found ' + slides.length + ' slides in MetaSlider');
        
        // Show first slide
        slides[0].classList.add('active');
        
        // Add navigation buttons
        const navButtons = `
          <button class="nav-buttons nav-prev" onclick="previousSlide()" aria-label="Previous slide"></button>
          <button class="nav-buttons nav-next" onclick="nextSlide()" aria-label="Next slide"></button>
        `;
        heroSlider.insertAdjacentHTML('beforeend', navButtons);
        
        // Auto-advance slides
        autoSlideInterval = setInterval(function() {
          nextSlide();
        }, 5000);
        
        // Pause auto-slide on hover
        heroSlider.addEventListener('mouseenter', function() {
          clearInterval(autoSlideInterval);
        });
        
        // Resume auto-slide on mouse leave
        heroSlider.addEventListener('mouseleave', function() {
          autoSlideInterval = setInterval(function() {
            nextSlide();
          }, 5000);
        });
        
      } else if (slides.length === 1) {
        // Single slide
        slides[0].classList.add('active');
        console.log('Only one slide found');
      } else {
        console.log('No slides found in MetaSlider');
      }
      
      // Global functions for navigation
      window.nextSlide = function() {
        if (slides.length > 1) {
          slides[currentSlide].classList.remove('active');
          currentSlide = (currentSlide + 1) % slides.length;
          slides[currentSlide].classList.add('active');
          console.log('Switched to slide ' + (currentSlide + 1));
        }
      };
      
      window.previousSlide = function() {
        if (slides.length > 1) {
          slides[currentSlide].classList.remove('active');
          currentSlide = (currentSlide - 1 + slides.length) % slides.length;
          slides[currentSlide].classList.add('active');
          console.log('Switched to slide ' + (currentSlide + 1));
        }
      };
    } else {
      // Custom fallback slider functionality
      console.log('Custom slider detected - using fallback functionality');
      const slides = heroSlider.querySelectorAll('.slide');
      let currentSlide = 0;
      
      if (slides.length > 1) {
        // Show first slide
        slides[0].classList.add('active');
        
        // Auto-advance slides
        setInterval(function() {
          slides[currentSlide].classList.remove('active');
          currentSlide = (currentSlide + 1) % slides.length;
          slides[currentSlide].classList.add('active');
        }, 5000);
      } else if (slides.length === 1) {
        // Single slide
        slides[0].classList.add('active');
      }
    }
  }
  
  // Initialize other Swiper sliders after DOM is loaded
  if (typeof Swiper !== 'undefined') {
    initSwiperSliders();
    initCategorySliders();
  } else {
    // Wait for Swiper to load
    setTimeout(function() {
      if (typeof Swiper !== 'undefined') {
        initSwiperSliders();
        initCategorySliders();
      }
    }, 100);
  }
});

function initSwiperSliders() {
  // Check if site is RTL
  const isRTL = document.documentElement.dir === 'rtl' || document.documentElement.getAttribute('dir') === 'rtl';
  
  // Product slider
  if (document.querySelector(".product-slider1")) {
    var swiper = new Swiper(".product-slider1", {
      slidesPerView: 4,
      spaceBetween: 16,
      sliderPerGroup: 4,
      loop: false,
      centerSlide: "true",
      fade: "true",
      grabCursor: "true",
      rtl: isRTL,
      breakpoints: {
        0: {
          slidesPerView: 1.3,
          spaceBetween: 4,
        },
        400: {
          slidesPerView: 1.4,
          spaceBetween: 6,
        },
        600: {
          slidesPerView: 2.2,
          spaceBetween: 8,
        },
        900: {
          slidesPerView: 3.2,
          spaceBetween: 16,
        },
        1060: {
          slidesPerView: 4,
          spaceBetween: 16,
        },
        1200: {
          slidesPerView: 4.6,
          spaceBetween: 16,
        },
      },
    });
  }
  
  // Off slider
  if (document.querySelector(".offSlider")) {
    var swiper = new Swiper(".offSlider", {
      autoplay: true,
      autoplayTimeout: 1000,
      spaceBetween: 16,
      loop: true,
      fade: "true",
    });
  }
  
  // Blog slider
  if (document.querySelector(".blog-slider")) {
    var swiper = new Swiper(".blog-slider", {
      slidesPerView: 4,
      spaceBetween: 16,
      sliderPerGroup: 4,
      loop: false,
      centerSlide: "true",
      fade: "true",
      grabCursor: "true",
      rtl: true,
      breakpoints: {
        0: {
          slidesPerView: 1.3,
          spaceBetween: 4,
        },
        400: {
          slidesPerView: 1.4,
          spaceBetween: 6,
        },
        600: {
          slidesPerView: 2.2,
          spaceBetween: 8,
        },
        900: {
          slidesPerView: 3.2,
          spaceBetween: 16,
        },
        1060: {
          slidesPerView: 4,
          spaceBetween: 16,
        },
        1200: {
          slidesPerView: 3.8,
          spaceBetween: 16,
        },
      },
    });
  }
  
  // Partner company slider
  if (document.querySelector(".partnerCompany")) {
    var swiper = new Swiper(".partnerCompany", {
      slidesPerView: 4,
      spaceBetween: 16,
      sliderPerGroup: 4,
      loop: false,
      centerSlide: "true",
      fade: "true",
      grabCursor: "true",
      rtl: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: ".swiper-btn-prev",
        prevEl: ".swiper-btn-next",
      },
      breakpoints: {
        0: {
          slidesPerView: 3.1,
          spaceBetween: 4,
        },
        400: {
          slidesPerView: 4.5,
          spaceBetween: 6,
        },
        600: {
          slidesPerView: 5.7,
          spaceBetween: 8,
        },
        900: {
          slidesPerView: 6.6,
          spaceBetween: 16,
        },
        1060: {
          slidesPerView: 8.2,
          spaceBetween: 16,
        },
        1200: {
          slidesPerView: 9.7,
          spaceBetween: 10,
        },
      },
    });
  }
}

function initCategorySliders() {
  // Check if site is RTL
  const isRTL = document.documentElement.dir === 'rtl' || document.documentElement.getAttribute('dir') === 'rtl';
  
  // Initialize all category product sliders
  const categorySliders = document.querySelectorAll('.category-products-slider');
  
  categorySliders.forEach(function(slider) {
    if (slider.querySelector('.swiper-wrapper')) {
      new Swiper(slider, {
        slidesPerView: 4,
        spaceBetween: 16,
        sliderPerGroup: 4,
        loop: false,
        centerSlide: "true",
        fade: "true",
        grabCursor: "true",
        rtl: isRTL,
        breakpoints: {
          0: {
            slidesPerView: 1.3,
            spaceBetween: 4,
          },
          400: {
            slidesPerView: 1.4,
            spaceBetween: 6,
          },
          600: {
            slidesPerView: 2.2,
            spaceBetween: 8,
          },
          900: {
            slidesPerView: 3.2,
            spaceBetween: 16,
          },
          1060: {
            slidesPerView: 4,
            spaceBetween: 16,
          },
          1200: {
            slidesPerView: 4.6,
            spaceBetween: 16,
          },
        },
      });
    }
  });
}