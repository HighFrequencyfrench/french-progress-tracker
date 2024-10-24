const episodes = [
    // ... (keep all your episodes data the same) ...
];

// Initialize completedEpisodes from localStorage or create new Set
let completedEpisodes = new Set(
    JSON.parse(localStorage.getItem('completedEpisodes')) || []
);

const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const episodesList = document.getElementById('episodes-list');
const shareButton = document.getElementById('share-btn');

// Create episode elements
episodes.forEach(episode => {
    const episodeElement = document.createElement('div');
    episodeElement.className = 'episode';
    // Add 'completed' class if this episode was completed before
    if (completedEpisodes.has(episode.id)) {
        episodeElement.classList.add('completed');
    }
    
    episodeElement.innerHTML = `
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
                <svg width="16" height="16"><use xlink:href="#spotify-icon"/></svg>
                Listen on Spotify
            </a>
        </div>
    `;
    
    const completeButton = episodeElement.querySelector('.complete-button');
    completeButton.addEventListener('click', (e) => {
        e.preventDefault();
        toggleEpisode(episode.id, episodeElement);
    });
    
    episodesList.appendChild(episodeElement);
});

function toggleEpisode(id, element) {
    if (completedEpisodes.has(id)) {
        completedEpisodes.delete(id);
        element.classList.remove('completed');
        element.querySelector('.complete-button').textContent = 'Mark as Complete';
    } else {
        completedEpisodes.add(id);
        element.classList.add('completed');
        element.querySelector('.complete-button').textContent = 'Mark as Incomplete';
    }
    // Save to localStorage after each change
    localStorage.setItem('completedEpisodes', JSON.stringify([...completedEpisodes]));
    updateProgress();
}

// Initialize progress on page load
updateProgress();

function updateProgress() {
    const progress = (completedEpisodes.size / episodes.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${progress.toFixed(1)}% Complete (${completedEpisodes.size} of ${episodes.length} episodes)`;
}

function shareProgress() {
    const progress = (completedEpisodes.size / episodes.length) * 100;
    const text = `I've completed ${completedEpisodes.size} episodes (${progress.toFixed(1)}%) of French From the Start Season 2! Join me in learning French through stories!`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My French Learning Progress',
            text: text,
            url: window.location.href
        }).catch(console.error);
    } else {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
    }
}

shareButton.addEventListener('click', shareProgress);
