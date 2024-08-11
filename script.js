import Ball from './Ball.js'
import Paddle from './Paddle.js'

const ball = new Ball(document.getElementById('ball'))
const playerPaddle = new Paddle(document.getElementById('player-paddle'))
const compoterPaddle = new Paddle(document.getElementById('computer-paddle'))

const playerScoreElement = document.getElementById('player-score')
const computerScoreElement = document.getElementById('computer-score')


let lastTime;
function update(time) {
    if (lastTime != null) {
        const delta = time - lastTime;

        ball.update(delta, [playerPaddle.rect(), compoterPaddle.rect()]);
        compoterPaddle.update(delta, ball.y);
        const hue = parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue("--hue")
        )
        document.documentElement.style.setProperty("--hue", hue + delta * 0.01)

        if (isLose()) {
            handleLose();
        }
    }
    lastTime = time;
    window.requestAnimationFrame(update)
}
function handleLose() {
    const rect = ball.rect();
    if (rect.right >= window.innerWidth) {
        playerScoreElement.textContent = parseInt(playerScoreElement.textContent) + 1;
    }
    else {
        computerScoreElement.textContent = parseInt(computerScoreElement.textContent) + 1;

    }
    ball.reset()
    compoterPaddle.reset()
}
function isLose() {
    const rect = ball.rect();
    return rect.right >= window.innerWidth || rect.left <= 0

}
document.addEventListener("mousemove", e => {
    playerPaddle.position = (e.y / window.innerHeight) * 100;
})


let isDragging = false;
document.addEventListener('touchstart', (event) => {
    isDragging = true;
});

document.addEventListener('touchmove', (event) => {
    if (isDragging) {
        const touch = event.touches[0];
        const touchY = touch.clientY;
        

        // Adjust the paddle position based on the touch position
        playerPaddle.position = (touchY / window.innerHeight) * 100;
    }
});

document.addEventListener('touchend', () => {
    isDragging = false;
});
window.requestAnimationFrame(update)
