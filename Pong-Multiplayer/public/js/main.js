var socket = io();

var gameId;

var canvas;
var ctx;

var ballX;
var ballY;

var paddle1Y;
var paddle2Y;

window.onload = function () {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
}


function joinGame() {
    $(".gameCanvas").show();

    var data = {
        id: socket.id,
        width: screen.width * 0.5,
        height: screen.height * 0.5
    }

    socket.emit('join', data, function (data) {
        if (data.gameFound) {
            gameId = data.gameId;
            ctx.canvas.width = data.width;
            ctx.canvas.height = data.height;
            gameStart();
        } else {
            socket.on('start', function (data) {
                gameId = data.gameId;
                ctx.canvas.width = data.width;
                ctx.canvas.height = data.height;
                gameStart();
            })
        }
    });

    socket.on('update', function (data) {
        ballX = data.ballPos.x;
        ballY = data.ballPos.y;
        paddle1Y = data.paddlePos.player1;
        paddle2Y = data.paddlePos.player2;

        draw();
    })

    socket.on('notify', function (data) {
        switch (data.type) {
            case "END":
                endGame();
                joinGame();
                break;
        }
    });
}

function gameStart() {
    window.onmousemove = function (evt) {
        move(getMouseY(canvas, evt));
    }

}

function endGame() {
    gameId = "";
    ballX = 0;
    ballY = 0;
    paddle1Y = 0;
    paddle2Y = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function getMouseY(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return evt.clientY - rect.top;
}

function draw() {
    rect(0, 0, canvas.width, canvas.height, "black");
    rect(ballX, ballY, 10, 10, "white");
    rect(0, paddle1Y, 10, 100, "white");
    rect(canvas.width - 10, paddle2Y, 10, 100, "white");
}

function move(mouseY) {
    var data = {
        gameId: gameId,
        playerId: socket.id,
        mouseY: mouseY
    }
    socket.emit('move', data);
}

function rect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}