// Music Player
// A clean, simple music player for local files

// DOM Elements
const audio = new Audio();
let currentSongIndex = 0;
let isPlaying = false;

// Song data - will be populated with music files from the folder
let songs = [];

// List of music files with their metadata
const musicFiles = [
    { file: 'Billie Jean.mp3', title: 'Billie Jean', artist: 'Michael Jackson' },
    { file: 'Cho L A R G E.mp3', title: 'Cho L A R G E', artist: 'Various Artists' },
    { file: 'Despacito - Remix.mp3', title: 'Despacito', artist: 'Luis Fonsi, Daddy Yankee, Justin Bieber' },
    { file: 'Harleys In Hawaii.mp3', title: 'Harleys In Hawaii', artist: 'Katy Perry' },
    { file: 'Levitating (feat. DaBaby).mp3', title: 'Levitating', artist: 'Dua Lipa ft. DaBaby' },
    { file: 'Poker Face.mp3', title: 'Poker Face', artist: 'Lady Gaga' },
    { file: 'Radioactive.mp3', title: 'Radioactive', artist: 'Imagine Dragons' },
    { file: 'Rolling in the Deep.mp3', title: 'Rolling in the Deep', artist: 'Adele' },
    { file: 'Shape of You.mp3', title: 'Shape of You', artist: 'Ed Sheeran' },
    { file: 'Six Days - Remix.mp3', title: 'Six Days', artist: 'DJ Shadow' },
    { file: 'This Is What You Came For.mp3', title: 'This Is What You Came For', artist: 'Calvin Harris ft. Rihanna' },
    { file: 'Thunder.mp3', title: 'Thunder', artist: 'Imagine Dragons' },
    { file: 'Waka Waka (This Time for Africa) [The Official 2010 FIFA World Cup (TM) Song] (feat. Freshlyground).mp3', 
      title: 'Waka Waka (This Time for Africa)', artist: 'Shakira' },
    { file: 'We Found Love.mp3', title: 'We Found Love', artist: 'Rihanna ft. Calvin Harris' }
];

// Initialize songs array with full paths
function initializeSongs() {
    songs = musicFiles.map(song => ({
        ...song,
        file: `music/${encodeURIComponent(song.file)}`
    }));
    
    // Load the first song if available
    if (songs.length > 0) {
        loadSong(0);
    }
}

// Get DOM elements
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progressEl = document.querySelector('.progress');
const progressContainer = document.querySelector('.progress-container');
const titleEl = document.getElementById('title');
const artistEl = document.getElementById('artist');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

// Format time in MM:SS
function formatTime(seconds) {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Update song details
function loadSong(index) {
    if (songs.length === 0) return;
    
    // Handle index out of bounds
    if (index < 0) index = songs.length - 1;
    if (index >= songs.length) index = 0;
    currentSongIndex = index;
    
    const song = songs[currentSongIndex];
    
    // Update UI
    titleEl.textContent = song.title;
    artistEl.textContent = song.artist;
    
    // Load the new song
    audio.src = song.file;
    audio.load();
    
    // Update time display
    updateTimeDisplay();
    
    // If already playing, continue playing the new song
    if (isPlaying) {
        playSong();
    }
}

// Play song
function playSong() {
    isPlaying = true;
    playBtn.querySelector('i').className = 'fas fa-pause';
    audio.play().catch(e => console.error('Error playing song:', e));
}

// Pause song
function pauseSong() {
    isPlaying = false;
    playBtn.querySelector('i').className = 'fas fa-play';
    audio.pause();
}

// Toggle play/pause
function togglePlay() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

// Previous song
function prevSong() {
    if (songs.length <= 1) return; // No previous song if there's only one or none
    loadSong(currentSongIndex - 1);
}

// Next song
function nextSong() {
    if (songs.length <= 1) return; // No next song if there's only one or none
    loadSong(currentSongIndex + 1);
}

// Update progress bar
function updateProgress() {
    if (isNaN(audio.duration)) return;
    
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressEl.style.width = `${progressPercent}%`;
    
    // Update time display
    updateTimeDisplay();
}

// Update time display
function updateTimeDisplay() {
    if (currentTimeEl) {
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
    if (durationEl) {
        // Only update duration if we have a valid duration
        if (!isNaN(audio.duration) && audio.duration > 0) {
            durationEl.textContent = formatTime(audio.duration);
        } else {
            durationEl.textContent = '0:00';
        }
    }
}

// Set progress bar
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration || 0;
    audio.currentTime = (clickX / width) * duration;
}

// Initialize the player
function init() {
    // Set up media session actions
    if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', togglePlay);
        navigator.mediaSession.setActionHandler('pause', togglePlay);
        navigator.mediaSession.setActionHandler('previoustrack', prevSong);
        navigator.mediaSession.setActionHandler('nexttrack', nextSong);
    }
    
    // Set up event listeners
    setupEventListeners();
    
    // Load the first song
    loadSong(currentSongIndex);
    
    // Set up time update
    audio.addEventListener('timeupdate', updateProgress);
    
    // Handle song end
    audio.addEventListener('ended', nextSong);
    
    // Set initial volume
    audio.volume = 0.7;
}

// Set up event listeners
function setupEventListeners() {
    // Play/Pause button
    playBtn.addEventListener('click', togglePlay);
    
    // Previous button
    prevBtn.addEventListener('click', prevSong);
    
    // Next button
    nextBtn.addEventListener('click', nextSong);
    
    // Progress bar click
    progressContainer.addEventListener('click', setProgress);
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        // Don't trigger shortcuts when typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                togglePlay();
                break;
            case 'ArrowLeft':
                audio.currentTime = Math.max(0, audio.currentTime - 5);
                break;
            case 'ArrowRight':
                audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
                break;
        }
    });
}

// Initialize the player when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // First initialize the songs
    initializeSongs();
    
    // Then initialize the player
    init();
    
    // Try to start playback automatically
    setTimeout(() => {
        if (songs.length > 0 && !isPlaying) {
            playSong().catch(error => {
                console.log('Autoplay was prevented:', error);
            });
        }
    }, 500);
});
