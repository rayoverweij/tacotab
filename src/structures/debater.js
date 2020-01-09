class Debater {
    debaterID;
    name;
    school;
    scores;
    ranks;
    wins;
    disqualified;

    constructor(debaterID, name, school) {
        this.debaterID = debaterID;
        this.name = name;
        this.school = school;
        this.scores = [0, 0, 0];
        this.ranks = [0, 0, 0];
        this.wins = 0;
        this.disqualified = false;
    }
}

export default Debater;