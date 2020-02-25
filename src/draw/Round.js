import React from 'react';
import './Round.scss';
import { ReactComponent as IconGenerate } from '../images/icon-bullseye.svg';
import { ReactComponent as IconRegen } from '../images/icon-regen.svg';
import { ReactComponent as IconFullScreen } from '../images/icon-fullscreen.svg';

import RoundRow from './RoundRow';
import Room from '../structures/room';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';


class Round extends React.Component {
    constructor(props) {
        super(props);

        const pairings = this.props.draws[this.props.round - 1];

        this.state = {
            generated: pairings.generated,
            pairings_one: pairings.pairings_one,
            pairings_two: pairings.pairings_two,
            fullScreen: false
        }

        this.generateDraw = this.generateDraw.bind(this);
        this.updatePairings = this.updatePairings.bind(this);
        this.fullScreenDraw = this.fullScreenDraw.bind(this);
        this.modalHide = this.modalHide.bind(this);
    }


    generateDraw() {
        const round = this.props.round;
        let draws = this.props.draws;

        // Check whether previous or next draws have happened
        if(round === 1) {
            if(draws[1].generated === true || draws[2].generated === true) {
                alert("You can't regenerate a draw after you've generated the next one.");
                return false;
            }
        } else if(round === 2) {
            if(draws[0].generated !== true) {
                alert("You can't generate the draw for round 2 before generating the draw for round 1.");
                return false;
            } else if(draws[2].generated === true) {
                alert("You can't regenerate a draw after you've generated the next one.");
                return false;
            }
        } else if(round === 3) {
            if(draws[0].generated !== true || draws[1].generated !== true) {
                alert("You can't generate the draw for round 3 before generating the draws for rounds 1 and 2.");
                return false;
            }
        }

        // Check if regenerating
        if(this.state.generated) {
            const confGen = window.confirm("Do you really want to regenerate the draw?");
            if(!confGen) {
                return false;
            }
        }

        // Initialize values
        let teams_one = this.props.teams_one;
        let teams_two = this.props.teams_two;
        let judges = this.props.judges;
        const len1 = teams_one.length;
        const len2 = teams_two.length;

        // Don't run the draw if division one has no teams
        if(len1 === 0) {
            alert("Add some teams to generate the draw.");
            return;
        }

        // Check for an even number of teams
        if(len1 % 2 !== 0 && len2 % 2 !== 0) {
            alert("Both divisions have an odd number of teams. A team from one division debating a team from the other division is not currently supported. Please add or remove a team to/from both in order to continue.")
            return false;
        } else if(len1 % 2 !== 0) {
            alert(`There is an odd number of ${this.props.config.divisions === "2" ? `${this.props.config.divisionNames[0]} ` : ""}teams\u2014add or remove a team to generate the draw.`);
            return false;
        } else if(len2 % 2 !== 0) {
            alert(`There is an odd number of ${this.props.config.divisions === "2" ? `${this.props.config.divisionNames[1]} ` : ""}teams\u2014add or remove a team to generate the draw.`);
            return false;
        }

        // Select only the judges that are available this round
        if(round === 1) {
            judges = judges.filter(el => el.r1 === true);
        } else if(round === 2) {
            judges = judges.filter(el => el.r2 === true);
        } else {
            judges = judges.filter(el => el.r3 === true);
        }

        // Split chairs and wings
        const chairs = judges.filter(el => el.canChair === true);
        let wings = judges.filter(el => el.canChair === false);

        // Check whether there are enough chairs
        const totalTeams = len1 + len2;
        if(chairs.length < totalTeams / 2) {
            alert("There are not enough chairs to adjudicate every room. Please add some more.");
            return false;
        }

        // Shuffle chairs for random picking
        for (let i = chairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [chairs[i], chairs[j]] = [chairs[j], chairs[i]];
        }

        // Select chairs and put the rest as wings
        while(chairs.length > totalTeams / 2) {
            wings.push(chairs.pop());
        }

        // Generate pairings
        let pairings_one = [];
        let pairings_two = [];
        let t1 = teams_one.slice(0);
        let t2 = teams_two.slice(0);

        if(round === 1) {
            // Generate lists of teams in random order
            for (let i = len1 - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [t1[i], t1[j]] = [t1[j], t1[i]];
            }
            for (let i = len2 - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [t2[i], t2[j]] = [t2[j], t2[i]];
            }
        } else {
            // Generate lists of teams in order of team wins, then total team points
            t1.sort((a, b) => {
                if(a.totalWins < b.totalWins) {
                    return 1;
                } else if(a.totalWins > b.totalWins) {
                    return -1;
                } else {
                    if(a.totalPoints < b.totalPoints) {
                        return 1;
                    } else if(a.totalPoints > b.totalPoints) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
            });
            t2.sort((a, b) => {
                if(a.totalWins < b.totalWins) {
                    return 1;
                } else if(a.totalWins > b.totalWins) {
                    return -1;
                } else {
                    if(a.totalPoints < b.totalPoints) {
                        return 1;
                    } else if(a.totalPoints > b.totalPoints) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
            });
        }

        // For round 2, make sure everyone is on another side
        if(round === 2) {
            t1.forEach((team, index) => {
                if(index % 2 === 0 && team.sideR1 === "prop") {
                    for(let i = index + 1; i < len1; i++) {
                        if(t1[i].sideR1 === "opp") {
                            [t1[index], t1[i]] = [t1[i], t1[index]];
                            break;
                        }
                    }
                } else if(index % 2 === 1 && team.sideR1 === "opp") {
                    for(let i = index + 1; i < len1; i++) {
                        if(t1[i].sideR1 === "prop") {
                            [t1[index], t1[i]] = [t1[i], t1[index]];
                            break;
                        }
                    }
                }
            });
            t2.forEach((team, index) => {
                if(index % 2 === 0 && team.sideR1 === "prop") {
                    for(let i = index + 1; i < len2; i++) {
                        if(t2[i].sideR1 === "opp") {
                            [t2[index], t2[i]] = [t2[i], t2[index]];
                            break;
                        }
                    }
                } else if(index % 2 === 1 && team.sideR1 === "opp") {
                    for(let i = index + 1; i < len2; i++) {
                        if(t2[i].sideR1 === "prop") {
                            [t2[index], t2[i]] = [t2[i], t2[index]];
                            break;
                        }
                    }
                }
            });
        }

        // For round 3, make sure teams don't get the same opponent
        if(round === 3) {
            for(let i = 0; i < t1.length; i += 2) {
                console.log(t1[i].opponents[1]);
                if(t1[i].opponents[1] === t1[i + 1].teamID) {
                    [t1[i], t1[i - 1]] = [t1[i - 1], t1[i]];
                    break;
                }
            }
            for(let i = 1; i < t2.length; i += 2) {
                if(t2[i].opponents[1] === t2[i + 1].teamID) {
                    [t2[i], t2[i - 1]] = [t2[i - 1], t2[i]];
                    break;
                }
            }
        }

        // Distribute teams and chairs
        let currProp, currOpp, currChair;
        for (let i = 0; i < len1; i += 2) {
            if(round === 1) {
                t1[i].sideR1 = "prop";
                t1[i + 1].sideR1 = "opp";
            }

            currProp = t1[i].teamID;
            currOpp = t1[i + 1].teamID;

            t1[i].opponents[round - 1] = currOpp;
            t1[i + 1].opponents[round - 1] = currProp;

            currChair = chairs.pop().judgeID;
            pairings_one[i / 2] = new Room(currProp, currOpp, currChair, []);
        }
        for (let i = 0; i < len2; i += 2) {
            if(round === 1) {
                t2[i].sideR1 = "prop";
                t2[i + 1].sideR1 = "opp";
            }

            currProp = t2[i].teamID;
            currOpp = t2[i + 1].teamID;

            t1[i].opponents[round - 1] = currOpp;
            t1[i + 1].opponents[round - 1] = currProp;

            currChair = chairs.pop().judgeID;
            pairings_two[i / 2] = new Room(currProp, currOpp, currChair, []);
        }

        // Add wings
        while(wings.length > 0) {
            for (let i = 0; i < pairings_one.length; i++) {
                pairings_one[i].wings.push(wings.pop().judgeID);
                if(wings.length === 0) {
                    break;
                }
            }
            if(wings.length === 0) {
                break;
            }
            for (let i = 0; i < pairings_two.length; i++) {
                pairings_two[i].wings.push(wings.pop().judgeID);
                if(wings.length === 0) {
                    break;
                }
            }
        }

        // Randomize row order
        for (let i = pairings_one.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pairings_one[i], pairings_one[j]] = [pairings_one[j], pairings_one[i]];
        }
        for (let i = pairings_two.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pairings_two[i], pairings_two[j]] = [pairings_two[j], pairings_two[i]];
        }

        // Save in storage
        const drawr = {
            generated: true,
            pairings_one: pairings_one,
            pairings_two: pairings_two
        }
        if(round === 1) {
            draws[0] = drawr;
        } else if(round === 2) {
            draws[1] = drawr;
        } else {
            draws[2] = drawr;
        }
        localStorage.setItem("draws", JSON.stringify(draws));

        // Update team values
        t1.forEach(team => {
            const i = teams_one.indexOf(team);
            teams_one[i] = team;
        });
        localStorage.setItem("teams_one", JSON.stringify(teams_one));
        t2.forEach(team => {
            const i = teams_two.indexOf(team);
            teams_two[i] = team;
        });
        localStorage.setItem("teams_two", JSON.stringify(teams_two));

        // Update chair values
        chairs.forEach(chair => {
            const j = judges.indexOf(chair);
            judges[j] = chair;
        });
        localStorage.setItem("judges", JSON.stringify(judges));

        // Update local state
        this.setState({pairings_one: pairings_one});
        this.setState({pairings_two: pairings_two});
        this.setState({generated: true});
    }


    updatePairings(pair, div) {
        const draws = JSON.parse(localStorage.getItem("draws"));
        let pairings;
        if(div === "one") {
            pairings = this.state.pairings_one;
        } else {
            pairings = this.state.pairings_two;
        }

        const index = pairings.indexOf(pair);
        pairings[index] = pair;

        if(div === "one") {
            this.setState({pairings_one: pairings});
            draws[this.props.round - 1].pairings_one = pairings;
        } else {
            this.setState({pairings_two: pairings});
            draws[this.props.round - 1].pairings_two = pairings;
        }
        localStorage.setItem("draws", JSON.stringify(draws));
    }


    fullScreenDraw() {
        this.setState({fullScreen: true});
        document.documentElement.requestFullscreen();
    }

    modalHide() {
        this.setState({fullScreen: false});
        if(document.fullscreenElement !== null) {
            document.exitFullscreen();
        }
    }


    render() {
        let tables;
        if(!this.state.generated) {
            tables = <div className="draw-placeholder"></div>;
        } else {
            tables = (
                <div>
                    <h3>{this.props.config.divisions === "2" ? this.props.config.divisionNames[0] : "Draw"}</h3>
                    <Table className="table-no-top-margin draw-table-one" hover striped>
                        <thead>
                            <tr>
                                <th>Room</th>
                                <th className="draw-table-team-cell">Proposition</th>
                                <th className="draw-table-team-cell">Opposition</th>
                                <th>Judges</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.pairings_one.map((pair, index) => {
                                    return <RoundRow 
                                            key={`one-pair-${index}`}
                                            pair={pair}
                                            div="one"
                                            round={this.props.round}
                                            speakers={this.props.speakers_one}
                                            teams={this.props.teams_one}
                                            judges={this.props.judges}
                                            draws={this.props.draws[this.props.round - 1]}
                                            updatePairings={this.updatePairings} />;
                                })
                            }
                        </tbody>
                    </Table>
                    
                    <h3>{this.props.config.divisions === "2" ? this.props.config.divisionNames[1] : ""}</h3>
                    <Table className={`table-no-top-margin ${this.props.config.divisions === "1" ? "hidden" : ""}`} hover striped>
                        <thead>
                            <tr>
                                <th>Room</th>
                                <th className="draw-table-team-cell">Proposition</th>
                                <th className="draw-table-team-cell">Opposition</th>
                                <th>Judges</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.pairings_two.map((pair, index) => {
                                    return <RoundRow 
                                            key={`two-pair-${index}`}
                                            pair={pair}
                                            div="two"
                                            round={this.props.round}
                                            speakers={this.props.speakers_two}
                                            teams={this.props.teams_two}
                                            judges={this.props.judges}
                                            draws={this.props.draws[this.props.round - 1]}
                                            updatePairings={this.updatePairings} />;
                                })
                            }
                        </tbody>
                    </Table>
                </div>
            );
        }

        return (
            <div>
                <Row className="draw-header">
                    <Col>
                        <h2>Round {this.props.round}</h2>
                        <Button
                            onClick={this.generateDraw}
                            className={this.state.generated && "hidden"}>
                            <IconGenerate className="btn-icon" alt="Icon of a bullseye" />
                            Generate draw
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={this.generateDraw}
                            className={!this.state.generated && "hidden"}>
                            <IconRegen className="btn-icon" alt="Icon of a circular arrow" />
                            Regenerate draw
                        </Button>
                        <Button
                            variant="primary"
                            onClick={this.fullScreenDraw}
                            className={!this.state.generated && "hidden"}>
                            <IconFullScreen className="btn-icon" alt="Icon of arrows pointing away from each other" />
                            Display fullscreen
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col lg={10} xl={9} className="table-col">
                        {tables}
                    </Col>
                </Row>

                <Modal
                    show={this.state.fullScreen}
                    onHide={this.modalHide}
                    backdrop="static"
                    size="xl"
                    className="draw-modal"
                    dialogClassName="draw-modal-dialog"
                    backdropClassName="draw-modal-backdrop">
                    <Modal.Header closeButton>
                        Draw Round {this.props.round}
                    </Modal.Header>
                    <Modal.Body>
                        {tables}
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default Round;