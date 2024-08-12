let SPEED = 0;
if (window.innerWidth <= 768) {
    SPEED = 0.003;
} else {
    SPEED = 0.005;
}
export default class Paddle {
    constructor(paddleElem) {
        this.paddleElem = paddleElem;
        this.reset()
    }
    get position() {
        return parseFloat(getComputedStyle(this.paddleElem).getPropertyValue("--position"))
    }
    set position(value) {       
        const clampedValue = Math.min(Math.max(value, 5), 95);
        this.paddleElem.style.setProperty("--position", clampedValue);
    }
    
    rect() {
        return this.paddleElem.getBoundingClientRect();
    }
    reset() {
        this.position = 50;
    }
    update(delta, ballHeight) {
        this.position += SPEED * delta * (ballHeight - this.position)
    }
}