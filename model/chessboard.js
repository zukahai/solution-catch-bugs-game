let chessBoard_image = new Image();
chessBoard_image.src = "assets/images/chessboards/chessboard1.png";

let chessBoard_bg_image = new Image();
chessBoard_bg_image.src = "assets/images/chessboards/chessboard_bg.png";

N = 4
N_flashlight = 6


class ChessBoard {
    constructor(game) {
        this.game = game;
        this.bugs = [];
        this.flashlights = [];
        this.size = game_H / 8;
        this.win = false;
        this.level = 1;

        this.x = (game_W - 4 * this.size) / 2;
        this.y = (game_H - 4 * this.size) / 2;
        this.redrict = false;

        this.randomChessboard();

        this.levels = Level.getData();
        this.initMatrix();
        this.initBug();
        this.initFlashlight();
    }

    initMatrix() {
        this.matrix = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];

        this.block = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
    }

    getSolution() {
        for (let i = 0; i < this.levels.length; i++) {
            let matrix1 = Matrix.copyMatrix(this.levels[i].data);
            if (Matrix.check(matrix1, this.matrix))
                return this.levels[i].result;
        }
        return "No solution";

    }

    getLevel(level) {
        level -= 1;
        let group = 2712;
        let rowMatrix = Math.floor(this.levels.length / group);
        let levelInIndex = this.levels[(level % rowMatrix) * group + Math.floor(level / group)];
        let level_data = levelInIndex.data;
        // console.log("Level " + (level + 1));
        // console.log(levelInIndex.result);
        for (let i = 0; i < level_data.length; i++)
            for (let j = 0; j < level_data.length; j++)
                level_data[i][j] -= 1;
        return level_data;
    }

    randomLevel() {
        let random_level = this.levels[Math.floor(Math.random() * 1000000) % this.levels.length];
        let level_data = random_level.data;
        console.log(random_level.result);
        for (let i = 0; i < level_data.length; i++)
            for (let j = 0; j < level_data.length; j++)
                level_data[i][j] -= 1;
        return level_data;
    }

    randomChessboard() {
        let index = Math.floor(Math.random() * 100000) % 10 + 1;
        chessBoard_image.src = "assets/images/backgounds/" + index + ".png";
    }

    newGame() {
        this.level++;
        Cookie.setCookie("level", this.level, 30);
        this.initMatrix();
        for (let i = 0; i < this.flashlights.length; i++)
            this.flashlights[i].resetLacation();
        this.initBug();
        this.randomChessboard();
    }

    initBug() {
        let number = [1, 2, 3, 4, 5, 6, 7, 8];
        for (let i = 0; i < 20; i++) {
            let index1 = Math.ceil((Math.random() * 100000)) % number.length
            let index2 = Math.ceil((Math.random() * 100000)) % number.length
            let temp = number[index1];
            number[index1] = number[index2];
            number[index2] = temp;
        }
        let count = 0;
        this.bugs = [];
        for (let i = 0; i < N; i++)
            for (let j = 0; j < N; j++)
                if (this.matrix[i][j] == 1)
                    this.bugs[count++] = new Bug(this.game, this.x + this.size * j, this.y + this.size * i, this.size, number[count]);

    }

    initFlashlight() {
        let m_n = [
            [2, 2],
            [2, 2],
            [2, 2],
            [2, 2],
            [1, 2],
            [1, 2]
        ]
        let block = [
            [
                [2, 0],
                [1, 2]
            ],
            [
                [1, 0],
                [2, 1]
            ],
            [
                [2, 0],
                [1, 1]
            ],
            [
                [2, 0],
                [1, 1]
            ],
            [
                [1, 2]
            ],
            [
                [1, 1]
            ]
        ]
        for (let i = 0; i < N_flashlight; i++)
            this.flashlights[i] = new Flashlight(this.game, m_n[i][0], m_n[i][1], this.size, i, block[i]);
    }

    getNumberBugs() {
        return this.bugs.length;
    }

    updateBlock() {
        this.block = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
        for (let i = 0; i < this.flashlights.length; i++) {
            let x = this.flashlights[i].x_real + this.size / 2;
            let y = this.flashlights[i].y_real + this.size / 2;
            if (x >= this.x && x <= this.x + 4 * this.size && y >= this.y && y <= this.y + this.size * 4) {
                let N = Math.floor((x - this.x) / this.size);
                let M = Math.floor((y - this.y) / this.size);
                // console.log(M, ' ', N);
                for (let i1 = 0; i1 < this.flashlights[i].block.length; i1++)
                    for (let i2 = 0; i2 < this.flashlights[i].block[0].length; i2++)
                        this.block[M + i1][N + i2] += this.flashlights[i].block[i1][i2];
            }
        }
    }

    isInChessBoard(x, y) {
        if (x < this.x - this.size / 2)
            return false;
        if (x > this.x + 3 * this.size)
            return false;
        if (y < this.y - this.size / 2)
            return false;
        if (y > this.y + 3 * this.size)
            return false;
        return true;
    }

    updateLocationFlashlight(index) {
        if (this.isInChessBoard(this.flashlights[index].x_real, this.flashlights[index].y_real)) {
            let x_real_new = Math.round((this.flashlights[index].x_real - this.x) / this.size) * this.size + this.x;
            let y_real_new = Math.round((this.flashlights[index].y_real - this.y) / this.size) * this.size + this.y;
            this.flashlights[index].updateLocationFromXYReal(x_real_new, y_real_new);
        } else {
            this.flashlights[index].resetLacation();
        }
    }

    checkResult() {
        for (let i = 0; i < N; i++)
            for (let j = 0; j < N; j++) {
                if (this.block[i][j] == 0)
                    return false;
                if (this.matrix[i][j] == 1 && this.block[i][j] != 2)
                    return false;
            }
        return true;
    }

    redrictLevel() {
        let check = false;
        for (let i = 0; i < this.flashlights.length; i++) {
            let x_y = this.flashlights[i].getLocation(i);
            let xt = this.flashlights[i].x;
            let yt = this.flashlights[i].y;

            this.flashlights[i].x = (x_y[0] + this.flashlights[i].x) / 2;
            this.flashlights[i].y = (x_y[1] + this.flashlights[i].y) / 2;


            for (let j = 0; j < 2; j++) {
                this.flashlights[i].x = (xt + this.flashlights[i].x) / 2;
                this.flashlights[i].y = (yt + this.flashlights[i].y) / 2;
            }
            if (Math.abs(this.flashlights[i].x - xt) < 0.01) {
                check = true;
            }
        }
        for (let i = 0; i < this.bugs.length; i++) {
            let locationChange = this.bugs[i].size - this.bugs[i].size / 1.07;
            this.bugs[i].size /= 1.08;
            this.bugs[i].x += locationChange / 2;
            this.bugs[i].y += locationChange / 2;
        }

        if (check) {
            this.win = false;
            this.newGame();
        }

    }

    drawBug() {
        for (let i = 0; i < this.bugs.length; i++)
            this.bugs[i].draw();
    }

    drawFlashlight() {
        for (let i = 0; i < N_flashlight; i++)
            this.flashlights[i].draw();
    }


    draw() {
        let size_2 = this.size / 1.25;
        this.game.context.drawImage(chessBoard_image, this.x, this.y, this.size * 4, this.size * 4);
        this.drawBug();
        this.drawFlashlight();
        this.game.context.drawImage(chessBoard_bg_image, this.x - size_2 / 2, this.y - size_2 / 2, this.size * 4 + size_2, this.size * 4 + size_2);
        this.drawText();
    }

    drawText() {
        this.game.context.font = this.size / 3 + 'px MyCustomFont';
        this.game.context.fillStyle = "#99DFEC";
        this.game.context.textAlign = "center";
        let text = "Solution";
        let bugs = 6 - this.bugs.length;
        if (bugs > 0) {
            text = "Choose" + " " + bugs + " ";
            if (bugs > 1)
                text = text + "bugs";
            else
                text = text + "bug";
        } else {
            if (this.getSolution() === "No solution")
                text = "No solution";
        }
        this.game.context.fillText(text, game_W / 2, this.size);
    }
}