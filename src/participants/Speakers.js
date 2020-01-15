import React from 'react';
import './Speakers.scss';

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
        let counter = this.props.bracket === "middle" ? localStorage.getItem("speakers_middle_counter") : localStorage.getItem("speakers_high_counter");

        const newSpeaker = new Debater(counter++, this.state.speakerForm.name, this.state.speakerForm.school);
        speakers.push(newSpeaker);

        if(this.props.bracket === "middle") {
            localStorage.setItem("speakers_middle", JSON.stringify(speakers));
            localStorage.setItem("speakers_middle_counter", counter);
        } else {
            localStorage.setItem("speakers_high", JSON.stringify(speakers));
            localStorage.setItem("speakers_high_counter", counter);
        }

        this.props.updateSpeakers(speakers);
    }

    handleSpeakerDelete(speaker) {
        const conf = window.confirm(`Are you sure you want to delete speaker ${speaker.name}?`);

        if(conf) {
            let speakers = this.props.speakers;

            const index = speakers.indexOf(speaker);
            speakers.splice(index, 1);

            if(this.props.bracket === "middle") {
                localStorage.setItem("speakers_middle", JSON.stringify(speakers));
            } else {
                localStorage.setItem("speakers_high", JSON.stringify(speakers));
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
                            <th className="table-delete"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.speakers.map(speaker => {
                            return (
                                <tr key={`speaker-row-${speaker.debaterID}`}>
                                    <td>{speaker.name}</td>
                                    <td>{speaker.school}</td>
                                    <td className="table-delete">
                                        <div onClick={() => this.handleSpeakerDelete(speaker)} className="icon icon-trash"></div>
                                    </td>
                                </tr>
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
                    <Col md={8} className="table-col">
                        {table}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Speakers;