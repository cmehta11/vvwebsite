/**
 * Vertvista Website Enhancements
 * Features: AOS Animations, Lightbox, Lazy Loading, Dark Mode, WhatsApp Widget, 
 * Newsletter, Page Loader, Smooth Scrolling
 */

// ==========================================
// 1. PAGE LOADER
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Hide loader after page loads
    const loader = document.getElementById('page-loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('loader-hidden');
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 500);
    }
});

// ==========================================
// 2. AOS (Animate On Scroll) - Custom Implementation
// ==========================================
const AOSCustom = {
    elements: [],
    
    init: function() {
        this.elements = document.querySelectorAll('[data-aos]');
        this.checkElements();
        window.addEventListener('scroll', this.throttle(this.checkElements.bind(this), 100));
        window.addEventListener('resize', this.throttle(this.checkElements.bind(this), 100));
    },
    
    checkElements: function() {
        this.elements.forEach(el => {
            if (this.isInViewport(el)) {
                const delay = el.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    el.classList.add('aos-animate');
                }, delay);
            }
        });
    },
    
    isInViewport: function(el) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        return rect.top <= windowHeight * 0.85;
    },
    
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            if (!inThrottle) {
                func.apply(this, arguments);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// ==========================================
// 3. LIGHTBOX GALLERY
// ==========================================
const Lightbox = {
    overlay: null,
    content: null,
    currentIndex: 0,
    images: [],
    
    init: function() {
        this.createLightbox();
        this.bindEvents();
    },
    
    createLightbox: function() {
        // Create lightbox HTML
        const lightboxHTML = `
            <div id="lightbox-overlay" class="lightbox-overlay">
                <div class="lightbox-container">
                    <button class="lightbox-close" aria-label="Close">&times;</button>
                    <button class="lightbox-prev" aria-label="Previous">&#10094;</button>
                    <button class="lightbox-next" aria-label="Next">&#10095;</button>
                    <div class="lightbox-content">
                        <img src="" alt="" class="lightbox-image">
                        <div class="lightbox-caption"></div>
                    </div>
                    <div class="lightbox-counter"></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        this.overlay = document.getElementById('lightbox-overlay');
        this.content = this.overlay.querySelector('.lightbox-image');
    },
    
    bindEvents: function() {
        // Click on gallery images
        document.querySelectorAll('[data-lightbox]').forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', (e) => {
                e.preventDefault();
                this.images = Array.from(document.querySelectorAll('[data-lightbox]'));
                this.currentIndex = this.images.indexOf(img);
                this.open(img.src || img.href, img.alt || img.getAttribute('data-caption'));
            });
        });
        
        // Close button
        this.overlay.querySelector('.lightbox-close').addEventListener('click', () => this.close());
        
        // Click outside to close
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });
        
        // Navigation
        this.overlay.querySelector('.lightbox-prev').addEventListener('click', () => this.prev());
        this.overlay.querySelector('.lightbox-next').addEventListener('click', () => this.next());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.overlay.classList.contains('active')) return;
            if (e.key === 'Escape') this.close();
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
    },
    
    open: function(src, caption) {
        this.content.src = src;
        this.overlay.querySelector('.lightbox-caption').textContent = caption || '';
        this.updateCounter();
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    },
    
    close: function() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    },
    
    prev: function() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        const img = this.images[this.currentIndex];
        this.content.src = img.src || img.href;
        this.overlay.querySelector('.lightbox-caption').textContent = img.alt || img.getAttribute('data-caption') || '';
        this.updateCounter();
    },
    
    next: function() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        const img = this.images[this.currentIndex];
        this.content.src = img.src || img.href;
        this.overlay.querySelector('.lightbox-caption').textContent = img.alt || img.getAttribute('data-caption') || '';
        this.updateCounter();
    },
    
    updateCounter: function() {
        if (this.images.length > 1) {
            this.overlay.querySelector('.lightbox-counter').textContent = 
                `${this.currentIndex + 1} / ${this.images.length}`;
        }
    }
};

// ==========================================
// 4. LAZY LOADING IMAGES
// ==========================================
const LazyLoad = {
    init: function() {
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src]');
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('lazy-loaded');
                        observer.unobserve(img);
                    }
                });
            }, { rootMargin: '50px 0px' });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }
};

// ==========================================
// 5. DARK MODE TOGGLE
// ==========================================
const DarkMode = {
    init: function() {
        this.createToggle();
        this.loadPreference();
        this.bindEvents();
    },
    
    createToggle: function() {
        const toggleHTML = `
            <button id="dark-mode-toggle" class="dark-mode-toggle" aria-label="Toggle dark mode" title="Toggle Dark Mode">
                <i class="fas fa-moon"></i>
                <i class="fas fa-sun"></i>
            </button>
        `;
        document.body.insertAdjacentHTML('beforeend', toggleHTML);
    },
    
    loadPreference: function() {
        const darkMode = localStorage.getItem('darkMode');
        if (darkMode === 'enabled') {
            document.body.classList.add('dark-mode');
        }
    },
    
    bindEvents: function() {
        const toggle = document.getElementById('dark-mode-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                if (document.body.classList.contains('dark-mode')) {
                    localStorage.setItem('darkMode', 'enabled');
                } else {
                    localStorage.setItem('darkMode', 'disabled');
                }
            });
        }
    }
};

// ==========================================
// 6. WHATSAPP CHAT WIDGET
// ==========================================
const WhatsAppWidget = {
    phoneNumber: '917045251178', // Vertvista phone number
    message: 'Hi! I\'m interested in learning more about Vertvista\'s biophilic design services.',
    
    init: function() {
        this.createWidget();
        this.bindEvents();
    },
    
    createWidget: function() {
        const widgetHTML = `
            <div id="whatsapp-widget" class="whatsapp-widget">
                <div class="whatsapp-popup" id="whatsapp-popup">
                    <div class="whatsapp-popup-header">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" class="whatsapp-icon">
                        <div class="whatsapp-popup-title">
                            <strong>Vertvista Support</strong>
                            <span>Typically replies within minutes</span>
                        </div>
                        <button class="whatsapp-popup-close">&times;</button>
                    </div>
                    <div class="whatsapp-popup-body">
                        <div class="whatsapp-message">
                            <p>👋 Hello! How can we help you today?</p>
                            <p>Ask us about:</p>
                            <ul>
                                <li>Indoor plants & maintenance</li>
                                <li>Green wall systems</li>
                                <li>Biophilic design consultation</li>
                                <li>Free site assessment</li>
                            </ul>
                        </div>
                    </div>
                    <div class="whatsapp-popup-footer">
                        <a href="https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(this.message)}" 
                           target="_blank" class="whatsapp-chat-btn">
                            <i class="fab fa-whatsapp"></i> Start Chat
                        </a>
                    </div>
                </div>
                <button class="whatsapp-btn" id="whatsapp-btn" aria-label="Chat on WhatsApp">
                    <i class="fab fa-whatsapp"></i>
                    <span class="whatsapp-tooltip">Chat with us!</span>
                </button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    },
    
    bindEvents: function() {
        const btn = document.getElementById('whatsapp-btn');
        const popup = document.getElementById('whatsapp-popup');
        const closeBtn = document.querySelector('.whatsapp-popup-close');
        
        if (btn) {
            btn.addEventListener('click', () => {
                popup.classList.toggle('active');
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                popup.classList.remove('active');
            });
        }
        
        // Close popup when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#whatsapp-widget')) {
                popup.classList.remove('active');
            }
        });
    }
};

// ==========================================
// 7. NEWSLETTER SIGNUP
// ==========================================
const Newsletter = {
    init: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
        document.querySelectorAll('.newsletter-form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = form.querySelector('input[type="email"]').value;
                if (this.validateEmail(email)) {
                    this.showSuccess(form);
                    // In production, you would send this to your backend
                    console.log('Newsletter signup:', email);
                } else {
                    this.showError(form, 'Please enter a valid email address');
                }
            });
        });
    },
    
    validateEmail: function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    showSuccess: function(form) {
        const msg = form.querySelector('.newsletter-message') || this.createMessage(form);
        msg.className = 'newsletter-message success';
        msg.textContent = '✓ Thank you for subscribing! We\'ll be in touch soon.';
        form.querySelector('input[type="email"]').value = '';
    },
    
    showError: function(form, message) {
        const msg = form.querySelector('.newsletter-message') || this.createMessage(form);
        msg.className = 'newsletter-message error';
        msg.textContent = message;
    },
    
    createMessage: function(form) {
        const msg = document.createElement('div');
        msg.className = 'newsletter-message';
        form.appendChild(msg);
        return msg;
    }
};

// ==========================================
// 8. SMOOTH SCROLL
// ==========================================
const SmoothScroll = {
    init: function() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
};

// ==========================================
// 9. SCROLL TO TOP BUTTON
// ==========================================
const ScrollToTop = {
    init: function() {
        this.createButton();
        this.bindEvents();
    },
    
    createButton: function() {
        const btnHTML = `
            <button id="scroll-to-top" class="scroll-to-top" aria-label="Scroll to top">
                <i class="fas fa-chevron-up"></i>
            </button>
        `;
        document.body.insertAdjacentHTML('beforeend', btnHTML);
    },
    
    bindEvents: function() {
        const btn = document.getElementById('scroll-to-top');
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });
        
        btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
};

// ==========================================
// 10. COUNTER ANIMATION
// ==========================================
const CounterAnimation = {
    init: function() {
        const counters = document.querySelectorAll('[data-counter]');
        if (counters.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    },
    
    animateCounter: function(el) {
        const target = parseInt(el.getAttribute('data-counter'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                el.textContent = target.toLocaleString() + (el.getAttribute('data-suffix') || '');
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current).toLocaleString() + (el.getAttribute('data-suffix') || '');
            }
        }, 16);
    }
};

// ==========================================
// INITIALIZE ALL FEATURES
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all enhancement modules
    AOSCustom.init();
    Lightbox.init();
    LazyLoad.init();
    DarkMode.init();
    WhatsAppWidget.init();
    Newsletter.init();
    SmoothScroll.init();
    ScrollToTop.init();
    CounterAnimation.init();
    
    console.log('✅ Vertvista Enhancements Loaded');
});
