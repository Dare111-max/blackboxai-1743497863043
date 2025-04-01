// FREE GUY 1 - Power-up System

class PowerUp {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.collected = false;
        this.duration = 15000; // 15 seconds
        this.spawnTime = Date.now();
    }

    draw(ctx) {
        if (!this.collected) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            
            // Different colors for different power-ups
            switch(this.type) {
                case 'health':
                    ctx.fillStyle = '#e63946';
                    break;
                case 'speed':
                    ctx.fillStyle = '#4cc9f0';
                    break;
                case 'invincible':
                    ctx.fillStyle = '#f77f00';
                    break;
            }
            
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw icon
            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            let icon = '';
            switch(this.type) {
                case 'health': icon = '❤'; break;
                case 'speed': icon = '⚡'; break;
                case 'invincible': icon = '🛡'; break;
            }
            
            ctx.fillText(icon, this.x, this.y);
        }
    }
}

class PowerUpManager {
    constructor(game) {
        this.game = game;
        this.powerUps = [];
        this.lastSpawnTime = 0;
        this.spawnInterval = 30000; // 30 seconds
    }

    spawn() {
        const now = Date.now();
        if (now - this.lastSpawnTime > this.spawnInterval) {
            const types = ['health', 'speed', 'invincible'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            // Spawn within safe zone
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * this.game.safeZone.radius * 0.8;
            const x = this.game.safeZone.x + Math.cos(angle) * distance;
            const y = this.game.safeZone.y + Math.sin(angle) * distance;
            
            this.powerUps.push(new PowerUp(type, x, y));
            this.lastSpawnTime = now;
        }
    }

    checkCollisions(player) {
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            if (!powerUp.collected) {
                const dx = player.x - powerUp.x;
                const dy = player.y - powerUp.y;
                const distance = Math.sqrt(dx*dx + dy*dy);
                
                if (distance < player.radius + powerUp.radius) {
                    player.addPowerUp(powerUp.type, powerUp.duration);
                    powerUp.collected = true;
                    this.powerUps.splice(i, 1);
                    this.game.soundManager.play('powerup');
                }
            }
        }
    }

    update() {
        // Remove power-ups that have existed too long without being collected
        const now = Date.now();
        this.powerUps = this.powerUps.filter(powerUp => 
            !powerUp.collected && now - powerUp.spawnTime < 20000 // 20 second lifetime
        );
    }

    draw(ctx) {
        this.powerUps.forEach(powerUp => powerUp.draw(ctx));
    }
}

export { PowerUp, PowerUpManager };