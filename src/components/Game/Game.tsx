import { useRef, useEffect } from "react";
import "./Game.css";

function Game() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const canvasWidth = 672
    const canvasHeight = 600
    let ballX = canvasWidth / 2
    let ballY = canvasHeight - 30
    const paddleVelocity = 15
    let paddleX = (canvasWidth - 200) / 2
    const paddleY = (canvasHeight - 30)
    const paddleWidth = 150;
    const paddleHeight = 15;
    let dx = 1
    let dy = -2

    const bricks = [
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    ]
    const brickWidth = 40
    const brickHeight = 20
    const brickPadding = 2
    const brickOffsetTop = 50

    const update = (ctx: CanvasRenderingContext2D) => {
        if (!ctx) return
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)

        function drawBall(): void {
            if (!ctx) return
            ctx.fillStyle = 'orange'
            ctx.beginPath()
            ballX += dx
            ballY += dy
            const radius = 6; // Radius of the circle
            const startAngle = 0; // Starting angle in radians
            const endAngle = Math.PI * 2; // Ending angle in radians (full circle)
            ctx.arc(ballX, ballY, radius, startAngle, endAngle);            
            ctx.fill();
            ctx.closePath()
        }

        function drawPaddle(): void {
            if (!ctx) return
            ctx.fillStyle = 'white'
            ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight)
        }

        function drawBricks(): void {
            if (!ctx) return
            for (let i = 0; i < bricks.length; i++) {
                for (let j = 0; j < bricks[i].length; j++) {
                    if (bricks[i][j] !== 0) {
                        ctx.fillStyle = 'blue'
                        ctx.fillRect(
                            (canvasWidth - bricks[0].length * (brickWidth + brickPadding)) / 2 + j * (brickWidth + brickPadding), 
                            brickOffsetTop + i * (brickHeight + brickPadding), 
                            brickWidth, 
                            brickHeight
                        )
                    }
                }
            }
        }

        function handleCollisions(): void {
            if (!ctx) return
            if (ballY + dy < 0) {
                dy = -dy
            } else if (ballY + dy > canvasHeight - 30) {
                if (ballX >= paddleX && ballX <= paddleX + paddleWidth) {
                    dy = -dy
                } else {
                    //alert('GAME OVER')
                    document.location.reload()
                }
            }
            if (ballX + dx < 0 || ballX > canvasWidth) {
                dx = -dx
            }
        }

        function handleBricksCollisions(): void {
            if (!ctx) return
            for (let i = 0; i < bricks.length; i++) {
                for (let j = 0; j < bricks[i].length; j++) {
                    if (bricks[i][j] !== 0) {
                        if (
                            ballX >= (canvasWidth - bricks[0].length * (brickWidth + brickPadding)) / 2 + j * (brickWidth + brickPadding) && // bricks left bound
                            ballX <= (canvasWidth - bricks[0].length * (brickWidth + brickPadding)) / 2 + j * (brickWidth + brickPadding) + brickWidth && // bricks right bound
                            ballY >= brickOffsetTop + i * (brickHeight + brickPadding) && // bricks upper bound
                            ballY <= brickOffsetTop + i * (brickHeight + brickPadding) + brickHeight // bricks lower bound
                        ) {
                            bricks[i][j] = 0
                            dy = -dy * 1.001
                            dx = dx * 1.001
                        }
                    }
                }
            }
        }

        drawBall()
        drawPaddle()
        drawBricks()
        handleCollisions()
        handleBricksCollisions()

    }

    useEffect(() => {
        let animationFrameId: number;

        if (canvasRef.current) {
            const canvas = canvasRef.current
            canvas.width = canvasWidth
            canvas.height = canvasHeight
            const ctx = canvas.getContext("2d")
            if (!ctx) return
            const render = () => {
                update(ctx)
                animationFrameId = window.requestAnimationFrame(render)
            }
            render()
        }
        return () => {
            window.cancelAnimationFrame(animationFrameId)
        }
    }, [])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowRight' && paddleX < canvasWidth - paddleWidth) {
                paddleX += paddleVelocity
            } else if (event.key === 'ArrowLeft' && paddleX > 0) {
                paddleX -= paddleVelocity
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    },[])

  return (
      <div>
        <canvas 
            ref={canvasRef}
            style={{
                border: "2px solid white",
                width: String(canvasWidth),
                height: String(canvasHeight),
            }}
            ></canvas>
    </div>
  )
}

export default Game



