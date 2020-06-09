document.addEventListener('DOMContentLoaded', (event) => {
    createBackground();
    const GRID = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const SCOREDISPLAY = document.querySelector('#score');
    const STARTBTN = document.querySelector('#start-button')
    const WIDTH = 10;
    let nextRandom = 0;
    let timerId;
    let score = 0;
    const COLORS = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ];
    const TETROMINOES = getTetrominoes(WIDTH);
    
    //Randomly select a Tetrominio and a rotation
    let random = Math.floor(Math.random()*TETROMINOES.length);
    let currentPosition = 4;
    let currentRotation = 0;
    let current = TETROMINOES[random][currentRotation];

    draw(squares, current, currentPosition);

    //assign functions to keyCodes
    function control(event) {
        if(event.keyCode === 37) {
            moveLeft();
        } else if (event.keyCode === 38) {
            rotate();
        } else if (event.keyCode === 39) {
            moveRight();
        } else if (event.keyCode === 40) {
            moveDown();
        }
    }
    document.addEventListener('keyup', control);

    function moveDown() {
        undraw(squares, current, currentPosition);
        currentPosition += WIDTH;

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= WIDTH;
        }
        draw();
        freeze();
    }

    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = COLORS[random];
        });
    }

    function freeze() {
        if(current.some(index => squares[currentPosition+index+WIDTH].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition+index].classList.add('taken'));
            //start a new tetromino
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * TETROMINOES.length);
            current = TETROMINOES[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }

    // move tetromino left unless it's at the egde
    function moveLeft() {
        undraw(squares, current, currentPosition);
        const isAtLeftEdge = current.some(index => (currentPosition + index) % WIDTH === 0);
        
        if(!isAtLeftEdge) currentPosition -= 1;

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }

        draw();
    }

    function moveRight() {
        undraw(squares, current, currentPosition);
        const isAtRightEdge = current.some(index => (currentPosition + index) % WIDTH === WIDTH -1);

        if (!isAtRightEdge) currentPosition += 1;

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }

        draw();
    }

    //rotate the tetromino
    function rotate() {
        undraw(squares, current, currentPosition);
        currentRotation ++;
        if (currentRotation === current.length) {
            currentRotation = 0;
        }
        current = TETROMINOES[random][currentRotation];
        draw();
    }

    //show up-next tetromino
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    let displayIndex = 0;

    //the tetrominos without rotations
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2],
        [0, displayWidth, displayWidth+1, displayWidth*2+1],
        [1, displayWidth, displayWidth + 1, displayWidth + 2],
        [0, 1, displayWidth, displayWidth + 1],
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]
    ];

    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
        });
        upNextTetrominoes[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
            displaySquares[displayIndex + index].style.backgroundColor = COLORS[nextRandom];
        });
    }

    //Add functionality to the button
    STARTBTN.addEventListener('click', () => {
        if(timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random()*TETROMINOES.length);
            displayShape();
        }
    });

    //Add score
    function addScore() {
        for (let i = 0; i < 199; i += WIDTH) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;
                SCOREDISPLAY.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor = '';
                });
                const squaresRemoved = squares.splice(i, WIDTH);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => GRID.appendChild(cell));
            }
        }
    }

    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            SCOREDISPLAY.innerHTML = 'end';
            clearInterval(timerId);
        }
    }
});


//Functions
function createBackground() {
    const game = document.querySelector('.game');
    //Create grid as div, styled in css
    const bgContainer = document.createElement('div');
    const miniContainer = document.createElement('div');
    bgContainer.classList.add("grid");
    miniContainer.classList.add("mini-grid");
    game.appendChild(bgContainer);
    game.appendChild(miniContainer);

    for (let i=0; i < 200; i++) {
        bgContainer.innerHTML += '<div></div>';
    }

    for (let i=0; i < 10; i++) {
        bgContainer.innerHTML += '<div class="taken"></div>';
    }

    for (let i=0; i < 16; i++) {
        miniContainer.innerHTML += '<div></div>';
    }
}

function getTetrominoes(WIDTH) {
    //The tetrominoes
    const lTetromino = [
        [1, WIDTH+1, WIDTH*2+1, 2],
        [WIDTH, WIDTH+1, WIDTH+2, WIDTH*2+2],
        [1, WIDTH+1, WIDTH*2+1, WIDTH*2],
        [WIDTH, WIDTH*2, WIDTH*2+1, WIDTH*2+2]
    ];
    
    const zTetromino = [
        [0, WIDTH, WIDTH+1, WIDTH*2+1],
        [WIDTH + 1, WIDTH+2, WIDTH*2, WIDTH*2+1],
        [0, WIDTH, WIDTH + 1, WIDTH * 2 + 1],
        [WIDTH + 1, WIDTH + 2, WIDTH * 2, WIDTH * 2 + 1]
    ];

    const tTetromino = [
        [1, WIDTH, WIDTH + 1, WIDTH + 2],
        [1, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 1],
        [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 1],
        [1, WIDTH, WIDTH + 1, WIDTH * 2 + 1]
    ];

    const oTetromino = [
        [0, 1, WIDTH, WIDTH + 1],
        [0, 1, WIDTH, WIDTH + 1],
        [0, 1, WIDTH, WIDTH + 1],
        [0, 1, WIDTH, WIDTH + 1]
    ];

    const iTetromino = [
        [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 3 + 1],
        [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH + 3],
        [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 3 + 1],
        [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH + 3]
    ];

    const TETROMINOES = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
    return TETROMINOES;
}

function undraw(squares, current, currentPosition) {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino');
        squares[currentPosition + index].style.backgroundColor = '';
    });
}