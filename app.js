// Config
const WIDTH = 100
const HEIGHT = 100
const REGULAR_POINTS = 10



// Get Frame
const frame = document.getElementById('frame');

// Get stylesheet
let stylesheet = document.styleSheets[0]

// Set UI pixel rate
frame.style.gridTemplateColumns = `repeat(${WIDTH}, 1fr)`
frame.style.gridTemplateRows = `repeat(${HEIGHT}, 1fr)`


let game = new Game()
let car = new Car(2, 1)
let brain = new GameBrain(game, car)


brain.initialize(WIDTH, HEIGHT)

let viewGenerator = new UI(game, frame)


if (brain.running) {
    document.onkeydown = checkKey;

    function checkKey(e) {

        e = e || window.event;
    
        if (e.keyCode == '38') {
            // up arrow
        }
        else if (e.keyCode == '40') {
            // down arrow
            brain.running = true
            brain.game.score = 0
        }
        else if (e.keyCode == '37') {
           brain.moveCar(-1)
           viewGenerator.initialDraw()
        }
        else if (e.keyCode == '39') {
           // right arrow
           brain.moveCar(1)
           viewGenerator.initialDraw()
        }
        else if(e.keyCode == '80') {
            // PAUSE
            brain.running = false
        }
    
    }    
}



viewGenerator.initialDraw()

function play() {
    console.log("running play")
    if(brain.running) {
    brain.moveCarUp()
    if(Math.random() < 0.01) {
        brain.addBonus()
    }
    else if(Math.random() < 0.1) {
        brain.addTrap()
    }
    else {
        brain.addNewRow()
    }
    
    brain.increaseScore(REGULAR_POINTS)
    

    displayScore(game.score)

    viewGenerator.initialDraw()
    brain.generator++
    }else {
        return
    }
}


setInterval(play, 50)



function displayScore(score) {
    let node = document.getElementById('scoreValue')
    node.innerHTML = `Score: ${score}`
}