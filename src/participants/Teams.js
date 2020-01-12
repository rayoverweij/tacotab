import React from 'react';
import './Teams.scss';
import TeamTable from './TeamTable';

import Team from '../structures/team';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

class Teams extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            addTeamForm: {
                teamName: "",
                speaker1: "",
                speaker2: "",
                speaker3: ""
            },
            teams: this.props.bracket === "middle" ? JSON.parse(localStorage.getItem("teams_middle")) : JSON.parse(localStorage.getItem("teams_high")),
            speakers: this.props.bracket === "middle" ? JSON.parse(localStorage.getItem("speakers_middle")) : JSON.parse(localStorage.getItem("speakers_high")),
            showModal: false
        }

        this.modalShow = this.modalShow.bind(this);
        this.modalHide = this.modalHide.bind(this);
        this.handleAddTeamFormChange = this.handleAddTeamFormChange.bind(this);
        this.handleAddTeamFormSubmit = this.handleAddTeamFormSubmit.bind(this);
        this.deleteTeam = this.deleteTeam.bind(this);
    }


    modalShow() {
        this.setState({showModal: true});
    }

    modalHide() {
        this.setState({showModal: false});
    }

    handleAddTeamFormChange(event) {
        const value = event.target.value;
        const name = event.target.name;
        let addTeamFormState = {...this.state.addTeamForm};
        addTeamFormState[name] = value;
        this.setState({addTeamForm: addTeamFormState});
    }

    handleAddTeamFormSubmit(event) {
        event.preventDefault();

        let teams = this.state.teams;
        let counter = this.props.bracket === "middle" ? localStorage.getItem("teams_middle_counter") : localStorage.getItem("teams_high_counter");

        const newTeam = new Team(counter++, this.state.addTeamForm.teamName, this.state.addTeamForm.speaker1, this.state.addTeamForm.speaker2, this.state.addTeamForm.speaker3);
        teams.push(newTeam);

        if(this.props.bracket === "middle") {
            localStorage.setItem("teams_middle", JSON.stringify(teams));
            localStorage.setItem("teams_middle_counter", counter);
        } else {
            localStorage.setItem("teams_high", JSON.stringify(teams));
            localStorage.setItem("teams_high_counter", counter);
        }

        this.setState({teams: teams});
        this.modalHide();
    }

    deleteTeam(team) {
        const conf = window.confirm(`Are you sure you want to delete team ${team.teamName}?`);
        
        if(conf) {
            let teams = this.state.teams;

            teams = teams.filter(el => {
                return el.teamID !== team.teamID;
            });
            
            if(this.props.bracket === "middle") {
                localStorage.setItem("teams_middle", JSON.stringify(teams));
            } else {
                localStorage.setItem("teams_high", JSON.stringify(teams));
            }

            this.setState({teams: teams});
        }
    }

    
    render() {
        let speakerPicker = this.state.speakers.map(speaker => {
            return (
                <option value={speaker.debaterID} key={`option-${speaker.debaterID}`}>{speaker.name}</option>
            );
        });

        let teamTable;
        if(this.state.teams.length === 0) {
            teamTable = <p id="no-teams">No teams yet!</p>;
        } else {
            teamTable = <TeamTable
                            speakers={this.state.speakers}
                            teams={this.state.teams}
                            bracket={this.props.bracket}
                            deleteTeam={this.deleteTeam} />
        }

        return (
            <div>
                <Row>
                    <Col>
                        <h2>Teams</h2>
                        <Button onClick={this.modalShow}>Add team</Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {teamTable}
                    </Col>
                </Row>

                <Modal show={this.state.showModal} onHide={this.modalHide}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add a team</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form onSubmit={this.handleAddTeamFormSubmit}>
                            <Form.Group controlId={`form-add-team-${this.props.bracket}-name`}>
                                <Form.Label>Team name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="teamName"
                                    value={this.state.addTeamForm.teamName}
                                    onChange={this.handleAddTeamFormChange} />
                            </Form.Group>
                            <Form.Group controlId={`form-add-team-${this.props.bracket}-speaker-1`}>
                                <Form.Label>Speaker 1</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="speaker1"
                                    value={this.state.addTeamForm.speaker1}
                                    onChange={this.handleAddTeamFormChange}>
                                        <option>-- pick a speaker --</option>
                                        {speakerPicker}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId={`form-add-team-${this.props.bracket}-speaker-2`}>
                                <Form.Label>Speaker 2</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="speaker2"
                                    value={this.state.addTeamForm.speaker2}
                                    onChange={this.handleAddTeamFormChange}>
                                        <option>-- pick a speaker --</option>
                                        {speakerPicker}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId={`form-add-team-${this.props.bracket}-speaker-3`}>
                                <Form.Label>Speaker 3</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="speaker3"
                                    value={this.state.addTeamForm.speaker3}
                                    onChange={this.handleAddTeamFormChange}>
                                        <option>-- pick a speaker --</option>
                                        {speakerPicker}
                                </Form.Control>
                            </Form.Group>
                            <Button variant="primary" type="submit" className="add-team-button">Add</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default Teams;