// FREE GUY 1 - High Score System

class ScoreManager {
    constructor() {
        this.scores = JSON.parse(localStorage.getItem('freeGuyHighScores')) || [];
        this.maxScores = 10;
    }

    addScore(name, score, wave, kills) {
        const newScore = {
            name: name,
            score: score,
            wave: wave,
            kills: kills,
            date: new Date().toLocaleDateString()
        };

        this.scores.push(newScore);
        this.scores.sort((a, b) => b.score - a.score);
        this.scores = this.scores.slice(0, this.maxScores);
        localStorage.setItem('freeGuyHighScores', JSON.stringify(this.scores));
    }

    getHighScores() {
        return this.scores;
    }

    isHighScore(score) {
        if (this.scores.length < this.maxScores) return true;
        return score > this.scores[this.scores.length - 1].score;
    }
}

export const scoreManager = new ScoreManager();

// Score display component
export function showHighScores() {
    const scores = scoreManager.getHighScores();
    const container = document.getElementById('highScoresContainer');
    
    if (!container) return;

    container.innerHTML = `
        <h2>HIGH SCORES</h2>
        <div class="scores-list">
            ${scores.map((score, i) => `
                <div class="score-entry ${i < 3 ? 'top-score' : ''}">
                    <span class="rank">${i + 1}.</span>
                    <span class="name">${score.name}</span>
                    <span class="score">${score.score}</span>
                    <span class="details">Wave ${score.wave} | ${score.kills} kills</span>
                </div>
            `).join('')}
        </div>
    `;
}