class UI {
    BOX_COLOR = 'red'
    ROAD_COLOR = 'gray'
    ROAD_BORDER_COLOR = 'black'
    BACKGROUND_COLOR = 'beige'
    CAR_COLOR = 'blue'
    BONUS_COLOR = 'gold'
    game
    frame

    constructor(game, frame) {
        this.game = game
        this.frame = frame
    }


    initialDraw() {
        this.clearFrame()

        let rows = game.rows
        let HEIGHT = rows.length
        let WIDTH = rows[0].pixels.length
        for(let y = 0; y < HEIGHT; y++) {
            for(let x = 0; x < WIDTH; x++) {
                let pixel = rows[y].pixels[x]
                let node = document.createElement('div')
                node.className = 'pixel'

                node.style.backgroundColor = this.getPixelColor(pixel)

                this.frame.appendChild(node)
            }
        }
    }

    draw() {
        // eemalda viimane row DOM-ist

        // lisa esimene row DOMi esimesteks elementideks


    }



    clearFrame() {
        this.frame.replaceChildren()
    }

    getPixelColor(pixel) {
        if(pixel.road) {
            return this.ROAD_COLOR
        }
        if(pixel.roadBorder) {
            return this.ROAD_BORDER_COLOR
        }
        if(pixel.car) {
            return this.CAR_COLOR;
        }
        if(pixel.box) {
            return this.BOX_COLOR;
        }
        if(pixel.bonus) {
            return this.BONUS_COLOR
        }
        else {
            return this.BACKGROUND_COLOR
        }
    }
}