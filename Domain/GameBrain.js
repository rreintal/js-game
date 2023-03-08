class GameBrain {
    ROAD_WIDTH = 15
    game
    car
    running = false
    generator = 1
    

    constructor(game, car) {
        this.game = game
        this.car = car
    }

    initialize(width, height) {
        this.running = true
        this.generateRows(width, height)
        this.generateInitialRoad()
        this.addCar()

    }

    addTrap() {
        // Add new row
        this.addNewRow()

        // Get recently generated row
        let row = this.game.getFirstRow()

        // Get road middle cord
        let rowX = this.getRoadMiddleX(row)

        // Add box
        row.pixels[rowX].reset()
        row.pixels[rowX].box = true
    }

    addBonus() {
        // Add new row
        this.addNewRow()

        // Get recently generated row
        let row = this.game.getFirstRow()

        // Get road middle cord
        let rowX = this.getRoadMiddleX(row)

        // Add box
        row.pixels[rowX].reset()
        row.pixels[rowX].bonus = true
    }



    moveCarUp() {
        let carHeight = this.car.height
        let carX = this.car.x

        let rows = this.game.rows

        // Car new posistion
        let newY = rows.length - carHeight - 1;

        if(this.didCarCrash(carX, newY)) {
            this.running = false
        }

        // Remove tail
        this.game.getLastRow().pixels[carX].reset()
        this.game.getLastRow().pixels[carX].road = true

        // Set new car pixel
        rows[newY].pixels[carX].reset()
        rows[newY].pixels[carX].car = true

    }

    userCollectedBonus() {
        this.game.score += 5000
    }

    didCarCrash(x, y) {
        if(this.game.rows[y].pixels[x].bonus) {
            this.userCollectedBonus()
        }

        return !this.game.rows[y].pixels[x].road && !this.game.rows[y].pixels[x].bonus
    }


    moveCar(direction) {
        let currentX = this.car.x
        let newX;

        if(direction === -1) {
            // left
            newX = currentX - 1
        }
        if(direction === 1) {
            // right
            newX = currentX + 1
        }


        // Update car location
        this.car.x = newX
        
        let carHeight = this.car.height
        let rows = this.game.rows


        for(let i = rows.length - carHeight; i < rows.length; i++) {
            // kontrolli, kas see liigub tee peale või ei!

            if(this.didCarCrash(newX, i)) {
                this.running = false
            }
            // Reset last pixels
            rows[i].pixels[currentX].reset()
            rows[i].pixels[currentX].road = true;

            // Set new car!
            rows[i].pixels[newX].reset()
            rows[i].pixels[newX].car = true
        }


    }

    addCar() {
        let lastRow = this.game.getLastRow()
        let roadMiddlePointX = this.getRoadMiddleX(lastRow)


        // Game rows
        let rows = this.game.rows

        // Get car parameters
        let carHeight = this.car.height
        // Set car posistion
        this.car.x = roadMiddlePointX


        // Add car to rows
        for(let i = rows.length - carHeight; i < rows.length; i++) {
            // -1 to draw car one pixel from side!
            
            // Reset pixel properties
            rows[i].pixels[roadMiddlePointX].reset()
            rows[i].pixels[roadMiddlePointX].car = true
        }
    }

    getRoadStartAndEndpoint(row) {
        let pixels = row.pixels
        let roadStart = -1
        let roadEnd = -1
        for(let i = 0; i< pixels.length; i++) {
            if(pixels[i].roadBorder && roadStart === -1) {
                roadStart = i
                continue;
            }
            if(pixels[i].roadBorder && roadEnd === -1) {
                roadEnd = i;
                break;
            }
        }
        return [roadStart, roadEnd]
    }

    getRoadMiddleX(row) {
        let pixels = row.pixels
        let roadStart = -1
        let roadEnd = -1
        for(let i = 0; i< pixels.length; i++) {
            if(pixels[i].roadBorder && roadStart === -1) {
                roadStart = i
                continue;
            }
            if(pixels[i].roadBorder && roadEnd === -1) {
                roadEnd = i;
                break;
            }
        }
        let roadMiddlePoint = Math.round((roadEnd + roadStart) / 2)
        return roadMiddlePoint
    }

    increaseScore(amount) {
        this.game.score += amount
    }

    generateRows(width, height) {
        let rows = []
        
        for(let y = 0; y < height; y++) {
            let row = new Row()

            for(let x = 0; x < width; x++) {
                let pixel = new Pixel()
                row.addPixel(pixel)
            }
            rows.push(row)
        }
        
        this.game.rows = rows
    }

    generateInitialRoad() {
        // Road always starts from the middle
        let roadStart = (game.rows[0].pixels.length / 2)


        let gameRows = game.rows
        const HEIGHT = gameRows.length
        const WIDTH = gameRows[0].pixels.length

        
        // Random number generator to get the choice, which way road turns
        let choice = this.getChoice()

        let lastX = roadStart

        gameRows.forEach((row) => {
            lastX = this.generateRowWithRoad(lastX, row)
        })

    }

    addNewRow() {
        console.log("Generating new row")
        let lastRow = this.game.getFirstRow()
        let roadStart = -1
        let roadEnd = -1

        // Get road starting posistion
        for(let i = 0; i < lastRow.pixels.length; i++) {
            if(lastRow.pixels[i].roadBorder && roadStart === -1) {
                roadStart = i
                continue;
            }
            if(lastRow.pixels[i].roadBorder && roadEnd === -1) {
                roadEnd = i
                break;
            }
        }
        // Create new empty row
        let row = this.createNewEmptyRow(lastRow.pixels.length)

        // Generate new row with road
        this.generateRowWithRoad(roadStart, row)
        
        // Remove last row
        this.game.rows.pop();

        // Add new row
        this.game.rows.unshift(row)
    }

    generateRowWithRoad(lastX, row) {
        let choice = this.getChoice()
        let WIDTH = row.pixels.length

        if(choice === 1) {
            // Road turns left
            if(!(lastX - 1 < 0)) {
                lastX -= 1
            }

        }
        else if(choice === 2) {
            // Road turns right
            if(lastX + 1 < WIDTH && lastX + this.ROAD_WIDTH + 1 < WIDTH - 1) {
                lastX += 1
            }
        }

        // Set road start- and endpoint.
        row.pixels[lastX].roadBorder = true;
        row.pixels[lastX + this.ROAD_WIDTH + 1].roadBorder = true;
        
        // Pixels between start and end
        for(let i = lastX + 1; i != lastX + this.ROAD_WIDTH + 1; i++) {
            row.pixels[i].road = true
        }

        return lastX;
    }

    getChoice() {
        // Returns 1 or 2
        return Math.floor(Math.random() * 2) + 1;
    }

    createNewEmptyRow(size) {
        let row = new Row()
        for(let i = 0; i < size; i++) {
            let pixel = new Pixel()
            row.addPixel(pixel)
        }
        return row
    }

    randomNumberInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
}