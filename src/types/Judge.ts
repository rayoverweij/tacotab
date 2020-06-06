export type Judge = {
    judgeID: number,
    name: string,
    school: string,
    canChair: boolean,
    atRound1: boolean,
    atRound2: boolean,
    atRound3: boolean,
    [key: string]: number|string|boolean
}