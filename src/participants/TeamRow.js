import React from 'react';
import TeamCell from './TeamCell';
import TeamSpeakerSelect from './TeamSpeakerSelect';
import TeamWinSelector from './TeamWinSelector';

import TrashIcon from '../images/icon-trash.svg';
import TrashIconFilled from '../images/icon-trash-fill.svg';
import PeopleIcon from '../images/icon-people.svg';
import PeopleIconFilled from '../images/icon-people-filled.svg';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


class TeamRow extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            speakers: this.getDistinctSpeakers(),
            updateTeamForm: [
                [this.props.team.round1[0], this.props.team.round2[0], this.props.team.round3[0]],
                [this.props.team.round1[1], this.props.team.round2[1], this.props.team.round3[1]],
                [this.props.team.round1[2], this.props.team.round2[2], this.props.team.round3[2]]
            ],
            showModal: false,
            trash: TrashIcon,
            people: PeopleIcon
        }

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


    getDistinctSpeakers() {
        let sp = []
        for(let s = 0; s < 3; s++) {
            sp.push(this.props.team.round1[s]);
            sp.push(this.props.team.round2[s]);
            sp.push(this.props.team.round3[s]);
        }
        return [...new Set(sp)];
    }
    
    modalShow() {
        this.setState({showModal: true});
    }

    modalHide() {
        this.setState({showModal: false});
    }
    
    setScore(speaker, no, value) {
        let speakers = this.props.speakers;
        speakers
            .find(el => el.debaterID.toString() === speaker.debaterID.toString())
            .scores[no] = parseInt(value);

        this.props.updateSpeakers(speakers);
    }

    setRank(speaker, no, value) {
        let speakers = this.props.speakers;
        speakers
            .find(el => el.debaterID.toString() === speaker.debaterID.toString())
            .ranks[no] = parseInt(value);
        
        this.props.updateSpeakers(speakers);
    }

    handleUpdateTeamFormChange(value, speaker, round) {
        let updateTeamFormState = this.state.updateTeamForm;
        updateTeamFormState[speaker][round - 1] = value;
        this.setState({updateTeamForm: updateTeamFormState});
    }

    handleTeamUpdate(event) {
        event.preventDefault();

        let team = this.props.team;
        team.round1 = [this.state.updateTeamForm[0][0], this.state.updateTeamForm[1][0], this.state.updateTeamForm[2][0]];
        team.round2 = [this.state.updateTeamForm[0][1], this.state.updateTeamForm[1][1], this.state.updateTeamForm[2][1]];
        team.round3 = [this.state.updateTeamForm[0][2], this.state.updateTeamForm[1][2], this.state.updateTeamForm[2][2]];

        this.props.updateTeam(team);
        this.setState({speakers: this.getDistinctSpeakers()});
        this.modalHide();
    }

    trashOnMouseEnter() {
        this.setState({trash: TrashIconFilled});
    }

    trashOnMouseLeave() {
        this.setState({trash: TrashIcon});
    }

    peopleOnMouseEnter() {
        this.setState({people: PeopleIconFilled});
    }

    peopleOnMouseLeave() {
        this.setState({people: PeopleIcon});
    }


    render() {
        const team = this.props.team;
        const speakers = this.state.speakers.map(sp => {
            if(sp === "avg") {
                return "avg";
            } else {
                return this.props.speakers.find(el => {
                    return el.debaterID.toString() === sp;
                });
            }
        });

        // Calculate averages
        if(speakers.includes("avg")) {
            const index = speakers.indexOf("avg");
            
            speakers[index] = {
                debaterID: "avg",
                name: "[averaged third speaker]",
                scores: [
                    (speakers[0].scores[0] + speakers[1].scores[0]) / 2,
                    (speakers[0].scores[1] + speakers[1].scores[1]) / 2,
                    (speakers[0].scores[2] + speakers[1].scores[2]) / 2
                ],
                ranks: [
                    (speakers[0].ranks[0] + speakers[1].ranks[0]) / 2,
                    (speakers[0].ranks[1] + speakers[1].ranks[1]) / 2,
                    (speakers[0].ranks[2] + speakers[1].ranks[2]) / 2
                ]
            }
        }

        // Generate the table rows
        const speakerRows = speakers.map(speaker => {
            if(speaker.debaterID === "avg") {
                return <tr key={`${team.teamID}-average-third`}></tr>;
            }

            const isInR1 = this.props.team.round1.includes(speaker.debaterID.toString());
            const isInR2 = this.props.team.round2.includes(speaker.debaterID.toString());
            const isInR3 = this.props.team.round3.includes(speaker.debaterID.toString());

            let totalScores = 0;
            if (isInR1) totalScores += speaker.scores[0];
            if (isInR2) totalScores += speaker.scores[1];
            if (isInR3) totalScores += speaker.scores[2];

            let totalRanks = 0;
            if (isInR1) totalRanks += speaker.ranks[0];
            if (isInR2) totalRanks += speaker.ranks[1];
            if (isInR3) totalRanks += speaker.ranks[2];

            return (
                <tr key={`${speaker.name}_row`}>
                    <td>{speaker.name}</td>
                    <td className={isInR1 ? "editable" : "disabled"}>
                        <TeamCell type="score" speaker={speaker} no={0} fn={this.setScore} />
                    </td>
                    <td className={isInR1 ? "editable" : "disabled"}>
                        <TeamCell type="rank" speaker={speaker} no={0} fn={this.setRank} />
                    </td>
                    <td className={isInR2 ? "editable" : "disabled"}>
                        <TeamCell type="score" speaker={speaker} no={1} fn={this.setScore} />
                    </td>
                    <td className={isInR2 ? "editable" : "disabled"}>
                        <TeamCell type="rank" speaker={speaker} no={1} fn={this.setRank} />
                    </td>
                    <td className={isInR3 ? "editable" : "disabled"}>
                        <TeamCell type="score" speaker={speaker} no={2} fn={this.setScore} />
                    </td>
                    <td className={isInR3 ? "editable" : "disabled"}>
                        <TeamCell type="rank" speaker={speaker} no={2} fn={this.setRank} />
                    </td>
                    <td>{totalScores}</td>
                    <td>{totalRanks}</td>
                </tr>
            );
        });

        // Calculate total scores
        let scores1 = 0;
        speakers.forEach(speaker => {
            if(this.props.team.round1.includes(speaker.debaterID.toString())) {
                scores1 += speaker.scores[0]
            }
        });
        let scores2 = 0;
        speakers.forEach(speaker => {
            if(this.props.team.round2.includes(speaker.debaterID.toString())) {
                scores2 += speaker.scores[1]
            }
        });
        let scores3 = 0;
        speakers.forEach(speaker => {
            if(this.props.team.round3.includes(speaker.debaterID.toString())) {
                scores3 += speaker.scores[2]
            }
        });

        // Calculate total ranks
        let ranks1 = 0;
        speakers.forEach(speaker => {
            if(this.props.team.round1.includes(speaker.debaterID.toString())) {
                ranks1 += speaker.ranks[0]
            }
        });
        let ranks2 = 0;
        speakers.forEach(speaker => {
            if(this.props.team.round2.includes(speaker.debaterID.toString())) {
                ranks2 += speaker.ranks[1]
            }
        });
        let ranks3 = 0;
        speakers.forEach(speaker => {
            if(this.props.team.round3.includes(speaker.debaterID.toString())) {
                ranks3 += speaker.ranks[2]
            }
        });


        // Update team scores
        team.totalPoints = scores1 + scores2 + scores3;
        let teams = this.props.teams;
        const index = teams.indexOf(el => {
            return el.teamID === team.teamID;
        });
        teams[index] = team;
        if(this.props.div === "one") {
            localStorage.setItem("teams_one", JSON.stringify(teams));
        } else {
            localStorage.setItem("teams_two", JSON.stringify(teams));
        }

        // Update the people selection picker
        const teamSpeakerSelects = [0, 1, 2].map(sp => {
            return (
                <div key={`teamSpeakerSelectRow-team-${team.teamID}-speaker-${sp}`} className="form-update-team-speaker">
                    <p>Speaker {sp + 1}</p>
                    <Form.Row>
                        {
                            [1, 2, 3].map(round => {
                                return (
                                    <TeamSpeakerSelect
                                        key={`teamSpeakerSelect-team-${team.teamID}-speaker-${sp}-round-${round}`}
                                        team={team}
                                        speaker={sp}
                                        round={round}
                                        value={this.state.updateTeamForm}
                                        handleUpdateTeamFormChange={this.handleUpdateTeamFormChange}
                                        speakerPicker={this.props.speakerPicker} />
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
                    <th rowSpan={this.state.speakers.length + 3} className="cell-teamname">
                        {team.teamName}
                        <br />
                        <img
                            src={this.state.people}
                            alt="Icon of multiple people"
                            role="button"
                            className="icon"
                            onMouseEnter={this.peopleOnMouseEnter}
                            onMouseLeave={this.peopleOnMouseLeave}
                            onClick={this.modalShow} />
                        <img
                            src={this.state.trash}
                            alt="Icon of trash can"
                            role="button"
                            className="icon"
                            onMouseEnter={this.trashOnMouseEnter}
                            onMouseLeave={this.trashOnMouseLeave}
                            onClick={() => this.props.deleteTeam(team)} />
                    </th>
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
                    <td colSpan="2">
                        <TeamWinSelector team={this.props.team} round="1" updateTeam={this.props.updateTeam} />
                    </td>
                    <td colSpan="2">
                        <TeamWinSelector team={this.props.team} round="2" updateTeam={this.props.updateTeam} />
                    </td>
                    <td colSpan="2">
                        <TeamWinSelector team={this.props.team} round="3" updateTeam={this.props.updateTeam} />
                    </td>
                    <td colSpan="2" className="cell-totalwins">
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