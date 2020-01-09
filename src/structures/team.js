class Team {
    teamID;
    teamName;
    bracket;
    round1;
    round2;
    round3;
    totalPoints;

    constructor(teamID, teamName, bracket, d1, d2, d3) {
        this.teamID = teamID;
        this.teamName = teamName;
        this.bracket = bracket;
        this.round1 = [d1, d2, d3];
        this.round2 = [d1, d2, d3];
        this.round3 = [d1, d2, d3];
        this.totalPoints = 0;
    }

}

export default Team;