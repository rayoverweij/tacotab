import React from 'react';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Collapse from 'react-bootstrap/Collapse';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';


class SetupModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            setupForm: {
                tournament_name: "",
                divisions: "1",
                division_one: "",
                division_two: ""
            }
        }

        this.handleSetupFormChange = this.handleSetupFormChange.bind(this);
        this.handleSetupFormSubmit = this.handleSetupFormSubmit.bind(this);
    }


    handleSetupFormChange(event) {
        const value = event.target.value;
        const name = event.target.name;
        let handleSetupFormState = {...this.state.setupForm};
        handleSetupFormState[name] = value;
        this.setState({setupForm: handleSetupFormState});
    }

    handleSetupFormSubmit(event) {
        event.preventDefault();
        
        const name = this.state.setupForm.tournament_name;
        if(name === "") return false;

        const divisions = this.state.setupForm.divisions;
        const divisionNames = [this.state.setupForm.division_one, this.state.setupForm.division_two];
        if(divisions === "2" && (divisionNames[0] === "" || divisionNames[1] === "")) {
            return false;
        }

        this.props.initializeTournament(name, divisions, divisionNames);
    }


    render() {
        return (
            <Modal show={!this.props.init} size="lg">
                <Modal.Header>
                    <Modal.Title>Welcome to TacoTab!</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p><strong>This is prerelease software, still under active development. Use at your own risk.</strong> For more information, see the <a href="https://github.com/rayoverweij/tacotab" rel="noopener noreferrer" target="_blank">GitHub repository</a>.</p>
                    <h3>Create a new tournament</h3>
                    <Form onSubmit={this.handleSetupFormSubmit}>
                        <Form.Group controlId="setupFormTournamentName">
                            <Form.Label>Tournament name</Form.Label>
                            <Form.Control
                                name="tournament_name"
                                type="text"
                                placeholder="e.g. 'Bard MS-HS 2020'"
                                value={this.state.setupForm.name}
                                onChange={this.handleSetupFormChange} />
                        </Form.Group>

                        <Form.Group controlId="setupFormNumDivisions">
                            <Form.Label>Number of speaker divisions:&nbsp;&nbsp;</Form.Label>
                            <Form.Check inline custom
                                name="divisions"
                                label="1"
                                value="1"
                                type="radio"
                                id="setup-form-divisions-1"
                                checked={this.state.setupForm.divisions === "1"}
                                onChange={this.handleSetupFormChange} />
                            <Form.Check inline custom
                                name="divisions"
                                label="2"
                                value="2"
                                type="radio"
                                id="setup-form-divisions-2"
                                checked={this.state.setupForm.divisions === "2"}
                                onChange={this.handleSetupFormChange} />
                        </Form.Group>

                        <Collapse in={this.state.setupForm.divisions === "2"}>
                            <Form.Group controlId="setupFormDivisionNames">
                                <Form.Label>Speaker division names</Form.Label>
                                <Form.Row>
                                    <Col md={6}>
                                        <Form.Control
                                            name="division_one"
                                            type="text"
                                            placeholder="e.g. 'Novice' or 'Middle School'"
                                            value={this.state.setupForm.division_one}
                                            onChange={this.handleSetupFormChange} />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Control
                                            name="division_two"
                                            type="text"
                                            placeholder="e.g. 'Open' or 'High School'"
                                            value={this.state.setupForm.division_two}
                                            onChange={this.handleSetupFormChange} />
                                    </Col>
                                </Form.Row>
                            </Form.Group>
                        </Collapse>

                        <Button variant="primary" type="Submit">Create the tournament</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }
}

export default SetupModal;