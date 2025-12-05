/* ================================================
   GALLERY OPTIMIZATION & LAZY LOADING
   Enhanced performance with Intersection Observer
   ================================================ */

document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
    initializeLightbox();
    initializeFilters();
});

// Gallery Initialization with Intersection Observer
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Intersection Observer for progressive loading
    const observerOptions = {
        root: null,
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.01
    };
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                const img = item.querySelector('img');
                
                // Add fade-in animation
                item.classList.add('gallery-item-visible');
                
                // Stop observing once loaded
                observer.unobserve(item);
            }
        });
    }, observerOptions);
    
    // Observe all gallery items
    galleryItems.forEach(item => {
        imageObserver.observe(item);
    });
}

// Enhanced Filter System
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter with animation
            galleryItems.forEach((item, index) => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    // Show with stagger animation
                    setTimeout(() => {
                        item.style.display = 'block';
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        
                        setTimeout(() => {
                            item.style.transition = 'all 0.4s ease';
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 50);
                    }, index * 30); // Stagger by 30ms
                } else {
                    // Hide with fade out
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(-10px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
            
            // Track filter usage (analytics)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'gallery_filter', {
                    'event_category': 'Gallery Interaction',
                    'event_label': filter
                });
            }
        });
    });
}

// Lightbox Functionality
function initializeLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    let currentIndex = 0;
    let visibleImages = [];
    
    // Update visible images array
    function updateVisibleImages() {
        visibleImages = Array.from(document.querySelectorAll('.gallery-item:not([style*="display: none"]) img'));
    }
    
    // Open lightbox
    galleryItems.forEach((img, index) => {
        img.addEventListener('click', function() {
            updateVisibleImages();
            currentIndex = visibleImages.indexOf(this);
            
            if (currentIndex !== -1) {
                showLightbox(currentIndex);
            }
        });
        
        // Add pointer cursor
        img.style.cursor = 'pointer';
    });
    
    function showLightbox(index) {
        if (index < 0 || index >= visibleImages.length) return;
        
        const img = visibleImages[index];
        const item = img.closest('.gallery-item');
        const overlay = item.querySelector('.gallery-overlay');
        
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        
        // Get caption from overlay
        if (overlay) {
            const title = overlay.querySelector('h3')?.textContent || '';
            const location = overlay.querySelector('p')?.textContent || '';
            const category = overlay.querySelector('.gallery-category')?.textContent || '';
            
            lightboxCaption.innerHTML = `
                <h3>${title}</h3>
                <p>${location}</p>
                <span class="lightbox-category">${category}</span>
            `;
        }
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        currentIndex = index;
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Close button
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    // Previous button
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', function() {
            currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
            showLightbox(currentIndex);
        });
    }
    
    // Next button
    if (lightboxNext) {
        lightboxNext.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % visibleImages.length;
            showLightbox(currentIndex);
        });
    }
    
    // Close on background click
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                lightboxPrev.click();
                break;
            case 'ArrowRight':
                lightboxNext.click();
                break;
        }
    });
}

// Performance: Preload next/previous images in lightbox
function preloadAdjacentImages(currentIndex, visibleImages) {
    const prevIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
    const nextIndex = (currentIndex + 1) % visibleImages.length;
    
    // Preload previous image
    if (visibleImages[prevIndex]) {
        const prevImg = new Image();
        prevImg.src = visibleImages[prevIndex].src;
    }
    
    // Preload next image
    if (visibleImages[nextIndex]) {
        const nextImg = new Image();
        nextImg.src = visibleImages[nextIndex].src;
    }
}

// Add loading state for images
document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('load', function() {
        this.classList.add('loaded');
    });
    
    img.addEventListener('error', function() {
        this.classList.add('error');
        this.alt = 'Image failed to load';
    });
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeGallery,
        initializeLightbox,
        initializeFilters
    };
}
