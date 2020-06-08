BLOCK_AMOUNT = 441;

document.addEventListener('DOMContentLoaded', (e) => {
    createBackground();

    const GRID = document.querySelector('.grid');
    const freeBtn = document.querySelector('#freebutton')
    let blocks = Array.from(document.querySelectorAll('.grid div'));

    document.addEventListener('keydown', setDir);
    freeBtn.addEventListener('click', clear);

    const WIDTH = 21;
    let timerId;
    let game_over = false;
    let score = 0;
    let dir = 0;
    let appleIndex;
    let headIndex = 220;
    let bodyIndexes = [];
    let fence = [];
    let moveBlockers = [false, false, false, false];

    function generateApple() {
        do {
            appleIndex = Math.floor(Math.random() * (BLOCK_AMOUNT - 1));
        } while (appleIndex === headIndex || bodyIndexes.includes(appleIndex) || fence.includes(appleIndex));
        blocks[appleIndex].classList.add('apple');
    }

    function draw() {
        blocks[headIndex].classList.add('head');
        if (bodyIndexes !== []) {
            bodyIndexes.forEach(index => {
                blocks[index].classList.add('body');
            });
        }
    }

    function setDir(event) {
        var keyCode = event.keyCode;
        // keys in order W A S D
        if (keyCode == 87 && !moveBlockers[2]) {
            dir = -WIDTH;
            moveBlockers = [true, false, false, false];
        } else if (keyCode == 65 && !moveBlockers[3]) {
            dir = -1;
            moveBlockers = [false, true, false, false];
        } else if (keyCode == 83 && !moveBlockers[0]) {
            dir = WIDTH;
            moveBlockers = [false, false, true, false];
        } else if (keyCode == 68 && !moveBlockers[1]) {
            dir = 1;
            moveBlockers = [false, false, false, true];
        } else if (keyCode == 81) {
            // (Q), game over
        } else if (keyCode == 82) {
            // R, refresh page
            location = location;
        }
    }

    generateApple();
    draw();
    timerId = setInterval(move, 80);

    function move() {
        let lastIndex;

        if (bodyIndexes.length != 0) {
            // ATE APPLE
            if (headIndex === appleIndex) {
                blocks[appleIndex].classList.remove('apple');
                bodyIndexes.unshift(headIndex);
                generateApple();
                score += 1;

            } else {
                blocks[bodyIndexes[bodyIndexes.length - 1]].classList.remove('body');
                lastIndex = bodyIndexes.pop();
                lastIndex = headIndex;
                bodyIndexes.unshift(lastIndex);
            }
            
        } else {
            if (headIndex === appleIndex) {
                blocks[appleIndex].classList.remove('apple');
                bodyIndexes.push(headIndex);
                generateApple();
                score += 1;
            }
        }

        blocks[headIndex].classList.remove('head');
        headIndex += dir;

        // CHECK IF WALL WAS HIT
        if ((headIndex - dir) % WIDTH === 0 && dir === -1) {
            headIndex += WIDTH;
        } else if((headIndex - dir) % WIDTH === WIDTH - 1 && dir === 1) {
            headIndex -= WIDTH;
        } else if( headIndex < -1 && dir === -WIDTH) {
            headIndex += BLOCK_AMOUNT;
        } else if( headIndex > (BLOCK_AMOUNT - 1) && dir === WIDTH) {
            headIndex -= BLOCK_AMOUNT;
        } 

        if (bodyIndexes.includes(headIndex)) {
            gameOver();
        }
        document.getElementById("points_number").innerHTML = score;
        draw();
    }

    function gameOver() {
        clearInterval(timerId);
        timerId = null;
        headIndex -= dir;
        window.alert("Game over! Refresh the page to start again.");
    }

    function clear () {
        bodyIndexes.forEach(index => {
            blocks[index].classList.remove('body');
        });
        blocks[headIndex].classList.remove('head');
        fence.forEach(index => {
            blocks[index].classList.remove('fence');
        });

        bodyIndexes = [];
        fence = [];
        headIndex = 220;
        score = 0;
        dir = 0;
        game_over = false;
        moveBlockers = [false, false, false, false];
        draw();
    }
});

// Functions
function createBackground() {
    const GAME = document.querySelector('.game');
    const bgContainer = document.createElement('div');
    bgContainer.classList.add('grid');
    GAME.appendChild(bgContainer);

    for(let i = 0; i < BLOCK_AMOUNT; i++) {
        bgContainer.innerHTML += '<div></div>';
    }
}