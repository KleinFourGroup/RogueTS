import { Application, Sprite, Texture, Ticker } from "pixi.js"

// Create the application
const app = new Application()
await app.init({ resizeTo: window, background: "#282828", antialias: true })

// Attach the app to the page
// @ts-ignore
document.body.appendChild(app.canvas)

let canvas = document.createElement('canvas')
canvas.width = 24
canvas.height = 24
let ctx = canvas.getContext("2d")
ctx.font = "24px serif"
ctx.fillStyle = "#33FF00"
ctx.textBaseline = "middle"
ctx.textAlign = "center"
ctx.fillText("@", 12, 12)

let sprite = new Sprite(Texture.from(canvas))
app.stage.addChild(sprite)

function update(ticker: Ticker) {
    sprite.x = app.renderer.width / 2
    sprite.y = app.renderer.height / 2
}

app.ticker.add(update)