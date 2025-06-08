function detectCollision({ rectangle1, rectangle2 }) {
    return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height)

}
function determineWinner({ player, enemy }) {
    clearTimeout(timerId);
    result.style.display = 'flex';

    if (player.health === enemy.health) {
        result.textContent = "TIE";

    }
    else if (player.health > enemy.health) {
        result.textContent = "Player 1 wins";
    }
    else {
        result.textContent = "Player 2 wins";

    }
}
async function decreaseTimer() {

    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        time.textContent = timer;
    }
    if (timer === 0) {
        determineWinner({ player, enemy });
    }
}