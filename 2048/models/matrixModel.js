function MatrixModel() {
    BaseModel.call(this);
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
    this.init();
    var instance = this;
    MatrixModel = function () {
        return instance;
    }
}

MatrixModel.prototype = Object.create(BaseModel.prototype);
MatrixModel.prototype.constructor = MatrixModel;

MatrixModel.prototype.displayActionResults = function (key) {
    this.publish('changeData');
}

MatrixModel.prototype.startNewGame = function () {
    this.init();
    this.publish('changeData');
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
    var initValues = [2, 4];
    var firstValue = initValues[getRandomInt(0, 1)];
    var secondValue = initValues[getRandomInt(0, 1)];
    var firstRow = getRandomInt(0, this.attributes.size.height - 1);
    var firstColumn = getRandomInt(0, this.attributes.size.width - 1);
    var secondRow, secondColumn;
    while (true) {
        secondRow = getRandomInt(0, this.attributes.size.height - 1);
        secondColumn = getRandomInt(0, this.attributes.size.width - 1);
        if (secondRow !== firstRow || secondColumn !== firstColumn) {
            break;
        }
    }
    this.attributes.grid[firstRow][firstColumn] = firstValue;
    this.attributes.grid[secondRow][secondColumn] = secondValue;
}
