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

        if(!localStorage.getItem("tournament_name")) {
            localStorage.setItem("tournament_name", s("New tournament"));
        }
        if(!localStorage.getItem("speakers_middle")) {
            localStorage.setItem("speakers_middle", s([]));
        }
        if(!localStorage.getItem("speakers_middle_counter")) {
            localStorage.setItem("speakers_middle_counter", 0);
        }
        if(!localStorage.getItem("teams_middle")) {
            localStorage.setItem("teams_middle", s([]));
        }
        if(!localStorage.getItem("teams_middle_counter")) {
            localStorage.setItem("teams_middle_counter", 0);
        }
        if(!localStorage.getItem("speakers_high")) {
            localStorage.setItem("speakers_high", s([]));
        }
        if(!localStorage.getItem("speakers_high_counter")) {
            localStorage.setItem("speakers_high_counter", 0);
        }
        if(!localStorage.getItem("teams_high")) {
            localStorage.setItem("teams_high", s([]));
        }
        if(!localStorage.getItem("teams_high_counter")) {
            localStorage.setItem("teams_high_counter", 0);
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
                {pairings_middle: [], pairings_high: []},
                {pairings_middle: [], pairings_high: []},
                {pairings_middle: [], pairings_high: []}
            ]));
        }

        document.title = `${JSON.parse(localStorage.getItem("tournament_name"))} - TacoTab`;
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

                        <Tabs defaultActiveKey="draw" id="app-nav">
                            <Tab eventKey="home" className="app-nav-tab" title="Home">
                                <Home />
                            </Tab>
                            <Tab eventKey="middleschool" className="app-nav-tab" title="Middle School">
                                <Participants bracket="middle" />
                            </Tab>
                            <Tab eventKey="highschool" className="app-nav-tab" title="High School">
                                <Participants bracket="high" />
                            </Tab>
                            <Tab eventKey="judges" className="app-nav-tab" title="Judges">
                                <Judges />
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
