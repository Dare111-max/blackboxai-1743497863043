import { Enemy } from './enemies.js';
import { BossAbilities } from './bossAbilities.js';

// Base Boss Class
export class BossEnemy extends Enemy {
    constructor(x, y) {
        super(x, y);
        this.isBoss = true;
        this.scale = 1.5;
        this.phase = 1;
        this.phaseThresholds = [0.66, 0.33];
    }

    update(currentTime) {
        super.update(currentTime);
        
        if (this.phase === 1 && this.health < this.maxHealth * this.phaseThresholds[0]) {
            this.enterPhase(2);
        } else if (this.phase === 2 && this.health < this.maxHealth * this.phaseThresholds[1]) {
            this.enterPhase(3);
        }
    }

    enterPhase(newPhase) {
        this.phase = newPhase;
        this.game.soundManager.play('bossPhase');
        document.dispatchEvent(new CustomEvent('bossPhase', { 
            detail: { phase: newPhase } 
        }));
    }

    createProjectile(angle, speed, damage, color) {
        this.game.gameObjects.push({
            x: this.x + 15 * this.scale,
            y: this.y + 15 * this.scale,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            damage: damage,
            update: function() {
                this.x += this.vx;
                this.y += this.vy;
                
                const pdx = player1.x - this.x;
                const pdy = player1.y - this.y;
                const pDistance = Math.sqrt(pdx*pdx + pdy*pdy);
                
                if (pDistance < 20) {
                    player1.takeDamage(this.damage);
                    this.shouldRemove = true;
                }
                
                if (this.x < 0 || this.x > game.canvas.width || 
                    this.y < 0 || this.y > game.canvas.height) {
                    this.shouldRemove = true;
                }
            },
            draw: function(ctx) {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }

    onDefeat() {
        document.dispatchEvent(new CustomEvent('bossDefeated'));
    }
}

// Tank Boss - Heavy and slow with area attacks
export class TankBoss extends BossEnemy {
    constructor(x, y) {
        super(x, y);
        this.health = 600;
        this.maxHealth = 600;
        this.speed = 1.5;
        this.attackRange = 150;
    }

    enterPhase(newPhase) {
        super.enterPhase(newPhase);
        
        if (newPhase === 2) {
            this.speed = 2;
            this.attackRange = 200;
            this.attackBehavior = () => BossAbilities.spiralAttack(this);
        } else if (newPhase === 3) {
            this.speed = 2.5;
            this.attackRange = 250;
            this.attackBehavior = () => BossAbilities.circleAttack(this);
        }
    }
}

// Sniper Boss - Fast with precision attacks
export class SniperBoss extends BossEnemy {
    constructor(x, y) {
        super(x, y);
        this.health = 400;
        this.maxHealth = 400;
        this.speed = 2;
        this.attackRange = 400;
        this.phaseThresholds = [0.5, 0.2];
    }

    enterPhase(newPhase) {
        super.enterPhase(newPhase);
        
        if (newPhase === 2) {
            this.speed = 2.5;
            this.attackBehavior = () => BossAbilities.tripleShot(this);
        } else if (newPhase === 3) {
            this.speed = 3;
            this.attackBehavior = () => BossAbilities.pentagonShot(this);
        }
    }
}