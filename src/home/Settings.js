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
                                <Form onSubmit={this.handleNameFormSubmit}>
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