import React from 'react';
import './Speakers.scss';

import SpeakerRow from './SpeakerRow';
import Debater from '../structures/debater';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';


class Speakers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            speakerForm: {
                name: "",
                school: ""
            }
        }

        this.handleSpeakerFormChange = this.handleSpeakerFormChange.bind(this);
        this.handleSpeakerFormSubmit = this.handleSpeakerFormSubmit.bind(this);
        this.handleSpeakerUpdate = this.handleSpeakerUpdate.bind(this);
        this.handleSpeakerDelete = this.handleSpeakerDelete.bind(this);
    }


    handleSpeakerFormChange(event) {
        const value = event.target.value;
        const name = event.target.name;
        let speakerFormState = {...this.state.speakerForm};
        speakerFormState[name] = value;
        this.setState({speakerForm: speakerFormState});
    }

    handleSpeakerFormSubmit(event) {
        event.preventDefault();

        let speakers = this.props.speakers;
        let counter = localStorage.getItem("speakers_counter");

        const newSpeaker = new Debater(counter++, this.state.speakerForm.name, this.state.speakerForm.school);
        speakers.push(newSpeaker);

        if(this.props.div === "one") {
            localStorage.setItem("speakers_one", JSON.stringify(speakers));
        } else {
            localStorage.setItem("speakers_two", JSON.stringify(speakers));
        }
        localStorage.setItem("speakers_counter", counter);

        this.props.updateSpeakers(speakers);

        let blankForm = {...this.state.speakerForm};
        blankForm.name = "";
        this.setState({speakerForm: blankForm});
    }

    handleSpeakerUpdate(speaker) {
        let speakers = this.props.speakers;
        const index = speakers.indexOf(speaker);
        speakers[index] = speaker;

        if(this.props.div === "one") {
            localStorage.setItem("speakers_one", JSON.stringify(speakers));
        } else {
            localStorage.setItem("speakers_two", JSON.stringify(speakers));
        }

        this.props.updateSpeakers(speakers);
    }

    handleSpeakerDelete(speaker) {
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

            if(this.props.div === "one") {
                localStorage.setItem("speakers_one", JSON.stringify(speakers));
            } else {
                localStorage.setItem("speakers_two", JSON.stringify(speakers));
            }

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
                                <abbr title="Disqualified speakers can still be added to teams and receive scores, but won't be listed in the ranking">
                                    Disq
                                </abbr>
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
                                    handleSpeakerUpdate={this.handleSpeakerUpdate}
                                    handleSpeakerDelete={this.handleSpeakerDelete} />
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
                    
                        <Form onSubmit={this.handleSpeakerFormSubmit}>
                            <Form.Row>
                                <Col>
                                    <Form.Control
                                        name="name"
                                        type="text"
                                        placeholder="Name"
                                        value={this.state.speakerForm.name}
                                        onChange={this.handleSpeakerFormChange} />
                                </Col>
                                <Col>
                                    <Form.Control
                                        name="school"
                                        type="text"
                                        placeholder="School"
                                        value={this.state.speakerForm.school}
                                        onChange={this.handleSpeakerFormChange} />
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