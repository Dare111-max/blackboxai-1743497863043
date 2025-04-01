// FREE GUY 1 - Enhanced Game Script

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.health = 100;
        this.maxHealth = 100;
        this.weapons = [];
        this.items = [];
        this.currentWeapon = null;
        this.speed = 5;
        this.isMoving = false;
        this.score = 0;
        this.kills = 0;
        this.powerUps = {};
        this.isInvincible = false;
    }

    // [Previous player methods...]

    addPowerUp(type, duration) {
        this.powerUps[type] = Date.now() + duration;
        switch(type) {
            case 'health':
                this.health = Math.min(this.maxHealth, this.health + 50);
                break;
            case 'speed':
                this.speed *= 1.5;
                break;
            case 'invincible':
                this.isInvincible = true;
                break;
        }
    }

    checkPowerUps() {
        const now = Date.now();
        for (const [type, expiry] of Object.entries(this.powerUps)) {
            if (now > expiry) {
                this.removePowerUp(type);
            }
        }
    }

    removePowerUp(type) {
        switch(type) {
            case 'speed':
                this.speed /= 1.5;
                break;
            case 'invincible':
                this.isInvincible = false;
                break;
        }
        delete this.powerUps[type];
    }
}

// New Weapon Types
class SniperRifle extends Weapon {
    constructor() {
        super('Sniper', 50, 5, 0.5);
        this.zoomLevel = 2;
    }
}

class RocketLauncher extends Weapon {
    constructor() {
        super('Rocket', 100, 3, 0.3);
        this.splashDamage = true;
    }
}

// New Enemy Types
class SniperEnemy extends Enemy {
    constructor(x, y) {
        super(x, y);
        this.range = 500;
        this.addWeapon(new SniperRifle());
    }
}

class TankEnemy extends Enemy {
    constructor(x, y) {
        super(x, y);
        this.health = 200;
        this.speed = 1.5;
        this.addWeapon(new RocketLauncher());
    }
}

// PowerUp Class
class PowerUp {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.collected = false;
    }
}

// Game Over System
function showGameOver(win) {
    const message = win ? "YOU WIN!" : "GAME OVER";
    // Display game over screen
}

// Multiplayer Foundation
class Multiplayer {
    constructor() {
        this.players = {};
        this.socket = io(); // Would connect to socket.io server
    }
}

// [Rest of original game code with enhancements...]