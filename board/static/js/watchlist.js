// Helper function to show notification
function showNotification(message, type = 'success') {
    // Remove any existing notifications first
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });

    const notification = document.createElement('div');
    notification.className = `notification ${type} show`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification styles if they don't exist
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 24px;
            border-radius: 4px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s, transform 0.3s;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .notification.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .notification.success {
            background-color: #28a745;
        }
        
        .notification.error {
            background-color: #dc3545;
        }
        
        .fade-out {
            opacity: 0 !important;
            transform: translateY(20px) !important;
        }
    `;
    document.head.appendChild(style);
}

// Generic function to toggle movie status
async function toggleMovieStatus(endpoint, movieId, errorMessage) {
    try {
        // Get CSRF token from meta tag
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
        
        if (!csrfToken) {
            console.error('CSRF token not found');
            showNotification('Security token missing. Please refresh the page.', 'error');
            return { success: false, error: 'CSRF token not found' };
        }

        const response = await fetch(`/api/${endpoint}/toggle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({ movie_id: movieId }),
            credentials: 'same-origin'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || errorMessage);
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error(`${errorMessage}:`, error);
        showNotification(error.message || errorMessage, 'error');
        return { success: false, error };
    }
}

// Watchlist functionality
async function toggleWatchlist(movieId) {
    const { success, data } = await toggleMovieStatus(
        'watchlist',
        movieId,
        'Failed to update watchlist'
    );

    if (success) {
        // Update all watchlist buttons for this movie using both single and double quotes in the selector
        const selectors = [
            `[onclick*="toggleWatchlist('${movieId}')"]`,
            `[onclick*='toggleWatchlist(\"${movieId}\")']`,
            `[onclick*='toggleWatchlist(${movieId})']`,
            `[onclick*="toggleWatchlist(${movieId})"]`
        ];
        
        // Combine all matching buttons
        const buttons = [];
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(btn => buttons.push(btn));
        });
        
        // Remove duplicates
        const uniqueButtons = [...new Set(buttons)];
        
        uniqueButtons.forEach(button => {
            const icon = button.querySelector('i');
            if (data.status === 'added to') {
                // For watchlist button - using btn-outline-light consistently to remove red highlight
                button.classList.remove('btn-outline-danger');
                button.classList.add('btn-outline-light');
                if (icon) icon.className = 'bi bi-bookmark-check-fill';
                button.title = 'Remove from watchlist';
                
                // For full text buttons
                if (button.textContent.includes('Add to Watchlist')) {
                    button.innerHTML = '<i class="bi bi-bookmark-check-fill me-2"></i>Remove from Watchlist';
                }
            } else {
                button.classList.remove('btn-outline-danger');
                button.classList.add('btn-outline-light');
                if (icon) icon.className = 'bi bi-bookmark-plus';
                button.title = 'Add to watchlist';
                
                // For full text buttons
                if (button.textContent.includes('Remove from Watchlist')) {
                    button.innerHTML = '<i class="bi bi-bookmark-plus me-2"></i>Add to Watchlist';
                }
            }
        });
        
        // If on the library page and movie was removed, remove the movie card
        if (document.body.classList.contains('library-page') && data.status === 'removed from') {
            const movieCards = document.querySelectorAll(`.movie-card[data-movie-id="${movieId}"]`);
            movieCards.forEach(card => card.remove());

            // Check if there are no more movie cards left
            const remainingCards = document.querySelectorAll('.movie-card');
            if (remainingCards.length === 0) {
                // Show empty state
                const movieGrid = document.querySelector('.movie-grid');
                if (movieGrid) {
                    const emptyState = document.createElement('div');
                    emptyState.className = 'text-center py-5 empty-state';
                    emptyState.innerHTML = `
                        <i class="bi bi-collection" style="font-size: 3rem; color: var(--text-muted);"></i>
                        <p class="mt-3">Your library is empty</p>
                        <p class="text-muted">Add movies to your watchlist to see them here</p>
                        <a href="/" class="btn btn-primary mt-3">
                            <i class="bi bi-house-door"></i> Browse Movies
                        </a>
                    `;
                    movieGrid.parentNode.replaceChild(emptyState, movieGrid);
                }
            }
        }
        
        showNotification(`Movie ${data.status} your watchlist`);
    }
    
    return success;
}

// Favorites functionality
async function toggleFavorite(movieId) {
    const { success, data } = await toggleMovieStatus(
        'favorites',
        movieId,
        'Failed to update favorites'
    );

    if (success) {
        // Update all favorite buttons for this movie using various possible selectors
        const selectors = [
            `[onclick*="toggleFavorite('${movieId}')"]`,
            `[onclick*='toggleFavorite(\"${movieId}\")']`,
            `[onclick*='toggleFavorite(${movieId})']`,
            `[onclick*="toggleFavorite(${movieId})"]`
        ];
        
        // Combine all matching buttons
        const buttons = [];
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(btn => buttons.push(btn));
        });
        
        // Remove duplicates
        const uniqueButtons = [...new Set(buttons)];
        
        uniqueButtons.forEach(button => {
            const icon = button.querySelector('i');
            if (data.status === 'added to') {
                button.classList.remove('btn-outline-light');
                button.classList.add('btn-danger');
                if (icon) icon.className = 'bi bi-heart-fill';
                button.title = 'Remove from favorites';
                
                // For full text buttons
                if (button.textContent.includes('Favorite')) {
                    button.innerHTML = '<i class="bi bi-heart-fill me-2"></i>Favorited';
                }
            } else {
                button.classList.remove('btn-danger');
                button.classList.add('btn-outline-light');
                if (icon) icon.className = 'bi bi-heart';
                button.title = 'Add to favorites';
                
                // For full text buttons
                if (button.textContent.includes('Favorited')) {
                    button.innerHTML = '<i class="bi bi-heart me-2"></i>Favorite';
                }
            }
        });
        
        showNotification(`Movie ${data.status} your favorites`);
    }
    
    return success;
}

// Watched functionality
async function toggleWatched(movieId) {
    const { success, data } = await toggleMovieStatus(
        'watched',
        movieId,
        'Failed to update watched status'
    );

    if (success) {
        // Update all watched buttons for this movie using various possible selectors
        const selectors = [
            `[onclick*="toggleWatched('${movieId}')"]`,
            `[onclick*='toggleWatched(\"${movieId}\")']`,
            `[onclick*='toggleWatched(${movieId})']`,
            `[onclick*="toggleWatched(${movieId})"]`
        ];
        
        // Combine all matching buttons
        const buttons = [];
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(btn => buttons.push(btn));
        });
        
        // Remove duplicates
        const uniqueButtons = [...new Set(buttons)];
        
        uniqueButtons.forEach(button => {
            const icon = button.querySelector('i');
            if (data.status === 'marked as watched') {
                button.classList.remove('btn-outline-light');
                button.classList.add('btn-primary');
                if (icon) icon.className = 'bi bi-eye-fill';
                button.title = 'Mark as not watched';
                
                // For full text buttons
                if (button.textContent.includes('Mark as Watched')) {
                    button.innerHTML = '<i class="bi bi-eye-fill me-2"></i>Watched';
                }
            } else {
                button.classList.remove('btn-primary');
                button.classList.add('btn-outline-light');
                if (icon) icon.className = 'bi bi-eye';
                button.title = 'Mark as watched';
                
                // For full text buttons
                if (button.textContent.includes('Watched')) {
                    button.innerHTML = '<i class="bi bi-eye me-2"></i>Mark as Watched';
                }
            }
        });
        
        showNotification(`Movie ${data.status}`);
    }
    
    return success;
}

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Handle all button clicks using event delegation
    document.addEventListener('click', (e) => {
        // Watchlist buttons
        let button = e.target.closest('[onclick^="toggleWatchlist"]');
        if (button) {
            e.preventDefault();
            e.stopPropagation();
            const match = button.getAttribute('onclick').match(/toggleWatchlist\((\d+)\)/);
            if (match && match[1]) {
                toggleWatchlist(match[1]);
            }
            return;
        }
        
        // Favorite buttons
        button = e.target.closest('[onclick^="toggleFavorite"]');
        if (button) {
            e.preventDefault();
            e.stopPropagation();
            const match = button.getAttribute('onclick').match(/toggleFavorite\((\d+)\)/);
            if (match && match[1]) {
                toggleFavorite(match[1]);
            }
            return;
        }
        
        // Watched buttons
        button = e.target.closest('[onclick^="toggleWatched"]');
        if (button) {
            e.preventDefault();
            e.stopPropagation();
            const match = button.getAttribute('onclick').match(/toggleWatched\((\d+)\)/);
            if (match && match[1]) {
                toggleWatched(match[1]);
            }
            return;
        }
    });
});
