function MatrixModel() {
    BaseModel.call(this);
    this.summaryModel = new SummaryModel();
    this.attributes = {
        size: {
            width: 4,
            height: 4
        },
        grid: [
            ['', '', '', ''],
            ['', '', '', ''],
            ['', '', '', ''],
            ['', '', '', '']
        ]
    }
    this.emptyCoordinates = [];
    this.init();
    var instance = this;
    MatrixModel = function () {
        return instance;
    }
}

MatrixModel.prototype = Object.create(BaseModel.prototype);
MatrixModel.prototype.constructor = MatrixModel;

MatrixModel.prototype.displayActionResults = function (key) {
    if (key === 'right') {
        this.calcAndShiftRight();
    }
    if (key === 'left') {
        this.calcAndShiftLeft();
    }
    if (key === 'up') {
        this.calcAndShiftUp();
    }
    if (key === 'down') {
        this.calcAndShiftDown();
    }
    this.publish('changeData');
    if (this.isFinished() === true) {
        if (this.summaryModel.attributes.bestScore === this.summaryModel.attributes.totalScore) {
            window.localStorage.bestScore = this.summaryModel.attributes.bestScore;
        }
        this.publish('gameOver');
    }
}

MatrixModel.prototype.isFinished = function () {
    if (this.emptyCoordinates.length === 0) {
        var i, j, arr = this.attributes.grid;
        for (i = 0; i < arr.length; i += 1) {
            for (j = 0; j < arr[i].length - 1; j += 1) {
                if (arr[i][j] === arr[i][j + 1]) {
                    return false;
                }
            }
        }
        for (i = 0; i < this.attributes.size.width; i += 1) {
            for (j = 0; j < arr.length - 1; j += 1) {
                if (arr[j][i] == arr[j + 1][i]) {
                    return false;
                }
            }
        }
        return true;
    }
}

MatrixModel.prototype.startNewGame = function () {
    if (this.summaryModel.attributes.bestScore === this.summaryModel.attributes.totalScore) {
        window.localStorage.bestScore = this.summaryModel.attributes.bestScore;
    }
    this.init();
    this.publish('changeData');
    this.summaryModel.publish('changeData');
}
MatrixModel.prototype.clearMatrix = function () {
    this.attributes.grid = [
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', '']
    ];
}

MatrixModel.prototype.init = function () {
    this.clearMatrix();
    this.fillRandomValue();
    this.fillRandomValue();
    this.summaryModel.init();
}
MatrixModel.prototype.fillEmptyCoordinates = function () {
    var i, j;
    this.emptyCoordinates = [];
    for (i = 0; i < this.attributes.size.height; i += 1) {
        for (j = 0; j < this.attributes.size.width; j += 1) {
            if (this.attributes.grid[i][j] === '') {
                this.emptyCoordinates.push([i, j]);
            }
        }
    }

}

MatrixModel.prototype.fillRandomValue = function () {
    this.fillEmptyCoordinates();
    var initValues = ['2', '2', '2', '2', '4'];
    var randomValue = initValues[getRandomInt(0, 4)];
    var randomCoordinates = this.emptyCoordinates[getRandomInt(0, this.emptyCoordinates.length - 1)];
    this.attributes.grid[randomCoordinates[0]][randomCoordinates[1]] = randomValue;
    this.emptyCoordinates = this.emptyCoordinates.filter(function (item) {
        return item !== randomCoordinates;
    });
}

MatrixModel.prototype.calcAndShiftRight = function () {
    var firstJob = this.shiftRight();
    var secondJob = this.calcRight();
    if (secondJob === true) {
        this.summaryModel.publish('changeData');
    }
    if (firstJob === true || secondJob === true) {
        this.fillRandomValue();
    }
}

MatrixModel.prototype.calcRight = function () {
    var row, i, arr, isWorked = false;
    for (row = 0; row < this.attributes.grid.length; row += 1) {
        arr = this.attributes.grid[row];
        for (i = arr.length - 1; i > 0; i -= 1) {
            if (arr[i] !== '' && arr[i] === arr[i - 1]) {
                arr[i] = (+arr[i] * 2).toString();
                this.summaryModel.attributes.totalScore += +arr[i];
                if (this.summaryModel.attributes.bestScore < this.summaryModel.attributes.totalScore) {
                    this.summaryModel.attributes.bestScore = this.summaryModel.attributes.totalScore;
                }
                arr[i - 1] = '';
                isWorked = true;
            }
        }
    }
    if (isWorked === true) {
        this.shiftRight();
    }
    return isWorked;
}

MatrixModel.prototype.shiftRight = function () {
    var row, i, j, arr, isWorked = false;
    for (row = 0; row < this.attributes.grid.length; row += 1) {
        arr = this.attributes.grid[row];
        for (i = arr.length - 1; i > 0; i -= 1) {
            if (arr[i] === '') {
                for (j = i - 1; j >= 0; j -= 1) {
                    if (arr[j] !== '') {
                        arr[i] = arr[j];
                        arr[j] = '';
                        isWorked = true;
                        break;
                    }
                }
            }
        }
    }
    return isWorked;
}

MatrixModel.prototype.calcAndShiftLeft = function () {
    var firstJob = this.shiftLeft();
    var secondJob = this.calcLeft();
    if (secondJob === true) {
        this.summaryModel.publish('changeData');
    }
    if (firstJob === true || secondJob === true) {
        this.fillRandomValue();
    }
}

MatrixModel.prototype.calcLeft = function () {
    var row, i, arr, isWorked = false;
    for (row = 0; row < this.attributes.grid.length; row += 1) {
        arr = this.attributes.grid[row];
        for (i = 0; i < arr.length - 1; i += 1) {
            if (arr[i] !== '' && arr[i] === arr[i + 1]) {
                arr[i] = (+arr[i] * 2).toString();
                this.summaryModel.attributes.totalScore += +arr[i];
                if (this.summaryModel.attributes.bestScore < this.summaryModel.attributes.totalScore) {
                    this.summaryModel.attributes.bestScore = this.summaryModel.attributes.totalScore;
                }
                arr[i + 1] = '';
                isWorked = true;
            }
        }
    }
    if (isWorked === true) {
        this.shiftLeft();
    }
    return isWorked;
}

MatrixModel.prototype.shiftLeft = function () {
    var row, i, j, arr, isWorked = false;;
    for (row = 0; row < this.attributes.grid.length; row += 1) {
        arr = this.attributes.grid[row];
        for (i = 0; i < arr.length - 1; i += 1) {
            if (arr[i] === '') {
                for (j = i + 1; j <= arr.length - 1; j += 1) {
                    if (arr[j] !== '') {
                        arr[i] = arr[j];
                        arr[j] = '';
                        isWorked = true;
                        break;
                    }
                }
            }
        }
    }
    return isWorked;
}

MatrixModel.prototype.calcAndShiftUp = function () {
    var firstJob = this.shiftUp();
    var secondJob = this.calcUp();
    if (secondJob === true) {
        this.summaryModel.publish('changeData');
    }
    if (firstJob === true || secondJob === true) {
        this.fillRandomValue();
    }
}

MatrixModel.prototype.calcUp = function () {
    var col, i, arr, isWorked = false;
    for (col = 0; col < this.attributes.size.width; col += 1) {
        arr = getColumn(this.attributes.grid, col);
        for (i = 0; i < arr.length - 1; i += 1) {
            if (arr[i] !== '' && arr[i] === arr[i + 1]) {
                arr[i] = (+arr[i] * 2).toString();
                this.summaryModel.attributes.totalScore += +arr[i];
                if (this.summaryModel.attributes.bestScore < this.summaryModel.attributes.totalScore) {
                    this.summaryModel.attributes.bestScore = this.summaryModel.attributes.totalScore;
                }
                arr[i + 1] = '';
                isWorked = true;
            }
        }
        setColumn(this.attributes.grid, arr, col);
    }
    if (isWorked === true) {
        this.shiftUp();
    }
    return isWorked;
}

MatrixModel.prototype.shiftUp = function () {
    var col, i, j, arr, isWorked = false;;
    for (col = 0; col < this.attributes.size.width; col += 1) {
        arr = getColumn(this.attributes.grid, col);
        for (i = 0; i < arr.length - 1; i += 1) {
            if (arr[i] === '') {
                for (j = i + 1; j <= arr.length - 1; j += 1) {
                    if (arr[j] !== '') {
                        arr[i] = arr[j];
                        arr[j] = '';
                        isWorked = true;
                        break;
                    }
                }
            }
        }
        setColumn(this.attributes.grid, arr, col);
    }
    return isWorked;
}

MatrixModel.prototype.calcAndShiftDown = function () {
    var firstJob = this.shiftDown();
    var secondJob = this.calcDown();
    if (secondJob === true) {
        this.summaryModel.publish('changeData');
    }
    if (firstJob === true || secondJob === true) {
        this.fillRandomValue();
    }
}

MatrixModel.prototype.calcDown = function () {
    var col, i, arr, isWorked = false;
    for (col = 0; col < this.attributes.size.width; col += 1) {
        arr = getColumn(this.attributes.grid, col);
        for (i = arr.length - 1; i > 0; i -= 1) {
            if (arr[i] !== '' && arr[i] === arr[i - 1]) {
                arr[i] = (+arr[i] * 2).toString();
                this.summaryModel.attributes.totalScore += +arr[i];
                if (this.summaryModel.attributes.bestScore < this.summaryModel.attributes.totalScore) {
                    this.summaryModel.attributes.bestScore = this.summaryModel.attributes.totalScore;
                }
                arr[i - 1] = '';
                isWorked = true;
            }
        }
        setColumn(this.attributes.grid, arr, col);
    }
    if (isWorked === true) {
        this.shiftDown();
    }
    return isWorked;
}


MatrixModel.prototype.shiftDown = function () {
    var col, i, j, arr, isWorked = false;;
    for (col = 0; col < this.attributes.size.width; col += 1) {
        arr = getColumn(this.attributes.grid, col);
        for (i = arr.length - 1; i > 0; i -= 1) {
            if (arr[i] === '') {
                for (j = i - 1; j >= 0; j -= 1) {
                    if (arr[j] !== '') {
                        arr[i] = arr[j];
                        arr[j] = '';
                        isWorked = true;
                        break;
                    }
                }
            }
        }
        setColumn(this.attributes.grid, arr, col);
    }
    return isWorked;
}