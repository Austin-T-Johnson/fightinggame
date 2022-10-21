const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

context.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imgSrc: './img/Village-03.png'
})

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imgSrc: './img/Huntress/Idle.png',
    framesMax: 8,
    scale: 3,
    offset: {
        x: 150,
        y: 142
    },
    sprites: {
        idle: {
            imgSrc: './img/Huntress/Idle.png',
            framesMax: 8
        },
        run: {
            imgSrc: './img/Huntress/Run.png',
            framesMax: 8
        },
        jump: {
            imgSrc: './img/Huntress/Jump.png',
            framesMax: 2
        },
        attack: {
            imgSrc: './img/Huntress/Attack2.png',
            framesMax: 5
        },
        fall: {
            imgSrc: './img/Huntress/Fall.png',
            framesMax: 2
        },
        takeHit: {
            imgSrc: './img/Huntress/Take-hit.png',
            framesMax: 3
        },
        death: {
            imgSrc: './img/Huntress/Death.png',
            framesMax: 8
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 125,
        height: 50
    }
})



const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imgSrc: './img/Ghost/idle.png',
    framesMax: 5,
    scale: 1,
    offset: {
        x: 150,
        y: 145
    },
    sprites: {
        idle: {
            imgSrc: './img/Ghost/idle.png',
            framesMax: 5
        },
        run: {
            imgSrc: './img/Ghost/fly.png',
            framesMax: 5
        },

        attack: {
            imgSrc: './img/Ghost/attack.png',
            framesMax: 11
        },
        takeHit: {
            imgSrc: './img/Ghost/hit.png',
            framesMax: 6
        },
        death: {
            imgSrc: './img/Ghost/death.png',
            framesMax: 8
        }

    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 100,
        height: 50
    }
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
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
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    context.fillStyle = 'red'
    context.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    // player movement

    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }


    // jumping

    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    // enemy movement


    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    // jumping

    if (enemy.velocity.y < 0) {

    } else if (enemy.velocity.y > 0) {

    }

    // detect collision & enemy gets hit
    //player
    if (rectangularCollision({ rectangle1: player, rectangle2: enemy }) && player.isAttacking && player.framesCurrent === 3) {
        enemy.takeHit()
        player.isAttacking = false
        // enemy.health -= 20
       
        gsap.to('.enemy-health-bar', {
            width: enemy.health + "%"
        })
    }
    // if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }
    // enemy
    if (rectangularCollision({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking && enemy.framesCurrent === 8) {
        player.takeHit()
        enemy.isAttacking = false
        // player.health -= 40
     
        gsap.to('.player-health-bar', {
            width: player.health + "%"
        })

    }
    // if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 8) {
        enemy.isAttacking = false
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId })
    }
}
animate()

window.addEventListener('keydown', (e) => {
    // player keys

    switch (e.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            player.velocity.y = -20
            break
        case ' ':
            player.attack()
            break
    }

    // enemy keys

    switch (e.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -20
            break
        case 'ArrowDown':
            enemy.attack()
            break
    }
})

window.addEventListener('keyup', (e) => {
    // player keys

    switch (e.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            break
    }

    // enemy keys

    switch (e.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            break

    }

})