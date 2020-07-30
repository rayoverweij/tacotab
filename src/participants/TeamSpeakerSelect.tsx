import React, { ChangeEvent } from 'react';
import { Team } from '../types/Team';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';


type TeamSpeakerSelectProps = {
    team: Team,
    speakerPos: number,
    round: number,
    value: Array<number[]>,
    handleUpdateTeamFormChange: (value: number, speaker: number, round: number) => void
}

type TeamSpeakerSelectState = {
    value: number
}

class TeamSpeakerSelect extends React.PureComponent<TeamSpeakerSelectProps, TeamSpeakerSelectState> {
    constructor(props: TeamSpeakerSelectProps) {
        super(props);

        let roundKey: keyof Team;
        if(this.props.round === 1) {
            roundKey = "round1";
        } else if(this.props.round === 2) {
            roundKey = "round2";
        } else {
            roundKey = "round3";
        }

        this.state = {
            value: this.props.team[roundKey][this.props.speakerPos]
        }

        this.handleFormChange = this.handleFormChange.bind(this);
    }


    handleFormChange(event: ChangeEvent<HTMLInputElement>) {
        const value = parseInt(event.target.value);
        this.setState({value: value});
        this.props.handleUpdateTeamFormChange(value, this.props.speakerPos, this.props.round);
    }


    render() {
        return (
            <Col>
                <Form.Group controlId={`form-update-team-${this.props.team.teamID}-speaker-${this.props.speakerPos}-round-${this.props.round}`}>
                    <Form.Label>Round {this.props.round}</Form.Label>
                    <Form.Control
                        as="select"
                        name={`speaker-${this.props.speakerPos}-round-${this.props.round}`}
                        value={this.state.value}
                        onChange={this.handleFormChange}>
                            {this.props.speakerPos === 2 ? <option value={-1}>[averaged third speaker]</option> : ""}
                            {this.props.children}
                    </Form.Control>
                </Form.Group>
            </Col>
        );
    }
}

export default TeamSpeakerSelect;