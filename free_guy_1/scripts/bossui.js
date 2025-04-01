// Boss UI Manager
export class BossUI {
    constructor(game) {
        this.game = game;
        this.currentBoss = null;
        
        // Create boss UI elements
        this.bossHealthContainer = document.createElement('div');
        this.bossHealthContainer.className = 'boss-health-container';
        this.bossHealthContainer.innerHTML = `
            <div id="bossHealthBar" class="boss-health-bar"></div>
            <div id="bossHealthText" class="boss-health-text">100%</div>
        `;
        document.body.appendChild(this.bossHealthContainer);
        
        this.bossDefeatEffect = document.createElement('div');
        this.bossDefeatEffect.className = 'boss-defeat';
        document.body.appendChild(this.bossDefeatEffect);
        
        this.bossRewardDisplay = document.createElement('div');
        this.bossRewardDisplay.className = 'boss-reward';
        document.body.appendChild(this.bossRewardDisplay);
    }

    trackBoss(boss) {
        this.currentBoss = boss;
        this.bossHealthContainer.style.display = 'block';
        this.updateBossHealth();
    }

    updateBossHealth() {
        if (this.currentBoss) {
            const healthPercent = (this.currentBoss.health / this.currentBoss.maxHealth) * 100;
            const healthBar = this.bossHealthContainer.querySelector('.boss-health-bar');
            const healthText = this.bossHealthContainer.querySelector('.boss-health-text');
            
            healthBar.style.width = `${healthPercent}%`;
            healthText.textContent = `${Math.round(healthPercent)}%`;
            
            // Change color based on phase
            if (this.currentBoss.phase === 2) {
                healthBar.style.backgroundColor = '#ff6600';
            } else if (this.currentBoss.phase === 3) {
                healthBar.style.backgroundColor = '#e63946';
            }
            
            // Check for defeat
            if (this.currentBoss.health <= 0) {
                this.showBossDefeat();
            }
        }
    }

    showBossDefeat() {
        if (!this.currentBoss) return;
        
        // Determine rewards based on boss type
        let rewardText = 'BOSS DEFEATED!\n';
        let scoreReward = 500;
        let healthReward = this.game.player1.maxHealth;
        
        if (this.currentBoss instanceof TankBoss) {
            rewardText += '+500 SCORE\n+MAX HEALTH\n+DEFENSE BOOST';
            scoreReward = 500;
            this.game.player1.defenseMod = 0.7; // 30% damage reduction
        } else if (this.currentBoss instanceof SniperBoss) {
            rewardText += '+750 SCORE\n+MAX HEALTH\n+SPEED BOOST';
            scoreReward = 750;
            this.game.player1.speed *= 1.3; // 30% speed increase
        }
        
        // Visual effects
        this.bossDefeatEffect.classList.add('show');
        this.bossRewardDisplay.textContent = rewardText;
        this.bossRewardDisplay.classList.add('show');
        
        // Apply rewards
        this.game.score += scoreReward;
        this.game.player1.health = healthReward;
        
        // Update UI
        document.getElementById('scoreDisplay').textContent = this.game.score;
        
        // Clean up
        setTimeout(() => {
            this.bossDefeatEffect.classList.remove('show');
            this.bossRewardDisplay.classList.remove('show');
            this.bossHealthContainer.style.display = 'none';
            this.currentBoss = null;
        }, 3000);
    }

    showPhaseTransition(phase) {
        // Play phase transition sound
        this.audio.playSound('phase', 0.8);
        
        const phaseText = document.createElement('div');
        phaseText.className = 'phase-transition';
        phaseText.textContent = `PHASE ${phase}`;
        document.body.appendChild(phaseText);
        
        setTimeout(() => {
            phaseText.classList.add('show');
            setTimeout(() => {
                phaseText.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(phaseText);
                }, 1000);
            }, 2000);
        }, 100);
    }
}