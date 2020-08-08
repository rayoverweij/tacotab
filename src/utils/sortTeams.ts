import { Team, getTotalTeamWins, getTotalReplyPoints } from '../types/Team';

export const sortTeams = (teams: Team[], scoreReplies: boolean) => {
    return [...teams].sort((a, b) => {
        // First sort on team wins
        const a_wins = getTotalTeamWins(a);
        const b_wins = getTotalTeamWins(b);

        if(a_wins > b_wins) {
            return -1;
        } else if(a_wins < b_wins) {
            return 1;
        } else {
            // Optionally sort on reply points
            if(scoreReplies) {
                const a_rpoints = getTotalReplyPoints(a);
                const b_rpoints = getTotalReplyPoints(b);

                if(a_rpoints > b_rpoints) {
                    return -1;
                } else if(a_rpoints < b_rpoints) {
                    return 1;
                }
            }
            // Finally sort on team points
            const a_tpoints = a.totalPoints;
            const b_tpoints = b.totalPoints;

            if(a_tpoints > b_tpoints) {
                return -1;
            } else if(a_tpoints < b_tpoints) {
                return 1;
            } else {
                return 1;
            }
        }
    });
}