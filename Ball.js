const INITIAL_VELOCITY = 0.025;
const VELOCITY_INCREASE = .000001;
const hitWall = new Audio('hitWall.wav');
const hitPaddle = new Audio('hitPaddle.wav');
let collisionAllowed=true;
export default class Ball {
    constructor(ballElem) {
        this.ballElem = ballElem;
        this.reset();
    }

    get x() {
        return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--x"));
    }

    set x(value) {
        this.ballElem.style.setProperty("--x", value);
    }

    get y() {
        return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--y"));
    }

    set y(value) {
        this.ballElem.style.setProperty("--y", value);
    }

    rect() {
        return this.ballElem.getBoundingClientRect();
    }

    reset() {
        this.x = 50;
        this.y = 50;
        this.direction = { x: 0, y: 0 };
        this.velocity = INITIAL_VELOCITY;

        while (
            Math.abs(this.direction.x) <= .2 ||
            Math.abs(this.direction.x) >= .9
        ) {
            const heading = randomNumberBetween(0, 2 * Math.PI);
            this.direction = { x: Math.cos(heading), y: Math.sin(heading) };
        }
    }

    update(delta, paddleRects) {
        this.x += this.direction.x * this.velocity * delta;
        this.y += this.direction.y * this.velocity * delta;
        this.velocity += VELOCITY_INCREASE * delta;
    
        const rect = this.rect();
    
        // Wall collisions
        if (window.innerWidth <= 768) { // Mobile
            if (rect.right >= window.innerWidth || rect.left <= 0) {
                this.direction.x *= -1;
                hitWall.currentTime = 0;
                hitWall.play();
            }
        } else { // Desktop
            if (rect.bottom >= window.innerHeight || rect.top <= 0) {
                this.direction.y *= -1;
                hitWall.currentTime = 0;
                hitWall.play();
            }
        }
    
        // Paddle collisions
        if (paddleRects.some(r => isCollision(r, rect))) {
            if (window.innerWidth <= 768) { // Mobile
                this.direction.y *= -1;
                // Adjust ball position slightly to avoid multiple collisions
                if (rect.top < window.innerHeight / 2) {
                    this.y += 0.01;
                } else {
                    this.y -= 0.01;
                }
            } else { // Desktop
                this.direction.x *= -1;
                // Adjust ball position slightly to avoid multiple collisions
                if (rect.left < window.innerWidth / 2) {
                    this.x += 0.001;
                } else {
                    this.x -= 0.001;
                }
            }
            hitPaddle.currentTime = 0;
            hitPaddle.play();
        }
    }
    
    
}

function randomNumberBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function isCollision(rect1, rect2) {
    return (
        rect1.left <= rect2.right &&
        rect1.right >= rect2.left &&
        rect1.top <= rect2.bottom &&
        rect1.bottom >= rect2.top
    );
}
