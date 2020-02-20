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

                        <Tabs defaultActiveKey="home" id="app-nav">
                            <Tab eventKey="home" className="app-nav-tab" title="Home">
                                <Home />
                            </Tab>
                            <Tab eventKey="divone" className="app-nav-tab" title="Division One">
                                <Participants div="one" />
                            </Tab>
                            <Tab eventKey="divtwo" className="app-nav-tab" title="Division Two">
                                <Participants div="two" />
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
