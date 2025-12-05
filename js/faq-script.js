/* ================================================
   FAQ PAGE JAVASCRIPT
   ================================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // FAQ ACCORDION FUNCTIONALITY
    // ========================================
    
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other items in the same category (optional - remove if you want multiple open)
            const category = item.closest('.faq-category');
            const otherItems = category.querySelectorAll('.faq-item.active');
            
            otherItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    
    // ========================================
    // CATEGORY FILTERING
    // ========================================
    
    const categoryButtons = document.querySelectorAll('.category-btn');
    const faqCategories = document.querySelectorAll('.faq-category');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-category');
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter categories
            if (filter === 'all') {
                faqCategories.forEach(category => {
                    category.classList.remove('hidden');
                });
            } else {
                faqCategories.forEach(category => {
                    const categoryType = category.getAttribute('data-category');
                    if (categoryType === filter) {
                        category.classList.remove('hidden');
                    } else {
                        category.classList.add('hidden');
                    }
                });
            }
            
            // Scroll to FAQ section
            const firstVisibleCategory = document.querySelector('.faq-category:not(.hidden)');
            if (firstVisibleCategory) {
                firstVisibleCategory.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    
    // ========================================
    // SEARCH FUNCTIONALITY
    // ========================================
    
    const searchInput = document.getElementById('faqSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                // Show all if search is empty
                faqCategories.forEach(category => {
                    category.classList.remove('hidden');
                    const items = category.querySelectorAll('.faq-item');
                    items.forEach(item => item.classList.remove('hidden'));
                });
                
                // Reset category filter to "all"
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                categoryButtons[0].classList.add('active');
                
                // Hide no results message if exists
                const noResults = document.querySelector('.no-results');
                if (noResults) {
                    noResults.remove();
                }
                
                return;
            }
            
            let hasResults = false;
            
            faqCategories.forEach(category => {
                const items = category.querySelectorAll('.faq-item');
                let categoryHasResults = false;
                
                items.forEach(item => {
                    const question = item.querySelector('.faq-question span').textContent.toLowerCase();
                    const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
                    
                    if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                        item.classList.remove('hidden');
                        categoryHasResults = true;
                        hasResults = true;
                    } else {
                        item.classList.add('hidden');
                    }
                });
                
                // Hide category if no items match
                if (categoryHasResults) {
                    category.classList.remove('hidden');
                } else {
                    category.classList.add('hidden');
                }
            });
            
            // Show "no results" message if needed
            const existingNoResults = document.querySelector('.no-results');
            if (!hasResults && !existingNoResults) {
                const container = document.querySelector('.section-padding:has(.faq-category)');
                const noResultsDiv = document.createElement('div');
                noResultsDiv.className = 'no-results';
                noResultsDiv.innerHTML = `
                    <i class="fas fa-search"></i>
                    <h3>No Results Found</h3>
                    <p>Try searching with different keywords or <a href="contact.html">contact us</a> directly.</p>
                `;
                container.appendChild(noResultsDiv);
            } else if (hasResults && existingNoResults) {
                existingNoResults.remove();
            }
        });
    }
    
    
    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip empty or just "#" hrefs
            if (href === '#' || href === '') {
                e.preventDefault();
                return;
            }
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - navbarHeight - 20;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    
    // ========================================
    // KEYBOARD NAVIGATION FOR ACCORDION
    // ========================================
    
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('keydown', (e) => {
            // Enter or Space to toggle
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
            
            // Arrow down to next question
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextItem = faqItems[index + 1];
                if (nextItem) {
                    nextItem.querySelector('.faq-question').focus();
                }
            }
            
            // Arrow up to previous question
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevItem = faqItems[index - 1];
                if (prevItem) {
                    prevItem.querySelector('.faq-question').focus();
                }
            }
        });
    });
    
    
    // ========================================
    // URL HASH HANDLING (Direct Link to Question)
    // ========================================
    
    if (window.location.hash) {
        const hashId = window.location.hash.substring(1);
        const targetElement = document.getElementById(hashId);
        
        if (targetElement) {
            // Open the accordion item if it's a question
            const faqItem = targetElement.closest('.faq-item');
            if (faqItem) {
                setTimeout(() => {
                    faqItem.classList.add('active');
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        }
    }
    
    
    // ========================================
    // EXPAND ALL / COLLAPSE ALL (Optional Feature)
    // ========================================
    
    // You can add buttons to expand/collapse all FAQs if needed
    // Uncomment below code and add buttons in HTML
    
    /*
    const expandAllBtn = document.getElementById('expandAll');
    const collapseAllBtn = document.getElementById('collapseAll');
    
    if (expandAllBtn) {
        expandAllBtn.addEventListener('click', () => {
            const visibleItems = document.querySelectorAll('.faq-item:not(.hidden)');
            visibleItems.forEach(item => {
                item.classList.add('active');
            });
        });
    }
    
    if (collapseAllBtn) {
        collapseAllBtn.addEventListener('click', () => {
            faqItems.forEach(item => {
                item.classList.remove('active');
            });
        });
    }
    */
    
});
