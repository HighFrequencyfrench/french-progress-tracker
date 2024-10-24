// Episodes data
const episodes = [
    { 
        id: 1, 
        title: "Moving House - Le Déménagement", 
        level: "Beginner 01",
        url: "https://open.spotify.com/episode/2YNKRg1EaPYvgThs1cibda?si=T1kEBrjIQn6RGQNQ6Jh7xQ"
    },
    // ... (keep all other episodes)
];

// Wait for DOM content to be loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const episodesList = document.getElementById('episodes-list');
    const shareButton = document.getElementById('share-btn');

    // Initialize progress tracking
    let completedEpisodes = new Set(
        JSON.parse(localStorage.getItem('completedEpisodes')) || []
    );

    // Create and add reset button
    const resetButton = document.createElement('button');
    resetButton.className = 'reset-button';
    resetButton.textContent = 'Reset Progress';
    shareButton.parentNode.insertBefore(resetButton, shareButton.nextSibling);

    // Create episode elements
    episodes.forEach(episode => {
        const html = `
            <div class="episode ${completedEpisodes.has(episode.id) ? 'completed' : ''}">
                <div class="episode-content">
                    <span class="episode-number">S02-EP${String(episode.id).padStart(2, '0')}</span>
                    <span class="episode-title">${episode.title}</span>
                    <span class="episode-level">${episode.level}</span>
                </div>
                <div class="episode-actions">
                    <button class="complete-button">
                        ${completedEpisodes.has(episode.id) ? 'Mark as Incomplete' : 'Mark as Complete'}
                    </button>
                    <a href="${episode.url}" target="_blank" class="listen-button">
                        Listen on Spotify
                    </a>
                </div>
            </div>
        `;
        episodesList.insertAdjacentHTML('beforeend', html);
    });

    // Update progress display
    function updateProgress() {
        const progress = (completedEpisodes.size / episodes.length) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${progress.toFixed(1)}% Complete (${completedEpisodes.size} of ${episodes.length} episodes)`;
    }

    // Toggle episode completion
    episodesList.addEventListener('click', function(e) {
        if (e.target.classList.contains('complete-button')) {
            const episodeElement = e.target.closest('.episode');
            const episodeId = parseInt(episodeElement.querySelector('.episode-number').textContent.slice(6));
            
            if (completedEpisodes.has(episodeId)) {
                completedEpisodes.delete(episodeId);
                episodeElement.classList.remove('completed');
                e.target.textContent = 'Mark as Complete';
            } else {
                completedEpisodes.add(episodeId);
                episodeElement.classList.add('completed');
                e.target.textContent = 'Mark as Incomplete';
            }
            
            localStorage.setItem('completedEpisodes', JSON.stringify([...completedEpisodes]));
            updateProgress();
        }
    });

    // Reset progress
    resetButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset your progress? This cannot be undone.')) {
            completedEpisodes.clear();
            localStorage.removeItem('completedEpisodes');
            document.querySelectorAll('.episode').forEach(episode => {
                episode.classList.remove('completed');
                episode.querySelector('.complete-button').textContent = 'Mark as Complete';
            });
            updateProgress();
        }
    });

    // Share progress
    shareButton.addEventListener('click', function() {
        const progress = (completedEpisodes.size / episodes.length) * 100;
        const text = `I've completed ${completedEpisodes.size} episodes (${progress.toFixed(1)}%) of French From the Start Season 2!`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My French Learning Progress',
                text: text,
                url: window.location.href
            }).catch(console.error);
        } else {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
        }
    });

    // Initialize progress display
    updateProgress();
});
