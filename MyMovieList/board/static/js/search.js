document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            const query = searchInput.value.trim();
            if (!query) {
                e.preventDefault();
                searchInput.focus();
            }
        });
    }
    
    // Focus search input when search icon is clicked on mobile
    const searchIcon = document.querySelector('.search-icon');
    if (searchIcon && window.innerWidth < 768) {
        searchIcon.addEventListener('click', function() {
            searchInput.focus();
        });
    }
});
