import React from 'react';
import './Speakers.scss';

import SpeakerRow from './SpeakerRow';
import Debater from '../structures/debater';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';


class Speakers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            addSpeakerForm: {
                name: "",
                school: ""
            }
        }

        this.handleAddSpeakerFormChange = this.handleAddSpeakerFormChange.bind(this);
        this.handleAddSpeakerFormSubmit = this.handleAddSpeakerFormSubmit.bind(this);
        this.updateSpeaker = this.updateSpeaker.bind(this);
        this.deleteSpeaker = this.deleteSpeaker.bind(this);
    }


    handleAddSpeakerFormChange(event) {
        const value = event.target.value;
        const name = event.target.name;
        let speakerAddFormState = {...this.state.addSpeakerForm};
        speakerAddFormState[name] = value;
        this.setState({addSpeakerForm: speakerAddFormState});
    }

    handleAddSpeakerFormSubmit(event) {
        event.preventDefault();

        let speakers = this.props.speakers;
        let counter = localStorage.getItem("speakers_counter");

        const newSpeaker = new Debater(counter++, this.state.addSpeakerForm.name, this.state.addSpeakerForm.school);
        speakers.push(newSpeaker);

        localStorage.setItem("speakers_counter", counter);
        this.props.updateSpeakers(speakers);

        let blankForm = {...this.state.addSpeakerForm};
        blankForm.name = "";
        this.setState({addSpeakerForm: blankForm});
    }

    updateSpeaker(speaker) {
        let speakers = this.props.speakers;
        const index = speakers.indexOf(speaker);
        speakers[index] = speaker;
        this.props.updateSpeakers(speakers);
    }

    deleteSpeaker(speaker) {
        for(const team of this.props.teams) {
            if(team.round1.includes(speaker.debaterID.toString()) || team.round2.includes(speaker.debaterID.toString()) || team.round3.includes(speaker.debaterID.toString())) {
                window.alert(`This speaker is still part of team ${team.teamName}. You need to remove them from the team before you can delete them.`);
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
                                        <Tooltip>Disqualified speakers can still be added to teams and receive scores, but won't be listed in the ranking</Tooltip>
                                    }>
                                    <abbr title="">Disq</abbr>
                                </OverlayTrigger>
                            </th>
                            <th className="table-delete">
                                <div className="icon icon-trash-filled"></div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.speakers.map(speaker => {
                            return (
                                <SpeakerRow 
                                    key={`speaker-row-${speaker.debaterID}`}
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
                <Row>
                    <Col>
                    <h2>Speakers</h2>
                    
                        <Form onSubmit={this.handleAddSpeakerFormSubmit}>
                            <Form.Row>
                                <Col>
                                    <Form.Control
                                        name="name"
                                        type="text"
                                        placeholder="Name"
                                        value={this.state.addSpeakerForm.name}
                                        onChange={this.handleAddSpeakerFormChange} />
                                </Col>
                                <Col>
                                    <Form.Control
                                        name="school"
                                        type="text"
                                        placeholder="School"
                                        value={this.state.addSpeakerForm.school}
                                        onChange={this.handleAddSpeakerFormChange} />
                                </Col>
                                <Col>
                                    <Button variant="primary" type="submit">Add speaker</Button>
                                </Col>
                            </Form.Row>
                        </Form>
                    </Col>
                </Row>

                <Row>
                    <Col md={8} className="table-col">
                        {table}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Speakers;