document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    
    // Mobile search toggle
    const mobileSearchToggle = document.getElementById('mobileSearchToggle');
    const mobileSearchContainer = document.getElementById('mobileSearchContainer');
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        mobileMenu.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }
    
    // Toggle mobile search
    function toggleMobileSearch() {
        mobileSearchContainer.classList.toggle('active');
        if (mobileSearchContainer.classList.contains('active')) {
            // Focus the search input when search is opened
            const searchInput = mobileSearchContainer.querySelector('input[type="text"]');
            if (searchInput) {
                searchInput.focus();
            }
        }
    }
    
    // Close mobile menu when clicking outside
    function closeMenuOnClickOutside(event) {
        if (mobileMenu.classList.contains('active') && !mobileMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
            toggleMobileMenu();
        }
    }
    
    // Close search when clicking outside
    function closeSearchOnClickOutside(event) {
        if (mobileSearchContainer.classList.contains('active') && 
            !mobileSearchContainer.contains(event.target) && 
            !mobileSearchToggle.contains(event.target)) {
            mobileSearchContainer.classList.remove('active');
        }
    }
    
    // Close menu when clicking on a link
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
    
    // Event listeners
    if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    if (closeMobileMenu) closeMobileMenu.addEventListener('click', toggleMobileMenu);
    if (mobileSearchToggle) mobileSearchToggle.addEventListener('click', toggleMobileSearch);
    document.addEventListener('click', closeMenuOnClickOutside);
    document.addEventListener('click', closeSearchOnClickOutside);
    
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
