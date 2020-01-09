class Judge {
    name;
    canChair;
    hasJudged;

    constructor(name, canChair) {
        this.name = name;
        this.canChair = canChair;
        this.hasJudged = [];
    }
}