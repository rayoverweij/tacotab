import React, { ChangeEvent, FormEvent } from 'react';
import './SetupScreen.scss';
import logo from '../images/logo.svg';
import { importTournament } from '../utils/importTournament';
import Modal from 'react-bootstrap/Modal';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Form from 'react-bootstrap/Form';
import Collapse from 'react-bootstrap/Collapse';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';


type SetupScreenProps = {
    init: boolean,
    initializeTournament: (tournamentName: string, numDivisions: number, divisionNames: string[], scoreReplies: boolean) => void
}

type SetupScreenState = {
    setupForm: {
        tournamentName: string,
        numDivisions: number,
        divisionOneName: string,
        divisionTwoName: string,
        scoreReplies: boolean,
        [key: string]: string|number|boolean
    },
    setupFormValidated: boolean,
    importFormValidated: boolean
}

class SetupScreen extends React.Component<SetupScreenProps, SetupScreenState> {
    constructor(props: SetupScreenProps) {
        super(props);

        this.state = {
            setupForm: {
                tournamentName: "",
                numDivisions: 1,
                divisionOneName: "",
                divisionTwoName: "",
                scoreReplies: false
            },
            setupFormValidated: false,
            importFormValidated: false
        }

        this.handleSetupFormChange = this.handleSetupFormChange.bind(this);
        this.handleSetupFormSubmit = this.handleSetupFormSubmit.bind(this);
        this.importData = this.importData.bind(this);
    }


    handleSetupFormChange(event: ChangeEvent<HTMLInputElement>) {
        const name = event.target.name;
        let value: string|number = event.target.value;
        if(name === "numDivisions") value = Number(value);
        let setupFormState = {...this.state.setupForm};
        setupFormState[name] = value;
        this.setState({ setupForm: setupFormState });
    }

    handleSetupFormSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        if(form.checkValidity() === false) {
            event.stopPropagation();
            this.setState({setupFormValidated: true});
            return false;
        }

        const numDivisions = this.state.setupForm.numDivisions;
        const divisionNames =[this.state.setupForm.divisionOneName, this.state.setupForm.divisionTwoName];
        if(numDivisions === 2 && (divisionNames[0] === "" || divisionNames[1] === "")) return false;

        this.setState({setupFormValidated: false});
        this.props.initializeTournament(this.state.setupForm.tournamentName, numDivisions, divisionNames, this.state.setupForm.scoreReplies);
    }

    importData(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        if(form.checkValidity() === false) {
            event.stopPropagation();
            this.setState({importFormValidated: true});
            return false;
        }

        const files = (document.getElementById("importSetup") as HTMLInputElement).files;
        if (files === null) return false;

        this.setState({importFormValidated: false});
        importTournament(files);
    }


    render() {
        return (
            <Modal
                show={!this.props.init}
                backdrop="static"
                animation={false}
                className="setup-modal"
                dialogClassName="setup-modal-dialog"
                backdropClassName="setup-modal-backdrop"
                aria-labelledby="setup-modal-title" >
                <Modal.Header>
                    <Modal.Title id="setup-modal-title">
                        <img src={logo} alt="TacoTab logo" id="setup-logo" />
                        Welcome to TacoTab!
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p><strong>This is prerelease software, still under active development. Use at your own risk&mdash;this app might bite.</strong> For more information, see the <a href="https://github.com/rayoverweij/tacotab" rel="noopener noreferrer" target="_blank">GitHub repository</a>.</p>
                    <p>You can create a new tournament from scratch, or import data from a previous TacoTab tournament.</p>
                    
                    <Tabs defaultActiveKey="createnew" id="setup-tabs">
                        <Tab eventKey="createnew" title="New tournament">
                            <Form
                                noValidate
                                validated={this.state.setupFormValidated}
                                onSubmit={this.handleSetupFormSubmit}>
                                <Form.Group controlId="setupFormTournamentName">
                                    <Form.Label className="h5">Tournament name</Form.Label>
                                    <Form.Control
                                        name="tournamentName"
                                        type="text"
                                        required
                                        placeholder="e.g. 'Bard MS-HS 2020'"
                                        value={this.state.setupForm.tournamentName}
                                        onChange={this.handleSetupFormChange} />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter a name for the tournament.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <h5 id="setup-form-div-h5">Speaker divisions</h5>
                                <Form.Group controlId="setupFormNumDivisions" id="setup-form-num-div">
                                    <Form.Label>Number of speaker divisions:&nbsp;&nbsp;</Form.Label>
                                    <Form.Check inline custom
                                        name="numDivisions"
                                        label="1"
                                        value={1}
                                        type="radio"
                                        id="setup-form-divisions-1"
                                        checked={this.state.setupForm.numDivisions === 1}
                                        onChange={this.handleSetupFormChange} />
                                    <Form.Check inline custom
                                        name="numDivisions"
                                        label="2"
                                        value={2}
                                        type="radio"
                                        id="setup-form-divisions-2"
                                        checked={this.state.setupForm.numDivisions === 2}
                                        onChange={this.handleSetupFormChange} />
                                </Form.Group>

                                <Collapse in={this.state.setupForm.numDivisions === 2}>
                                    <div>
                                        <Form.Group controlId="setupFormDivisionNames">
                                            <Form.Label>Give both divisions a name for easy identification.</Form.Label>
                                            <Form.Row>
                                                <Col md={6}>
                                                    <Form.Label srOnly>Name for division one</Form.Label>
                                                    <Form.Control
                                                        name="divisionOneName"
                                                        type="text"
                                                        placeholder="e.g. 'Novice'"
                                                        required={this.state.setupForm.numDivisions === 2}
                                                        value={this.state.setupForm.divisionOneName}
                                                        onChange={this.handleSetupFormChange} />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please enter a name.
                                                    </Form.Control.Feedback>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Label srOnly>Name for division two</Form.Label>
                                                    <Form.Control
                                                        name="divisionTwoName"
                                                        type="text"
                                                        placeholder="e.g. 'Open'"
                                                        required={this.state.setupForm.numDivisions === 2}
                                                        value={this.state.setupForm.divisionTwoName}
                                                        onChange={this.handleSetupFormChange} />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please enter a name.
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Row>
                                        </Form.Group>
                                    </div>
                                </Collapse>

                                <Button variant="primary" type="submit" id="setup-form-submit">
                                    Create the tournament
                                </Button>
                            </Form>
                        </Tab>

                        <Tab eventKey="importnew" title="Import tournament">
                            <p>Open files generated with the Export function.</p>
                            <Form
                                noValidate
                                validated={this.state.importFormValidated}
                                onSubmit={this.importData}>
                                <Form.Row>
                                    <Col md={9}>
                                        <div className="custom-file">
                                            <Form.Control
                                                name="import"
                                                id="importSetup"
                                                className="custom-file-input"
                                                type="file"
                                                required
                                                accept=".tournament,.json" />
                                            <label className="custom-file-label" htmlFor="importSetup">Choose file</label>
                                            <Form.Control.Feedback type="invalid">
                                                Please select a file from your computer.
                                            </Form.Control.Feedback>
                                        </div>
                                    </Col>
                                    <Col md={3}>
                                        <Button variant="primary" type="submit">Import</Button>
                                    </Col>
                                </Form.Row>
                            </Form>
                        </Tab>
                    </Tabs>
                </Modal.Body>
            </Modal>
        );
    }
}

export default SetupScreen;