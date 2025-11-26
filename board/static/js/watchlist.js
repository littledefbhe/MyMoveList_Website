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

// Helper function to remove movie card from the UI
function removeMovieCard(movieId, tabId) {
    const movieCard = document.querySelector(`#${tabId} .movie-card[data-movie-id="${movieId}"]`);
    if (movieCard) {
        movieCard.style.opacity = '0';
        setTimeout(() => {
            movieCard.remove();
            
            // Check if this was the last movie in the tab
            const tabContent = document.querySelector(`#${tabId}`);
            const movieGrid = tabContent?.querySelector('.movie-grid');
            if (movieGrid && movieGrid.children.length === 0) {
                // Check if empty state already exists
                const existingEmptyState = tabContent.querySelector('.empty-state');
                if (!existingEmptyState) {
                    // Show empty state only if it doesn't already exist
                    const emptyState = document.createElement('div');
                    emptyState.className = 'text-center py-5 empty-state';
                    emptyState.innerHTML = `
                        <i class="bi ${tabId === 'watched' ? 'bi-eye-slash' : 'bi-heart'}" style="font-size: 3rem; color: var(--text-muted);"></i>
                        <p class="mt-3">No ${tabId === 'watched' ? 'watched' : 'favorite'} movies yet</p>
                        <p class="text-muted">${tabId === 'watched' ? 'Mark movies as watched' : 'Add movies to your favorites'} to see them here</p>
                    `;
                    tabContent.insertBefore(emptyState, movieGrid);
                }
            }
        }, 300);
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
        // Update all watchlist buttons for this movie
        const selectors = [
            `[onclick*="toggleWatchlist('${movieId}')"]`,
            `[onclick*='toggleWatchlist(\"${movieId}\")']`,
            `[onclick*='toggleWatchlist(${movieId})']`,
            `[onclick*="toggleWatchlist(${movieId})"]`,
            // Add selectors for any other button variations
            `[data-movie-id="${movieId}"] .watchlist-btn`,
            `[data-movie-id='${movieId}'] .watchlist-btn`
        ];
        
        // Combine all matching buttons
        const buttons = [];
        selectors.forEach(selector => {
            try {
                document.querySelectorAll(selector).forEach(btn => buttons.push(btn));
            } catch (e) {
                console.warn('Invalid selector:', selector, e);
            }
        });
        
        // Remove duplicates
        const uniqueButtons = [...new Set(buttons)];
        
        uniqueButtons.forEach(button => {
            const icon = button.querySelector('i');
            // Remove all existing button classes
            button.classList.forEach(cls => {
                if (cls.startsWith('btn-')) {
                    button.classList.remove(cls);
                }
            });
            
            if (data.status === 'added to') {
                button.classList.add('btn-outline-light');
                if (icon) {
                    icon.classList.remove('bi-bookmark-plus');
                    icon.classList.add('bi-bookmark-check-fill');
                }
                button.title = 'Remove from watchlist';

                // For full text buttons
                if (button.textContent.includes('Add to Watchlist')) {
                    button.innerHTML = '<i class="bi bi-bookmark-check-fill me-2"></i>In Watchlist';
                }
            } else {
                button.classList.add('btn-outline-light');
                if (icon) {
                    icon.classList.remove('bi-bookmark-check-fill');
                    icon.classList.add('bi-bookmark-plus');
                }
                button.title = 'Add to watchlist';

                // For full text buttons
                if (button.textContent.includes('In Watchlist')) {
                    button.innerHTML = '<i class="bi bi-bookmark-plus me-2"></i>Add to Watchlist';
                }

                // If we're in the library page, remove the movie card from the watchlist
                if (window.location.pathname.includes('/my-library')) {
                    removeMovieCard(movieId, 'all');
                }
            }
        });
        
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
        // Update all favorite buttons for this movie
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
            // Remove all existing button classes
            button.classList.forEach(cls => {
                if (cls.startsWith('btn-')) {
                    button.classList.remove(cls);
                }
            });
            if (data.status === 'added to') {
                button.classList.add('btn-outline-light');
                if (icon) {
                    icon.classList.remove('bi-heart');
                    icon.classList.add('bi-heart-fill');
                }
                button.title = 'Remove from favorites';

                // For full text buttons
                if (button.textContent.includes('Favorite')) {
                    button.innerHTML = '<i class="bi bi-heart-fill me-2"></i>Favorited';
                }
            } else {
                button.classList.add('btn-outline-light');
                if (icon) {
                    icon.classList.remove('bi-heart-fill', 'text-danger');
                    icon.classList.add('bi-heart');
                }
                button.title = 'Add to favorites';

                // For full text buttons
                if (button.textContent.includes('Favorited')) {
                    button.innerHTML = '<i class="bi bi-heart me-2"></i>Favorite';
                }

                // If we're in the library page, remove the movie card from the favorites tab
                if (window.location.pathname.includes('/my-library')) {
                    removeMovieCard(movieId, 'favorites');
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
        // Update all watched buttons for this movie
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
            // Remove all existing button classes
            button.classList.forEach(cls => {
                if (cls.startsWith('btn-')) {
                    button.classList.remove(cls);
                }
            });
            if (data.status === 'marked as watched') {
                button.classList.add('btn-outline-light');
                if (icon) {
                    icon.classList.remove('bi-eye');
                    icon.classList.add('bi-eye-fill', 'text-primary');
                }
                button.title = 'Mark as not watched';

                // For full text buttons
                if (button.textContent.includes('Mark as Watched')) {
                    button.innerHTML = '<i class="bi bi-eye-fill me-2 text-primary"></i>Watched';
                }
            } else {
                button.classList.add('btn-outline-light');
                if (icon) {
                    icon.classList.remove('bi-eye-fill', 'text-primary');
                    icon.classList.add('bi-eye');
                }
                button.title = 'Mark as watched';

                // For full text buttons
                if (button.textContent.includes('Watched')) {
                    button.innerHTML = '<i class="bi bi-eye me-2"></i>Mark as Watched';
                }

                // If we're in the library page, remove the movie card from the watched tab
                if (window.location.pathname.includes('/my-library')) {
                    removeMovieCard(movieId, 'watched');
                }
            }
        });
        
        showNotification(`Movie ${data.status}`);
    }
    
    return success;
}

// Function to update button state based on status
function updateButtonState(button, type, isActive) {
    const icon = button.querySelector('i');
    if (!icon) return;

    // Remove all existing button classes
    button.classList.forEach(cls => {
        if (cls.startsWith('btn-')) {
            button.classList.remove(cls);
        }
    });
    
    button.classList.add('btn-outline-light');
    
    if (type === 'watchlist') {
        if (isActive) {
            icon.classList.remove('bi-bookmark-plus');
            icon.classList.add('bi-bookmark-check-fill');
            button.title = 'Remove from watchlist';
        } else {
            icon.classList.remove('bi-bookmark-check-fill');
            icon.classList.add('bi-bookmark-plus');
            button.title = 'Add to watchlist';
        }
    } else if (type === 'favorite') {
        if (isActive) {
            icon.classList.remove('bi-heart');
            icon.classList.add('bi-heart-fill');
            button.title = 'Remove from favorites';
        } else {
            icon.classList.remove('bi-heart-fill');
            icon.classList.add('bi-heart');
            button.title = 'Add to favorites';
        }
    } else if (type === 'watched') {
        if (isActive) {
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-fill');
            button.title = 'Mark as not watched';
        } else {
            icon.classList.remove('bi-eye-fill');
            icon.classList.add('bi-eye');
            button.title = 'Mark as watched';
        }
    }
}

// Function to initialize button states
async function initializeButtonStates() {
    try {
        const response = await fetch('/api/user/movie-statuses');
        if (!response.ok) throw new Error('Failed to fetch user movie statuses');
        
        const data = await response.json();
        if (!data.success) throw new Error(data.error || 'Failed to fetch user movie statuses');
        
        // Update all watchlist buttons
        document.querySelectorAll('[onclick*="toggleWatchlist"], .watchlist-btn').forEach(button => {
            const movieId = button.getAttribute('data-movie-id') || 
                           (button.getAttribute('onclick') || '').match(/toggleWatchlist\(['"](\d+)['"]\)/)?.[1];
            if (movieId && data.watchlist.includes(parseInt(movieId))) {
                updateButtonState(button, 'watchlist', true);
            }
        });
        
        // Update all favorite buttons
        document.querySelectorAll('[onclick*="toggleFavorite"], .favorite-btn').forEach(button => {
            const movieId = button.getAttribute('data-movie-id') || 
                           (button.getAttribute('onclick') || '').match(/toggleFavorite\(['"](\d+)['"]\)/)?.[1];
            if (movieId && data.favorites.includes(parseInt(movieId))) {
                updateButtonState(button, 'favorite', true);
            }
        });
        
        // Update all watched buttons
        document.querySelectorAll('[onclick*="toggleWatched"], .watched-btn').forEach(button => {
            const movieId = button.getAttribute('data-movie-id') || 
                           (button.getAttribute('onclick') || '').match(/toggleWatched\(['"](\d+)['"]\)/)?.[1];
            if (movieId && data.watched.includes(parseInt(movieId))) {
                updateButtonState(button, 'watched', true);
            }
        });
    } catch (error) {
        console.error('Error initializing button states:', error);
    }
}

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize button states
    initializeButtonStates();
    
    // Handle all button clicks using event delegation
    document.addEventListener('click', (e) => {
        // Watchlist button click
        if (e.target.closest('[onclick*="toggleWatchlist"]') || e.target.closest('.watchlist-btn')) {
            e.preventDefault();
            const button = e.target.closest('[onclick*="toggleWatchlist"], .watchlist-btn');
            const movieId = button.getAttribute('data-movie-id') || 
                           button.getAttribute('onclick').match(/toggleWatchlist\(['"](\d+)['"]\)/)[1];
            toggleWatchlist(movieId);
        }
        
        // Favorite button click
        if (e.target.closest('[onclick*="toggleFavorite"]') || e.target.closest('.favorite-btn')) {
            e.preventDefault();
            const button = e.target.closest('[onclick*="toggleFavorite"], .favorite-btn');
            const movieId = button.getAttribute('data-movie-id') || 
                           button.getAttribute('onclick').match(/toggleFavorite\(['"](\d+)['"]\)/)[1];
            toggleFavorite(movieId);
        }
        
        // Watched button click
        if (e.target.closest('[onclick*="toggleWatched"]') || e.target.closest('.watched-btn')) {
            e.preventDefault();
            const button = e.target.closest('[onclick*="toggleWatched"], .watched-btn');
            const movieId = button.getAttribute('data-movie-id') || 
                           button.getAttribute('onclick').match(/toggleWatched\(['"](\d+)['"]\)/)[1];
            toggleWatched(movieId);
        }
    });
});
