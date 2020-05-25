import React from 'react';
import Welcome from './Welcome';
import Settings from './Settings';
import { Config } from '../types/Config';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import { HouseDoorFill, GearWideConnected } from 'react-bootstrap-icons';


type HomeProps = {
    config: Config,
    tournamentName: string,
    updateTournamentName: (name: string) => void,
    updateConfig: (config: Config) => void
}

class Home extends React.Component<HomeProps> {
    render() {
        return (
            <Tab.Container id="home-view" defaultActiveKey="welcome">
                <Row>
                    <Col md={3} lg={2}>
                        <Nav variant="pills" className="sub-nav">
                            <Nav.Item>
                                <Nav.Link eventKey="welcome" className="sub-nav-link">
                                    <HouseDoorFill className="btn-icon"/>
                                    Welcome
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="settings" className="sub-nav-link">
                                    <GearWideConnected className="btn-icon"/>
                                    Settings
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col md={9} lg={10}>
                        <Tab.Content>
                            <Tab.Pane eventKey="welcome">
                                <Welcome />
                            </Tab.Pane>
                            <Tab.Pane eventKey="settings">
                                <Settings
                                    config={this.props.config}
                                    tournamentName={this.props.tournamentName}
                                    updateTournamentName={this.props.updateTournamentName}
                                    updateConfig={this.props.updateConfig} />
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        );
    }
}

export default Home;