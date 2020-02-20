import React from 'react';

import Speakers from './Speakers';
import Teams from './Teams';
import Ranking from './Ranking';

import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';

class Participants extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            teams: this.props.div === "one" ? JSON.parse(localStorage.getItem("teams_one")) : JSON.parse(localStorage.getItem("teams_two")),
            speakers: this.props.div === "one" ? JSON.parse(localStorage.getItem("speakers_one")) : JSON.parse(localStorage.getItem("speakers_two"))
        }

        this.updateSpeakers = this.updateSpeakers.bind(this);
        this.updateTeams = this.updateTeams.bind(this);
    }


    updateSpeakers(speakers) {
        this.setState({speakers: speakers});
    }

    updateTeams(teams) {
        this.setState({teams: teams});
    }


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
                                    speakers={this.state.speakers}
                                    teams={this.state.teams}
                                    div={this.props.div}
                                    updateSpeakers={this.updateSpeakers}
                                    updateTeams={this.updateTeams} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="teams">
                                <Teams
                                    speakers={this.state.speakers}
                                    teams={this.state.teams}
                                    div={this.props.div}
                                    updateSpeakers={this.updateSpeakers}
                                    updateTeams={this.updateTeams} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="ranking">
                                <Ranking
                                    speakers={this.state.speakers}
                                    teams={this.state.teams} />
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        );
    }
}

export default Participants;