class Judge {
    judgeID;
    name;
    canChair;
    r1;
    r2;
    r3;
    hasChaired;

    constructor(ID, name) {
        this.judgeID = ID;
        this.name = name;
        this.canChair = false;
        this.r1 = true;
        this.r2 = true;
        this.r3 = true;
        this.hasChaired = [];
    }
}

export default Judge;