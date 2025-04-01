// Audio Controller for Boss Battles
export class AudioController {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.sounds = new Map();
        this.loadSounds();
    }

    async loadSounds() {
        const soundFiles = {
            phase: 'assets/sounds/boss/phase.wav',
            spiral: 'assets/sounds/boss/spiral.wav',
            circle: 'assets/sounds/boss/circle.wav',
            pentagon: 'assets/sounds/boss/pentagon.wav',
            defeat: 'assets/sounds/boss/defeat.wav'
        };

        for (const [name, url] of Object.entries(soundFiles)) {
            try {
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
                this.sounds.set(name, audioBuffer);
            } catch (err) {
                console.error(`Error loading sound ${name}:`, err);
            }
        }
    }

    playSound(name, volume = 1.0, playbackRate = 1.0) {
        if (!this.sounds.has(name)) return;

        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        
        source.buffer = this.sounds.get(name);
        source.playbackRate.value = playbackRate;
        gainNode.gain.value = volume;
        
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        source.start(0);
        return source;
    }

    // Spatial audio positioning
    playPositionalSound(name, x, y, volume = 1.0) {
        if (!this.sounds.has(name)) return;
        
        // Check for walls between sound source and player
        const occlusion = this.checkSoundOcclusion(x, y);
        if (occlusion.occluded) {
            volume *= occlusion.volumeFactor;
            this.applyOcclusionFilter(source, occlusion.wallType);
        }

        // Create audio nodes
        const source = this.audioContext.createBufferSource();
        const panner = this.audioContext.createPanner();
        const gainNode = this.audioContext.createGain();
        
        // Configure spatial audio
        panner.panningModel = 'HRTF';
        panner.distanceModel = 'inverse';
        panner.refDistance = 100;
        panner.maxDistance = 1000;
        panner.rolloffFactor = 1;
        
        // Calculate position relative to player
        const playerX = game.player1.x;
        const playerY = game.player1.y;
        const relX = x - playerX;
        const relY = y - playerY;
        
        // Set 3D position (convert 2D game coords to 3D audio space)
        panner.setPosition(relX, 0, -relY); // Negative Z for proper orientation
        
        // Configure volume and playback
        source.buffer = this.sounds.get(name);
        gainNode.gain.value = volume;
        
        // Connect nodes
        source.connect(panner);
        panner.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        source.start(0);
        return { source, panner, gainNode };
    }

    checkSoundOcclusion(x, y) {
        const player = game.player1;
        const walls = game.walls;
        const result = {
            occluded: false,
            wallType: 'default',
            volumeFactor: 1.0
        };
        
        // Simple line-of-sight check
        for (const wall of walls) {
            if (this.lineIntersectsRect(
                player.x, player.y, 
                x, y,
                wall.x, wall.y,
                wall.width, wall.height
            )) {
                return true;
            }
        }
        return false;
    }

    // Line intersection utilities
    lineIntersectsRect(x1, y1, x2, y2, rx, ry, rw, rh) {
        // Check if line intersects any of the rectangle's edges
        return this.lineIntersectsLine(x1,y1,x2,y2, rx,ry,rx+rw,ry) || // top
               this.lineIntersectsLine(x1,y1,x2,y2, rx+rw,ry,rx+rw,ry+rh) || // right
               this.lineIntersectsLine(x1,y1,x2,y2, rx,ry+rh,rx+rw,ry+rh) || // bottom
               this.lineIntersectsLine(x1,y1,x2,y2, rx,ry,rx,ry+rh); // left
    }

    applyOcclusionFilter(source, wallType = 'default') {
        const filter = this.audioContext.createBiquadFilter();
        filter.type = "lowpass";
        
        // Different filter settings based on wall material
        switch(wallType) {
            case 'stone':
                filter.frequency.value = 800;
                filter.Q.value = 0.8;
                break;
            case 'wood':
                filter.frequency.value = 1200; 
                filter.Q.value = 1.2;
                break;
            case 'glass':
                filter.frequency.value = 2000;
                filter.Q.value = 1.5;
                break;
            default: // concrete/metal
                filter.frequency.value = 1000;
                filter.Q.value = 1.0;
        }
        
        source.disconnect();
        source.connect(filter);
        filter.connect(this.audioContext.destination);
    }

    lineIntersectsLine(x1,y1,x2,y2, x3,y3,x4,y4) {
        // Calculate intersection between two lines
        const denom = (y4-y3)*(x2-x1) - (x4-x3)*(y2-y1);
        if (denom === 0) return false; // parallel
        
        const ua = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / denom;
        const ub = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / denom;
        
        return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
    }
}