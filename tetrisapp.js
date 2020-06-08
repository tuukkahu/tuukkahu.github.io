document.addEventListener('DOMContentLoaded', (event) => {
    createBackground();
    const GRID = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const SCOREDISPLAY = document.querySelector('#score');
    const STARTBTN = document.querySelector('#start-button')
    const WIDTH = 10;
    const TETROMINOES = getTetrominoes(WIDTH);
    
    //Randomly select a Tetrominio and a rotation
    let random = Math.floor(Math.random()*TETROMINOES.length);
    let currentPosition = 4;
    let currentRotation = 0;
    let current = TETROMINOES[random][currentRotation];

    draw(squares, current, currentPosition);

    //make the tetromino move down every second
    timerId = setInterval(moveDown, 1000);

    function moveDown() {
        undraw(squares, current, currentPosition);
        currentPosition += WIDTH;
        draw(squares, current, currentPosition);
        freeze();
    }

    function freeze() {
        if(current.some(index => squares[currentPosition+index+WIDTH].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition+index].classList.add('taken'));
            //start a new tetromino
            random = Math.floor(Math.random() * TETROMINOES.length);
            current = TETROMINOES[random][currentRotation];
            currentPosition = 4;
            draw();
        }
    }

    // move tetromino left unless it's at the egde
    
});


//Functions
function createBackground() {
    const game = document.querySelector('.game');
    //Create grid as div, styled in css
    const bgContainer = document.createElement('div');
    bgContainer.classList.add("grid");
    game.appendChild(bgContainer);

    for (let i=0; i < 200; i++) {
        bgContainer.innerHTML += '<div></div>';
    }

    for (let i=0; i < 10; i++) {
        bgContainer.innerHTML += '<div class="taken"></div>';
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

function draw(squares, current, currentPosition) {
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino');
    });
}

function undraw(squares, current, currentPosition) {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino');
    });
}

