import React from 'react';
import './Settings.scss';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            nameForm: ""
        }

        this.handleNameFormChange = this.handleNameFormChange.bind(this);
        this.handleNameFormSubmit = this.handleNameFormSubmit.bind(this);
        this.exportData = this.exportData.bind(this);
    }


    handleNameFormChange(event) {
        this.setState({nameForm: event.target.value});
    }

    handleNameFormSubmit(event) {
        event.preventDefault();

        const name = this.state.nameForm;
        localStorage.setItem("tournament_name", JSON.stringify(name));
        document.title = `${name} - TacoTab`;
    }

    exportData() {
        let data = "data:text/json;charset=utf-8,";
        data += encodeURIComponent("{");
        data += encodeURIComponent('"tournament_name": ' + localStorage.getItem("tournament_name") + ",");
        data += encodeURIComponent('"speakers_middle": ' + localStorage.getItem("speakers_middle") + ",");
        data += encodeURIComponent('"teams_middle": ' + localStorage.getItem("teams_middle") + ",");
        data += encodeURIComponent('"speakers_high": ' + localStorage.getItem("speakers_high") + ",");
        data += encodeURIComponent('"teams_high": ' + localStorage.getItem("teams_high") + ",");
        data += encodeURIComponent('"speakers_counter": ' + localStorage.getItem("speakers_counter") + ",");
        data += encodeURIComponent('"team_counter": ' + localStorage.getItem("team_counter") + ",");
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
                                <Form onSubmit={this.handleNameFormSubmit} className="form-tourname">
                                    <Form.Row>
                                        <Col sm={6}>
                                            <Form.Control
                                                name="tournament-name"
                                                type="text"
                                                placeholder="New name"
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
                                <h3>Export tournament data</h3>
                                <p>Save all tournament data to a file on your PC.</p>
                                <Button variant="primary" onClick={this.exportData}>Export data</Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4}>
                        <Row>
                            <Col>
                                <h3>About</h3>
                                <p>
                                    TacoTab alpha version 0.1.0<br />
                                    <a href="/docs">Documentation</a><br />
                                    <a href="https://github.com/rayoverweij/tacotab" rel="noopener noreferrer" target="_blank">GitHub</a>
                                </p>
                                <p>
                                    Built by <a href="https://rayo.dev" rel="noopener noreferrer" target="_blank">Rayo Verweij</a>.
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