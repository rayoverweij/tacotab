import React, { ChangeEvent, FormEvent } from 'react';
import TeamTable from './TeamTable';
import TwoPersonTeamTooltip from './TwoPersonTeamTooltip';
import { Speaker } from '../types/Speaker';
import { Team } from '../types/Team';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { SpeakerDropDown } from './SpeakerDropDown';


type TeamsProps = {
    div: number,
    speakers: Speaker[],
    teams: Team[],
    scoreReplies: boolean,
    updateSpeakers: (speakers: Speaker[]) => void,
    updateTeams: (teams: Team[]) => void
}

type TeamsState = {
    addTeamForm: {
        teamName: string,
        speaker1: number | "",
        speaker2: number | "",
        speaker3: number | "",
        [key: string]: string|number
    },
    addTeamFormValidated: boolean,
    showModal: boolean,
    showWarning: boolean
}

class Teams extends React.PureComponent<TeamsProps, TeamsState> {
    constructor(props: TeamsProps) {
        super(props);

        this.state = {
            addTeamForm: {
                teamName: "",
                speaker1: "",
                speaker2: "",
                speaker3: ""
            },
            addTeamFormValidated: false,
            showModal: false,
            showWarning: false
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

        const form = event.currentTarget;
        if(form.checkValidity() === false) {
            event.stopPropagation();
            this.setState({addTeamFormValidated: true});
            return false;
        }

        const team = {...this.state.addTeamForm}
        if (team.speaker1 === team.speaker2 || team.speaker1 === team.speaker3 || team.speaker2 === team.speaker3) {
            this.setState({showWarning: true});
            return false;
        }

        let counter = JSON.parse(localStorage.getItem("teamCounter")!);

        const memberList = [team.speaker1, team.speaker2, team.speaker3] as [number, number, number]
        const newTeam: Team = {
            teamID: counter++,
            name: team.teamName,
            round1: memberList,
            round2: memberList,
            round3: memberList,
            totalPoints: 0,
            wins: [false, false, false]
            };
        if (this.props.scoreReplies) newTeam.replyScores = [0, 0, 0];
        
        const newTeams = [...this.props.teams, newTeam];

        localStorage.setItem("teamCounter", JSON.stringify(counter));
        this.props.updateTeams(newTeams);

        this.setState({addTeamForm: {
            teamName: "",
            speaker1: "",
            speaker2: "",
            speaker3: ""
        }});
        this.setState({showWarning: false});
        this.setState({addTeamFormValidated: false});
        this.modalHide();
    }

    updateTeam(team: Team) {
        let teams = [...this.props.teams];
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
            const teams = [...this.props.teams].filter(el => el.teamID !== team.teamID);  
            this.props.updateTeams(teams);
        }
    }

    
    render() {
        let noTeams = false;
        if(this.props.teams.length === 0) {
            noTeams = true;
        }

        let teamTable;
        if(noTeams) {
            teamTable = <p className="none-yet">No teams yet!</p>;
        } else {
            teamTable = <TeamTable
                            div={this.props.div}
                            speakers={this.props.speakers}
                            teams={this.props.teams}
                            scoreReplies={this.props.scoreReplies}
                            updateSpeakers={this.props.updateSpeakers}
                            updateTeam={this.updateTeam}
                            deleteTeam={this.deleteTeam} />
        }

        return (
            <div>
                <h2>
                    Teams
                    <Button onClick={this.modalShow}>Add team</Button>
                    <div className={`hint-add-team ${noTeams ? "" : "hidden"}`}>
                        <span>&gt;</span>
                        <span>&gt;</span>
                        <span>&gt;</span>
                    </div>
                </h2>
                {teamTable}

                <Modal show={this.state.showModal} onHide={this.modalHide}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add a team</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form
                            noValidate
                            validated={this.state.addTeamFormValidated}
                            onSubmit={this.handleAddTeamFormSubmit}>
                            <Form.Group controlId={`form-add-team-${this.props.div}-name`}>
                                <Form.Label>Team name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="teamName"
                                    required
                                    value={this.state.addTeamForm.teamName}
                                    onChange={this.handleAddTeamFormChange} />
                                <Form.Control.Feedback type="invalid">
                                    Please give the team a name.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId={`form-add-team-${this.props.div}-speaker-1`}>
                                <Form.Label>Speaker 1</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="speaker1"
                                    required
                                    value={this.state.addTeamForm.speaker1}
                                    onChange={this.handleAddTeamFormChange}>
                                        <option value="" disabled hidden>-- pick a speaker --</option>
                                        <SpeakerDropDown speakers={this.props.speakers} />
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    Please choose a speaker from the list.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId={`form-add-team-${this.props.div}-speaker-2`}>
                                <Form.Label>Speaker 2</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="speaker2"
                                    required
                                    value={this.state.addTeamForm.speaker2}
                                    onChange={this.handleAddTeamFormChange}>
                                        <option value="" disabled hidden>-- pick a speaker --</option>
                                        <SpeakerDropDown speakers={this.props.speakers} />
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    Please choose a speaker from the list.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId={`form-add-team-${this.props.div}-speaker-3`}>
                                <Form.Label>Speaker 3</Form.Label>
                                <TwoPersonTeamTooltip />
                                <Form.Control
                                    as="select"
                                    name="speaker3"
                                    required
                                    value={this.state.addTeamForm.speaker3}
                                    onChange={this.handleAddTeamFormChange}>
                                        <option value="" disabled hidden>-- pick a speaker --</option>
                                        <option value={-1}>[averaged third speaker]</option>
                                        <SpeakerDropDown speakers={this.props.speakers} />
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    Please choose a speaker from the list, or select [averaged third speaker] for a two-person team.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <p className={`red ${this.state.showWarning ? "" : "hidden"}`}>
                                You can't add a speaker to a team more than once.
                            </p>
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