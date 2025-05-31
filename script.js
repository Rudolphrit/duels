const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
let lastKey;
const enemyHealth = document.getElementById('enemy-health');
const playerHealth = document.getElementById('player-health');
const time = document.getElementById('timer');
const result = document.getElementById('displayResult');
let timer = 60;
let timerId;
canvas.width = 1024;
canvas.height = 576;
const gravity = 0.7;
const background = new Sprite({
    position: { x: 0, y: 0 },
    imageSrc: './background.png'

});
const shop = new Sprite({
    position: { x: 600, y: 128 },
    imageSrc: './shop.png',
    scale: 2.75,
    frames: 6
})
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
};
c.fillRect(0, 0, canvas.width, canvas.height);

decreaseTimer();




const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'red',
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './samuraiMack/Idle.png',
    frames: 8,
    offset: {
        x: 215,
        y: 157
    },
    scale: 2.5,
    sprites: {
        idle: {
            imageSrc: './samuraiMack/Idle.png',
            frames: 8,
        },
        run: {
            imageSrc: './samuraiMack/Run.png',
            frames: 8,
        },
        jump: {
            imageSrc: './samuraiMack/Jump.png',
            frames: 2,
        },
        fall: {
            imageSrc: './samuraiMack/Fall.png',
            frames: 2,
        },
        attack1: {
            imageSrc: './samuraiMack/Attack1.png',
            frames: 6,
        },
        takeHit: {
            imageSrc: './samuraiMack/Take hit.png',
            frames: 4,
        },
        death: {
            imageSrc: './samuraiMack/Death.png',
            frames: 6,
        }
    },
    attackBox: {
        offset: {
            x: -100,
            y: -50
        },
        width: 160,
        height: 50
    }

});
const enemy = new Fighter({
    position: {
        x: 450,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: 50,
        y: 0
    },
    imageSrc: './kenji/Idle.png',
    frames: 4,
    offset: {
        x: 215,
        y: 170
    },
    scale: 2.5,
    sprites: {
        idle: {
            imageSrc: './kenji/Idle.png',
            frames: 4,
        },
        run: {
            imageSrc: './kenji/Run.png',
            frames: 8,
        },
        jump: {
            imageSrc: './kenji/Jump.png',
            frames: 2,
        },
        fall: {
            imageSrc: './kenji/Fall.png',
            frames: 2,
        },
        attack1: {
            imageSrc: './kenji/Attack1.png',
            frames: 4,
        },
        takeHit: {
            imageSrc: './kenji/Take hit.png',
            frames: 3
        },
        death: {
            imageSrc: './kenji/Death.png',
            frames: 7
        }
    },
    attackBox: {
        offset: {
            x: 175,
            y: -50
        },
        width: 160,
        height: 50
    }
});
player.draw();
enemy.draw();


function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();

    player.update();
    enemy.update();
    player.velocity.x = 0;
    if (keys.a.pressed && player.lastKey === 'a') {
        player.switchSprite('run');
        player.velocity.x = -6;
    }
    else if (keys.d.pressed && player.lastKey === 'd') {
        player.switchSprite('run');

        player.velocity.x = 6;
    }
    else {
        player.switchSprite('idle');

    }
    if (player.velocity.y < 0) {
        player.switchSprite('jump');

    }
    else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }
    enemy.velocity.x = 0;
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.switchSprite('run');

        enemy.velocity.x = -6;
    }
    else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.switchSprite('run');

        enemy.velocity.x = 6;
    }
    else {
        enemy.switchSprite('idle');

    }
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');

    }
    else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }
    //collision detection
    if (detectCollision({ rectangle1: player, rectangle2: enemy }) && player.isAttacking && player.currentFrame === 4) {
        enemy.gotHit();
        enemyHealth.style.width = enemy.health + '%';

        player.isAttacking = false;
    }
    if (player.isAttacking && player.currentFrame === 4) {
        player.isAttacking = false;
    }
    if (detectCollision({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking && enemy.currentFrame === 2) {

        player.gotHit();
        playerHealth.style.width = player.health + '%';
        enemy.isAttacking = false;
    }
    if (enemy.isAttacking && enemy.currentFrame === 2) {
        enemy.isAttacking = false;
    }
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy });

    }




}
animate();

window.addEventListener('keydown', (event) => {
    if (!player.dead) {
        switch (event.key) {

            case 'd':
                {
                    keys.d.pressed = true;
                    player.lastKey = 'd';
                    break;
                }
            case 'a':
                {
                    keys.a.pressed = true;
                    player.lastKey = 'a';
                    break;
                }
            case 'w':
                {

                    player.velocity.y = -15;

                    break;
                }
            case ' ': {
                player.attack();
                break;
            }
        }
    }
    if (!enemy.dead) {
        switch (event.key) {
            case 'ArrowRight':
                {
                    keys.ArrowRight.pressed = true;
                    enemy.lastKey = 'ArrowRight';
                    break;
                }
            case 'ArrowLeft':
                {
                    keys.ArrowLeft.pressed = true;
                    enemy.lastKey = 'ArrowLeft';
                    break;
                }
            case 'ArrowUp':
                {
                    enemy.velocity.y = -15;
                    break;
                }
            case 'ArrowDown':
                {
                    enemy.attack();
                    break;
                }
        }
    }

});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd': {
            keys.d.pressed = false;
            break;
        }
        case 'a':
            {
                keys.a.pressed = false;
                break;
            }
        case 'ArrowRight':
            {
                keys.ArrowRight.pressed = false;
                break;
            }
        case 'ArrowLeft':
            {
                keys.ArrowLeft.pressed = false;
                break;
            }

    }

});
