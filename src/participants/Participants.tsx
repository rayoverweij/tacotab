import React from 'react';
import Speakers from './Speakers';
import Teams from './Teams';
import Ranking from './Ranking';
import { Speaker } from '../types/Speaker';
import { Team } from '../types/Team';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import { PersonFill, PeopleFill, Trophy } from 'react-bootstrap-icons';


type ParticipantsProps = {
    div: number,
    speakers: Speaker[],
    teams: Team[],
    scoreReplies: boolean,
    updateSpeakers: (speakers: Speaker[]) => void,
    updateTeams: (teams: Team[]) => void
}

class Participants extends React.PureComponent<ParticipantsProps> {
    render() {
        return (
            <Tab.Container id={`part-view-${this.props.div}`} defaultActiveKey="speakers" transition={false}>
                <Row>
                    <Col md={3} lg={2}>
                        <Nav variant="pills" className="sub-nav">
                            <Nav.Item>
                                <Nav.Link eventKey="speakers" className="sub-nav-link">
                                    <PersonFill className="btn-icon" />
                                    Speakers
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="teams" className="sub-nav-link">
                                    <PeopleFill className="btn-icon" />
                                    Teams
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="ranking" className="sub-nav-link">
                                    <Trophy className="btn-icon" />
                                    Ranking
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col md={9} lg={10}>
                        <Tab.Content>
                            <Tab.Pane eventKey="speakers">
                                <Speakers
                                    speakers={this.props.speakers}
                                    teams={this.props.teams}
                                    updateSpeakers={this.props.updateSpeakers} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="teams">
                                <Teams
                                    div={this.props.div}
                                    speakers={this.props.speakers}
                                    teams={this.props.teams}
                                    scoreReplies={this.props.scoreReplies}
                                    updateSpeakers={this.props.updateSpeakers}
                                    updateTeams={this.props.updateTeams} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="ranking">
                                <Ranking
                                    speakers={this.props.speakers}
                                    teams={this.props.teams}
                                    scoreReplies={this.props.scoreReplies} />
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        );
    }
}

export default Participants;