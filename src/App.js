import React from 'react';
import './App.scss';
import logo from './images/logo.svg';

import localforage from 'localforage';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import Home from './home/Home';
import Participants from './participants/Participants';
import Judges from './judges/Judges';
import Draw from './draw/Draw';


console.log("localforage is", localforage);

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tournament_name: "",
            speakers_middle: [],
            speakers_high: [],
            teams_middle: [],
            teams_high: [],
            judges: []
        }

        // Initializing the database
        localforage.length().then(numKeys => {
            // First-time user
            if(numKeys === 0) {
                localforage.setItem("tournament-name", "New Tournament");
                localforage.setItem("speakers-middle", []);
                localforage.setItem("speakers-high", []);
                localforage.setItem("teams-middle", []);
                localforage.setItem("teams-high", []);
                localforage.setItem("judges", []);

                this.setState({tournament_name: "New Tournament"});
            
            // Returning user 
            } else {
                localforage.getItem("tournament-name").then(value => {
                    this.setState({tournament_name: value});
                });
                localforage.getItem("speakers-middle").then(value => {
                    this.setState({speakers_middle: value});
                });
                localforage.getItem("speakers-high").then(value => {
                    this.setState({speakers_high: value});
                });
                localforage.getItem("teams-middle").then(value => {
                    this.setState({teams_middle: value});
                });
                localforage.getItem("teams-high").then(value => {
                    this.setState({teams_high: value});
                });
                localforage.getItem("judges").then(value => {
                    this.setState({judges: value});
                });
            }            
        }).catch(err => {
            alert("Can't connect to the database. Please refresh. Error: ", err);
        });
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
