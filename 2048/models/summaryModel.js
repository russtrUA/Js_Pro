function SummaryModel() {
    BaseModel.call(this);
    this.attributes = {
        totalScore: 0,
        bestScore: 0
    }

    this.init();
    var instance = this;
    SummaryModel = function () {
        return instance;
    }
}

SummaryModel.prototype = Object.create(BaseModel.prototype);
SummaryModel.prototype.constructor = SummaryModel;

SummaryModel.prototype.init = function () {
    if (window.localStorage.hasOwnProperty('bestScore')) {
        this.attributes.bestScore = window.localStorage.bestScore;
    } else {
        this.attributes.bestScore = 0;
    }
    this.attributes.totalScore = 0;
}