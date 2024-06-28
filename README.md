# Particle Waves

## Simple plugin to create an aminated particle wave

**Big thanks to @stufreen for the inspiration!**

### To create a particle wave:

`<canvas id="particle1" class="particle-canvas"></canvas>`

`ParticleAnimation.start({
    canvasId: 'particle1', //ID of the particle canvas
    numParticles: 500, // number of particles
    particleSize: 0.3, // size of particles
    speed: 95000, // spped in milliseconds
    colorR: { mean: 255, dev: 0 }, // Red of RGB + deviation
    colorG: { mean: 255, dev: 20 }, // Green of RGB + deviation
    colorB: { mean: 255, dev: 0 } // Blue of RGB + deviation
});`