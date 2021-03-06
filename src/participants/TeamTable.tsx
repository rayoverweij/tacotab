import React from 'react';
import './TeamTable.scss';
import TeamRow from './TeamRow';
import { Speaker } from '../types/Speaker';
import { Team } from '../types/Team';
import Table from 'react-bootstrap/Table';


type TeamTableProps = {
    div: number,
    speakers: Speaker[],
    teams: Team[],
    scoreReplies: boolean,
    updateSpeakers: (speakers: Speaker[]) => void,
    updateTeam: (team: Team) => void,
    deleteTeam: (team: Team) => void
}

class TeamTable extends React.PureComponent<TeamTableProps> {
    render() {
        return (
            <Table hover className="team-table table-no-top-margin">
                <thead>
                    <tr>
                        <th>Team</th>
                        <th>Speakers</th>
                        <th>R1 Score</th>
                        <th>R1 Rank</th>
                        <th>R2 Score</th>
                        <th>R2 Rank</th>
                        <th>R3 Score</th>
                        <th>R3 Rank</th>
                        <th>Total Score</th>
                        <th>Total Rank</th>
                    </tr>
                </thead>
                {this.props.teams.map(team => {
                    return <TeamRow
                                key={`${team.name}-row`}
                                team={team}
                                div={this.props.div}
                                speakers={this.props.speakers}
                                teams={this.props.teams}
                                scoreReplies={this.props.scoreReplies}
                                updateSpeakers={this.props.updateSpeakers}
                                updateTeam={this.props.updateTeam}
                                deleteTeam={this.props.deleteTeam} />;
                })}
            </Table>
        );
    }
}

export default TeamTable;