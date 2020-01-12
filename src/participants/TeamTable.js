import React from 'react';
import './TeamTable.scss';
import Table from 'react-bootstrap/Table';
import TeamRow from './TeamRow';

class TeamTable extends React.Component {
    render() {
        return (
            <Table hover>
                <thead>
                    <tr>
                        <th>Team Name</th>
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
                                key={`${team.teamName}-row`}
                                team={team}
                                speakers={this.props.speakers}
                                bracket={this.props.bracket}
                                deleteTeam = {this.props.deleteTeam} />;
                })}
            </Table>
        );
    }
}

export default TeamTable;