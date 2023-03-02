game_W = 0, game_H = 0;

let bg = new Image();
bg.src = "assets/images/bg.png";
let logo = new Image();
logo.src = "assets/images/logo.png";
let fl = new Image();
let phone_img = new Image();
phone_img.src = "assets/images/phone/phone4.png";

let move = false;
let click = false;
let index_flashlight = -1;

let x_touch = 0;
let y_touch = 0;
N = 4;

class game {
    constructor() {
        this.canvas = null;
        this.context = null;
        this.init();
    }

    init() {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);

        this.render();
        this.chessBoard = new ChessBoard(this);
        this.chessBoard.draw();
        this.loop();
        this.listenMouse();
        this.listenTouch();
    }

    loop() {
        if (!this.chessBoard.win) {
            this.update();
            this.render();

        } else {
            this.chessBoard.redrictLevel();
        }
        this.draw();
        setTimeout(() => this.loop(), 30);

    }

    update() {

    }

    listenMouse() {
        document.addEventListener("mousedown", evt => {
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
            this.actionDown(x, y);

        })

        document.addEventListener("mousemove", evt => {
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
            x_touch = x;
            y_touch = y;
            this.actionMove(x, y);
        })

        document.addEventListener("mouseup", evt => {
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
            this.actionUp(x, y);
        })
    }

    listenTouch() {
        document.addEventListener("touchmove", evt => {
            var y = evt.touches[0].pageY;
            var x = evt.touches[0].pageX;
            this.actionMove(x, y);
        })

        document.addEventListener("touchstart", evt => {
            let y = evt.touches[0].pageY;
            let x = evt.touches[0].pageX;
            this.actionDown(x, y);

        })

        document.addEventListener("touchend", evt => {
            let x = x_touch;
            let y = y_touch;
            // this.actionUp(x, y);
            this.actionUpTouch(x, y);
        })
    }

    actionDown(x, y) {

    }

    actionMove(x, y) {

    }

    actionUp(x, y) {
        let Y = Math.ceil((x - this.chessBoard.x) / this.chessBoard.size);
        let X = Math.ceil((y - this.chessBoard.y) / this.chessBoard.size);
        this.chessBoard.matrix[X - 1][Y - 1] = 1 - this.chessBoard.matrix[X - 1][Y - 1];
        this.chessBoard.initBug();
        if (this.chessBoard.getNumberBugs() == 6 && this.chessBoard.getSolution() !== "No solution") {
            console.log('Solution: ', this.chessBoard.getSolution());
            let matrixChessboard = Matrix.copyMatrix(this.chessBoard.getSolution());
            for (let i = 0; i < this.chessBoard.flashlights.length; i++) {
                while (true) {
                    let matrix = Matrix.copyMatrix(this.chessBoard.flashlights[i].block);

                    // console.log(matrix);

                    let m = matrix.length;
                    let n = matrix[0].length;
                    let ok = false;
                    for (let I = 0; I < N && !ok; I++)
                        for (let J = 0; J < N && !ok; J++) {
                            let isTrue = true;
                            for (let I2 = 0; I2 < m; I2++)
                                for (let J2 = 0; J2 < n; J2++) {
                                    if (I + I2 < N && J + J2 < N) {

                                        if (matrix[I2][J2] > 0 && matrixChessboard[I + I2][J + J2] != (i + 1)) {
                                            isTrue = false;
                                            break;
                                        }
                                        if (matrix[I2][J2] == 2 && this.chessBoard.matrix[I + I2][J + J2] != 1) {
                                            isTrue = false;
                                            break;
                                        }
                                    } else
                                        isTrue = false;
                                }
                            if (isTrue) {
                                this.chessBoard.flashlights[i].updateLocationFromXYReal(this.chessBoard.x + J * this.chessBoard.size, this.chessBoard.y + I * this.chessBoard.size);
                            }
                            ok = isTrue
                        }
                    if (ok) {
                        // console.log("a", matrix);
                        break;
                    }
                    this.chessBoard.flashlights[i].rotate_90();
                }
            }
        } else {
            for (let i = 0; i < this.chessBoard.flashlights.length; i++)
                this.chessBoard.flashlights[i].resetLacation();
        }

    }

    actionUpTouch(x, y) {

    }

    newGame() {
        for (let i = 0; i < this.chessBoard.flashlights.length; i++)
            this.chessBoard.flashlights[i].resetLacation();
        this.chessBoard.newGame();
    }

    drawLine(x1, y1, x2, y2) {
        this.context.strokeStyle = "#FFFFFF";
        this.context.lineWidth = 5;
        this.context.beginPath();

        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.stroke();
    }

    drawNet() {
        if (this.chessBoard.bugs.length < 6) {
            for (let i = 1; i < N; i++) {
                let x1 = this.chessBoard.x + i * this.chessBoard.size;
                let y1 = this.chessBoard.y;
                let x2 = x1;
                let y2 = y1 + this.chessBoard.size * N;
                this.drawLine(x1, y1, x2, y2);
            }
            for (let i = 1; i < N; i++) {
                let x1 = this.chessBoard.x;
                let y1 = this.chessBoard.y + i * this.chessBoard.size;
                let x2 = x1 + this.chessBoard.size * N;
                let y2 = y1;
                this.drawLine(x1, y1, x2, y2);
            }
        }
    }

    draw() {
        this.clearScreen();
        this.drawNet();
        this.chessBoard.draw();
        this.drawPhone();
    }

    drawPhone() {
        if (game_W / game_H < 1.3) {
            this.clearScreen();
            let size = Math.min(game_W, game_H);
            let x = (game_W - size) / 2;
            let y = (game_H - size) / 2;
            this.context.drawImage(phone_img, x, y, size, size);
        }
    }

    clearScreen() {
        this.context.clearRect(0, 0, game_W, game_H);
        this.context.drawImage(bg, 0, 0, game_W, game_H);
        this.context.drawImage(logo, game_H / 40, game_H / 40, game_H / 13, game_H / 13);
        this.context.font = game_W / 20 + 'px Arial Black';
        this.context.fillStyle = "#FF00CC";
        this.context.textAlign = "center";
    }


    render() {
        if (this.canvas.width != document.documentElement.clientWidth || this.canvas.height != document.documentElement.clientHeight) {
            this.canvas.width = document.documentElement.clientWidth;
            this.canvas.height = document.documentElement.clientHeight;
            game_W = this.canvas.width;
            game_H = this.canvas.height;
            this.chessBoard = new ChessBoard(this);
            this.chessBoard.draw();
        }
    }

}

var g = new game();