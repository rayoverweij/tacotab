import React from 'react';
import { ReactComponent as IconHome } from '../images/icon-home.svg';
import { ReactComponent as IconSettings } from '../images/icon-settings.svg';

import Welcome from './Welcome';
import Settings from './Settings';

import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';


class Home extends React.Component {
    render() {
        return (
            <Tab.Container id="home-view" defaultActiveKey="welcome">
                <Row>
                    <Col sm={2}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="welcome" className="sub-nav-link">
                                    <IconHome className="btn-icon" alt="Icon of a house" />
                                    Welcome
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="settings" className="sub-nav-link">
                                    <IconSettings className="btn-icon" alt="Icon of a gear" />
                                    Settings
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={10}>
                        <Tab.Content>
                            <Tab.Pane eventKey="welcome">
                                <Welcome
                                    tournamentName={this.props.tournamentName} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="settings">
                                <Settings
                                    config={this.props.config}
                                    updateTournamentName={this.props.updateTournamentName}
                                    updateConfig={this.props.updateConfig}
                                    importTournament={this.props.importTournament} />
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        );
    }
}

export default Home;