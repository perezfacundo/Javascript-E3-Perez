const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const $sprite = document.querySelector('#sprite')
const $bricks = document.querySelector('#bricks')

canvas.width = 448
canvas.height = 400

// Variables del juego
let counter = 0

// VARIABLES DE LA PELOTA
const ballRadius = 3
// Posicion de la pelota
let x = canvas.width / 2
let y = canvas.height - 30
// Velocidad de la pelota
let dx = 2
let dy = -2

// VARIABLES DE LA PALETA
const paddleHeight = 10
const paddleWidth = 50

let paddleX = (canvas.width - paddleWidth) / 2
let paddleY = canvas.height - paddleHeight - 10

let rightPressed = false
let leftPressed = false

// VARIABLES DE LOS LADRILLOS
const brickRowCount = 6
const brickColumnCount = 13
const brickWidth = 32
const brickHeight = 16
const brickPadding = 0
const brickOffsetTop = 80
const brickOffsetLeft = 16
const bricks = []

const BRICK_STATUS = { ACTIVE: 1, DESTROYED: 0 }

for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = []
    for (let r = 0; r < brickRowCount; r++) {
        // calcular la posicion del ladrillo 
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop

        // asignar color al ladrillo 
        const random = Math.floor(Math.random() * 8)

        // guardar la informacion de cada ladrillo
        bricks[c][r] = {
            x: brickX,
            y: brickY,
            status: BRICK_STATUS.FRESH,
            color: random
        }

    }
}

let PADDLE_SENSIBILITY = 8

function drawBall() {
    ctx.beginPath()
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.closePath()
}

function drawPaddle() {
    // ctx.fillStyle = 'red'
    // ctx.fillRect(
    //     paddleX, //coordenada x
    //     paddleY, //coordenada y
    //     paddleWidth, //el ancho del rectangulo
    //     paddleHeight //el alto del rectangulo
    // )

    ctx.drawImage(
        $sprite,
        29,
        174,
        paddleWidth,
        paddleHeight,
        paddleX,
        paddleY,
        paddleWidth,
        paddleHeight
    )
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const currentBrick = bricks[c][r]
            if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;

            const clipX = currentBrick.color * 32

            ctx.drawImage(
                $bricks,
                clipX,
                0,
                brickWidth,
                brickHeight,
                currentBrick.x,
                currentBrick.y,
                brickWidth,
                brickHeight
            )

        }
    }
}

// ======================================

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const currentBrick = bricks[c][r]
            if (currentBrick.status === BRICK_STATUS.DESTROYED) continue

            const isBallSameXAsBrick =
                x > currentBrick.x &&
                x < currentBrick.x + brickWidth

            const isBallSameYAsBrick =
                y > currentBrick.y &&
                y < currentBrick.y + brickHeight

            if (isBallSameXAsBrick && isBallSameYAsBrick) {
                dy = -dy
                currentBrick.status = BRICK_STATUS.DESTROYED
            }
        }

    }
}

function ballMovement() {
    // rebotes laterales
    if (
        x + dx > canvas.width - ballRadius || /*pared derecha*/
        x + dx < ballRadius /*pared izquierda*/
    ) {
        dx = -dx
    }

    //rebote superior
    if (y + dy < ballRadius) {
        dy = -dy
    }

    // la pelota toca la pala
    const isBallSameXAsPaddle =
        x > paddleX &&
        x < paddleX + paddleWidth

    const isBallTouchingPaddle =
        y + dy > paddleY

    if (isBallSameXAsPaddle && isBallTouchingPaddle) {
        dy = -dy
    } else if (y + dy > canvas.height - ballRadius) {
        console.log('game over')
        document.location.reload()
    }

    // mover la pelota
    x += dx
    y += dy
}

function paddleMovement() {
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += PADDLE_SENSIBILITY
    } else if (leftPressed && paddleX > 0) {
        paddleX -= PADDLE_SENSIBILITY
    }
}

function cleanCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function initEvents() {
    document.addEventListener('keydown', keyDownHandler)
    document.addEventListener('keyup', keyUpHandler)

    function keyDownHandler(event) {
        const { key } = event

        if (key === 'Right' || key === 'ArrowRight') {
            rightPressed = true
        } else if (key === 'Left' || key === 'ArrowLeft') {
            leftPressed = true
        }
    }

    function keyUpHandler(event) {
        const { key } = event

        if (key === 'Right' || key === 'ArrowRight') {
            rightPressed = false
        } else if (key === 'Left' || key === 'ArrowLeft') {
            leftPressed = false
        }
    }
}

// DIBUJAR
function draw() {
    cleanCanvas()

    //Dibujar elementos
    drawBall()
    drawPaddle()
    drawBricks()
    //drawScore()

    //Detectar colisiones y movimientos
    collisionDetection()
    ballMovement()
    paddleMovement()

    window.requestAnimationFrame(draw)
}

draw()
initEvents()