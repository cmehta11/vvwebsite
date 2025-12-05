/**
 * VERTVISTA ECO SOLUTIONS - Main JavaScript
 * All interactive features and animations
 */

// ==========================================
// 1. MOBILE NAVIGATION TOGGLE
// ==========================================

const navToggle = document.getElementById('navToggle') || document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    });

    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    });
}

// ==========================================
// 2. NAVBAR SCROLL EFFECT
// ==========================================

const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add scrolled class for shadow effect
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ==========================================
// 3. SMOOTH SCROLLING FOR ANCHOR LINKS
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Ignore empty hash or just '#'
        if (href === '#' || href === '') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const navHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// 4. STATS COUNTER ANIMATION
// ==========================================

const counters = document.querySelectorAll('.stat-number');

const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 100;
    const duration = 2000; // 2 seconds
    const stepTime = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
            entry.target.classList.add('counted');
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => {
    counterObserver.observe(counter);
});

// ==========================================
// 5. BACK TO TOP BUTTON
// ==========================================

const backToTop = document.getElementById('backToTop');

if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==========================================
// 6. GALLERY FILTERING
// ==========================================

const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

if (filterButtons.length > 0 && galleryItems.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter items with animation
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ==========================================
// 7. LIGHTBOX FOR IMAGES
// ==========================================

const createLightbox = () => {
    // Create lightbox HTML
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close" aria-label="Close">&times;</button>
            <button class="lightbox-prev" aria-label="Previous">&lt;</button>
            <button class="lightbox-next" aria-label="Next">&gt;</button>
            <img src="" alt="">
            <div class="lightbox-caption"></div>
        </div>
    `;
    document.body.appendChild(lightbox);
    
    return lightbox;
};

const initLightbox = () => {
    const galleryImages = document.querySelectorAll('.gallery-item img');
    
    if (galleryImages.length === 0) return;
    
    const lightbox = createLightbox();
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    let currentIndex = 0;
    let images = [];
    
    const showImage = (index) => {
        lightboxImg.src = images[index].src;
        lightboxCaption.textContent = images[index].alt;
        currentIndex = index;
    };
    
    const openLightbox = (index) => {
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        showImage(index);
    };
    
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    const showNext = () => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    };
    
    const showPrev = () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    };
    
    // Add click handlers to gallery images
    galleryImages.forEach((img, index) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            images = Array.from(galleryImages);
            openLightbox(index);
        });
    });
    
    // Lightbox controls
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });
};

// Initialize lightbox if gallery exists
if (document.querySelector('.gallery-item')) {
    initLightbox();
}

// ==========================================
// 8. FORM VALIDATION
// ==========================================

const forms = document.querySelectorAll('form');

forms.forEach(form => {
    const inputs = form.querySelectorAll('input, textarea, select');
    
    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('invalid')) {
                validateField(input);
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            // Form is valid - submit or show success message
            showFormMessage(form, 'success', 'Thank you! We will contact you soon.');
            form.reset();
            
            // In production, you would submit the form here
            // form.submit() or use AJAX
        }
    });
});

const validateField = (field) => {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    // Remove previous error
    removeFieldError(field);
    
    // Check if required and empty
    if (required && value === '') {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation (basic)
    if (type === 'tel' && value !== '') {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            showFieldError(field, 'Please enter a valid 10-digit phone number');
            return false;
        }
    }
    
    // Mark as valid
    field.classList.remove('invalid');
    field.classList.add('valid');
    return true;
};

const showFieldError = (field, message) => {
    field.classList.add('invalid');
    field.classList.remove('valid');
    
    let errorDiv = field.parentElement.querySelector('.field-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        field.parentElement.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
};

const removeFieldError = (field) => {
    const errorDiv = field.parentElement.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
};

const showFormMessage = (form, type, message) => {
    let messageDiv = form.querySelector('.form-message');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.className = 'form-message';
        form.insertBefore(messageDiv, form.firstChild);
    }
    
    messageDiv.textContent = message;
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.display = 'block';
    
    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Hide after 5 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
};

// ==========================================
// 9. TESTIMONIALS SLIDER
// ==========================================

const initTestimonialsSlider = () => {
    const slider = document.querySelector('.testimonials-slider');
    if (!slider) return;
    
    const cards = slider.querySelectorAll('.testimonial-card');
    if (cards.length === 0) return;
    
    let currentSlide = 0;
    const slideCount = cards.length;
    
    // Create navigation dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'slider-dots';
    
    for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement('button');
        dot.className = 'slider-dot';
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    
    slider.parentElement.appendChild(dotsContainer);
    
    const goToSlide = (index) => {
        currentSlide = index;
        updateSlider();
    };
    
    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % slideCount;
        updateSlider();
    };
    
    const updateSlider = () => {
        // Hide all cards
        cards.forEach(card => {
            card.style.display = 'none';
            card.style.opacity = '0';
        });
        
        // Show current card
        cards[currentSlide].style.display = 'block';
        setTimeout(() => {
            cards[currentSlide].style.opacity = '1';
        }, 10);
        
        // Update dots
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    };
    
    // Auto-rotate every 5 seconds
    let autoRotate = setInterval(nextSlide, 5000);
    
    // Pause on hover
    slider.addEventListener('mouseenter', () => {
        clearInterval(autoRotate);
    });
    
    slider.addEventListener('mouseleave', () => {
        autoRotate = setInterval(nextSlide, 5000);
    });
    
    // Initialize
    updateSlider();
};

// Initialize testimonials slider
initTestimonialsSlider();

// ==========================================
// 10. FAQ ACCORDION
// ==========================================

const initAccordion = () => {
    const accordionButtons = document.querySelectorAll('.accordion-button, .faq-question');
    
    accordionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const accordionItem = button.parentElement;
            const accordionContent = accordionItem.querySelector('.accordion-content, .faq-answer');
            const isActive = accordionItem.classList.contains('active');
            
            // Close all accordions (optional - remove to allow multiple open)
            document.querySelectorAll('.accordion-item, .faq-item').forEach(item => {
                item.classList.remove('active');
                const content = item.querySelector('.accordion-content, .faq-answer');
                if (content) content.style.maxHeight = null;
            });
            
            // Toggle current accordion
            if (!isActive && accordionContent) {
                accordionItem.classList.add('active');
                accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
            }
        });
    });
};

// Initialize accordion if FAQ exists
if (document.querySelector('.accordion-item, .faq-item')) {
    initAccordion();
}

// ==========================================
// 11. LOADING ANIMATIONS (Fade in on scroll)
// ==========================================

const fadeInElements = document.querySelectorAll('.fade-in, .animate-fade-in');

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            fadeInObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

fadeInElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(element);
});

// ==========================================
// 12. NEWSLETTER FORM
// ==========================================

const newsletterForms = document.querySelectorAll('.newsletter-form');

newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'newsletter-success';
            successMsg.textContent = 'Thank you for subscribing!';
            successMsg.style.color = '#CCFF00';
            successMsg.style.marginTop = '10px';
            successMsg.style.fontSize = '14px';
            
            form.appendChild(successMsg);
            emailInput.value = '';
            
            // Remove success message after 3 seconds
            setTimeout(() => {
                successMsg.remove();
            }, 3000);
            
            // In production, send email to backend
            console.log('Newsletter subscription:', email);
        }
    });
});

// ==========================================
// 13. ACTIVE NAV LINK ON SCROLL
// ==========================================

const sections = document.querySelectorAll('section[id]');

const highlightNav = () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
};

window.addEventListener('scroll', highlightNav);

// ==========================================
// 14. COOKIE CONSENT (Optional)
// ==========================================

const initCookieConsent = () => {
    // Check if user has already accepted
    if (localStorage.getItem('cookieConsent') === 'accepted') return;
    
    // Create cookie banner
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `
        <div class="cookie-content">
            <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
            <div class="cookie-buttons">
                <button class="btn-primary" id="acceptCookies">Accept</button>
                <button class="btn-secondary" id="declineCookies">Decline</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(banner);
    
    // Accept cookies
    document.getElementById('acceptCookies').addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        banner.remove();
    });
    
    // Decline cookies
    document.getElementById('declineCookies').addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        banner.remove();
    });
};

// Uncomment to enable cookie consent
// initCookieConsent();

// ==========================================
// 15. LAZY LOADING IMAGES
// ==========================================

const lazyImages = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// ==========================================
// INITIALIZATION COMPLETE
// ==========================================

console.log('Vertvista website initialized successfully!');
console.log('Breathe • Grow • Thrive 🌿');