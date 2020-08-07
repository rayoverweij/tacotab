export type Team = {
    teamID: number,
    name: string,
    round1: [number, number, number],
    round2: [number, number, number],
    round3: [number, number, number],
    totalPoints: number,
    wins: [boolean, boolean, boolean],
    totalWins: number,
    replyScores?: [number, number, number]
}