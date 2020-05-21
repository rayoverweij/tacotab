import React, { ChangeEvent, FormEvent } from 'react';
import TeamTable from './TeamTable';
import { Speaker } from '../types/Speaker';
import { Team } from '../types/Team';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';


type TeamsProps = {
    div: number,
    speakers: Speaker[],
    teams: Team[],
    updateSpeakers: (speakers: Speaker[]) => void,
    updateTeams: (teams: Team[]) => void
}

type TeamsState = {
    addTeamForm: {
        teamName: string,
        speaker1: number,
        speaker2: number,
        speaker3: number,
        [key: string]: string|number
    },
    showModal: boolean
}

class Teams extends React.Component<TeamsProps, TeamsState> {
    constructor(props: TeamsProps) {
        super(props);

        this.state = {
            addTeamForm: {
                teamName: "",
                speaker1: 0,
                speaker2: 0,
                speaker3: 0
            },
            showModal: false
        }

        this.modalShow = this.modalShow.bind(this);
        this.modalHide = this.modalHide.bind(this);
        this.handleAddTeamFormChange = this.handleAddTeamFormChange.bind(this);
        this.handleAddTeamFormSubmit = this.handleAddTeamFormSubmit.bind(this);
        this.updateTeam = this.updateTeam.bind(this);
        this.deleteTeam = this.deleteTeam.bind(this);
    }


    modalShow() {
        this.setState({showModal: true});
    }

    modalHide() {
        this.setState({showModal: false});
    }

    handleAddTeamFormChange(event: ChangeEvent<HTMLInputElement>) {
        const name = event.target.name;
        let value: string|number = event.target.value;
        if(name !== "teamName") value = Number(value);
        let addTeamFormState = {...this.state.addTeamForm};
        addTeamFormState[name] = value;
        this.setState({addTeamForm: addTeamFormState});
    }

    handleAddTeamFormSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        let teams = this.props.teams;
        let counter = JSON.parse(localStorage.getItem("teamCounter")!);

        const memberList = [this.state.addTeamForm.speaker1, this.state.addTeamForm.speaker2, this.state.addTeamForm.speaker3]
        const newTeam: Team = {
            teamID: counter++,
            name: this.state.addTeamForm.teamName,
            round1: memberList,
            round2: memberList,
            round3: memberList,
            totalPoints: 0,
            wins: [false, false, false],
            totalWins: 0,
            sideRound1: "",
            opponents: []
            };
        teams.push(newTeam);

        localStorage.setItem("teamCounter", JSON.stringify(counter));
        this.props.updateTeams(teams);

        this.modalHide();
    }

    updateTeam(team: Team) {
        let teams = this.props.teams;
        const index = teams.findIndex(el => el.teamID === team.teamID);
        teams[index] = team;
        this.props.updateTeams(teams);
    }

    deleteTeam(team: Team) {
        const draws = JSON.parse(localStorage.getItem("draws")!);
        for (const round in draws) {
            let rooms;

            if(this.props.div === 1) rooms = draws[round].roomsOne;
            else rooms = draws[round].roomsTwo;

            for (const pair of rooms) {
                if(pair.prop === team.teamID || pair.opp === team.teamID) {
                    alert("This team has already started the tournament. You can't delete it anymore. You can still replace its speakers.");
                    return;
                }
            }
        }

        const conf = window.confirm(`Are you sure you want to delete team ${team.name}?`);
        if(conf) {
            let teams = this.props.teams;
            teams = teams.filter(el => el.teamID !== team.teamID);  
            this.props.updateTeams(teams);
        }
    }

    
    render() {
        let speakerPicker = this.props.speakers.map(speaker => {
            return (
                <option value={speaker.speakerID} key={`option-${speaker.speakerID}`}>{speaker.name}</option>
            );
        });

        let teamTable;
        if(this.props.teams.length === 0) {
            teamTable = <p className="none-yet">No teams yet!</p>;
        } else {
            teamTable = <TeamTable
                            div={this.props.div}
                            speakers={this.props.speakers}
                            teams={this.props.teams}
                            updateSpeakers={this.props.updateSpeakers}
                            updateTeam={this.updateTeam}
                            deleteTeam={this.deleteTeam}
                            speakerPicker={speakerPicker} />
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
                            <Form.Group controlId={`form-add-team-${this.props.div}-name`}>
                                <Form.Label>Team name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="teamName"
                                    value={this.state.addTeamForm.teamName}
                                    onChange={this.handleAddTeamFormChange} />
                            </Form.Group>
                            <Form.Group controlId={`form-add-team-${this.props.div}-speaker-1`}>
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
                            <Form.Group controlId={`form-add-team-${this.props.div}-speaker-2`}>
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
                            <Form.Group controlId={`form-add-team-${this.props.div}-speaker-3`}>
                                <Form.Label>Speaker 3</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="speaker3"
                                    value={this.state.addTeamForm.speaker3}
                                    onChange={this.handleAddTeamFormChange}>
                                        <option>-- pick a speaker --</option>
                                        <option value="avg">[no third speaker]</option>
                                        {speakerPicker}
                                </Form.Control>
                            </Form.Group>
                            <Button
                                variant="primary"
                                className="btn-submit"
                                type="submit">
                                Add
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default Teams;