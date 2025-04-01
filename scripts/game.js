class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.health = 100;
        this.weapons = [];
        this.currentWeapon = null;
        this.speed = 5;
        this.isMoving = false;
    }

    move(direction) {
        switch(direction) {
            case 'up': this.y -= this.speed; break;
            case 'down': this.y += this.speed; break;
            case 'left': this.x -= this.speed; break;
            case 'right': this.x += this.speed; break;
        }
        this.isMoving = true;
    }

    stopMoving() {
        this.isMoving = false;
    }

    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        console.log('Player eliminated');
        // Trigger death animation and respawn logic
    }

    addWeapon(weapon) {
        this.weapons.push(weapon);
        if (!this.currentWeapon) {
            this.currentWeapon = weapon;
            this.currentWeaponIndex = 0;
        }
    }

    switchWeapon(direction) {
        if (this.weapons.length <= 1) return;
        
        this.currentWeaponIndex = (this.currentWeaponIndex + direction) % this.weapons.length;
        if (this.currentWeaponIndex < 0) {
            this.currentWeaponIndex = this.weapons.length - 1;
        }
        this.currentWeapon = this.weapons[this.currentWeaponIndex];
        this.updateWeaponUI();
    }

    updateWeaponUI() {
        if (document.getElementById('ammoCounter')) {
            document.getElementById('ammoCounter').textContent = 
                `${this.currentWeapon.ammo}/${this.currentWeapon.maxAmmo}`;
        }
    }
}

class Weapon {
    constructor(name, damage, ammo, fireRate) {
        this.name = name;
        this.damage = damage;
        this.maxAmmo = ammo;
        this.ammo = ammo;
        this.fireRate = fireRate; // shots per second
        this.lastFired = 0;
    }

    canFire(currentTime) {
        return this.ammo > 0 && 
               currentTime - this.lastFired > 1000 / this.fireRate;
    }

    fire(currentTime) {
        if (this.canFire(currentTime)) {
            this.ammo--;
            this.lastFired = currentTime;
            
            // Create muzzle flash effect
            if (document.getElementById('gameCanvas')) {
                const canvas = document.getElementById('gameCanvas');
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#ff9900';
                ctx.fillRect(player1.x + 15, player1.y + 10, 10, 5);
                setTimeout(() => {
                    ctx.clearRect(player1.x + 15, player1.y + 10, 10, 5);
                }, 50);
            }
            
            // Play shooting sound
            if (this.sound) {
                this.sound.currentTime = 0;
                this.sound.play();
            }
            
            return this.damage;
        }
        return 0;
    }

    reload() {
        this.ammo = this.maxAmmo;
    }
}

// Game State Manager
class Enemy extends Player {
    constructor(x, y) {
        super(x, y);
        this.speed = 2;
        this.lastDirectionChange = 0;
        this.direction = Math.random() * Math.PI * 2;
    }

    update(currentTime) {
        // Change direction occasionally
        if (currentTime - this.lastDirectionChange > 2000) {
            this.direction = Math.random() * Math.PI * 2;
            this.lastDirectionChange = currentTime;
        }

        // Move in current direction
        this.x += Math.cos(this.direction) * this.speed;
        this.y += Math.sin(this.direction) * this.speed;

        // Simple AI - move toward player if visible
        const dx = player1.x - this.x;
        const dy = player1.y - this.y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        
        if (distance < 300) { // Detection range
            this.direction = Math.atan2(dy, dx);
        }
    }
}

class SoundManager {
    constructor() {
        this.sounds = {
            shoot: new Audio('assets/sounds/shoot.wav'),
            hit: new Audio('assets/sounds/hit.wav'),
            reload: new Audio('assets/sounds/reload.wav'),
            death: new Audio('assets/sounds/death.wav'),
            background: new Audio('assets/sounds/background.mp3')
        };
        
        // Set volumes
        this.sounds.shoot.volume = 0.3;
        this.sounds.hit.volume = 0.4;
        this.sounds.reload.volume = 0.5;
        this.sounds.death.volume = 0.6;
        this.sounds.background.volume = 0.2;
        this.sounds.background.loop = true;
    }

    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play();
        }
    }
}

class Game {
    constructor() {
        this.players = [];
        this.enemies = [];
        this.safeZone = { x: 500, y: 500, radius: 1000 };
        this.storm = { active: true, damage: 0.5 };
        this.gameTime = 1800; // 30 minutes in seconds
        this.lastUpdate = Date.now();
        this.gameObjects = [];
        this.lastEnemySpawn = 0;
        this.score = 0;
        this.soundManager = new SoundManager();
    }

    spawnEnemies(currentTime) {
        if (currentTime - this.lastEnemySpawn > 10000) { // Every 10 seconds
            const count = Math.floor(Math.random() * 3) + 1; // 1-3 enemies
            for (let i = 0; i < count; i++) {
                // Spawn at edge of safe zone
                const angle = Math.random() * Math.PI * 2;
                const x = this.safeZone.x + Math.cos(angle) * this.safeZone.radius;
                const y = this.safeZone.y + Math.sin(angle) * this.safeZone.radius;
                
                const enemy = new Enemy(x, y);
                enemy.addWeapon(new Weapon('Pistol', 8, 15, 3));
                this.enemies.push(enemy);
            }
            this.lastEnemySpawn = currentTime;
        }
    }

    addPlayer(player) {
        this.players.push(player);
    }

    update() {
        const now = Date.now();
        const deltaTime = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;

        // Update game time
        this.gameTime -= deltaTime;

        // Shrink safe zone periodically
        if (this.gameTime % 60 < deltaTime) {
            this.safeZone.radius = Math.max(100, this.safeZone.radius - 50);
        }

        // Check player positions against safe zone
        this.players.forEach(player => {
            const dx = player.x - this.safeZone.x;
            const dy = player.y - this.safeZone.y;
            const distance = Math.sqrt(dx*dx + dy*dy);
            
            if (distance > this.safeZone.radius) {
                player.takeDamage(this.storm.damage * deltaTime);
            }
        });
    }
}

// Character stats
const characters = {
    1: { name: 'Phoenix', speed: 6, health: 100, damageMod: 1.05 },
    2: { name: 'Juggernaut', speed: 3, health: 150, damageMod: 1.0 },
    3: { name: 'Ghost', speed: 5, health: 90, damageMod: 1.0, stealth: true },
    4: { name: 'Medic', speed: 4, health: 120, damageMod: 0.9, healing: 1.25 },
    5: { name: 'Sniper', speed: 4, health: 100, damageMod: 1.3 }
};

// Global game instance
const game = new Game();
let player1;

// Initialize game with character selection
function initGame(characterId) {
    const character = characters[characterId];
    player1 = new Player(0, 0);
    
    // Apply character stats
    player1.speed = character.speed;
    player1.maxHealth = character.health;
    player1.health = character.health;
    player1.damageMod = character.damageMod;
    
    // Add weapons based on character
    switch(characterId) {
        case 1: // Phoenix
            player1.addWeapon(new Weapon('AK-47', 15 * character.damageMod, 30, 10));
            player1.addWeapon(new Weapon('Pistol', 10 * character.damageMod, 15, 5));
            break;
        case 2: // Juggernaut
            player1.addWeapon(new Weapon('LMG', 20 * character.damageMod, 50, 5));
            break;
        case 3: // Ghost
            player1.addWeapon(new Weapon('SMG', 12 * character.damageMod, 30, 15));
            player1.addWeapon(new Weapon('Knife', 25 * character.damageMod, 1, 1));
            break;
        case 4: // Medic
            player1.addWeapon(new Weapon('Shotgun', 18 * character.damageMod, 8, 2));
            break;
        case 5: // Sniper
            player1.addWeapon(new Weapon('Sniper', 30 * character.damageMod, 5, 1));
            player1.addWeapon(new Weapon('Pistol', 10 * character.damageMod, 15, 5));
            break;
    }

    game.addPlayer(player1);
    return game;
}

// Game loop
function gameLoop() {
    game.update();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();

// Export for debugging
window.game = game;
window.player1 = player1;