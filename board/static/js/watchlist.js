// Watchlist functionality
async function toggleWatchlist(movieId) {
    try {
        const response = await fetch('/api/watchlist/toggle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({ movie_id: movieId })
        });

        if (!response.ok) {
            throw new Error('Failed to update watchlist');
        }

        const data = await response.json();
        
        // Update button state
        const buttons = document.querySelectorAll(`.btn-watchlist[data-movie-id="${movieId}"]`);
        buttons.forEach(button => {
            if (data.status === 'added to') {
                button.classList.add('active');
                button.innerHTML = '<i class="bi bi-check-circle"></i>';
                button.title = 'Remove from watchlist';
            } else {
                button.classList.remove('active');
                button.innerHTML = '<i class="bi bi-plus-circle"></i>';
                button.title = 'Add to watchlist';
            }
        });
        
        // If on the library page and movie was removed, remove the movie card
        if (document.body.classList.contains('library-page') && data.status === 'removed from') {
            const movieCards = document.querySelectorAll(`.movie-card[data-movie-id="${movieId}"]`);
            movieCards.forEach(card => card.remove());
        }
        
        return true;
    } catch (error) {
        console.error('Error updating watchlist:', error);
        return false;
    }
}

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add click handlers to all watchlist buttons
    document.querySelectorAll('.btn-watchlist').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const movieId = button.getAttribute('data-movie-id');
            toggleWatchlist(movieId);
        });
    });
});
