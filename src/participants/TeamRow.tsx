import React, { FormEvent, ChangeEvent, FocusEvent } from 'react';
import TeamCell from './TeamCell';
import TeamSpeakerSelect from './TeamSpeakerSelect';
import TeamWinSelector from './TeamWinSelector';
import TwoPersonTeamTooltip from './TwoPersonTeamTooltip';
import { SpeakerDropDown } from './SpeakerDropDown';
import { getDistinctSpeakers } from '../utils/getDistinctSpeakers';
import { Speaker } from '../types/Speaker';
import { Team } from '../types/Team';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Trash, TrashFill, People, PeopleFill } from 'react-bootstrap-icons';


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
    name: string,
    speakers: number[],
    updateTeamForm: Array<number[]>,
    showModal: boolean,
    showWarning: boolean,
    trashFill: boolean,
    peopleFill: boolean
}

class TeamRow extends React.Component<TeamRowProps, TeamRowState> {
    constructor(props: TeamRowProps) {
        super(props);
        
        this.state = {
            name: this.props.team.name,
            speakers: getDistinctSpeakers(this.props.team),
            updateTeamForm: [
                [this.props.team.round1[0], this.props.team.round2[0], this.props.team.round3[0]],
                [this.props.team.round1[1], this.props.team.round2[1], this.props.team.round3[1]],
                [this.props.team.round1[2], this.props.team.round2[2], this.props.team.round3[2]]
            ],
            showModal: false,
            showWarning: false,
            trashFill: false,
            peopleFill: false
        }

        this.handleTeamNameEdit = this.handleTeamNameEdit.bind(this);
        this.handleTeamNameUpdate = this.handleTeamNameUpdate.bind(this);
        this.setScore = this.setScore.bind(this);
        this.setRank = this.setRank.bind(this);
        this.modalShow = this.modalShow.bind(this);
        this.modalHide = this.modalHide.bind(this);
        this.handleUpdateTeamFormChange = this.handleUpdateTeamFormChange.bind(this);
        this.handleTeamUpdate = this.handleTeamUpdate.bind(this);
        this.trashOnMouseEnter = this.trashOnMouseEnter.bind(this);
        this.trashOnMouseLeave = this.trashOnMouseLeave.bind(this);
        this.peopleOnMouseEnter = this.peopleOnMouseEnter.bind(this);
        this.peopleOnMouseLeave = this.peopleOnMouseLeave.bind(this);
    }


    handleTeamNameEdit(event: ChangeEvent<HTMLTextAreaElement>) {
        this.setState({name: event.target.value});
    }
    
    handleTeamNameUpdate(event: FocusEvent<HTMLTextAreaElement>) {
        event.preventDefault();
        const name = this.state.name;
        const team = this.props.team;
        team.name = name;
        this.props.updateTeam(team);
    }
    
    modalShow() {
        this.setState({showModal: true});
    }

    modalHide() {
        this.setState({showModal: false});
    }
    
    setScore(speaker: Speaker, no: number, value: number) {
        let speakers = this.props.speakers;
        speakers
            .find(el => el.speakerID.toString() === speaker.speakerID.toString())!
            .scores[no] = value;

        this.props.updateSpeakers(speakers);
    }

    setRank(speaker: Speaker, no: number, value: number) {
        let speakers = this.props.speakers;
        speakers
            .find(el => el.speakerID.toString() === speaker.speakerID.toString())!
            .ranks[no] = value;
        
        this.props.updateSpeakers(speakers);
    }

    handleUpdateTeamFormChange(value: number, speakerPos: number, round: number) {
        let updateTeamFormState = this.state.updateTeamForm;
        updateTeamFormState[speakerPos][round - 1] = value;
        this.setState({updateTeamForm: updateTeamFormState});
    }

    handleTeamUpdate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const newTeam = [...this.state.updateTeamForm];
        if((newTeam[0][0] === newTeam[1][0] || newTeam[0][0] === newTeam[2][0] || newTeam[1][0] === newTeam[2][0])
            || (newTeam[0][1] === newTeam[1][1] || newTeam[0][1] === newTeam[2][1] || newTeam[1][1] === newTeam[2][1])
            || (newTeam[0][2] === newTeam[1][2] || newTeam[0][2] === newTeam[2][2] || newTeam[1][2] === newTeam[2][2])) {
                this.setState({showWarning: true});
                return false;
            }

        let team = this.props.team;
        team.round1 = [newTeam[0][0], newTeam[1][0], newTeam[2][0]];
        team.round2 = [newTeam[0][1], newTeam[1][1], newTeam[2][1]];
        team.round3 = [newTeam[0][2], newTeam[1][2], newTeam[2][2]];

        this.props.updateTeam(team);
        this.setState({speakers: getDistinctSpeakers(this.props.team)});
        this.setState({showWarning: false});
        this.modalHide();
    }

    trashOnMouseEnter() { this.setState({trashFill: true}); }
    trashOnMouseLeave() { this.setState({trashFill: false}); }
    peopleOnMouseEnter() { this.setState({peopleFill: true}); }
    peopleOnMouseLeave() { this.setState({peopleFill: false}); }


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
                        [isInR1, isInR2, isInR3].map((isInR, i) => {
                            return ["score", "rank"].map(t => {
                                return (
                                    <td className={isInR ? "editable" : "disabled"}>
                                        <TeamCell
                                            key={`teamcell-${speaker!.speakerID}-${i}-${t}`}
                                            type={t}
                                            speaker={speaker!}
                                            round={i}
                                            fn={t === "score" ? this.setScore : this.setRank} />
                                    </td>
                                );
                            })
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
                        <textarea
                            className="cell-valupdate"
                            rows={1}
                            cols={this.state.name.length > 8 ? this.state.name.length : 8}
                            autoComplete="off"
                            spellCheck="false"
                            value={this.state.name}
                            onChange={this.handleTeamNameEdit}
                            onBlur={this.handleTeamNameUpdate} />
                        <br />
                        {this.state.peopleFill ?
                            <PeopleFill
                                role="button"
                                className="icon"
                                onMouseEnter={this.peopleOnMouseEnter}
                                onMouseLeave={this.peopleOnMouseLeave}
                                onClick={this.modalShow} />
                            :
                            <People
                                role="button"
                                className="icon"
                                onMouseEnter={this.peopleOnMouseEnter}
                                onMouseLeave={this.peopleOnMouseLeave}
                                onClick={this.modalShow} />
                        }
                        {this.state.trashFill ? 
                            <TrashFill
                                role="button"
                                className="icon red"
                                onMouseEnter={this.trashOnMouseEnter}
                                onMouseLeave={this.trashOnMouseLeave}
                                onClick={() => this.props.deleteTeam(team)} />
                            :
                            <Trash
                                role="button"
                                className="icon"
                                onMouseEnter={this.trashOnMouseEnter}
                                onMouseLeave={this.trashOnMouseLeave}
                                onClick={() => this.props.deleteTeam(team)} />
                        }
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
                        <Form onSubmit={this.handleTeamUpdate}>
                            {teamSpeakerSelects}
                            <p className={`red ${this.state.showWarning ? "" : "hidden"}`}>
                                You can't add a speaker to the same round more than once!
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