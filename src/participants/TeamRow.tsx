import React, { FormEvent } from 'react';
import TeamSpeakerSelect from './TeamSpeakerSelect';
import TeamWinSelector from './TeamWinSelector';
import TwoPersonTeamTooltip from './TwoPersonTeamTooltip';
import { SpeakerDropDown } from './SpeakerDropDown';
import { EditText } from '../utils/EditText';
import { getDistinctSpeakers } from '../utils/getDistinctSpeakers';
import { Speaker } from '../types/Speaker';
import { Team } from '../types/Team';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { People, Trash } from 'react-bootstrap-icons';


type TeamRowProps = {
    team: Team,
    div: number,
    speakers: Speaker[],
    teams: Team[],
    updateSpeakers: (speakers: Speaker[]) => void,
    updateTeam: (team: Team) => void,
    deleteTeam: (team: Team) => void
}

type TeamRowState = {
    speakers: number[],
    updateTeamForm: Array<number[]>,
    showModal: boolean,
    showWarning: boolean
}

class TeamRow extends React.PureComponent<TeamRowProps, TeamRowState> {
    constructor(props: TeamRowProps) {
        super(props);
        
        this.state = {
            speakers: getDistinctSpeakers(this.props.team),
            updateTeamForm: [
                [this.props.team.round1[0], this.props.team.round2[0], this.props.team.round3[0]],
                [this.props.team.round1[1], this.props.team.round2[1], this.props.team.round3[1]],
                [this.props.team.round1[2], this.props.team.round2[2], this.props.team.round3[2]]
            ],
            showModal: false,
            showWarning: false
        }

        this.handleTeamUpdate = this.handleTeamUpdate.bind(this);
        this.modalShow = this.modalShow.bind(this);
        this.modalHide = this.modalHide.bind(this);
        this.handleUpdateTeamFormChange = this.handleUpdateTeamFormChange.bind(this);
        this.handleTeamMembersUpdate = this.handleTeamMembersUpdate.bind(this);
    }


    handleTeamUpdate(name: string, value: string, baggage?: [Speaker, number]) {
        if(name === "score" || "rank") {
            if(!value || isNaN(Number(value))) {
                value = "0";
            }
            let numValue = Number(value);

            let speakers = [...this.props.speakers];

            if(name === "score") {
                speakers
                    .find(el => el.speakerID === baggage![0].speakerID)!
                    .scores[baggage![1]] = numValue;
            } else if(name === "rank") {
                speakers
                    .find(el => el.speakerID === baggage![0].speakerID)!
                    .ranks[baggage![1]] = numValue;
            }

            this.props.updateSpeakers(speakers);
        } else {
            const team = {...this.props.team, [name]: value};
            this.props.updateTeam(team);
        }
    }
    
    modalShow() {
        this.setState({showModal: true});
    }

    modalHide() {
        this.setState({showModal: false});
    }

    handleUpdateTeamFormChange(value: number, speakerPos: number, round: number) {
        let updateTeamFormState = this.state.updateTeamForm;
        updateTeamFormState[speakerPos][round - 1] = value;
        this.setState({updateTeamForm: updateTeamFormState});
    }

    handleTeamMembersUpdate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const newTeam = [...this.state.updateTeamForm];
        if((newTeam[0][0] === newTeam[1][0] || newTeam[0][0] === newTeam[2][0] || newTeam[1][0] === newTeam[2][0])
            || (newTeam[0][1] === newTeam[1][1] || newTeam[0][1] === newTeam[2][1] || newTeam[1][1] === newTeam[2][1])
            || (newTeam[0][2] === newTeam[1][2] || newTeam[0][2] === newTeam[2][2] || newTeam[1][2] === newTeam[2][2])) {
                this.setState({showWarning: true});
                return false;
            }

        let team = {...this.props.team};
        team.round1 = [newTeam[0][0], newTeam[1][0], newTeam[2][0]];
        team.round2 = [newTeam[0][1], newTeam[1][1], newTeam[2][1]];
        team.round3 = [newTeam[0][2], newTeam[1][2], newTeam[2][2]];

        this.props.updateTeam(team);
        this.setState({speakers: getDistinctSpeakers(this.props.team)});
        this.setState({showWarning: false});
        this.modalHide();
    }


    render() {
        const team = this.props.team;
        const speakers = this.state.speakers.map(sp => {
            if(sp === -1) {
                return null;
            } else {
                return this.props.speakers.find(el => el.speakerID === sp)!;
            }
        });
        
        // Calculate average scores
        if(speakers.includes(null)) {
            const index = speakers.indexOf(null);

            speakers[index] = {
                speakerID: -1,
                name: "[averaged third speaker]",
                school: "",
                scores: [
                    (speakers[0]!.scores[0] + speakers[1]!.scores[0]) / 2,
                    (speakers[0]!.scores[1] + speakers[1]!.scores[1]) / 2,
                    (speakers[0]!.scores[2] + speakers[1]!.scores[2]) / 2
                ],
                ranks: [
                    (speakers[0]!.ranks[0] + speakers[1]!.ranks[0]) / 2,
                    (speakers[0]!.ranks[1] + speakers[1]!.ranks[1]) / 2,
                    (speakers[0]!.ranks[2] + speakers[1]!.ranks[2]) / 2
                ],
                wins: 0,
                disqualified: true
            }
        }

        // Generate the table rows
        const speakerRows = speakers.map(speaker => {
            speaker = speaker!

            if(speaker.speakerID === -1) {
                return <tr key={`${team.teamID}-average-third`}></tr>;
            }

            const isInR1 = this.props.team.round1.includes(speaker.speakerID);
            const isInR2 = this.props.team.round2.includes(speaker.speakerID);
            const isInR3 = this.props.team.round3.includes(speaker.speakerID);

            let totalScores = 0;
            if (isInR1) totalScores += speaker.scores[0];
            if (isInR2) totalScores += speaker.scores[1];
            if (isInR3) totalScores += speaker.scores[2];

            let totalRanks = 0;
            if (isInR1) totalRanks += speaker.ranks[0];
            if (isInR2) totalRanks += speaker.ranks[1];
            if (isInR3) totalRanks += speaker.ranks[2];

            return (
                <tr key={`${speaker.name}-${this.props.div}-row`}>
                    <td>{speaker.name}</td>
                    {
                        [isInR1, isInR2, isInR3].map((isInR, r) => {
                            return (
                                <React.Fragment key={`cells-score-n-rank-${speaker!.speakerID}-${r}`}>
                                    <td className={isInR ? "editable" : "disabled"}>
                                        <EditText
                                            name="score"
                                            init={speaker!.scores[r].toString()}
                                            cols={2}
                                            maxLength={2}
                                            placeholder="#"
                                            fn={this.handleTeamUpdate}
                                            baggage={[speaker!, r]} />
                                    </td>
                                    <td className={isInR ? "editable" : "disabled"}>
                                        <EditText
                                            name="rank" 
                                            init={speaker!.ranks[r].toString()}
                                            cols={1}
                                            maxLength={1}
                                            placeholder="#"
                                            fn={this.handleTeamUpdate}
                                            baggage={[speaker!, r]} />
                                    </td>
                                </React.Fragment>
                            );
                        })
                    }
                    <td>{totalScores}</td>
                    <td>{totalRanks}</td>
                </tr>
            );
        });

        // Calculate total scores
        let scores1 = 0;
        speakers.forEach(speaker => {
            if(this.props.team.round1.includes(speaker!.speakerID)) {
                scores1 += speaker!.scores[0]
            }
        });
        let scores2 = 0;
        speakers.forEach(speaker => {
            if(this.props.team.round2.includes(speaker!.speakerID)) {
                scores2 += speaker!.scores[1]
            }
        });
        let scores3 = 0;
        speakers.forEach(speaker => {
            if(this.props.team.round3.includes(speaker!.speakerID)) {
                scores3 += speaker!.scores[2]
            }
        });

        // Calculate total ranks
        let ranks1 = 0;
        speakers.forEach(speaker => {
            if(this.props.team.round1.includes(speaker!.speakerID)) {
                ranks1 += speaker!.ranks[0]
            }
        });
        let ranks2 = 0;
        speakers.forEach(speaker => {
            if(this.props.team.round2.includes(speaker!.speakerID)) {
                ranks2 += speaker!.ranks[1]
            }
        });
        let ranks3 = 0;
        speakers.forEach(speaker => {
            if(this.props.team.round3.includes(speaker!.speakerID)) {
                ranks3 += speaker!.ranks[2]
            }
        });


        // Update team scores
        team.totalPoints = scores1 + scores2 + scores3;
        let teams = this.props.teams;
        const index = teams.findIndex(el => {
            return el.teamID === team.teamID;
        });
        teams[index] = team;
        if(this.props.div === 1) {
            localStorage.setItem("teamsOne", JSON.stringify(teams));
        } else {
            localStorage.setItem("teamsTwo", JSON.stringify(teams));
        }

        // Update the people selection picker
        const teamSpeakerSelects = [0, 1, 2].map(speakerPos => {
            return (
                <div key={`teamSpeakerSelectRow-team-${team.teamID}-speaker-${speakerPos}`} className="form-update-team-speaker">
                    <p>Speaker {speakerPos + 1}</p>
                    {speakerPos === 2 ? <TwoPersonTeamTooltip /> : ""}
                    <Form.Row>
                        {
                            [1, 2, 3].map(round => {
                                return (
                                    <TeamSpeakerSelect
                                        key={`teamSpeakerSelect-team-${team.teamID}-speaker-${round}-round-${round}`}
                                        team={team}
                                        speakerPos={speakerPos}
                                        round={round}
                                        value={this.state.updateTeamForm}
                                        handleUpdateTeamFormChange={this.handleUpdateTeamFormChange}>
                                            <SpeakerDropDown speakers={this.props.speakers} />
                                    </TeamSpeakerSelect>
                                );
                            })
                        }
                    </Form.Row>
                </div>
            );
        });


        return (
            <tbody>
                <tr>
                    <td rowSpan={this.state.speakers.length + 3} className="cell-teamname">
                        <EditText
                            name="name"
                            init={team.name}
                            fn={this.handleTeamUpdate} />
                        <br />
                        <button
                            className="icon-wrapper btn-none"
                            title={`Change team members of ${team.name}`}
                            onClick={this.modalShow}>
                            <People className="icon people" />
                        </button>
                        <button
                            className="icon-wrapper btn-none"
                            title={`Remove ${team.name}`}
                            onClick={() => this.props.deleteTeam(team)}>
                            <Trash className="icon trash" />
                        </button>
                    </td>
                </tr>
                {speakerRows}
                <tr className="row-total">
                    <td>Team total</td>
                    <td>{scores1}</td>
                    <td>{ranks1}</td>
                    <td>{scores2}</td>
                    <td>{ranks2}</td>
                    <td>{scores3}</td>
                    <td>{ranks3}</td>
                    <td>{scores1 + scores2 + scores3}</td>
                    <td>{ranks1 + ranks2 + ranks3}</td>
                </tr>
                <tr className="row-wins">
                    <td>Team wins</td>
                    <td colSpan={2}>
                        <TeamWinSelector team={this.props.team} round={1} updateTeam={this.props.updateTeam} />
                    </td>
                    <td colSpan={2}>
                        <TeamWinSelector team={this.props.team} round={2} updateTeam={this.props.updateTeam} />
                    </td>
                    <td colSpan={2}>
                        <TeamWinSelector team={this.props.team} round={3} updateTeam={this.props.updateTeam} />
                    </td>
                    <td colSpan={2} className="cell-totalwins">
                        Total wins: {team.totalWins}
                    </td>
                </tr>

                <Modal show={this.state.showModal} size="lg" onHide={this.modalHide}>
                    <Modal.Header closeButton>
                        <Modal.Title>Specify team members per round</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form onSubmit={this.handleTeamMembersUpdate}>
                            {teamSpeakerSelects}
                            <p className={`red ${this.state.showWarning ? "" : "hidden"}`}>
                                You can't add a speaker to the same round more than once.
                            </p>
                            <Button
                                variant="primary"
                                className="btn-submit"
                                type="submit">
                                Save
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </tbody>
        );
    }
}

export default TeamRow;