/**
 * VERTVISTA - PREMIUM JAVASCRIPT ENHANCEMENTS
 * Advanced interactions for 10x better user experience
 */

(function() {
    'use strict';

    // ========================================
    // 1. SCROLL ANIMATIONS (Intersection Observer)
    // ========================================
    
    const initScrollAnimations = () => {
        const animatedElements = document.querySelectorAll('.animate-on-scroll, .slide-up, .slide-in-left, .slide-in-right, .scale-up, .blur-in, .stagger-children');
        
        if (animatedElements.length === 0) return;
        
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Optionally unobserve after animation
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        animatedElements.forEach(el => observer.observe(el));
    };

    // ========================================
    // 2. SMOOTH SCROLL PROGRESS INDICATOR
    // ========================================
    
    const initScrollProgress = () => {
        const progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) {
            // Create scroll progress bar if it doesn't exist
            const bar = document.createElement('div');
            bar.className = 'scroll-progress';
            document.body.prepend(bar);
        }
        
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            const bar = document.querySelector('.scroll-progress');
            if (bar) {
                bar.style.width = `${Math.min(progress, 100)}%`;
            }
        };
        
        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    };

    // ========================================
    // 3. NAVBAR SCROLL BEHAVIOR
    // ========================================
    
    const initNavbarScroll = () => {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
        let lastScroll = 0;
        const scrollThreshold = 100;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            
            // Add scrolled class
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll (optional - uncomment to enable)
            // if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
            //     navbar.style.transform = 'translateY(-100%)';
            // } else {
            //     navbar.style.transform = 'translateY(0)';
            // }
            
            lastScroll = currentScroll;
        }, { passive: true });
    };

    // ========================================
    // 4. ANIMATED COUNTER
    // ========================================
    
    const initCounters = () => {
        const counters = document.querySelectorAll('.stat-number, .stat-number-premium, [data-counter]');
        if (counters.length === 0) return;
        
        const animateCounter = (el) => {
            const target = parseInt(el.getAttribute('data-target') || el.textContent.replace(/[^0-9]/g, ''));
            const duration = 2000;
            const startTime = performance.now();
            const suffix = el.textContent.includes('+') ? '+' : (el.textContent.includes('%') ? '%' : '');
            
            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function (ease-out-expo)
                const easeOutExpo = 1 - Math.pow(2, -10 * progress);
                const current = Math.floor(target * easeOutExpo);
                
                el.textContent = current.toLocaleString() + suffix;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    el.textContent = target.toLocaleString() + suffix;
                }
            };
            
            requestAnimationFrame(updateCounter);
        };
        
        const observerOptions = {
            threshold: 0.5
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    animateCounter(entry.target);
                }
            });
        }, observerOptions);
        
        counters.forEach(counter => {
            // Store original value as data attribute
            if (!counter.getAttribute('data-target')) {
                counter.setAttribute('data-target', counter.textContent.replace(/[^0-9]/g, ''));
            }
            observer.observe(counter);
        });
    };

    // ========================================
    // 5. SMOOTH ANCHOR SCROLLING
    // ========================================
    
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    // ========================================
    // 6. MOBILE NAVIGATION
    // ========================================
    
    const initMobileNav = () => {
        const toggle = document.querySelector('.nav-toggle, .hamburger');
        const menu = document.querySelector('.nav-menu, .nav-links');
        const dropdowns = document.querySelectorAll('.nav-dropdown, .dropdown');
        
        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                menu.classList.toggle('active');
                document.body.classList.toggle('nav-open');
            });
            
            // Close menu on link click
            menu.querySelectorAll('a:not(.nav-dropdown > a)').forEach(link => {
                link.addEventListener('click', () => {
                    toggle.classList.remove('active');
                    menu.classList.remove('active');
                    document.body.classList.remove('nav-open');
                });
            });
        }
        
        // Mobile dropdown toggle
        dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('.nav-link, > a');
            if (trigger && window.innerWidth <= 1024) {
                trigger.addEventListener('click', (e) => {
                    if (window.innerWidth <= 1024) {
                        e.preventDefault();
                        dropdown.classList.toggle('active');
                    }
                });
            }
        });
    };

    // ========================================
    // 7. BACK TO TOP BUTTON
    // ========================================
    
    const initBackToTop = () => {
        let btn = document.querySelector('.back-to-top');
        
        if (!btn) {
            btn = document.createElement('button');
            btn.className = 'back-to-top';
            btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
            btn.setAttribute('aria-label', 'Back to top');
            document.body.appendChild(btn);
        }
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                btn.classList.add('show');
            } else {
                btn.classList.remove('show');
            }
        }, { passive: true });
        
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    // ========================================
    // 8. PAGE LOADER
    // ========================================
    
    const initPageLoader = () => {
        const loader = document.getElementById('page-loader');
        if (!loader) return;
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.classList.add('loaded');
            }, 300);
        });
        
        // Fallback - hide loader after 3 seconds max
        setTimeout(() => {
            if (loader && !loader.classList.contains('hidden')) {
                loader.classList.add('hidden');
                document.body.classList.add('loaded');
            }
        }, 3000);
    };

    // ========================================
    // 9. ACCORDION FUNCTIONALITY
    // ========================================
    
    const initAccordions = () => {
        const accordionItems = document.querySelectorAll('.accordion-item, .accordion-item-premium, .faq-item');
        
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header, .accordion-header-premium, .faq-question');
            if (!header) return;
            
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items (optional - remove for multi-open)
                // accordionItems.forEach(i => i.classList.remove('active'));
                
                // Toggle current item
                item.classList.toggle('active', !isActive);
            });
        });
    };

    // ========================================
    // 10. TABS FUNCTIONALITY
    // ========================================
    
    const initTabs = () => {
        const tabContainers = document.querySelectorAll('.tabs-premium, .tabs-container');
        
        tabContainers.forEach(container => {
            const buttons = container.querySelectorAll('.tab-btn-premium, .tab-btn');
            const panels = container.querySelectorAll('.tab-panel-premium, .tab-panel');
            
            buttons.forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    // Remove active from all
                    buttons.forEach(b => b.classList.remove('active'));
                    panels.forEach(p => p.classList.remove('active'));
                    
                    // Add active to clicked
                    btn.classList.add('active');
                    if (panels[index]) {
                        panels[index].classList.add('active');
                    }
                });
            });
        });
    };

    // ========================================
    // 11. GALLERY LIGHTBOX
    // ========================================
    
    const initLightbox = () => {
        const galleryItems = document.querySelectorAll('.gallery-item, .gallery-item-premium, [data-lightbox]');
        if (galleryItems.length === 0) return;
        
        // Create lightbox HTML if it doesn't exist
        let lightbox = document.querySelector('.gallery-lightbox');
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.className = 'gallery-lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-backdrop"></div>
                <button class="lightbox-close"><i class="fas fa-times"></i></button>
                <button class="lightbox-nav lightbox-prev"><i class="fas fa-chevron-left"></i></button>
                <button class="lightbox-nav lightbox-next"><i class="fas fa-chevron-right"></i></button>
                <span class="lightbox-counter">1 / ${galleryItems.length}</span>
                <div class="lightbox-content">
                    <img class="lightbox-image" src="" alt="">
                    <div class="lightbox-caption">
                        <h4></h4>
                        <p></p>
                    </div>
                </div>
            `;
            document.body.appendChild(lightbox);
        }
        
        let currentIndex = 0;
        const images = Array.from(galleryItems).map(item => {
            const img = item.querySelector('img');
            const overlay = item.querySelector('.gallery-overlay, .gallery-item-overlay');
            return {
                src: img?.src || item.getAttribute('data-src'),
                title: overlay?.querySelector('h3, h4')?.textContent || '',
                desc: overlay?.querySelector('p, span')?.textContent || ''
            };
        });
        
        const updateLightbox = () => {
            const img = lightbox.querySelector('.lightbox-image');
            const caption = lightbox.querySelector('.lightbox-caption');
            const counter = lightbox.querySelector('.lightbox-counter');
            
            img.src = images[currentIndex].src;
            caption.querySelector('h4').textContent = images[currentIndex].title;
            caption.querySelector('p').textContent = images[currentIndex].desc;
            counter.textContent = `${currentIndex + 1} / ${images.length}`;
        };
        
        const openLightbox = (index) => {
            currentIndex = index;
            updateLightbox();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };
        
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };
        
        const nextImage = () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateLightbox();
        };
        
        const prevImage = () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateLightbox();
        };
        
        // Event listeners
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });
        
        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-next').addEventListener('click', nextImage);
        lightbox.querySelector('.lightbox-prev').addEventListener('click', prevImage);
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        });
    };

    // ========================================
    // 12. SEARCH AUTOCOMPLETE
    // ========================================
    
    const initSearchAutocomplete = () => {
        const searchInput = document.querySelector('.search-input');
        const autocomplete = document.querySelector('.search-autocomplete');
        
        if (!searchInput || !autocomplete) return;
        
        // Sample search data (would come from backend in production)
        const searchData = [
            { category: 'Services', items: [
                { title: 'Indoor Plants', desc: 'Natural & artificial plants for offices', icon: 'fa-seedling', url: 'indoor-plants.html' },
                { title: 'Green Walls', desc: 'Vertical gardens & living walls', icon: 'fa-layer-group', url: 'green-walls.html' },
                { title: 'Moss Art', desc: 'Premium preserved moss installations', icon: 'fa-paint-brush', url: 'moss-art.html' },
                { title: 'Planters', desc: 'FRP, ceramic & custom planters', icon: 'fa-box', url: 'planters.html' },
                { title: 'Biophilic Design', desc: 'Nature-integrated workspace design', icon: 'fa-spa', url: 'biophilic-design.html' },
                { title: 'Maintenance', desc: 'AMC & plant care services', icon: 'fa-tools', url: 'maintenance.html' }
            ]},
            { category: 'Locations', items: [
                { title: 'Mumbai', desc: 'Headquarters', icon: 'fa-building', url: 'mumbai.html' },
                { title: 'Bangalore', desc: 'Tech hub operations', icon: 'fa-laptop-code', url: 'bangalore.html' },
                { title: 'Pune', desc: 'Regional center', icon: 'fa-city', url: 'pune.html' },
                { title: 'Chennai', desc: 'South India hub', icon: 'fa-industry', url: 'chennai.html' }
            ]},
            { category: 'Tools', items: [
                { title: 'Plant Finder Quiz', desc: 'Find the perfect plant', icon: 'fa-search', url: 'plant-finder-quiz.html' },
                { title: 'ROI Calculator', desc: 'Calculate green investment returns', icon: 'fa-calculator', url: 'roi-calculator.html' },
                { title: 'Carbon Calculator', desc: 'Measure your carbon offset', icon: 'fa-leaf', url: 'carbon-offset-calculator.html' }
            ]}
        ];
        
        const performSearch = (query) => {
            if (query.length < 2) {
                autocomplete.classList.remove('active');
                return;
            }
            
            const results = [];
            const lowerQuery = query.toLowerCase();
            
            searchData.forEach(category => {
                const matchingItems = category.items.filter(item => 
                    item.title.toLowerCase().includes(lowerQuery) ||
                    item.desc.toLowerCase().includes(lowerQuery)
                );
                
                if (matchingItems.length > 0) {
                    results.push({
                        category: category.category,
                        items: matchingItems
                    });
                }
            });
            
            renderResults(results, query);
        };
        
        const renderResults = (results, query) => {
            if (results.length === 0) {
                autocomplete.innerHTML = '<div class="search-no-results">No results found</div>';
                autocomplete.classList.add('active');
                return;
            }
            
            let html = '';
            results.forEach(category => {
                html += `<div class="search-category">${category.category}</div>`;
                category.items.forEach(item => {
                    const highlightedTitle = item.title.replace(
                        new RegExp(query, 'gi'),
                        match => `<span class="highlight">${match}</span>`
                    );
                    html += `
                        <a href="${item.url}" class="search-result-item">
                            <div class="search-result-icon">
                                <i class="fas ${item.icon}"></i>
                            </div>
                            <div class="search-result-content">
                                <h4>${highlightedTitle}</h4>
                                <p>${item.desc}</p>
                            </div>
                        </a>
                    `;
                });
            });
            
            autocomplete.innerHTML = html;
            autocomplete.classList.add('active');
        };
        
        // Debounce search
        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                performSearch(e.target.value);
            }, 200);
        });
        
        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                autocomplete.classList.remove('active');
            }
        });
        
        // Keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            const items = autocomplete.querySelectorAll('.search-result-item');
            const activeItem = autocomplete.querySelector('.search-result-item.active');
            let index = Array.from(items).indexOf(activeItem);
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                index = Math.min(index + 1, items.length - 1);
                items.forEach(i => i.classList.remove('active'));
                items[index]?.classList.add('active');
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                index = Math.max(index - 1, 0);
                items.forEach(i => i.classList.remove('active'));
                items[index]?.classList.add('active');
            } else if (e.key === 'Enter' && activeItem) {
                e.preventDefault();
                window.location.href = activeItem.href;
            }
        });
    };

    // ========================================
    // 13. TOAST NOTIFICATIONS
    // ========================================
    
    window.showToast = (options = {}) => {
        const { type = 'info', title = '', message = '', duration = 5000 } = options;
        
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        
        const icons = {
            success: 'fa-check',
            error: 'fa-times',
            warning: 'fa-exclamation',
            info: 'fa-info'
        };
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${icons[type]}"></i>
            </div>
            <div class="toast-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <button class="toast-close"><i class="fas fa-times"></i></button>
        `;
        
        container.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Auto remove
        const autoRemove = setTimeout(() => removeToast(toast), duration);
        
        // Manual close
        toast.querySelector('.toast-close').addEventListener('click', () => {
            clearTimeout(autoRemove);
            removeToast(toast);
        });
    };
    
    const removeToast = (toast) => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    };

    // ========================================
    // 14. PARALLAX EFFECT
    // ========================================
    
    const initParallax = () => {
        const parallaxElements = document.querySelectorAll('.parallax, [data-parallax]');
        if (parallaxElements.length === 0) return;
        
        const updateParallax = () => {
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-parallax-speed') || '0.5');
                const rect = el.getBoundingClientRect();
                const scrolled = window.scrollY;
                const yPos = -(scrolled * speed);
                
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    el.style.transform = `translateY(${yPos}px)`;
                }
            });
        };
        
        window.addEventListener('scroll', updateParallax, { passive: true });
        updateParallax();
    };

    // ========================================
    // 15. LAZY LOADING IMAGES
    // ========================================
    
    const initLazyLoad = () => {
        const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            }, { rootMargin: '50px' });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    };

    // ========================================
    // 16. FORM VALIDATION ENHANCEMENT
    // ========================================
    
    const initFormValidation = () => {
        const forms = document.querySelectorAll('form[data-validate]');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                input.addEventListener('blur', () => validateInput(input));
                input.addEventListener('input', () => {
                    if (input.classList.contains('error')) {
                        validateInput(input);
                    }
                });
            });
            
            form.addEventListener('submit', (e) => {
                let isValid = true;
                inputs.forEach(input => {
                    if (!validateInput(input)) {
                        isValid = false;
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                }
            });
        });
    };
    
    const validateInput = (input) => {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Required check
        if (input.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email check
        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email';
            }
        }
        
        // Phone check
        if (input.type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-+()]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
        
        // Update UI
        const errorEl = input.parentNode.querySelector('.input-error');
        if (isValid) {
            input.classList.remove('error');
            if (errorEl) errorEl.remove();
        } else {
            input.classList.add('error');
            if (!errorEl) {
                const error = document.createElement('span');
                error.className = 'input-error';
                error.textContent = errorMessage;
                input.parentNode.appendChild(error);
            } else {
                errorEl.textContent = errorMessage;
            }
        }
        
        return isValid;
    };

    // ========================================
    // INITIALIZATION
    // ========================================
    
    const init = () => {
        initPageLoader();
        initScrollAnimations();
        initScrollProgress();
        initNavbarScroll();
        initCounters();
        initSmoothScroll();
        initMobileNav();
        initBackToTop();
        initAccordions();
        initTabs();
        initLightbox();
        initSearchAutocomplete();
        initParallax();
        initLazyLoad();
        initFormValidation();
        
        console.log('Vertvista Premium JS initialized');
    };
    
    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
