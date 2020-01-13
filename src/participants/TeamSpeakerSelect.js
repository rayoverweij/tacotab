import React from 'react';

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';


class TeamSpeakerSelect extends React.Component {
    constructor(props) {
        super(props);

        let r;
        if(this.props.round === 1) {
            r = "round1";
        } else if(this.props.round === 2) {
            r = "round2";
        } else {
            r = "round3";
        }

        this.state = {
            value: this.props.team[r][this.props.speaker]
        }

        this.handleFormChange = this.handleFormChange.bind(this);
    }

    handleFormChange(event) {
        const value = event.target.value;
        this.setState({value: value});
        this.props.handleUpdateTeamFormChange(value, this.props.speaker, this.props.round);
    }

    render() {
        return (
            <Col>
                <Form.Group controlId={`form-update-team-${this.props.team.teamID}-speaker-${this.props.speaker}-round-${this.props.round}`}>
                    <Form.Label>Round {this.props.round}</Form.Label>
                    <Form.Control
                        as="select"
                        name={`speaker-${this.props.speaker}-round-${this.props.round}`}
                        value={this.state.value}
                        onChange={this.handleFormChange}>
                            {this.props.speakerPicker}
                    </Form.Control>
                </Form.Group>
            </Col>
        );
    }
}

export default TeamSpeakerSelect;