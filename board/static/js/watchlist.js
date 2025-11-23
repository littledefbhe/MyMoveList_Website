// Watchlist functionality
async function toggleWatchlist(button) {
    const movieId = button.getAttribute('data-movie-id');
    const isInWatchlist = button.classList.contains('active');
    
    try {
        const response = await fetch('/api/watchlist/toggle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ movie_id: movieId })
        });

        if (!response.ok) {
            throw new Error('Failed to update watchlist');
        }

        const data = await response.json();
        
        // Update button state
        if (data.in_watchlist) {
            button.classList.add('active');
            button.setAttribute('title', 'Remove from watchlist');
            button.innerHTML = '<i class="bi bi-check-circle"></i>';
        } else {
            button.classList.remove('active');
            button.setAttribute('title', 'Add to watchlist');
            button.innerHTML = '<i class="bi bi-plus-circle"></i>';
        }
    } catch (error) {
        console.error('Error updating watchlist:', error);
        alert('Failed to update watchlist. Please try again.');
    }
}

// Helper function to get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add click handlers to all watchlist buttons
    document.querySelectorAll('.btn-watchlist').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWatchlist(button);
        });
    });
});
