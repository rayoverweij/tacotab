import React from 'react';

import Welcome from './Welcome';
import Settings from './Settings';

import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';


class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            'tournament_name': localStorage.getItem("tournament_name")
        }
    }

    render() {
        return (
            <Tab.Container id="home-view" defaultActiveKey="welcome">
                <Row>
                    <Col sm={2}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="welcome" className="sub-nav-link">Welcome</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="settings" className="sub-nav-link">Settings</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={10}>
                        <Tab.Content>
                            <Tab.Pane eventKey="welcome">
                                <Welcome />
                            </Tab.Pane>
                            <Tab.Pane eventKey="settings">
                                <Settings />
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        );
    }
}

export default Home;