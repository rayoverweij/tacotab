import React from 'react';
import './App.scss';
import logo from './images/logo.svg';
import pkg from '../package.json';
import SetupScreen from './setup/SetupScreen';
import Home from './home/Home';
import Participants from './participants/Participants';
import Judges from './judges/Judges';
import Draws from './draws/Draws';
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
            localStorage.setItem("config", s({version: pkg.version, numDivisions: 0}));
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
        if(!localStorage.getItem("roomCounter")) {
            localStorage.setItem("roomCounter", s(0));
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

        document.title = `${JSON.parse(localStorage.getItem("tournamentName")!)} - TacoTab`;
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
                version: pkg.version,
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
            // COMPATIBILITY WITH EXPORTS BEFORE VERSION 0.3.0
            if(!result.config.version) {
                localStorage.setItem("tournamentName", s(result.tournament_name));

                let importConfig = result.config;
                importConfig.version = this.state.config.version;
                if(importConfig.divisions === "1") {
                    importConfig.numDivisions = 1
                } else {
                    importConfig.numDivisions = 2
                }
                delete importConfig.divisions
                localStorage.setItem("config", s(importConfig));

                let importSpeakersOne = result.speakers_one.map((speaker: any) => {
                    let newSpeaker = {
                        ...speaker,
                        speakerID: speaker.debaterID
                    }
                    delete newSpeaker.debaterID
                    return newSpeaker
                });
                localStorage.setItem("speakersOne", s(importSpeakersOne));

                let importTeamsOne = result.teams_one.map((team: any) => {
                    let newTeam = {
                        ...team,
                        name: team.teamName,
                        round1: team.round1.map((sp: string) => parseInt(sp)),
                        round2: team.round2.map((sp: string) => parseInt(sp)),
                        round3: team.round2.map((sp: string) => parseInt(sp)),
                        sideRound1: team.sideR1
                    }
                    delete newTeam.teamName
                    delete newTeam.sideR1
                    return newTeam
                });
                localStorage.setItem("teamsOne", s(importTeamsOne));

                let importSpeakersTwo = result.speakers_two.map((speaker: any) => {
                    let newSpeaker = {
                        ...speaker,
                        speakerID: speaker.debaterID
                    }
                    delete newSpeaker.debaterID
                    return newSpeaker
                });
                localStorage.setItem("speakersTwo", s(importSpeakersTwo));

                let importTeamsTwo = result.teams_two.map((team: any) => {
                    let newTeam = {
                        ...team,
                        name: team.teamName,
                        round1: team.round1.map((sp: string) => parseInt(sp)),
                        round2: team.round2.map((sp: string) => parseInt(sp)),
                        round3: team.round2.map((sp: string) => parseInt(sp)),
                        sideRound1: team.sideR1
                    }
                    delete newTeam.teamName
                    delete newTeam.sideR1
                    return newTeam
                });
                localStorage.setItem("teamsTwo", s(importTeamsTwo));

                localStorage.setItem("speakerCounter", s(result.speakers_counter));
                localStorage.setItem("teamCounter", s(result.teams_counter));

                let importJudges = result.judges.map((judge: any) => {
                    let newJudge = {
                        ...judge,
                        atRound1: judge.r1,
                        atRound2: judge.r2,
                        atRound3: judge.r3
                    }
                    delete newJudge.r1
                    delete newJudge.r2
                    delete newJudge.r3
                    return newJudge
                });
                localStorage.setItem("judges", s(importJudges));

                localStorage.setItem("judgeCounter", s(result.judges_counter));

                let roomCounter = 0;
                let importDraws = result.draws.map((draw: any) => {
                    let newDraw = {
                        ...draw,
                        roomsOne: draw.pairings_one.map((pairing: any) => {
                            let newRoom = {
                                ...pairing,
                                roomID: roomCounter++,
                                name: pairing.room
                            }
                            delete newRoom.room
                            return newRoom
                        }),
                        roomsTwo: draw.pairings_two.map((pairing: any) => {
                            let newRoom = {
                                ...pairing,
                                roomID: roomCounter++,
                                name: pairing.room
                            }
                            delete newRoom.room
                            return newRoom
                        })
                    }
                    delete newDraw.pairings_one
                    delete newDraw.pairings_two
                    return newDraw
                });
                localStorage.setItem("draws", s(importDraws));
                localStorage.setItem("roomCounter", s(roomCounter));

            // CURRENT EXPORTS
            } else {
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
                localStorage.setItem("roomCounter", s(result.roomCounter));
            }

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
                        <Tab.Pane eventKey="draw">
                            <Draws
                                config={this.state.config}
                                speakersOne={this.state.speakersOne}
                                speakersTwo={this.state.speakersTwo}
                                teamsOne={this.state.teamsOne}
                                teamsTwo={this.state.teamsTwo}
                                judges={this.state.judges}
                                draws={this.state.draws} />
                        </Tab.Pane>
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