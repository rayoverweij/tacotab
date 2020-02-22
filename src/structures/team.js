class Team {
    teamID;
    teamName;
    round1;
    round2;
    round3;
    totalPoints;
    wins;
    totalWins;
    sideR1;
    opponents;

    constructor(teamID, teamName, d1, d2, d3) {
        this.teamID = teamID;
        this.teamName = teamName;
        this.round1 = [d1, d2, d3];
        this.round2 = [d1, d2, d3];
        this.round3 = [d1, d2, d3];
        this.totalPoints = 0;
        this.wins = [false, false, false];
        this.totalWins = 0;
        this.sideR1 = "";
        this.opponents = [];
    }

}

export default Team;