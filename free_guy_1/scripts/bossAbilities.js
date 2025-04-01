// Boss Ability System
// Screen shake utility
function triggerScreenShake(intensity = 5, duration = 500) {
    const container = document.createElement('div');
    container.className = 'shake-container';
    document.body.appendChild(container);
    
    // Apply shake effect to game canvas
    const canvas = document.getElementById('gameCanvas');
    canvas.classList.add('shake-effect');
    canvas.style.animationDuration = `${duration}ms`;
    
    // Clean up after animation
    setTimeout(() => {
        canvas.classList.remove('shake-effect');
        container.remove();
    }, duration);
}

export class BossAbilities {
    static spiralAttack(boss, count=8, delay=100) {
        // Mild screen shake
        triggerScreenShake(3, 400);
        
        // Create spiral visual effect
        const spiral = document.createElement('div');
        spiral.className = 'ability-effect spiral-effect';
        spiral.style.left = `${boss.x - 150}px`;
        spiral.style.top = `${boss.y - 150}px`;
        document.body.appendChild(spiral);
        
        setTimeout(() => {
            spiral.classList.add('show');
            setTimeout(() => {
                spiral.classList.remove('show');
                setTimeout(() => spiral.remove(), 300);
            }, 1000);
        }, 0);

        // Create projectiles
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const angle = Math.PI * 2 * (i/count);
                boss.createProjectile(angle, 7, 30, '#ff0000');
            }, i * delay);
        }
    }

    static circleAttack(boss, count=12) {
        for (let i = 0; i < count; i++) {
            const angle = Math.PI * 2 * (i/count);
            boss.createProjectile(angle, 5, 20, '#ff6600');
        }
    }

    static tripleShot(boss) {
        for (let i = 0; i < 3; i++) {
            const angle = Math.atan2(
                player1.y - boss.y,
                player1.x - boss.x
            ) + (i-1) * 0.2;
            boss.createProjectile(angle, 10, 25, '#4cc9f0');
        }
    }

    static pentagonShot(boss) {
        // Strong screen shake
        triggerScreenShake(10, 1000);
        
        // Create pentagon markers
        for (let i = 0; i < 5; i++) {
            const angle = Math.PI * 2 * (i/5);
            const marker = document.createElement('div');
            marker.className = 'ability-effect pentagon-marker';
            marker.style.left = `${boss.x + Math.cos(angle) * 100 - 10}px`;
            marker.style.top = `${boss.y + Math.sin(angle) * 100 - 10}px`;
            document.body.appendChild(marker);
            
            setTimeout(() => {
                marker.classList.add('show');
                setTimeout(() => {
                    marker.classList.remove('show');
                    setTimeout(() => marker.remove(), 300);
                }, 1000);
            }, 0);
            
            // Create projectile
            boss.createProjectile(angle, 6, 15, '#e63946');
        }
    }
}