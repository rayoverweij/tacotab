import React from 'react';
import { Speaker } from '../types/Speaker';
import { Team } from '../types/Team';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';


type RankingProps = {
    speakers: Speaker[],
    teams: Team[]
}

class Ranking extends React.Component<RankingProps> {
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
                    const a_team = teams.find(el => el.round1.includes(a.speakerID));
                    const b_team = teams.find(el => el.round1.includes(b.speakerID));
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
            let team = teams.find(el => el.round1.includes(speaker.speakerID));
            if (team === undefined) {
                team = {
                    teamID: -1,
                    name: "",
                    round1: [],
                    round2: [],
                    round3: [],
                    totalPoints: 0,
                    wins: [],
                    totalWins: 0,
                    sideRound1: "",
                    opponents: []
                }
            }
            return (
                <tr key={`speaker_rank_${index + 1}`}>
                    <td>{index + 1}</td>
                    <td>{speaker.name}</td>
                    <td>{speaker.school}</td>
                    <td>{speaker.scores.reduce((x, y) => x + y, 0)}</td>
                    <td>{speaker.ranks.reduce((x, y) => x + y, 0)}</td>
                    <td>{team.totalWins}</td>
                    <td>{team.totalPoints}</td>
                </tr>
            );
        });


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
                    <td>{team.name}</td>
                    <td>{team.totalWins}</td>
                    <td>{team.totalPoints}</td>
                </tr>
            );
        });
        

        return (
            <div>
                <h2>Ranking</h2>
                <Row>
                    <Col lg={7} className="table-col">
                        <h3>Speakers</h3>
                        <Table striped className="speaker-ranking-table table-no-top-margin table-less-bottom-margin-sm">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>School</th>
                                    <th>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Tooltip id="tooltip-totalspeakerpoints">
                                                    Total speaker points
                                                </Tooltip>
                                            }>
                                            <abbr title="">ΣSP</abbr>
                                        </OverlayTrigger>
                                    </th>
                                    <th>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Tooltip id="tooltip-totalspeakerranks">
                                                    Total speaker ranks<br />(lower is better)
                                                </Tooltip>
                                            }>
                                            <abbr title="">ΣSR</abbr>
                                        </OverlayTrigger>
                                    </th>
                                    <th>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Tooltip id="tooltip-totalteamwins">
                                                    Total team wins
                                                </Tooltip>
                                            }>
                                            <abbr title="">ΣTW</abbr>
                                        </OverlayTrigger>
                                    </th>
                                    <th>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Tooltip id="tooltip-totalteampoints">
                                                    Total team points
                                                </Tooltip>
                                            }>
                                            <abbr title="">ΣTP</abbr>
                                        </OverlayTrigger>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {speaker_ranking}
                            </tbody>
                        </Table>
                    </Col>
                    <Col lg={5} className="table-col table-col-margin-lg">
                        <h3>Teams</h3>
                        <Table striped className="table-no-top-margin">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Tooltip id="tooltip-totalteamwins">
                                                    Total team wins
                                                </Tooltip>
                                            }>
                                            <abbr title="">ΣTW</abbr>
                                        </OverlayTrigger>
                                    </th>
                                    <th>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Tooltip id="tooltip-totalteampoints">
                                                    Total team points
                                                </Tooltip>
                                            }>
                                            <abbr title="">ΣTP</abbr>
                                        </OverlayTrigger>
                                    </th>
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