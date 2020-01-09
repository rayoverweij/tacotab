import React from 'react';
import './Speakers.scss';

import localforage from 'localforage';

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
            },
            speakers: []
        }

        this.handleSpeakerFormChange = this.handleSpeakerFormChange.bind(this);
        this.handleSpeakerFormSubmit = this.handleSpeakerFormSubmit.bind(this);
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

        if(this.props.bracket === "middle") {
            localforage.getItem("speakers-middle").then(curr_speakers => {
                localforage.getItem("speakers-middle-id-count").then(curr_id => {
                    const newDebater = new Debater(curr_id++, this.state.speakerForm.name, this.state.speakerForm.school);
                    curr_speakers.push(newDebater);
                    localforage.setItem("speakers-middle", curr_speakers).then(() => {
                        localforage.setItem("speakers-middle-id-count", curr_id).then(() => {
                            this.forceUpdate();
                        });
                    });
                });
            });
        } else if(this.props.bracket === "high") {
            localforage.getItem("speakers-high").then(curr_speakers => {
                localforage.getItem("speakers-high-id-count").then(curr_id => {
                    const newDebater = new Debater(curr_id++, this.state.speakerForm.name, this.state.speakerForm.school);
                    curr_speakers.push(newDebater);
                    localforage.setItem("speakers-high", curr_speakers).then(() => {
                        localforage.setItem("speakers-high-id-count", curr_id).then(() => {
                            this.forceUpdate();
                        });
                    });
                });
            });
        }
    }

    handleSpeakerDelete(speaker) {
        const conf = window.confirm(`Are you sure you want to delete speaker ${speaker.name}?`);

        if(conf) {
            if(this.props.bracket === "middle") {
                localforage.getItem("speakers-middle").then(curr_speakers => {
                    const index = curr_speakers.findIndex(el => el.debaterID === speaker.debaterID);
                    curr_speakers.splice(index, 1);
                    localforage.setItem("speakers-middle", curr_speakers).then(() => {
                        this.forceUpdate();
                    })
                })
            }

        }
    }


    render() {
        if(this.props.bracket === "middle") {
            localforage.getItem("speakers-middle").then(value => {
                this.setState({speakers: value});
            });
        } else if (this.props.bracket === "high") {
            localforage.getItem("speakers-high").then(value => {
                this.setState({speakers: value});
            });
        }

        let tableEntries;
        if(this.state.speakers !== null) {
            tableEntries = this.state.speakers.map(speaker => {
                return (
                    <tr key={`speaker-row-${speaker.debaterID}`}>
                        <td>{speaker.name}</td>
                        <td>{speaker.school}</td>
                        <td>
                            <div onClick={() => this.handleSpeakerDelete(speaker)} className="icon icon-trash"></div>
                        </td>
                    </tr>
                );
            });
        }

        return (
            <div>
                <Row>
                    <Col>
                    <h2>Speakers</h2>
                    
                        <Form onSubmit={this.handleSpeakerFormSubmit}>
                            <Form.Row>
                                <Col>
                                    <Form.Control name="name" type="text" placeholder="Name" onChange={this.handleSpeakerFormChange} />
                                </Col>
                                <Col>
                                    <Form.Control name="school" type="text" placeholder="School" onChange={this.handleSpeakerFormChange} />
                                </Col>
                                <Col>
                                    <Button variant="primary" type="submit">Add speaker</Button>
                                </Col>
                            </Form.Row>
                        </Form>
                    </Col>
                </Row>

                <Row>
                    <Col md={8} className="speaker-table-col">
                        <Table className="speaker-table" hover bordered>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>School</th>
                                    <th className="speaker-table-delete"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableEntries}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Speakers;