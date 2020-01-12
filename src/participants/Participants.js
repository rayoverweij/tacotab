import React from 'react';
import './Participants.scss';

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
            <Tab.Container id={`part-view-${this.props.bracket}`} defaultActiveKey="speakers">
                <Row className="part-view">
                    <Col sm={2}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="speakers" className="part-nav-link">Speakers</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="teams" className="part-nav-link">Teams</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="ranking" className="part-nav-link">Ranking</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={10}>
                        <Tab.Content>
                            <Tab.Pane eventKey="speakers">
                                <Speakers bracket={this.props.bracket} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="teams">
                                <Teams bracket={this.props.bracket} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="ranking">
                                <Ranking bracket={this.props.bracket} />
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        );
    }
}

export default Participants;