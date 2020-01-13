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
                                <Col sm={4}>
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
            </div>
        );
    }
}

export default Settings;