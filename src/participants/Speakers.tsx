import React, { ChangeEvent, FormEvent } from 'react';
import './Speakers.scss';
import SpeakerRow from './SpeakerRow';
import { Speaker } from '../types/Speaker';
import { Team } from '../types/Team';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { TrashFill } from 'react-bootstrap-icons';


type SpeakersProps = {
    speakers: Speaker[],
    teams: Team[],
    updateSpeakers: (speakers: Speaker[]) => void
}

type SpeakersState = {
    addSpeakerForm: {
        speakerName: string,
        school: string,
        [key: string]: string
    }
}

class Speakers extends React.Component<SpeakersProps, SpeakersState> {
    constructor(props: SpeakersProps) {
        super(props);

        this.state = {
            addSpeakerForm: {
                speakerName: "",
                school: ""
            }
        }

        this.handleAddSpeakerFormChange = this.handleAddSpeakerFormChange.bind(this);
        this.handleAddSpeakerFormSubmit = this.handleAddSpeakerFormSubmit.bind(this);
        this.updateSpeaker = this.updateSpeaker.bind(this);
        this.deleteSpeaker = this.deleteSpeaker.bind(this);
    }


    handleAddSpeakerFormChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        let addSpeakerFormState = {...this.state.addSpeakerForm};
        addSpeakerFormState[name] = value;
        this.setState({addSpeakerForm: addSpeakerFormState});
    }

    handleAddSpeakerFormSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        let speakers = this.props.speakers;
        let counter = JSON.parse(localStorage.getItem("speakerCounter")!);

        const newSpeaker: Speaker = {
            speakerID: counter++,
            name: this.state.addSpeakerForm.speakerName,
            school: this.state.addSpeakerForm.school,
            scores: [0, 0, 0],
            ranks: [0, 0, 0],
            wins: 0,
            disqualified: false
        };
        speakers.push(newSpeaker);

        localStorage.setItem("speakerCounter", JSON.stringify(counter));
        this.props.updateSpeakers(speakers);

        let blankForm = {...this.state.addSpeakerForm};
        blankForm.speakerName = "";
        this.setState({addSpeakerForm: blankForm});
    }

    updateSpeaker(speaker: Speaker) {
        let speakers = this.props.speakers;
        const index = speakers.indexOf(speaker);
        speakers[index] = speaker;
        this.props.updateSpeakers(speakers);
    }

    deleteSpeaker(speaker: Speaker) {
        for(const team of this.props.teams) {
            if(team.round1.includes(speaker.speakerID) || team.round2.includes(speaker.speakerID) || team.round3.includes(speaker.speakerID)) {
                window.alert(`This speaker is still part of team ${team.name}. You need to remove them from the team before you can delete them.`);
                return;
            }
        }

        const conf = window.confirm(`Are you sure you want to delete speaker ${speaker.name}?`);
        if(conf) {
            let speakers = this.props.speakers;
            const index = speakers.indexOf(speaker);
            speakers.splice(index, 1);
            this.props.updateSpeakers(speakers);
        }
    }


    render() {
        let table;
        if(this.props.speakers.length === 0) {
            table = <p className="none-yet">No speakers yet!</p>;
        } else {
            table = (
                <Table className="speaker-table" hover bordered>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>School</th>
                            <th>
                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip id="tooltip-disqualify-info">
                                            Disqualified speakers can still be added to teams and receive scores, but won't be listed in the ranking
                                        </Tooltip>
                                    }>
                                    <abbr title="">Disq</abbr>
                                </OverlayTrigger>
                            </th>
                            <th className="table-delete">
                                <TrashFill className="icon" />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.speakers.map(speaker => {
                            return (
                                <SpeakerRow 
                                    key={`speaker-row-${speaker.speakerID}`}
                                    speaker={speaker}
                                    updateSpeaker={this.updateSpeaker}
                                    deleteSpeaker={this.deleteSpeaker} />
                            );
                        })}
                    </tbody>
                </Table>
            );
            
            
        }

        return (
            <div>
                <h2>Speakers</h2>
                <Row>
                    <Col>
                    
                        <Form onSubmit={this.handleAddSpeakerFormSubmit}>
                            <Form.Row>
                                <Col md={4}>
                                    <Form.Control
                                        name="name"
                                        type="text"
                                        placeholder="Name"
                                        value={this.state.addSpeakerForm.speakerName}
                                        onChange={this.handleAddSpeakerFormChange} />
                                </Col>
                                <Col md={4}>
                                    <Form.Control
                                        name="school"
                                        type="text"
                                        placeholder="School"
                                        value={this.state.addSpeakerForm.school}
                                        onChange={this.handleAddSpeakerFormChange} />
                                </Col>
                                <Col>
                                    <Button
                                        variant="primary"
                                        className="btn-submit"
                                        type="submit">
                                        Add speaker
                                    </Button>
                                </Col>
                            </Form.Row>
                        </Form>
                    </Col>
                </Row>

                <Row>
                    <Col lg={10} xl={8} className="table-col">
                        {table}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Speakers;