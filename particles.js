// modified version of random-normal
function normalPool(o){
    var r=0;
    do{
        var a=Math.round(normal({mean:o.mean,dev:o.dev}));
        if(a<o.pool.length&&a>=0) return o.pool[a];
        r++;
    } while(r<100)
}

function randomNormal(o){
    if(o=Object.assign({mean:0,dev:1,pool:[]},o),Array.isArray(o.pool)&&o.pool.length>0)
        return normalPool(o);
    var r,a,n,e,l=o.mean,t=o.dev;
    do{
        r=(a=2*Math.random()-1)*a+(n=2*Math.random()-1)*n;
    } while(r>=1);
    return e=a*Math.sqrt(-2*Math.log(r)/r),t*e+l
}

class ParticleAnimation {
    constructor(options = {}) {
        this.NUM_PARTICLES = options.numParticles || 500;
        this.PARTICLE_SIZE = options.particleSize || 0.5; // View heights
        this.SPEED = options.speed || 80000; // Milliseconds
        this.colorR = options.colorR || { mean: 238, dev: 0 };
        this.colorG = options.colorG || { mean: 49, dev: 20 };
        this.colorB = options.colorB || { mean: 107, dev: 0 };
        this.canvasId = options.canvasId || 'particle';
        this.particles = [];
    }

    rand(low, high) {
        return Math.random() * (high - low) + low;
    }

    createParticle(canvas) {
        const colour = {
            r: randomNormal(this.colorR),
            g: randomNormal(this.colorG),
            b: randomNormal(this.colorB),
            a: this.rand(0, 1),
        };
        return {
            x: -2,
            y: -2,
            diameter: Math.max(0, randomNormal({ mean: this.PARTICLE_SIZE, dev: this.PARTICLE_SIZE / 2 })),
            duration: randomNormal({ mean: this.SPEED, dev: this.SPEED * 0.1 }),
            amplitude: randomNormal({ mean: 16, dev: 2 }),
            offsetY: randomNormal({ mean: 0, dev: 10 }),
            arc: Math.PI * 2,
            startTime: performance.now() - this.rand(0, this.SPEED),
            colour: `rgba(${Math.round(colour.r)}, ${Math.round(colour.g)}, ${Math.round(colour.b)}, ${colour.a})`,
        };
    }

    moveParticle(particle, canvas, time) {
        const progress = ((time - particle.startTime) % particle.duration) / particle.duration;
        return {
            ...particle,
            x: progress,
            y: ((Math.sin(progress * particle.arc) * particle.amplitude) + particle.offsetY),
        };
    }

    drawParticle(particle, canvas, ctx) {
        const vh = canvas.height / 100;

        ctx.fillStyle = particle.colour;
        ctx.beginPath();
        ctx.ellipse(
            particle.x * canvas.width,
            particle.y * vh + (canvas.height / 2),
            particle.diameter * vh,
            particle.diameter * vh,
            0,
            0,
            2 * Math.PI
        );
        ctx.fill();
    }

    draw(time, canvas, ctx) {
        // Move particles
        this.particles.forEach((particle, index) => {
            this.particles[index] = this.moveParticle(particle, canvas, time);
        });

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the particles
        this.particles.forEach((particle) => {
            this.drawParticle(particle, canvas, ctx);
        });

        // Schedule next frame
        requestAnimationFrame((time) => this.draw(time, canvas, ctx));
    }

    initializeCanvas() {
        let canvas = document.getElementById(this.canvasId);
        canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        let ctx = canvas.getContext("2d");

        window.addEventListener('resize', () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx = canvas.getContext("2d");
        });

        return [canvas, ctx];
    }

    startAnimation() {
        const [canvas, ctx] = this.initializeCanvas();

        // Create a bunch of particles
        for (let i = 0; i < this.NUM_PARTICLES; i++) {
            this.particles.push(this.createParticle(canvas));
        }
        
        requestAnimationFrame((time) => this.draw(time, canvas, ctx));
    }

    static start(options) {
        const animation = new ParticleAnimation(options);
        animation.startAnimation();
    }
}