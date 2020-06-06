export type Team = {
    teamID: number,
    name: string,
    round1: number[],
    round2: number[],
    round3: number[],
    totalPoints: number,
    wins: boolean[],
    totalWins: number
}