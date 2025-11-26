document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu elements
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    
    // Mobile search elements
    const mobileSearchToggle = document.getElementById('mobileSearchToggle');
    const mobileSearchContainer = document.getElementById('mobileSearchContainer');
    const searchForm = document.querySelector('.mobile-search-container form');
    const searchInput = document.querySelector('.mobile-search-container .search-input');
    
    // State management
    let isMenuOpen = false;
    let isSearchOpen = false;
    
    // Debug log
    console.log('Mobile menu elements:', { mobileMenuToggle, mobileMenu, mobileMenuOverlay });
    
    // Toggle mobile menu with animation
    function toggleMobileMenu() {
        console.log('toggleMobileMenu called');
        if (isSearchOpen) {
            console.log('Search is open, closing it first');
            toggleMobileSearch();
            return;
        }
        
        isMenuOpen = !isMenuOpen;
        console.log('isMenuOpen:', isMenuOpen);
        
        if (isMenuOpen) {
            // Open menu
            console.log('Opening menu');
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            
            // Make sure elements are visible
            mobileMenuOverlay.style.display = 'block';
            mobileMenu.style.display = 'flex';
            
            // Trigger reflow
            void mobileMenu.offsetWidth;
            
            // Add active classes
            mobileMenuOverlay.classList.add('active');
            mobileMenu.classList.add('active');
            
            // Animate menu items with staggered delay
            const menuItems = document.querySelectorAll('.mobile-nav-links li');
            menuItems.forEach((item, index) => {
                item.style.animation = `slideInRight 0.3s ease-out ${0.1 + (index * 0.05)}s forwards`;
            });
        } else {
            console.log('Closing menu');
            // Close menu
            mobileMenuOverlay.classList.remove('active');
            mobileMenu.classList.remove('active');
            
            // Reset menu items animation
            const menuItems = document.querySelectorAll('.mobile-nav-links li');
            menuItems.forEach(item => {
                item.style.animation = 'none';
            });
            
            // Allow animations to complete before resetting styles
            setTimeout(() => {
                if (!isMenuOpen) {
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';
                    mobileMenuOverlay.style.display = 'none';
                    mobileMenu.style.display = 'none';
                }
            }, 300);
        }
    }
    
    // Toggle mobile search with animation
    function toggleMobileSearch(forceClose = false) {
        if (isMenuOpen && !forceClose) return; // Don't allow search toggling while menu is open
        
        // If forceClose is true, we're forcing the search to close
        isSearchOpen = forceClose ? false : !isSearchOpen;
        
        if (isSearchOpen) {
            // Open search
            mobileSearchContainer.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            
            // Add click-outside listener
            setTimeout(() => {
                document.addEventListener('click', handleClickOutsideSearch);
            }, 10);
            
            // Trigger reflow
            void mobileSearchContainer.offsetWidth;
            
            // Animate search container
            requestAnimationFrame(() => {
                mobileSearchContainer.classList.add('active');
                
                // Focus search input after animation starts
                setTimeout(() => {
                    if (searchInput) {
                        searchInput.focus();
                    }
                }, 100);
            });
        } else {
            // Close search
            mobileSearchContainer.classList.remove('active');
            
            // Remove click-outside listener
            document.removeEventListener('click', handleClickOutsideSearch);
            
            // Allow animation to complete before resetting styles
            setTimeout(() => {
                if (!isSearchOpen) {
                    mobileSearchContainer.style.display = 'none';
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';
                    
                    // Don't clear search input when submitting the form
                    if (searchInput && !forceClose) {
                        searchInput.value = '';
                    }
                }
            }, 300);
        }
    }
    
    // Handle clicks outside the search container
    function handleClickOutsideSearch(event) {
        const searchForm = document.getElementById('mobileSearchForm');
        const searchToggle = document.getElementById('mobileSearchToggle');
        
        // If click is outside both the search container and the search toggle button
        if (!mobileSearchContainer.contains(event.target) && event.target !== searchToggle) {
            toggleMobileSearch(true); // Force close the search
        }
    }
    
    // Handle search form submission
    function handleSearchSubmit(e) {
        e.preventDefault();
        if (searchInput && searchInput.value.trim() !== '') {
            // The form will submit naturally to the search endpoint
            // No need for manual redirection
            console.log('Submitting search for:', searchInput.value.trim());
            
            // Remove the click-outside listener before form submission
            document.removeEventListener('click', handleClickOutsideSearch);
            
            // Submit the form
            e.target.submit();
        } else {
            // If search is empty, just close the search
            toggleMobileSearch(true);
        }
    }
    
    // Close mobile menu when clicking outside
    function closeMenuOnClickOutside(event) {
        if (isMenuOpen && !mobileMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
            toggleMobileMenu();
        }
    }
    
    // Close search when clicking outside
    function closeSearchOnClickOutside(event) {
        if (isSearchOpen && 
            !mobileSearchContainer.contains(event.target) && 
            !mobileSearchToggle.contains(event.target)) {
            toggleMobileSearch();
        }
    }
    
    // Initialize mobile menu state
    if (mobileMenu) {
        mobileMenu.style.display = 'none';
    }
    
    // Add event listeners for menu and search toggles
    if (mobileMenuToggle) {
        console.log('Adding click listener to menu toggle');
        mobileMenuToggle.addEventListener('click', function(e) {
            console.log('Menu toggle clicked');
            e.stopPropagation();
            // Close search if open when menu is toggled
            if (isSearchOpen) {
                toggleMobileSearch(true);
            }
            toggleMobileMenu();
        });
    } else {
        console.error('Mobile menu toggle button not found!');
    }
    
    if (mobileSearchToggle) {
        mobileSearchToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            // Close menu if open when search is toggled
            if (isMenuOpen) {
                toggleMobileMenu();
                // Small delay to allow menu to close before opening search
                setTimeout(() => toggleMobileSearch(), 350);
            } else {
                toggleMobileSearch();
            }
        });
    }
    
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearchSubmit);
        
        // Prevent clicks inside the search form from closing it
        searchForm.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Close menu when clicking outside or on overlay
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', function(e) {
            if (isMenuOpen) {
                toggleMobileMenu();
            }
        });
    }
    
    // Close menu when clicking on a link
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (isMenuOpen) {
                toggleMobileMenu();
            }
        });
    });
    
    // Close menu when pressing escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMobileMenu();
        }
    });
    
    // Close mobile menu when window is resized to desktop
    function handleResize() {
        if (window.innerWidth >= 992) { // lg breakpoint
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
            if (mobileSearchContainer.classList.contains('active')) {
                mobileSearchContainer.classList.remove('active');
            }
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    // Handle back button to close menu
    window.addEventListener('popstate', function() {
        if (mobileMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
});
