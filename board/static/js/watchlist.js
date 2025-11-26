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
            const error = 'CSRF token not found';
            console.error(error);
            return { success: false, error };
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
        return { success: false, error: error.message || errorMessage };
    }
}

// Function to update tab count
function updateTabCount(tabId) {
    const tabElement = document.querySelector(`#${tabId}-tab`);
    if (!tabElement) return;
    
    const tabContent = document.getElementById(tabId);
    if (!tabContent) return;
    
    // Count the number of movie cards in the tab
    const movieCount = tabContent.querySelectorAll('.movie-card').length;
    
    // Update the badge with the new count
    let badge = tabElement.querySelector('.badge');
    if (!badge) {
        badge = document.createElement('span');
        badge.className = 'badge bg-secondary ms-1';
        tabElement.appendChild(badge);
    }
    badge.textContent = movieCount;
}

// Helper function to remove movie card from the UI
function removeMovieCard(movieId, tabId) {
    // If tabId is 'all', remove from all tabs, otherwise only from the specified tab
    const tabsToUpdate = tabId === 'all' ? ['all', 'watched', 'favorites'] : [tabId];
    
    tabsToUpdate.forEach(tab => {
        const movieCard = document.querySelector(`#${tab} .movie-card[data-movie-id="${movieId}"]`);
        if (movieCard) {
            // Add fade-out class for smooth removal
            movieCard.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            movieCard.style.opacity = '0';
            movieCard.style.transform = 'translateY(20px)';
            
            // Remove the movie card after the transition
            setTimeout(() => {
                movieCard.remove();
                
                // Check if this was the last movie in the tab
                const tabContent = document.getElementById(tab);
                const movieGrid = tabContent?.querySelector('.movie-grid');
                if (movieGrid && movieGrid.children.length === 0) {
                    // Check if empty state already exists
                    const existingEmptyState = tabContent.querySelector('.empty-state');
                    if (!existingEmptyState) {
                        // Show empty state only if it doesn't already exist
                        const emptyState = document.createElement('div');
                        emptyState.className = 'text-center py-5 empty-state';
                        
                        // Set appropriate empty state message based on the tab
                        if (tab === 'watched') {
                            emptyState.innerHTML = `
                                <i class="bi bi-eye-slash" style="font-size: 3rem; color: var(--text-muted);"></i>
                                <p class="mt-3">No watched movies yet</p>
                                <p class="text-muted">Mark movies as watched to see them here</p>
                            `;
                        } else if (tab === 'favorites') {
                            emptyState.innerHTML = `
                                <i class="bi bi-heart" style="font-size: 3rem; color: var(--text-muted);"></i>
                                <p class="mt-3">No favorite movies yet</p>
                                <p class="text-muted">Add movies to your favorites to see them here</p>
                            `;
                        } else {
                            emptyState.innerHTML = `
                                <i class="bi bi-collection" style="font-size: 3rem; color: var(--text-muted);"></i>
                                <p class="mt-3">Your library is empty</p>
                                <p class="text-muted">Add movies to your watchlist to see them here</p>
                                <a href="${window.location.origin}" class="btn btn-primary mt-3">
                                    <i class="bi bi-house-door"></i> Browse Movies
                                </a>
                            `;
                        }
                        
                        tabContent.appendChild(emptyState);
                    }
                }
                
                // Update the tab count for all tabs since a movie might affect multiple tabs
                updateTabCount('all');
                updateTabCount('watched');
                updateTabCount('favorites');
                
            }, 300);
        }
    });
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
            `[onclick*="toggleWatchlist('${movieId}')`,
            `[onclick*='toggleWatchlist("${movieId}")`,
            `[onclick*='toggleWatchlist(${movieId})`,
            `[onclick*="toggleWatchlist(${movieId})`,
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
                    icon.classList.remove('bi-plus-circle', 'bi-bookmark-plus');
                    icon.classList.add('bi-dash-circle', 'bi-bookmark-check-fill');
                }
                button.title = 'Remove from watchlist';

                // For full text buttons
                if (button.textContent.includes('Add to Watchlist')) {
                    button.innerHTML = '<i class="bi bi-bookmark-check-fill me-2"></i>In Watchlist';
                } else if (button.textContent.includes('Add to Watchlist')) {
                    button.innerHTML = '<i class="bi bi-dash-circle me-2"></i>Remove from Watchlist';
                } else if (button.textContent.includes('In Watchlist')) {
                    button.innerHTML = '<i class="bi bi-bookmark-check-fill me-2"></i>In Watchlist';
                } else {
                    // For the movie detail page button
                    button.innerHTML = button.innerHTML.replace('bi-plus-circle', 'bi-dash-circle')
                                                     .replace('Add to Watchlist', 'Remove from Watchlist');
                }
                showNotification('Movie added to your watchlist');
            } else {
                button.classList.add('btn-outline-light');
                if (icon) {
                    icon.classList.remove('bi-dash-circle', 'bi-bookmark-check-fill');
                    icon.classList.add('bi-plus-circle', 'bi-bookmark-plus');
                }
                button.title = 'Add to watchlist';

                // For full text buttons
                if (button.textContent.includes('Remove from Watchlist')) {
                    button.innerHTML = '<i class="bi bi-plus-circle me-2"></i>Add to Watchlist';
                } else if (button.textContent.includes('In Watchlist')) {
                    button.innerHTML = '<i class="bi bi-bookmark-plus me-2"></i>Add to Watchlist';
                } else {
                    // For the movie detail page button
                    button.innerHTML = button.innerHTML.replace('bi-dash-circle', 'bi-plus-circle')
                                                     .replace('Remove from Watchlist', 'Add to Watchlist');
                }
                showNotification('Movie removed from your watchlist');

                // If we're in the library page, remove the movie card from the watchlist
                if (window.location.pathname.includes('/my-library')) {
                    removeMovieCard(movieId, 'all');
                }
            }
        });
    } else {
        showNotification(data.error || 'Failed to update watchlist', 'error');
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
            `[onclick*="toggleFavorite('${movieId}')`,
            `[onclick*='toggleFavorite("${movieId}")`,
            `[onclick*='toggleFavorite(${movieId})`,
            `[onclick*="toggleFavorite(${movieId})`
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
                showNotification('Movie added to your favorites');
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
                showNotification('Movie removed from your favorites');

                // If we're in the library page, remove the movie card from the favorites tab
                if (window.location.pathname.includes('/my-library')) {
                    removeMovieCard(movieId, 'favorites');
                }
            }
        });
    } else {
        showNotification(data.error || 'Failed to update favorites', 'error');
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
            `[onclick*="toggleWatched('${movieId}')`,
            `[onclick*='toggleWatched("${movieId}")`,
            `[onclick*='toggleWatched(${movieId})`,
            `[onclick*="toggleWatched(${movieId})`
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
                    icon.classList.remove('bi-eye', 'text-primary');
                    icon.classList.add('bi-eye-fill');
                }
                button.title = 'Mark as not watched';

                // For full text buttons
                if (button.textContent.includes('Mark as Watched')) {
                    button.innerHTML = '<i class="bi bi-eye-fill me-2"></i>Watched';
                }
                showNotification('Movie marked as watched');
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
                showNotification('Movie marked as not watched');

                // If we're in the library page, remove the movie card from the watched tab
                if (window.location.pathname.includes('/my-library')) {
                    removeMovieCard(movieId, 'watched');
                }
            }
        });
    } else {
        showNotification(data.error || 'Failed to update watched status', 'error');
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
            icon.classList.remove('bi-eye', 'text-primary');
            icon.classList.add('bi-eye-fill');
            button.title = 'Mark as not watched';
        } else {
            icon.classList.remove('bi-eye-fill', 'text-primary');
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
                // Remove any existing text-primary class from the icon
                const icon = button.querySelector('i');
                if (icon) {
                    icon.classList.remove('text-primary');
                }
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
