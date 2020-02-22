import React from 'react';
import './App.scss';
import logo from './images/logo.svg';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';

import Home from './home/Home';
import Participants from './participants/Participants';
import Judges from './judges/Judges';
import Draw from './draw/Draw';
import SetupModal from './setup/SetupModal';


const s = JSON.stringify;

class App extends React.Component {
    constructor(props) {
        super(props);

        if(!localStorage.getItem("init")) {
            localStorage.setItem("init", s(false));
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
            localStorage.setItem("speakers_counter", s(0));
        }
        if(!localStorage.getItem("teams_counter")) {
            localStorage.setItem("teams_counter", s(0));
        }
        if(!localStorage.getItem("judges")) {
            localStorage.setItem("judges", s([]));
        }
        if(!localStorage.getItem("judges_counter")) {
            localStorage.setItem("judges_counter", s(0));
        }
        if(!localStorage.getItem("draws")) {
            localStorage.setItem("draws", s([
                {generated: false, pairings_one: [], pairings_two: []},
                {generated: false, pairings_one: [], pairings_two: []},
                {generated: false, pairings_one: [], pairings_two: []}
            ]));
        }

        this.state = {
            init: JSON.parse(localStorage.getItem("init")),
            tournament_name: JSON.parse(localStorage.getItem("tournament_name")),
            config: JSON.parse(localStorage.getItem("config")),
            speakers_one: JSON.parse(localStorage.getItem("speakers_one")),
            speakers_two: JSON.parse(localStorage.getItem("speakers_two")),
            teams_one: JSON.parse(localStorage.getItem("teams_one")),
            teams_two: JSON.parse(localStorage.getItem("teams_two")),
            judges: JSON.parse(localStorage.getItem("judges")),
            draws: JSON.parse(localStorage.getItem("draws"))
        }

        this.updateTournamentName = this.updateTournamentName.bind(this);
        this.updateSpeakersOne = this.updateSpeakersOne.bind(this);
        this.updateSpeakersTwo = this.updateSpeakersTwo.bind(this);
        this.updateTeamsOne = this.updateTeamsOne.bind(this);
        this.updateTeamsTwo = this.updateTeamsTwo.bind(this);
        this.updateJudges = this.updateJudges.bind(this);
        
        this.initializeTournament = this.initializeTournament.bind(this);
        this.importTournament = this.importTournament.bind(this);
        this.getTotalTeams = this.getTotalTeams.bind(this);

        document.title = `${JSON.parse(localStorage.getItem("tournament_name"))} - TacoTab`;
    }

  
    // Global update state methods
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

    // Global helper methods
    initializeTournament(name, divisions, divisionNames) {
        this.updateTournamentName(name);

        let config;
        if(divisions === "1") {
            config = {
                divisions: divisions
            }
        } else {
            config = {
                divisions: divisions,
                divisionNames: [divisionNames[0], divisionNames[1]]
            }
        }
        this.updateConfig(config);

        localStorage.setItem("init", JSON.stringify(true));
        this.setState({init: true});
    }

    importTournament(files) {
        if(files.length <= 0) return false;

        const fr = new FileReader();
        fr.onload = event => {
            const result = JSON.parse(event.target.result);
            localStorage.setItem("init", JSON.stringify(result.init));
            localStorage.setItem("tournament_name", JSON.stringify(result.tournament_name));
            localStorage.setItem("config", JSON.stringify(result.config));
            localStorage.setItem("speakers_one", JSON.stringify(result.speakers_one));
            localStorage.setItem("teams_one", JSON.stringify(result.teams_one));
            localStorage.setItem("speakers_two", JSON.stringify(result.speakers_two));
            localStorage.setItem("teams_two", JSON.stringify(result.teams_two));
            localStorage.setItem("speakers_counter", JSON.stringify(result.speakers_counter));
            localStorage.setItem("teams_counter", JSON.stringify(result.teams_counter));
            localStorage.setItem("judges", JSON.stringify(result.judges));
            localStorage.setItem("judges_counter", JSON.stringify(result.judges_counter));
            localStorage.setItem("draws", JSON.stringify(result.draws));
        }
        fr.readAsText(files.item(0));

        window.location.reload();
    }

    getTotalTeams() {
        return this.state.teams_one.length + this.state.teams_two.length;
    }



    render() {
        let participants_nav, participants_panes;
        if(this.state.config.divisions !== "2") {
            participants_nav = (
                <Nav.Item>
                    <Nav.Link eventKey="participants">Participants</Nav.Link>
                </Nav.Item>
            );
            participants_panes = (
                <Tab.Pane eventKey="participants">
                    <Participants
                        speakers={this.state.speakers_one}
                        teams={this.state.teams_one}
                        updateSpeakers={this.updateSpeakersOne}
                        updateTeams={this.updateTeamsOne}
                        div="one" />
                </Tab.Pane>
            );
        } else {
            participants_nav = (
                <>
                    <Nav.Item>
                        <Nav.Link eventKey="divone">{this.state.config.divisionNames[0]}</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="divtwo">{this.state.config.divisionNames[1]}</Nav.Link>
                    </Nav.Item>
                </>
            );
            participants_panes = (
                <>
                    <Tab.Pane eventKey="divone">
                        <Participants
                            speakers={this.state.speakers_one}
                            teams={this.state.teams_one}
                            updateSpeakers={this.updateSpeakersOne}
                            updateTeams={this.updateTeamsOne}
                            div="one" />
                    </Tab.Pane>
                    <Tab.Pane eventKey="divtwo">
                        <Participants
                            speakers={this.state.speakers_two}
                            teams={this.state.teams_two}
                            updateSpeakers={this.updateSpeakersTwo}
                            updateTeams={this.updateTeamsTwo}
                            div="two" />
                    </Tab.Pane>
                </>
            );
        }


        return (
            <div>
                <Container fluid="true" className="app">
                    <Row>
                        <Col id="app-container">
                            <div id="logo">
                                <img src={logo} alt="TacoTab logo" />
                                <h1>TacoTab</h1>
                            </div>

                            <Tab.Container id="app-nav" defaultActiveKey="home">
                                <Nav className="nav-tabs main-nav">
                                    <Nav.Item>
                                        <Nav.Link eventKey="home">Home</Nav.Link>
                                    </Nav.Item>
                                    {participants_nav}
                                    <Nav.Item>
                                        <Nav.Link eventKey="judges">Judges</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="draw">Draw</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <Tab.Content>
                                    <Tab.Pane eventKey="home">
                                        <Home
                                            tournamentName={this.state.tournament_name}
                                            config={this.state.config}
                                            updateTournamentName={this.updateTournamentName}
                                            updateConfig={this.updateConfig}
                                            importTournament={this.importTournament} />
                                    </Tab.Pane>
                                    {participants_panes}
                                    <Tab.Pane eventKey="judges">
                                        <Judges
                                            judges={this.state.judges}
                                            updateJudges={this.updateJudges}
                                            getTotalTeams={this.getTotalTeams} />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="draw">
                                        <Draw
                                            config={this.state.config}
                                            speakers_one={this.state.speakers_one}
                                            speakers_two={this.state.speakers_two}
                                            teams_one={this.state.teams_one}
                                            teams_two={this.state.teams_two}
                                            judges={this.state.judges}
                                            draws={this.state.draws} />
                                    </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container>
                        </Col>
                    </Row>
                </Container>

                <SetupModal
                    init={this.state.init}
                    initializeTournament={this.initializeTournament}
                    importTournament={this.importTournament} />
            </div>
        );
    }
}

export default App;
