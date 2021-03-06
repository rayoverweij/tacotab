import React from 'react';
import InfoTip from '../utils/InfoTip';
import { Speaker } from '../types/Speaker';
import { Team, getTotalTeamWins, getTotalReplyPoints } from '../types/Team';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { getDistinctSpeakers } from '../utils/getDistinctSpeakers';
import { sortTeams } from '../utils/sortTeams';


type RankingProps = {
    speakers: Speaker[],
    teams: Team[],
    scoreReplies: boolean
}

class Ranking extends React.PureComponent<RankingProps> {
    render() {
        const speakers = this.props.speakers;
        const teams = this.props.teams;
        const scoreReplies = this.props.scoreReplies;

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
                    const a_wins = a_team === undefined ? 0 : getTotalTeamWins(a_team);
                    const b_wins = b_team === undefined ? 0 : getTotalTeamWins(b_team);

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
            return (
                <tr key={`speaker-rank-${index + 1}`}>
                    <td>{index + 1}</td>
                    <td>{speaker.name}</td>
                    <td>{speaker.school}</td>
                    <td>{speaker.scores.reduce((x, y) => x + y, 0)}</td>
                    <td>{speaker.ranks.reduce((x, y) => x + y, 0)}</td>
                    <td>{team !== undefined ? getTotalTeamWins(team) : 0}</td>
                    <td>{team?.totalPoints || 0}</td>
                </tr>
            );
        });


        const teams_ranked = sortTeams(teams, scoreReplies);

        const team_ranking = teams_ranked.map((team, index) => {
            const speakerIDs = getDistinctSpeakers(team);
            const speakerNames: string[] = [];
            for(let speakerID of speakerIDs) {
                let currSpeaker = speakers.find(sp => sp.speakerID === speakerID);
                if(currSpeaker === undefined) continue;
                if(currSpeaker.disqualified === true) continue;
                speakerNames.push(currSpeaker.name);
            }
            const speakerElements = speakerNames.map((speaker, index) => {
                if(index < speakerNames.length - 1) {
                    return (
                        <React.Fragment key={`speaker-${index}`}>
                            {speaker},&nbsp;
                        </React.Fragment>
                    );
                } else {
                    return (
                        <React.Fragment key={`speaker-${index}`}>
                            {speaker}
                        </React.Fragment>
                    );
                }
            });

            return (
                <tr key={`team-rank-${index + 1}`}>
                    <td>{index + 1}</td>
                    <td>
                        <InfoTip
                            id={`tooltip-rank-teamName-${index + 1}`}
                            abbr={team.name}>
                            {speakerElements}
                        </InfoTip>
                    </td>
                    <td>{getTotalTeamWins(team)}</td>
                    {scoreReplies ?
                    <td>
                        {getTotalReplyPoints(team)}
                    </td>
                    : ""}
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
                                        <InfoTip
                                            id="tooltip-totalspeakerpoints"
                                            abbr="ΣSP">
                                            Total speaker points
                                        </InfoTip>
                                    </th>
                                    <th>
                                        <InfoTip
                                            id="tooltip-totalspeakerranks"
                                            abbr="ΣSR">
                                            Total speaker ranks<br />(lower is better)
                                        </InfoTip>
                                    </th>
                                    <th>
                                        <InfoTip
                                            id="tooltip-totalteamwins-speakers"
                                            abbr="ΣTW">
                                            Total team wins
                                        </InfoTip>
                                    </th>
                                    <th>
                                        <InfoTip
                                            id="tooltip-totalteampoints-speakers"
                                            abbr="ΣTP">
                                            Total team points
                                        </InfoTip>
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
                                        <InfoTip
                                            id="tooltip-totalteamwins-teams"
                                            abbr="ΣTW">
                                            Total team wins
                                        </InfoTip>
                                    </th>
                                    {scoreReplies ?
                                    <th>
                                        <InfoTip
                                            id="tooltip-totalreplypoints"
                                            abbr="ΣRP">
                                            Total reply points
                                        </InfoTip>
                                    </th>
                                    : ""}
                                    <th>
                                        <InfoTip
                                            id="tooltip-totalteampoints-teams"
                                            abbr="ΣTP">
                                            Total team points
                                        </InfoTip>
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