import { Team } from '../types/Team';

export function getDistinctSpeakers(team: Team) {
    let sp = []
    for(let s = 0; s < 3; s++) {
        sp.push(team.round1[s]);
        sp.push(team.round2[s]);
        sp.push(team.round3[s]);
    }
    return [...new Set(sp)];
}