import React from 'react';

import Speakers from './Speakers';
import Teams from './Teams';
import Ranking from './Ranking';

import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';

class Participants extends React.Component {
    render() {
        return (
            <Tab.Container id={`part-view-${this.props.div}`} defaultActiveKey="speakers">
                <Row className="part-view">
                    <Col sm={2}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="speakers" className="sub-nav-link">Speakers</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="teams" className="sub-nav-link">Teams</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="ranking" className="sub-nav-link">Ranking</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={10}>
                        <Tab.Content>
                            <Tab.Pane eventKey="speakers">
                                <Speakers
                                    speakers={this.props.speakers}
                                    teams={this.props.teams}
                                    updateSpeakers={this.props.updateSpeakers} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="teams">
                                <Teams
                                    speakers={this.props.speakers}
                                    teams={this.props.teams}
                                    div={this.props.div}
                                    updateSpeakers={this.props.updateSpeakers}
                                    updateTeams={this.props.updateTeams} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="ranking">
                                <Ranking
                                    speakers={this.props.speakers}
                                    teams={this.props.teams} />
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        );
    }
}

export default Participants;