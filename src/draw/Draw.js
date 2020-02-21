import React from 'react';

import Round from './Round';

import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';


class Draw extends React.Component {
    render() {
        return (
            <Tab.Container id={`draw-view`} defaultActiveKey="round-1">
                <Row>
                    <Col sm={2}>
                        <Nav variant="pills" className="flex-column">
                            {[1, 2, 3].map(round => {
                                return (
                                    <Nav.Item key={`draw-nav-${round}`}>
                                        <Nav.Link eventKey={`round-${round}`} className="sub-nav-link">
                                            Round {round}
                                        </Nav.Link>
                                    </Nav.Item>
                                );
                            })}
                        </Nav>
                    </Col>
                    <Col sm={10}>
                        <Tab.Content>
                            {[1, 2, 3].map(round => {
                                return (
                                    <Tab.Pane key={`draw-pane-${round}`} eventKey={`round-${round}`}>
                                        <Round
                                            round={round}
                                            config={this.props.config}
                                            teams_one={this.props.teams_one}
                                            teams_two={this.props.teams_two}
                                            judges={this.props.judges}
                                            draws={this.props.draws} />
                                    </Tab.Pane>
                                )
                            })}
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        );
    }
}

export default Draw;