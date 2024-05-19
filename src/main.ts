import { Application, Ticker, Container } from "pixi.js"

import { COLORS } from "./colors"
import { TextSprite, TileSprite } from "./text_sprite"
import { GameMap, randomTiles } from "./map"

// Create the application
const app = new Application()
await app.init({ resizeTo: window, background: COLORS["terminal black"], antialias: true })

// Attach the app to the page
// @ts-ignore
document.body.appendChild(app.canvas)


const ROWS = 41
const COLS = 21

let foreground = new Container()

let backgroundTiles = randomTiles(ROWS, COLS)

let gameMap = new GameMap(ROWS, COLS, backgroundTiles)

const MESSAGE = "TESTING"
let ind = -1

let character = new TextSprite("@", COLORS["terminal amber"])
let currLoc = {
    x: 20,
    y: 10
}
let oldLoc = {
    x: 20,
    y: 10
}

foreground.addChild(character.sprite)

app.stage.addChild(gameMap.background)
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

    gameMap.background.x = (app.renderer.width - ROWS * 24) / 2
    gameMap.background.y = (app.renderer.height - COLS * 24) / 2

    foreground.x = (app.renderer.width - ROWS * 24) / 2
    foreground.y = (app.renderer.height - COLS * 24) / 2

    let progress = (1 - Math.cos(Math.min((elapsed - lastTick) / 1000, 1) * Math.PI)) / 2

    character.sprite.x = oldLoc.x * 24 * (1 - progress) + currLoc.x * 24 * progress
    character.sprite.y = oldLoc.y * 24 * (1 - progress) + currLoc.y * 24 * progress

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            let tile = gameMap.backgroundTiles[row][col]
            let overlapX = Math.max(0, 24 + Math.min(tile.tile.x, character.sprite.x) - Math.max(tile.tile.x, character.sprite.x))
            let overlapY = Math.max(0, 24 + Math.min(tile.tile.y, character.sprite.y) - Math.max(tile.tile.y, character.sprite.y))

            let overlap = Math.min(overlapX, overlapY) / 24
            tile.sprite.alpha = 1 - overlap
        }
    }
}

app.ticker.add(update)