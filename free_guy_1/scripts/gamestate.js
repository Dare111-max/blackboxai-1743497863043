// FREE GUY 1 - Game State Manager
import { Enemy, SniperEnemy, TankEnemy } from './enemies.js';

class GameState {
    constructor(game) {
        this.game = game;
        this.state = 'running'; // running, gameover, win
        this.wave = 1;
        this.maxWaves = 5;
        this.enemiesPerWave = [5, 8, 12, 15, 20];
        this.lastPowerUpSpawn = 0;
    }

    update() {
        if (this.state !== 'running') return;

        // Check player death
        if (this.game.player1.health <= 0) {
            this.endGame(false);
            return;
        }

        // Check wave completion
        if (this.game.enemies.length === 0) {
            if (this.wave < this.maxWaves) {
                this.nextWave();
            } else {
                this.endGame(true);
            }
        }
    }

    nextWave() {
        this.wave++;
        
        // Show wave announcement
        const waveEvent = new CustomEvent('waveStart', {
            detail: { wave: this.wave }
        });
        document.dispatchEvent(waveEvent);
        
        // Increase difficulty
        const difficultyScale = 1 + (this.wave * 0.1);
        this.game.player1.damageMod *= 1.05; // Player gets slightly stronger
        
        this.spawnWave();
        this.game.soundManager.play('newWave');
    }

    spawnWave() {
        // Every 3rd wave is a boss wave
        if (this.wave % 3 === 0) {
            this.spawnBossWave();
        } else {
            const count = this.enemiesPerWave[this.wave - 1];
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const x = this.game.safeZone.x + Math.cos(angle) * this.game.safeZone.radius;
                const y = this.game.safeZone.y + Math.sin(angle) * this.game.safeZone.radius;
                
                let enemy;
                const rand = Math.random();
                if (this.wave < 3 && rand < 0.8) {
                    enemy = new Enemy(x, y);
                } else if (this.wave < 4 && rand < 0.9) {
                    enemy = new SniperEnemy(x, y);
                } else {
                    enemy = new TankEnemy(x, y);
                }
                this.game.enemies.push(enemy);
            }
        }
    }

    spawnBossWave() {
        // Spawn boss in center
        const boss = new TankEnemy(
            this.game.safeZone.x, 
            this.game.safeZone.y
        );
        boss.health = 500;
        boss.maxHealth = 500;
        boss.scale = 1.5;
        boss.addWeapon(new RocketLauncher());
        boss.addWeapon(new SniperRifle());
        this.game.enemies.push(boss);

        // Special boss wave announcement
        const bossEvent = new CustomEvent('bossWave', {
            detail: { wave: this.wave }
        });
        document.dispatchEvent(bossEvent);
    }

    endGame(win) {
        this.state = win ? 'win' : 'gameover';
        const event = new CustomEvent('gameOver', {
            detail: {
                win: win,
                score: this.game.score,
                wave: this.wave,
                kills: this.game.player1.kills
            }
        });
        document.dispatchEvent(event);
    }

    resetGame() {
        this.state = 'running';
        this.wave = 1;
        this.game.score = 0;
        this.game.enemies = [];
        this.game.gameObjects = [];
        this.game.player1.health = this.game.player1.maxHealth;
        this.game.player1.kills = 0;
        this.spawnWave();
    }
}

export default GameState;