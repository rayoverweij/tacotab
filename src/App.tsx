import React from 'react';
import './App.scss';
import logo from './images/logo.svg';
import pgk from '../package.json';
import SetupScreen from './setup/SetupScreen';
import Home from './home/Home';
import Participants from './participants/Participants';
import Judges from './judges/Judges';
import { Speaker } from './types/Speaker';
import { Team } from './types/Team';
import { Judge } from './types/Judge';
import { Draw } from './types/Draw';
import { Config } from './types/Config';
import Container from 'react-bootstrap/Container';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Collapse from 'react-bootstrap/Collapse';
import { List } from 'react-bootstrap-icons';


type AppProps = {}

type AppState = {
    showMenu: boolean,
    init: boolean,
    tournamentName: string,
    config: Config,
    speakersOne: Speaker[],
    speakersTwo: Speaker[],
    teamsOne: Team[],
    teamsTwo: Team[],
    judges: Judge[],
    draws: Draw[]
}

const s = JSON.stringify;

class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);

        if(!localStorage.getItem("init")) {
            localStorage.setItem("init", s(false));
        }
        if(!localStorage.getItem("tournamentName")) {
            localStorage.setItem("tournamentName", s("New tournament"));
        }
        if(!localStorage.getItem("config")) {
            localStorage.setItem("config", s({version: "0", numDivisions: 0}));
        }
        if(!localStorage.getItem("speakersOne")) {
            localStorage.setItem("speakersOne", s([]));
        }
        if(!localStorage.getItem("teamsOne")) {
            localStorage.setItem("teamsOne", s([]));
        }
        if(!localStorage.getItem("speakersTwo")) {
            localStorage.setItem("speakersTwo", s([]));
        }
        if(!localStorage.getItem("teamsTwo")) {
            localStorage.setItem("teamsTwo", s([]));
        }
        if(!localStorage.getItem("speakerCounter")) {
            localStorage.setItem("speakerCounter", s(0));
        }
        if(!localStorage.getItem("teamCounter")) {
            localStorage.setItem("teamCounter", s(0));
        }
        if(!localStorage.getItem("judges")) {
            localStorage.setItem("judges", s([]));
        }
        if(!localStorage.getItem("judgeCounter")) {
            localStorage.setItem("judgeCounter", s(0));
        }
        if(!localStorage.getItem("draws")) {
            localStorage.setItem("draws", s([
                {generated: false, roomsOne: [], roomsTwo: []},
                {generated: false, roomsOne: [], roomsTwo: []},
                {generated: false, roomsOne: [], roomsTwo: []}
            ]));
        }

        this.state = {
            showMenu: false,
            init: JSON.parse(localStorage.getItem("init")!),
            tournamentName: JSON.parse(localStorage.getItem("tournamentName")!),
            config: JSON.parse(localStorage.getItem("config")!),
            speakersOne: JSON.parse(localStorage.getItem("speakersOne")!),
            speakersTwo: JSON.parse(localStorage.getItem("speakersTwo")!),
            teamsOne: JSON.parse(localStorage.getItem("teamsOne")!),
            teamsTwo: JSON.parse(localStorage.getItem("teamsTwo")!),
            judges: JSON.parse(localStorage.getItem("judges")!),
            draws: JSON.parse(localStorage.getItem("draws")!)
        }

        this.toggleMenu = this.toggleMenu.bind(this);

        this.updateStorage = this.updateStorage.bind(this);
        this.updateTournamentName = this.updateTournamentName.bind(this);
        this.updateInit = this.updateInit.bind(this);
        this.updateConfig = this.updateConfig.bind(this);
        this.updateSpeakersOne = this.updateSpeakersOne.bind(this);
        this.updateSpeakersTwo = this.updateSpeakersTwo.bind(this);
        this.updateTeamsOne = this.updateTeamsOne.bind(this);
        this.updateTeamsTwo = this.updateTeamsTwo.bind(this);
        this.updateJudges = this.updateJudges.bind(this);

        this.initializeTournament = this.initializeTournament.bind(this);
        this.importTournament = this.importTournament.bind(this);
        this.getTotalTeams = this.getTotalTeams.bind(this);
    }


    // Toggle menu
    toggleMenu() {
        if(this.state.showMenu) {
            this.setState({ showMenu: false });
        } else {
            this.setState({ showMenu: true });
        }
    }


    // Global methods to update local storage and state
    updateStorage = (key: string) => {
        return (value: any) => {
            localStorage.setItem(key, JSON.stringify(value));
            this.setState<never>({ [key]: value })
        }
    };

    updateTournamentName = (name: string) => {
        this.updateStorage("tournamentName")(name)
        document.title = `${name} - TacoTab`;
    }

    updateInit = this.updateStorage("init");
    updateConfig = this.updateStorage("config");
    updateSpeakersOne = this.updateStorage("speakersOne");
    updateSpeakersTwo = this.updateStorage("speakersTwo");
    updateTeamsOne = this.updateStorage("teamsOne");
    updateTeamsTwo = this.updateStorage("teamsTwo");
    updateJudges = this.updateStorage("judges");


    // Global helper methods
    initializeTournament = (
        tournamentName: string,
        numDivisions: number,
        divisionNames: string[]) => {

            this.updateTournamentName(tournamentName);
            
            let config: Config = {
                version: pgk.version,
                numDivisions: numDivisions
            }
            if(numDivisions !== 1) {
                config.divisionNames = [...divisionNames];
            }
            this.updateConfig(config);

            this.updateInit(true);
    }

    importTournament = (files: FileList) => {
        if(files.length <= 0) return false;

        const fr = new FileReader();
        fr.onload = event => {
            const result = JSON.parse(event.target!.result as string);
            localStorage.setItem("init", s(result.init));
            localStorage.setItem("tournamentName", s(result.tournamentName));
            localStorage.setItem("config", s(result.config));
            localStorage.setItem("speakersOne", s(result.speakersOne));
            localStorage.setItem("teamsOne", s(result.teamsOne));
            localStorage.setItem("speakersTwo", s(result.speakersTwo));
            localStorage.setItem("teamsTwo", s(result.teamsTwo));
            localStorage.setItem("speakerCounter", s(result.speakerCounter));
            localStorage.setItem("teamCounter", s(result.teamCounter));
            localStorage.setItem("judges", s(result.judges));
            localStorage.setItem("judgeCounter", s(result.judgeCounter));
            localStorage.setItem("draws", s(result.draws));
        }
        fr.readAsText(files.item(0) as File);

        window.location.reload();
    }

    getTotalTeams() {
        return this.state.teamsOne.length + this.state.teamsTwo.length;
    }



    render() {
        let participants_nav, participants_panes;
        if(this.state.config.numDivisions !== 2) {
            participants_nav = (
                <Nav.Item>
                    <Nav.Link eventKey="participants">Participants</Nav.Link>
                </Nav.Item>
            );
            participants_panes = (
                <Tab.Pane eventKey="participants">
                    <Participants
                        div={1}
                        speakers={this.state.speakersOne}
                        teams={this.state.teamsOne}
                        updateSpeakers={this.updateSpeakersOne}
                        updateTeams={this.updateTeamsOne} />
                </Tab.Pane>
            );
        } else {
            participants_nav = (
                <>
                    <Nav.Item>
                        <Nav.Link eventKey="divone">{this.state.config.divisionNames![0]}</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="divtwo">{this.state.config.divisionNames![1]}</Nav.Link>
                    </Nav.Item>
                </>
            );
            participants_panes = (
                <>
                    <Tab.Pane eventKey="divone">
                        <Participants
                            div={1}
                            speakers={this.state.speakersOne}
                            teams={this.state.teamsOne}
                            updateSpeakers={this.updateSpeakersOne}
                            updateTeams={this.updateTeamsOne} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="divtwo">
                        <Participants
                            div={2}
                            speakers={this.state.speakersTwo}
                            teams={this.state.teamsTwo}
                            updateSpeakers={this.updateSpeakersTwo}
                            updateTeams={this.updateTeamsTwo} />
                    </Tab.Pane>
                </>
            );
        }


        return (
            <>
            <Container fluid className="app">
                <div id="logo">
                    <img src={logo} alt="TacoTab logo" />
                    <h1>TacoTab</h1>
                </div>

                <div id="hamburger">
                    <List 
                        onClick={this.toggleMenu}
                        role="button"
                        aria-controls="app-nav"
                        aria-expanded={this.state.showMenu} />
                </div>

                <Tab.Container id="app-nav" defaultActiveKey="home">
                    <Collapse in={this.state.showMenu}>
                        <Nav className="main-nav">
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
                    </Collapse>
                    <Tab.Content>
                        <Tab.Pane eventKey="home">
                            <Home
                                tournamentName={this.state.tournamentName}
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
                        {/* <Tab.Pane eventKey="draw">
                            <Draw
                                config={this.state.config}
                                speakers_one={this.state.speakers_one}
                                speakers_two={this.state.speakers_two}
                                teams_one={this.state.teams_one}
                                teams_two={this.state.teams_two}
                                judges={this.state.judges}
                                draws={this.state.draws} />
                        </Tab.Pane> */}
                    </Tab.Content>
                </Tab.Container>
            </Container>

            <SetupScreen
                init={this.state.init}
                initializeTournament={this.initializeTournament}
                importTournament={this.importTournament} />
            </>
        );
    }
}

export default App;