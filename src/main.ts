import { Application, Sprite, Texture, Ticker, Container } from "pixi.js"

import { COLORS } from "./colors"

// Create the application
const app = new Application()
await app.init({ resizeTo: window, background: COLORS["terminal black"], antialias: true })

// Attach the app to the page
// @ts-ignore
document.body.appendChild(app.canvas)

class TextSprite {
    text: string
    color: string
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    sprite: Sprite

    constructor(text: string, color: string) {
        this.text = text
        this.color = color
        this.canvas = document.createElement('canvas')
        this.canvas.width = 24
        this.canvas.height = 24
        this.ctx = this.canvas.getContext("2d")
        this.ctx.font = "24px serif"
        this.ctx.fillStyle = this.color
        this.ctx.textBaseline = "middle"
        this.ctx.textAlign = "center"
        this.ctx.fillText(this.text, 12, 12)
        this.sprite = new Sprite(Texture.from(this.canvas))
    }

    redraw() {
        this.ctx.clearRect(0, 0, 24, 24)
        this.ctx.fillText(this.text, 12, 12)
    }
}

const ROWS = 60
const COLS = 20

let background = new Container()
let foreground = new Container()

let backgroundSprites: Array<Array<TextSprite>> = []

for (let row = 0; row < ROWS; row++) {
    backgroundSprites.push([])
    for (let col = 0; col < COLS; col++) {
        let type = Math.floor(Math.random() * 3)
        let sprite = new TextSprite(type === 2 ? "\"" : type === 1 ? "'" : ",", COLORS["terminal green"])
        sprite.sprite.position.set(row * 24, col* 24)
        background.addChild(sprite.sprite)
        backgroundSprites[row].push(sprite)
    }
}

const MESSAGE = "TESTING"
let ind = -1

let character = new TextSprite("@", COLORS["terminal amber"])
let currLoc = {
    x: 30,
    y: 10
}
let oldLoc = {
    x: 30,
    y: 10
}

foreground.addChild(character.sprite)

app.stage.addChild(background)
app.stage.addChild(foreground)

function tick() {
    oldLoc.x = currLoc.x
    oldLoc.y = currLoc.y
    let searching = true
    while (searching) {
        let rand = Math.floor(Math.random() * 4)
        let dx = 0
        let dy = 0
        switch (rand) {
            case 0:
                dx = -1
                break
            case 1:
                dy = 1
                break
            case 2:
                dx = 1
                break
            case 3:
                dy = -1
                break
            default:
                console.error("Uh oh...")
        }

        if (0 <= currLoc.x + dx && currLoc.x + dx < ROWS && 0 <= currLoc.y + dy && currLoc.y + dy < COLS) {
            currLoc.x += dx
            currLoc.y += dy
            searching = false
        }
    }

    ind = (ind + 1) % MESSAGE.length
    character.text = MESSAGE[ind]
    character.redraw()
    character.sprite.texture.source.update()
}

let elapsed = 0.0
let lastTick = 0.0

tick()

function update(ticker: Ticker) {
    elapsed += ticker.deltaMS
    if (elapsed - lastTick >= 1000) {
        tick()
        lastTick += 1000
    }

    background.x = (app.renderer.width - ROWS * 24) / 2
    background.y = (app.renderer.height - COLS * 24) / 2

    foreground.x = (app.renderer.width - ROWS * 24) / 2
    foreground.y = (app.renderer.height - COLS * 24) / 2

    let progress = (1 - Math.cos(Math.min((elapsed - lastTick) / 1000, 1) * Math.PI)) / 2

    character.sprite.x = oldLoc.x * 24 * (1 - progress) + currLoc.x * 24 * progress
    character.sprite.y = oldLoc.y * 24 * (1 - progress) + currLoc.y * 24 * progress

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            let sprite = backgroundSprites[row][col]
            let overlapX = Math.max(0, 24 + Math.min(sprite.sprite.x, character.sprite.x) - Math.max(sprite.sprite.x, character.sprite.x))
            let overlapY = Math.max(0, 24 + Math.min(sprite.sprite.y, character.sprite.y) - Math.max(sprite.sprite.y, character.sprite.y))

            let overlap = Math.min(overlapX, overlapY) / 24
            sprite.sprite.alpha = 1 - overlap
        }
    }
}

app.ticker.add(update)