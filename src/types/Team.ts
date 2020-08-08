export type Team = {
    teamID: number,
    name: string,
    round1: [number, number, number],
    round2: [number, number, number],
    round3: [number, number, number],
    totalPoints: number,
    wins: [boolean, boolean, boolean],
    replyScores?: [number, number, number]
}

export const getTotalTeamWins = (team: Team) => {
    return team.wins.filter(x => x).length;
}

export const getTotalReplyPoints = (team: Team) => {
    return team.replyScores!.reduce((x, y) => x + y);
}