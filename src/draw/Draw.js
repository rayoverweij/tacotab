import React from 'react';
import { ReactComponent as IconRound } from '../images/icon-round.svg';

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
                    <Col md={3} lg={2}>
                        <Nav variant="pills">
                            {[1, 2, 3].map(round => {
                                return (
                                    <Nav.Item key={`draw-nav-${round}`}>
                                        <Nav.Link eventKey={`round-${round}`} className="sub-nav-link">
                                            <IconRound className="btn-icon" alt="Icon of a half-full circle" />
                                            Round {round}
                                        </Nav.Link>
                                    </Nav.Item>
                                );
                            })}
                        </Nav>
                    </Col>
                    <Col md={9} lg={10}>
                        <Tab.Content>
                            {[1, 2, 3].map(round => {
                                return (
                                    <Tab.Pane key={`draw-pane-${round}`} eventKey={`round-${round}`}>
                                        <Round
                                            round={round}
                                            config={this.props.config}
                                            speakers_one={this.props.speakers_one}
                                            speakers_two={this.props.speakers_two}
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