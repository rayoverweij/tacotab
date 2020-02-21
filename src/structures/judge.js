class Judge {
    judgeID;
    name;
    school;
    canChair;
    r1;
    r2;
    r3;
    hasChaired;

    constructor(ID, name, school) {
        this.judgeID = ID;
        this.name = name;
        this.school = school;
        this.canChair = false;
        this.r1 = true;
        this.r2 = true;
        this.r3 = true;
        this.hasChaired = [];
    }
}

export default Judge;