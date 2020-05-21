import { Head } from 'https://cdn.jsdelivr.net/tuukkahu/tuukkahu.github.io/modules/head.js';
import { Body, Apple } from 'https://cdn.jsdelivr.net/tuukkahu/tuukkahu.github.io/modules/body.js';

const BLOCKWIDTH = 28;
const SIZE = 20;
var dir = [0, 0];
var game_over = false;
var prev_key;
window.addEventListener("keydown", onKeyDown, false);

//var button1 = document.getElementById("button1");
//button1.onclick = resetGame;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function drawBackground() {
    const canvas = document.querySelector('.background');
    const ctx = canvas.getContext('2d');
    const width = canvas.width = SIZE * (BLOCKWIDTH + 2);
    const height = canvas.height = width;

    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            let bgimage = new Image(width, height);
            bgimage.src = 'https://raw.githubusercontent.com/tuukkahu/tuukkahu.github.io/master/modules/bg.png';
            bgimage.onload = function() {
                ctx.drawImage(bgimage, i*(BLOCKWIDTH+2), j*(BLOCKWIDTH+2), BLOCKWIDTH+2, BLOCKWIDTH+2);
            };
        }
    }
}

function generateApple(head, body, fence) {
    let x;
    let y;
    let x_list = [];
    let y_list = [];
    if (body != []) {
        for (let i = 0; i < body.length; i++) {
            x_list.push(body[i].x);
        }
        for (let i = 0; i < body.length; i++) {
            y_list.push(body[i].y);
        }
    }

    if (fence != []) {
        for (let i = 0; i < fence.length; i++) {
            x_list.push(fence[i].x);
        }
        for (let i = 0; i < fence.length; i++) {
            y_list.push(fence[i].y);
        }
    }

    do {
        x = Math.floor(Math.random() * 19);
        x *= (BLOCKWIDTH + 2);
    } while (x === head.x || x_list.includes(x));
    do {
        y = Math.floor(Math.random() * 19);
        y *= (BLOCKWIDTH + 2);
    } while (y === head.y || y_list.includes(y));
    
    var apple = new Apple(x, y, BLOCKWIDTH);
    var appleimage = apple.drawApple();
    return [apple, appleimage];
}

function onKeyDown(event) {
    var keyCode = event.keyCode;
    // keys in order W A S D
    if (keyCode == 87 && prev_key != 83) {
        dir = [0, -1];
        prev_key = 87;
    } else if (keyCode == 65 && prev_key != 68) {
        dir = [-1, 0];
        prev_key = 65;
    } else if (keyCode == 83 && prev_key != 87) {
        dir = [0, 1];
        prev_key = 83;
    } else if (keyCode == 68 && prev_key != 65) {
        dir = [1, 0];
        prev_key = 68;
    } else if (keyCode == 81) {
        game_over = true;
    } else if (keyCode == 82) {
        location = location;
    }
}

function addPoint(points) {
    points += 1;
    document.getElementById("points_number").innerHTML = points;
    return points;
}

function levelOne() {
    let fencepart;
    let fence = [];
    let j = 5;
    for (let i = 5; i <= 10; i++) {
        fencepart = new Body(i*(BLOCKWIDTH+2), j*(BLOCKWIDTH+2), BLOCKWIDTH);
        fencepart.bodyimg = 'https://raw.githubusercontent.com/tuukkahu/tuukkahu.github.io/master/modules/fence.png';
        fencepart.draw();
        fence.push(fencepart);
    }
    return fence;
}

function resetGame(event) {
    const canvas = document.querySelector('.background');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game_over = true;
    if (event.x == button1.x) {
        main(0)
    }
}

async function main(level=1) {
    game_over = false;
    let to_do;
    drawBackground();
    let fence = [];
    if (level == 1) {
        fence = levelOne();
    }
    let head = new Head((SIZE/2-1)*(BLOCKWIDTH+2), (SIZE/2-1)*(BLOCKWIDTH+2), BLOCKWIDTH);
    head.draw();
    let body = [];
    let points = 0;
    let bodypart;
    let apple = generateApple(head, body, fence);
    let old_headx;
    let old_heady;

    while (!game_over) {
        old_headx = head.x;
        old_heady = head.y;
        // speed
        await sleep(85);
        to_do = head.move(dir, body, apple[0], fence);
        if (body.length > 0) {
            if (body.length == 1) {
                body[0].hide();
            }
            for (let i = body.length - 1; i > 0; i--) {
                
                if(i == body.length-1) {
                    body[i].hide();
                }
                body[i].x = body[i-1].x;
                body[i].y = body[i-1].y;
            }
            body[0].x = old_headx;
            body[0].y = old_heady;
            body[0].move();
        }

        if (to_do === 1) {
            apple[1].style.display='none';
            apple = generateApple(head, body, fence);
            if (body.length > 2) {
                let last_body = body[body.length - 1];
                let last_xdir = (body[body.length - 2].x - last_body.x)/(BLOCKWIDTH+2);
                let last_ydir = (body[body.length - 2].y - last_body.y)/(BLOCKWIDTH+2);
                bodypart = new Body(last_body.x-last_xdir*(BLOCKWIDTH+2), last_body.y-last_ydir*(BLOCKWIDTH+2), BLOCKWIDTH);
            } else if (body.length === 0) {
                bodypart = new Body(head.x-dir[0]*(BLOCKWIDTH+2), head.y-dir[1]*(BLOCKWIDTH+2), BLOCKWIDTH);
            } else {
                bodypart = new Body(body[0].x-dir[0]*(BLOCKWIDTH+2), body[0].y-dir[1]*(BLOCKWIDTH+2), BLOCKWIDTH);
            }
            points = addPoint(points);
            body.push(bodypart);
            bodypart.bodyimg = 'https://raw.githubusercontent.com/tuukkahu/tuukkahu.github.io/master/modules/body.png';
            bodypart.draw();
        } else if (to_do === 2) {
            game_over = true;
            window.alert("Game over! Refresh the page to start again.");
        }
    }

    head.draw();
}


main();