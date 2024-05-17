import { Application, Sprite, Texture, Ticker, Container } from "pixi.js"

// Create the application
const app = new Application()
await app.init({ resizeTo: window, background: "#282828", antialias: true })

// Attach the app to the page
// @ts-ignore
document.body.appendChild(app.canvas)

class TextSprite {
    text: string
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    sprite: Sprite

    constructor(text: string) {
        this.text = text
        this.canvas = document.createElement('canvas')
        this.canvas.width = 24
        this.canvas.height = 24
        this.ctx = this.canvas.getContext("2d")
        this.ctx.font = "24px serif"
        this.ctx.fillStyle = "#33FF00"
        this.ctx.textBaseline = "middle"
        this.ctx.textAlign = "center"
        this.ctx.fillText(this.text, 12, 12)
        this.sprite = new Sprite(Texture.from(this.canvas))
    }
}

const ROWS = 10
const COLS = 10

let background = new Container()

for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
        let sprite = new TextSprite(Math.random() * 2 > 1 ? "\"" : ",")
        sprite.sprite.position.set(row * 24, col* 24)
        background.addChild(sprite.sprite)
    }
}
app.stage.addChild(background)

function update(ticker: Ticker) {
    background.x = (app.renderer.width - ROWS * 24) / 2
    background.y = (app.renderer.height - COLS * 24) / 2
}

app.ticker.add(update)