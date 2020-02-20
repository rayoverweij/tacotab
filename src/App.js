import React from 'react';
import './App.scss';
import logo from './images/logo.svg';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import Home from './home/Home';
import Participants from './participants/Participants';
import Judges from './judges/Judges';
import Draw from './draw/Draw';


const s = JSON.stringify;

class App extends React.Component {
    constructor(props) {
        super(props);

        if(!localStorage.getItem("init")) {
            localStorage.setItem("init", false);
        }
        if(!localStorage.getItem("tournament_name")) {
            localStorage.setItem("tournament_name", s("New tournament"));
        }
        if(!localStorage.getItem("config")) {
            localStorage.setItem("config", s({}));
        }
        if(!localStorage.getItem("speakers_one")) {
            localStorage.setItem("speakers_one", s([]));
        }
        if(!localStorage.getItem("teams_one")) {
            localStorage.setItem("teams_one", s([]));
        }
        if(!localStorage.getItem("speakers_two")) {
            localStorage.setItem("speakers_two", s([]));
        }
        if(!localStorage.getItem("teams_two")) {
            localStorage.setItem("teams_two", s([]));
        }
        if(!localStorage.getItem("speakers_counter")) {
            localStorage.setItem("speakers_counter", 0);
        }
        if(!localStorage.getItem("teams_counter")) {
            localStorage.setItem("teams_counter", 0);
        }
        if(!localStorage.getItem("judges")) {
            localStorage.setItem("judges", s([]));
        }
        if(!localStorage.getItem("judges_counter")) {
            localStorage.setItem("judges_counter", 0);
        }
        if(!localStorage.getItem("draws_generated")) {
            localStorage.setItem("draws_generated", s([false, false, false]));
        }
        if(!localStorage.getItem("draws")) {
            localStorage.setItem("draws", s([
                {pairings_one: [], pairings_two: []},
                {pairings_one: [], pairings_two: []},
                {pairings_one: [], pairings_two: []}
            ]));
        }

        this.state = {
            init: localStorage.getItem("init"),
            tournament_name: JSON.parse(localStorage.getItem("tournament_name")),
            config: JSON.parse(localStorage.getItem("config")),
            speakers_one: JSON.parse(localStorage.getItem("speakers_one")),
            speakers_two: JSON.parse(localStorage.getItem("speakers_two")),
            teams_one: JSON.parse(localStorage.getItem("teams_one")),
            teams_two: JSON.parse(localStorage.getItem("teams_two")),
            judges: JSON.parse(localStorage.getItem("judges"))
        }

        this.updateTournamentName = this.updateTournamentName.bind(this);
        this.updateSpeakersOne = this.updateSpeakersOne.bind(this);
        this.updateSpeakersTwo = this.updateSpeakersTwo.bind(this);
        this.updateTeamsOne = this.updateTeamsOne.bind(this);
        this.updateTeamsTwo = this.updateTeamsTwo.bind(this);
        this.updateJudges = this.updateJudges.bind(this);

        document.title = `${JSON.parse(localStorage.getItem("tournament_name"))} - TacoTab`;
    }



    updateTournamentName(name) {
        localStorage.setItem("tournament_name", JSON.stringify(name));
        this.setState({tournament_name: name});
        document.title = `${name} - TacoTab`;
    }

    updateConfig(config) {
        localStorage.setItem("config", JSON.stringify(config));
        this.setState({config: config});
    }
    
    updateSpeakersOne(speakers) {
        localStorage.setItem("speakers_one", JSON.stringify(speakers));
        this.setState({speakers_one: speakers});
    }

    updateSpeakersTwo(speakers) {
        localStorage.setItem("speakers_two", JSON.stringify(speakers));
        this.setState({speakers_two: speakers});
    }

    updateTeamsOne(teams) {
        localStorage.setItem("teams_one", JSON.stringify(teams));
        this.setState({teams_one: teams});
    }

    updateTeamsTwo(teams) {
        localStorage.setItem("teams_two", JSON.stringify(teams));
        this.setState({teams_two: teams});
    }
    
    updateJudges(judges) {
        localStorage.setItem("judges", JSON.stringify(judges));
        this.setState({judges: judges});
    }



    render() {
        return (
            <Container fluid="true" className="app">
                <Row>
                    <Col id="app-container">
                        <div id="logo">
                            <img src={logo} alt="TacoTab logo" />
                            <h1>TacoTab</h1>
                        </div>

                        <Tabs defaultActiveKey="home" id="app-nav">
                            <Tab eventKey="home" className="app-nav-tab" title="Home">
                                <Home
                                    tournamentName={this.state.tournament_name}
                                    config={this.state.config}
                                    updateTournamentName={this.updateTournamentName}
                                    updateConfig={this.updateConfig} />
                            </Tab>
                            <Tab eventKey="divone" className="app-nav-tab" title="Division One">
                                <Participants
                                    speakers={this.state.speakers_one}
                                    teams={this.state.teams_one}
                                    updateSpeakers={this.updateSpeakersOne}
                                    updateTeams={this.updateTeamsOne}
                                    div="one" />
                            </Tab>
                            <Tab eventKey="divtwo" className="app-nav-tab" title="Division Two">
                                <Participants
                                    speakers={this.state.speakers_two}
                                    teams={this.state.teams_two}
                                    updateSpeakers={this.updateSpeakersTwo}
                                    updateTeams={this.updateTeamsTwo}
                                    div="two" />
                            </Tab>
                            <Tab eventKey="judges" className="app-nav-tab" title="Judges">
                                <Judges
                                    judges={this.state.judges}
                                    updateJudges={this.updateJudges} />
                            </Tab>
                            <Tab eventKey="draw" className="app-nav-tab" title="Draw">
                                <Draw />
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default App;
