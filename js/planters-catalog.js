// ========================================
// PLANTERS CATALOG - FILTERING & SORTING
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const filterCheckboxes = document.querySelectorAll('.filter-group input[type="checkbox"]');
    const sortSelect = document.getElementById('sortSelect');
    const resetButton = document.querySelector('.reset-filters');
    const productsGrid = document.getElementById('productsGrid');
    const productCards = Array.from(document.querySelectorAll('.product-card'));
    const resultsInfo = document.querySelector('.results-info');
    const noResults = document.querySelector('.no-results');
    
    // Active filters object
    let activeFilters = {
        material: [],
        size: [],
        use: [],
        placement: []
    };

    // Initialize
    updateResultsCount();
    
    // Event Listeners
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });
    
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSort);
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', resetAllFilters);
    }
    
    // Filter Change Handler
    function handleFilterChange(e) {
        const filterType = e.target.dataset.filter;
        const filterValue = e.target.value;
        
        if (e.target.checked) {
            // Add filter
            if (!activeFilters[filterType].includes(filterValue)) {
                activeFilters[filterType].push(filterValue);
            }
        } else {
            // Remove filter
            activeFilters[filterType] = activeFilters[filterType].filter(val => val !== filterValue);
        }
        
        applyFilters();
    }
    
    // Apply Filters
    function applyFilters() {
        let visibleCount = 0;
        
        productCards.forEach((card, index) => {
            const materialMatch = checkFilterMatch(card, 'material');
            const sizeMatch = checkFilterMatch(card, 'size');
            const useMatch = checkFilterMatch(card, 'use');
            const placementMatch = checkFilterMatch(card, 'placement');
            
            const shouldShow = materialMatch && sizeMatch && useMatch && placementMatch;
            
            if (shouldShow) {
                // Staggered fade-in animation
                setTimeout(() => {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                }, index * 50);
                visibleCount++;
            } else {
                card.classList.add('hidden');
                card.style.animation = 'none';
            }
        });
        
        updateResultsCount(visibleCount);
        toggleNoResults(visibleCount === 0);
    }
    
    // Check if card matches filter criteria
    function checkFilterMatch(card, filterType) {
        const activeFiltersForType = activeFilters[filterType];
        
        // If no filters active for this type, match all
        if (activeFiltersForType.length === 0) {
            return true;
        }
        
        // Get card's data attributes
        const cardValue = card.dataset[filterType];
        
        // Check if card matches any of the active filters
        // Handle multiple values (e.g., "indoor outdoor" for use case)
        if (cardValue) {
            const cardValues = cardValue.split(' ');
            return activeFiltersForType.some(filter => cardValues.includes(filter));
        }
        
        return false;
    }
    
    // Sort Products
    function handleSort() {
        const sortValue = sortSelect.value;
        let sortedCards;
        
        switch(sortValue) {
            case 'name-asc':
                sortedCards = sortByName(productCards, 'asc');
                break;
            case 'name-desc':
                sortedCards = sortByName(productCards, 'desc');
                break;
            case 'size-large':
                sortedCards = sortBySize(productCards, 'large');
                break;
            case 'size-small':
                sortedCards = sortBySize(productCards, 'small');
                break;
            case 'popular':
                sortedCards = sortByPopularity(productCards);
                break;
            default:
                sortedCards = productCards;
        }
        
        // Re-append cards in sorted order
        sortedCards.forEach(card => {
            productsGrid.appendChild(card);
        });
        
        // Re-apply filters after sorting
        applyFilters();
    }
    
    // Sort by Name
    function sortByName(cards, order = 'asc') {
        return [...cards].sort((a, b) => {
            const nameA = a.querySelector('h3').textContent.toLowerCase();
            const nameB = b.querySelector('h3').textContent.toLowerCase();
            
            if (order === 'asc') {
                return nameA.localeCompare(nameB);
            } else {
                return nameB.localeCompare(nameA);
            }
        });
    }
    
    // Sort by Size
    function sortBySize(cards, preference = 'large') {
        return [...cards].sort((a, b) => {
            const sizeA = a.dataset.size;
            const sizeB = b.dataset.size;
            
            const sizeOrder = { large: 3, medium: 2, small: 1 };
            const valueA = sizeOrder[sizeA] || 0;
            const valueB = sizeOrder[sizeB] || 0;
            
            if (preference === 'large') {
                return valueB - valueA; // Descending (large first)
            } else {
                return valueA - valueB; // Ascending (small first)
            }
        });
    }
    
    // Sort by Popularity (based on badges)
    function sortByPopularity(cards) {
        return [...cards].sort((a, b) => {
            const badgeA = a.querySelector('.product-badge');
            const badgeB = b.querySelector('.product-badge');
            
            // Priority: Bestseller > New > Custom > None
            const getPriority = (badge) => {
                if (!badge) return 0;
                const text = badge.textContent.toLowerCase();
                if (text.includes('bestseller')) return 3;
                if (text.includes('new')) return 2;
                if (text.includes('custom')) return 1;
                return 0;
            };
            
            return getPriority(badgeB) - getPriority(badgeA);
        });
    }
    
    // Reset All Filters
    function resetAllFilters() {
        // Uncheck all checkboxes
        filterCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reset sort to default
        if (sortSelect) {
            sortSelect.value = 'popular';
        }
        
        // Clear active filters
        activeFilters = {
            material: [],
            size: [],
            use: [],
            placement: []
        };
        
        // Show all products
        applyFilters();
        
        // Smooth scroll to top of catalog
        document.querySelector('.catalog-section').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
    
    // Update Results Count
    function updateResultsCount(count) {
        if (!resultsInfo) return;
        
        const visibleCount = count !== undefined ? count : productCards.filter(card => !card.classList.contains('hidden')).length;
        const totalCount = productCards.length;
        
        resultsInfo.innerHTML = `Showing <strong>${visibleCount}</strong> of <strong>${totalCount}</strong> products`;
    }
    
    // Toggle No Results Message
    function toggleNoResults(show) {
        if (noResults) {
            if (show) {
                noResults.classList.add('visible');
                productsGrid.style.display = 'none';
            } else {
                noResults.classList.remove('visible');
                productsGrid.style.display = 'grid';
            }
        }
    }
    
    // Product Card Click Handler (for Request Quote buttons)
    const inquireButtons = document.querySelectorAll('.btn-inquire');
    inquireButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productSize = productCard.querySelector('.product-size').textContent;
            
            // Create inquiry message
            const message = `Hi! I'm interested in the ${productName} (${productSize}). Could you please provide more details and pricing?`;
            
            // Redirect to contact page with pre-filled message
            const encodedMessage = encodeURIComponent(message);
            window.location.href = `contact.html?product=${encodeURIComponent(productName)}&message=${encodedMessage}`;
        });
    });
    
    // Animate product cards on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const productObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all product cards
    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        productObserver.observe(card);
    });
    
    // Add search functionality (optional enhancement)
    function addSearchFunctionality() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                const searchTerm = e.target.value.toLowerCase().trim();
                
                productCards.forEach(card => {
                    const productName = card.querySelector('h3').textContent.toLowerCase();
                    const productCategory = card.querySelector('.product-category').textContent.toLowerCase();
                    
                    const matches = productName.includes(searchTerm) || productCategory.includes(searchTerm);
                    
                    if (searchTerm === '' || matches) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                updateResultsCount();
            });
        }
    }
    
    // Initialize search if search input exists
    addSearchFunctionality();
    
    // Smooth scroll for CTA buttons
    const ctaButtons = document.querySelectorAll('.btn-cta');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#contact') {
                e.preventDefault();
                window.location.href = 'contact.html?source=planters-cta';
            }
        });
    });
    
    // Add animation keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .product-card.hidden {
            animation: fadeOut 0.3s ease forwards;
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: scale(1);
            }
            to {
                opacity: 0;
                transform: scale(0.95);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Console log for debugging
    console.log('Planters catalog initialized');
    console.log('Total products:', productCards.length);
    console.log('Active filters:', activeFilters);
});

// Export functions for potential use in other scripts
window.PlantersCatalog = {
    version: '1.0.0',
    totalProducts: document.querySelectorAll('.product-card').length
};
