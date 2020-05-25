export type Speaker = {
    speakerID: number,
    name: string,
    school: string,
    scores: number[],
    ranks: number[],
    wins: number,
    disqualified: boolean,
    [key: string]: number|string|number[]|boolean
}