// Boss Sound Effects Manager
export class BossSoundManager {
    constructor() {
        this.sounds = {
            phaseTransition: new Audio('assets/sounds/boss/phase.wav'),
            spiralAttack: new Audio('assets/sounds/boss/spiral.wav'),
            circleAttack: new Audio('assets/sounds/boss/circle.wav'),
            pentagonAttack: new Audio('assets/sounds/boss/pentagon.wav'),
            bossDefeat: new Audio('assets/sounds/boss/defeat.wav')
        };

        // Set volume levels
        this.sounds.phaseTransition.volume = 0.7;
        this.sounds.spiralAttack.volume = 0.6;
        this.sounds.circleAttack.volume = 0.8;
        this.sounds.pentagonAttack.volume = 1.0;
        this.sounds.bossDefeat.volume = 0.9;
    }

    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play();
        }
    }
}