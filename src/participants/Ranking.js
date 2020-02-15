import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';


class Ranking extends React.Component {
    // doesn't automatically update yet
    render() {
        const speakers = this.props.speakers;
        const teams = this.props.teams;

        const speakers_ranked = speakers
                                .slice(0)
                                .filter(el => el.disqualified === false)
                                .sort((a, b) => {
            // First sort on total speaker scores
            const a_sum = a.scores.reduce((x, y) => x + y, 0);
            const b_sum = b.scores.reduce((x, y) => x + y, 0);

            if(a_sum > b_sum) {
                return -1;
            } else if(a_sum < b_sum) {
                return 1;
            } else {
                // Secondly sort on speaker ranks
                const a_ranks = a.ranks.reduce((x, y) => x + y, 0);
                const b_ranks = b.ranks.reduce((x, y) => x + y, 0);

                if(a_ranks < b_ranks) {
                    return -1;
                } else if(a_ranks > b_ranks) {
                    return 1;
                } else {
                    // Thirdly sort on team wins
                    const a_team = teams.find(el => el.round1.includes(a.debaterID.toString()));
                    const b_team = teams.find(el => el.round1.includes(b.debaterID.toString()));
                    const a_wins = a_team === undefined ? 0 : a_team.totalWins;
                    const b_wins = b_team === undefined ? 0 : b_team.totalWins;

                    if(a_wins > b_wins) {
                        return -1;
                    } else if(a_wins < b_wins) {
                        return 1;
                    } else {
                        // Fourthly sort on team points
                        const a_tpoints = a_team === undefined ? 0 : a_team.totalPoints;
                        const b_tpoints = b_team === undefined ? 0 : b_team.totalPoints;

                        if(a_tpoints > b_tpoints) {
                            return -1;
                        } else if(a_tpoints < b_tpoints) {
                            return 1;
                        } else {
                            return 1;
                        }
                    }
                }
            }
        });

        const speaker_ranking = speakers_ranked.map((speaker, index) => {
            let team = teams.find(el => el.round1.includes(speaker.debaterID.toString()));
            if (team === undefined) {
                team = {}
                team.totalWins = 0;
                team.totalPoints = 0;
            }
            return (
                <tr key={`speaker_rank_${index + 1}`}>
                    <td>{index + 1}</td>
                    <td>{speaker.name}</td>
                    <td>{speaker.scores.reduce((x, y) => x + y, 0)}</td>
                    <td>{speaker.ranks.reduce((x, y) => x + y, 0)}</td>
                    <td>{team.totalWins}</td>
                    <td>{team.totalPoints}</td>
                </tr>
            );
        }).splice(0, 20);


        const teams_ranked = teams.slice(0).sort((a, b) => {
            // First sort on team wins
            const a_wins = a.totalWins;
            const b_wins = b.totalWins;

            if(a_wins > b_wins) {
                return -1;
            } else if(a_wins < b_wins) {
                return 1;
            } else {
                // Secondlyly sort on team points
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

        const team_ranking = teams_ranked.map((team, index) => {
            return (
                <tr key={`team_rank_${index + 1}`}>
                    <td>{index + 1}</td>
                    <td>{team.teamName}</td>
                    <td>{team.totalWins}</td>
                    <td>{team.totalPoints}</td>
                </tr>
            );
        });
        

        return (
            <div>
                <Row>
                    <Col>
                        <h2>Ranking</h2>
                    </Col>
                </Row>
                <Row>
                    <Col md={6} className="table-col">
                        <h4>Speakers</h4>
                        <Table hover className="speaker-ranking-table table-no-top-margin">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th><abbr title="Total speaker points">ΣSP</abbr></th>
                                    <th><abbr title="Total speaker ranks (lower is better)">ΣSR</abbr></th>
                                    <th><abbr title="Total team wins">ΣTW</abbr></th>
                                    <th><abbr title="Total team points">ΣTP</abbr></th>
                                </tr>
                            </thead>
                            <tbody>
                                {speaker_ranking}
                            </tbody>
                        </Table>
                    </Col>
                    <Col md={6}>
                        <h4>Teams</h4>
                        <Table hover className="table-no-top-margin">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th><abbr title="Total team wins">ΣTW</abbr></th>
                                    <th><abbr title="Total team points">ΣTP</abbr></th>
                                </tr>
                            </thead>
                            <tbody>
                                {team_ranking}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Ranking;