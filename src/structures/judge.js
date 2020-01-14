class Judge {
    name;
    canChair;
    r1;
    r2;
    r3;
    hasJudged;

    constructor(name) {
        this.name = name;
        this.canChair = false;
        this.r1 = true;
        this.r2 = true;
        this.r3 = true;
        this.hasJudged = [];
    }
}

export default Judge;