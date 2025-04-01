// FREE GUY 1 - UI Manager
import { scoreManager, showHighScores } from './scores.js';

export function setupGameUI(game) {
    // Get all UI elements
    const waveAnnouncement = document.getElementById('waveAnnouncement');
    const waveNumber = document.getElementById('waveNumber');
    const gameOverScreen = document.getElementById('gameOverScreen');
    const gameOverText = document.getElementById('gameOverText');
    const scoreDisplay = document.getElementById('finalScore');
    const waveDisplay = document.getElementById('finalWave');
    const killsDisplay = document.getElementById('finalKills');
    const nameInputDialog = document.getElementById('nameInputDialog');
    const playerNameInput = document.getElementById('playerNameInput');
    const submitScoreButton = document.getElementById('submitScoreButton');
    const cancelScoreButton = document.getElementById('cancelScoreButton');
    const restartButton = document.getElementById('restartButton');
    const menuButton = document.getElementById('menuButton');
    const muteButton = document.getElementById('muteButton');

    // Game over event listener
    document.addEventListener('gameOver', (e) => {
        const { win, score, wave, kills } = e.detail;
        
        // Update game over screen
        gameOverText.textContent = win ? 'VICTORY!' : 'GAME OVER';
        scoreDisplay.textContent = score;
        waveDisplay.textContent = wave;
        killsDisplay.textContent = kills;
        gameOverScreen.className = win ? 'game-over-screen win-screen' : 'game-over-screen';
        
        // Check for high score
        if (scoreManager.isHighScore(score)) {
            showNameInputDialog(score, wave, kills);
        } else {
            showHighScores();
            gameOverScreen.style.display = 'flex';
        }
    });

    // Name input dialog functions
    function showNameInputDialog(score, wave, kills) {
        playerNameInput.value = '';
        nameInputDialog.style.display = 'flex';
        playerNameInput.focus();
        
        submitScoreButton.onclick = () => {
            const name = playerNameInput.value.trim() || 'Player';
            scoreManager.addScore(name, score, wave, kills);
            nameInputDialog.style.display = 'none';
            showHighScores();
            gameOverScreen.style.display = 'flex';
        };
        
        cancelScoreButton.onclick = () => {
            nameInputDialog.style.display = 'none';
            showHighScores();
            gameOverScreen.style.display = 'flex';
        };
    }

    // Button event listeners
    restartButton.addEventListener('click', () => {
        gameOverScreen.style.display = 'none';
        game.resetGame();
    });

    menuButton.addEventListener('click', () => {
        window.location.href = 'select.html';
    });

    // Mute button functionality
    muteButton.addEventListener('click', toggleMute);

    function toggleMute() {
        const isMuted = muteButton.classList.toggle('muted');
        game.soundManager.sounds.background.muted = isMuted;
        Object.values(game.soundManager.sounds).forEach(sound => {
            sound.muted = isMuted;
        });
        muteButton.innerHTML = isMuted 
            ? '<i class="fas fa-volume-mute"></i>' 
            : '<i class="fas fa-volume-up"></i>';
    }

    // Wave announcement event listener
    document.addEventListener('waveStart', (e) => {
        waveNumber.textContent = e.detail.wave;
        waveAnnouncement.classList.add('show');
        
        setTimeout(() => {
            waveAnnouncement.classList.remove('show');
        }, 2000);
    });

    // Initialize high scores display
    showHighScores();
}
