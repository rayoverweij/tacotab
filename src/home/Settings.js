import React from 'react';
import './Settings.scss';

import GitHubLogo from '../images/icon-github.svg';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import bsCustomFileInput from 'bs-custom-file-input';


class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            nameForm: ""
        }

        this.handleNameFormChange = this.handleNameFormChange.bind(this);
        this.handleNameFormSubmit = this.handleNameFormSubmit.bind(this);
        this.importData = this.importData.bind(this);
        this.exportData = this.exportData.bind(this);
        this.clearData = this.clearData.bind(this);
    }

    componentDidMount() {
        bsCustomFileInput.init();
    }


    handleNameFormChange(event) {
        this.setState({nameForm: event.target.value});
    }

    handleNameFormSubmit(event) {
        event.preventDefault();
        const name = this.state.nameForm;
        this.props.updateTournamentName(name);
        this.setState({nameForm: ""});
    }

    importData(event) {
        event.preventDefault();
        const files = document.getElementById("import-settings").files;
        this.props.importTournament(files);
    }

    exportData() {
        let data = "data:text/json;charset=utf-8,";
        data += encodeURIComponent("{");
        data += encodeURIComponent('"init": ' + localStorage.getItem("init") + ",");
        data += encodeURIComponent('"tournament_name": ' + localStorage.getItem("tournament_name") + ",");
        data += encodeURIComponent('"config": ' + localStorage.getItem("config") + ",");
        data += encodeURIComponent('"speakers_one": ' + localStorage.getItem("speakers_one") + ",");
        data += encodeURIComponent('"teams_one": ' + localStorage.getItem("teams_one") + ",");
        data += encodeURIComponent('"speakers_two": ' + localStorage.getItem("speakers_two") + ",");
        data += encodeURIComponent('"teams_two": ' + localStorage.getItem("teams_two") + ",");
        data += encodeURIComponent('"speakers_counter": ' + localStorage.getItem("speakers_counter") + ",");
        data += encodeURIComponent('"teams_counter": ' + localStorage.getItem("teams_counter") + ",");
        data += encodeURIComponent('"judges": ' + localStorage.getItem("judges") + ",");
        data += encodeURIComponent('"judges_counter": ' + localStorage.getItem("judges_counter") + ",");
        data += encodeURIComponent('"draws_generated": ' + localStorage.getItem("draws_generated") + ",");
        data += encodeURIComponent('"draws": ' + localStorage.getItem("draws"));
        data += encodeURIComponent("}");
        
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", data);
        downloadAnchorNode.setAttribute("download", "tournament.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
 
    clearData() {
        const conf = window.confirm("Are you sure you want to delete all data?");
        if(!conf) {
            return false;
        }
        localStorage.clear();
        window.location.reload();
    }


    render() {
        return (
            <div>
                <Row>
                    <Col md={8}>
                        <Row>
                            <Col>
                                <h2>Settings</h2>
                                <p>Manage your tournament.</p>
                            </Col>
                        </Row>
                        <Row className="row-settings">
                            <Col>
                                <h3>Change tournament name</h3>
                                <Form onSubmit={this.handleNameFormSubmit} className="form-settings">
                                    <Form.Row>
                                        <Col sm={6}>
                                            <Form.Control
                                                name="tournament-name"
                                                type="text"
                                                placeholder="New name"
                                                value={this.state.nameForm}
                                                onChange={this.handleNameFormChange} />
                                        </Col>
                                        <Col>
                                            <Button variant="primary" type="submit">Save</Button>
                                        </Col>
                                    </Form.Row>
                                </Form>
                            </Col>
                        </Row>
                        <Row className="row-settings">
                            <Col>
                                <h3>Import tournament data</h3>
                                <p>Open files generated with the Export function below. <strong>Note:</strong> this will override all current data!</p>
                                <Form onSubmit={this.importData} className="form-settings">
                                    <Form.Row>
                                        <Col>
                                            <div className="custom-file">
                                                <Form.Control
                                                    name="import"
                                                    id="import-settings"
                                                    className="custom-file-input"
                                                    type="file" />
                                                <label className="custom-file-label" htmlFor="customFile">Choose file</label>
                                            </div>
                                        </Col>
                                        <Col>
                                            <Button variant="primary" type="submit">Import</Button>
                                        </Col>
                                    </Form.Row>
                                </Form>
                            </Col>
                        </Row>
                        <Row className="row-settings">
                            <Col>
                                <h3>Export tournament data</h3>
                                <p>Save all tournament data to a file on your PC.</p>
                                <Button
                                    variant="primary"
                                    className="button-settings"
                                    onClick={this.exportData}>
                                        Export data
                                    </Button>
                            </Col>
                        </Row>
                        <Row className="row-settings">
                            <Col>
                                <h3>Clear tournament data</h3>
                                <p>Warning: this will delete <strong>all</strong> entered data. Save your data using the Export function first.</p>
                                <Button
                                    variant="danger"
                                    className="button-settings"
                                    onClick={this.clearData}>
                                        Clear data
                                    </Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4}>
                        <Row>
                            <Col>
                                <h3>About</h3>
                                <p>
                                    TacoTab β version 0.1.0<br />
                                    <img src={GitHubLogo} alt="GitHub logo" id="logo-github"/>&nbsp;
                                    <a href="https://github.com/rayoverweij/tacotab" rel="noopener noreferrer" target="_blank">
                                        GitHub
                                    </a>
                                </p>
                                <p>
                                    Built by <a href="https://rayo.dev" rel="noopener noreferrer" target="_blank">Rayo Verweij</a> for the <a href="https://debate.bard.edu" rel="noopener noreferrer" target="_blank">Bard Debate Union</a>&mdash;Bard's best sports team.
                                </p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Settings;