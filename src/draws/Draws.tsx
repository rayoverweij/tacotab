import React from 'react';
import Round from './Round';
import { Config } from '../types/Config';
import { Speaker } from '../types/Speaker';
import { Team } from '../types/Team';
import { Judge } from '../types/Judge';
import { Draw } from '../types/Draw';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import { CircleHalf } from 'react-bootstrap-icons';


type DrawsProps = {
    config: Config,
    speakersOne: Speaker[],
    speakersTwo: Speaker[],
    teamsOne: Team[],
    teamsTwo: Team[],
    judges: Judge[],
    draws: Draw[]
}

class Draws extends React.Component<DrawsProps> {
    render() {
        return (
            <Tab.Container id={`draw-view`} defaultActiveKey="round-1" transition={false}>
                <Row>
                    <Col md={3} lg={2}>
                        <Nav variant="pills" className="sub-nav">
                            {[1, 2, 3].map(round => {
                                return (
                                    <Nav.Item key={`draw-nav-${round}`}>
                                        <Nav.Link eventKey={`round-${round}`} className="sub-nav-link">
                                            <CircleHalf className="btn-icon" />
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
                                            speakersOne={this.props.speakersOne}
                                            speakersTwo={this.props.speakersTwo}
                                            teamsOne={this.props.teamsOne}
                                            teamsTwo={this.props.teamsTwo}
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

export default Draws;