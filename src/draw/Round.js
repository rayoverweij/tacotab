import React from 'react';
import './Round.scss';

import RoundRow from './RoundRow';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';


class Round extends React.Component {
    constructor(props) {
        super(props);

        const pairings = JSON.parse(localStorage.getItem("draws"))[this.props.r - 1];

        this.state = {
            generated: JSON.parse(localStorage.getItem("draws_generated"))[this.props.r - 1],
            pairings_one: pairings.pairings_one,
            pairings_two: pairings.pairings_two
        }

        this.generateDraw = this.generateDraw.bind(this);
        this.updatePairings = this.updatePairings.bind(this);
    }


    generateDraw() {
        // Check if regenerating
        if(this.state.generated) {
            const confGen = window.confirm("Do you really want to regenerate the draw?");
            if(!confGen) {
                return false;
            }
        }

        // Initialize values
        let draws_generated = JSON.parse(localStorage.getItem("draws_generated"));
        let draws = JSON.parse(localStorage.getItem("draws"));
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

        // Select only the judges that are available this round
        if(this.props.r === "1") {
            judges = judges.filter(el => el.r1 === true);
        } else if(this.props.r === "2") {
            judges = judges.filter(el => el.r2 === true);
        } else {
            judges = judges.filter(el => el.r3 === true);
        }

        // Split chairs and wings
        const chairs = judges.filter(el => el.canChair === true).map(el => el.judgeID);
        let wings = judges.filter(el => el.canChair === false).map(el => el.judgeID);

        // Check for an even number of teams
        if(len1 % 2 !== 0 && len2 % 2 !== 0) {
            alert("Both divisions have an odd number of teams. A team from one division debating a team from the other division is not currently supported. Please add or remove a team to/from both in order to continue.")
            return false;
        } else if(len1 % 2 !== 0) {
            alert("There is an odd number of division one teams\u2014add or remove a team to generate the draw.");
            return false;
        } else if(len2 % 2 !== 0) {
            alert("There is an odd number of division two teams\u2014add or remove a team to generate the draw.");
            return false;
        }

        // Check whether previous draws have happened
        if(this.props.r === "2") {
            if(draws_generated[0] !== true) {
                alert("You can't generate the draw for round 2 before generating the draw for round 1.");
                return false;
            }
        } else if(this.props.r === "3") {
            if(draws_generated[0] !== true || draws_generated[1] !== true) {
                alert("You can't generate the draw for round 3 before generating the draws for rounds 1 and 2.");
                return false;
            }
        }

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

        if(this.props.r === "1") {
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
        if(this.props.r === "2") {
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

        // Distribute teams and chairs
        let currProp, currOpp;
        for (let i = 0; i < len1; i += 2) {
            if(this.props.r === "1") {
                t1[i].sideR1 = "prop";
                t1[i + 1].sideR1 = "opp";
            }

            currProp = t1[i].teamID;
            currOpp = t1[i + 1].teamID;
            let currChair = chairs.pop();
            pairings_one[i / 2] = {
                prop: currProp,
                opp: currOpp,
                chair: currChair,
                wings: [],
                room: "[room]"
            }
        }
        for (let i = 0; i < len2; i += 2) {
            if(this.props.r === "1") {
                t2[i].sideR1 = "prop";
                t2[i + 1].sideR1 = "opp";
            }

            currProp = t2[i].teamID;
            currOpp = t2[i + 1].teamID;
            let currChair = chairs.pop();
            pairings_two[i / 2] = {
                prop: currProp,
                opp: currOpp,
                chair: currChair,
                wings: [],
                room: "[room]"
            }
        }

        // Add wings
        while(wings.length > 0) {
            for (let i = 0; i < pairings_one.length; i++) {
                pairings_one[i].wings.push(wings.pop());
                if(wings.length === 0) {
                    break;
                }
            }
            if(wings.length === 0) {
                break;
            }
            for (let i = 0; i < pairings_two.length; i++) {
                pairings_two[i].wings.push(wings.pop());
                if(wings.length === 0) {
                    break;
                }
            }
        }

        // Randomize rows
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
            pairings_one: pairings_one,
            pairings_two: pairings_two
        }
        if(this.props.r === "1") {
            draws[0] = drawr;
        } else if(this.props.r === "2") {
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

        this.setState({pairings_one: pairings_one});
        this.setState({pairings_two: pairings_two});

        draws_generated[this.props.r - 1] = true;
        localStorage.setItem("draws_generated", JSON.stringify(draws_generated));
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
            draws[this.props.r - 1].pairings_one = pairings;
        } else {
            this.setState({pairings_two: pairings});
            draws[this.props.r - 1].pairings_two = pairings;
        }
        localStorage.setItem("draws", JSON.stringify(draws));
    }


    render() {
        let tables;
        if(!this.state.generated) {
            tables = <div className="draw-placeholder"></div>;
        } else {
            tables = (
                <div>
                    <h3>{this.props.config.divisions === "2" ? this.props.config.divisionNames[0] : "Draw"}</h3>
                    <Table className="table-no-top-margin draw-table-one" hover>
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
                                            round={this.props.r}
                                            updatePairings={this.updatePairings} />;
                                })
                            }
                        </tbody>
                    </Table>
                    
                    <h3>{this.props.config.divisions === "2" ? this.props.config.divisionNames[1] : ""}</h3>
                    <Table className={`table-no-top-margin ${this.props.config.divisions === "1" ? "hidden" : ""}`} hover>
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
                                            div="two" />;
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
                        <h2>Round {this.props.r}</h2>
                        <Button
                            onClick={this.generateDraw}
                            className={this.state.generated && "hidden"}>
                            Generate draw
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={this.generateDraw}
                            className={!this.state.generated && "hidden"}>
                            Regenerate draw
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col md={9} className="table-col">
                        {tables}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Round;