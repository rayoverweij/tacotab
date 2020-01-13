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
    constructor(props) {
        super(props);

        this.state = {
            teams: this.props.bracket === "middle" ? JSON.parse(localStorage.getItem("teams_middle")) : JSON.parse(localStorage.getItem("teams_high")),
            speakers: this.props.bracket === "middle" ? JSON.parse(localStorage.getItem("speakers_middle")) : JSON.parse(localStorage.getItem("speakers_high"))
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
                                <Speakers speakers={this.state.speakers} teams={this.state.teams} bracket={this.props.bracket} updateSpeakers={this.updateSpeakers} updateTeams={this.updateTeams} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="teams">
                                <Teams speakers={this.state.speakers} teams={this.state.teams} bracket={this.props.bracket} updateSpeakers={this.updateSpeakers} updateTeams={this.updateTeams} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="ranking">
                                <Ranking speakers={this.state.speakers} teams={this.state.teams} bracket={this.props.bracket} updateSpeakers={this.updateSpeakers} updateTeams={this.updateTeams} />
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        );
    }
}

export default Participants;