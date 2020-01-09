class Debater {
    debaterID;
    name;
    bracket;
    scores;
    ranks;
    wins;
    disqualified;

    constructor(debaterID, name, bracket) {
        this.debaterID = debaterID;
        this.name = name;
        this.bracket = bracket;
        this.scores = [0, 0, 0];
        this.ranks = [0, 0, 0];
        this.wins = 0;
        this.disqualified = false;
    }
}

export default Debater;