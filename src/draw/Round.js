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
            pairings_middle: pairings.pairings_middle,
            pairings_high: pairings.pairings_high
        }

        this.generateDraw = this.generateDraw.bind(this);
        this.updatePairings = this.updatePairings.bind(this);
    }


    generateDraw() {
        // Check if regenerating
        if(this.state.generated) {
            const confGen = window.confirm("Do you really want to regenerate the draw?");
            if(!confGen) {
                return;
            }
        }

        // Initialize values
        let draws_generated = JSON.parse(localStorage.getItem("draws_generated"));
        let draws = JSON.parse(localStorage.getItem("draws"));
        const teams_middle = JSON.parse(localStorage.getItem("teams_middle"));
        const teams_high = JSON.parse(localStorage.getItem("teams_high"));
        let judges = JSON.parse(localStorage.getItem("judges"));

        const lenM = teams_middle.length;
        const lenH = teams_high.length;

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
        if(lenM % 2 !== 0 && lenH % 2 !== 0) {
            const confMix = window.confirm("Both brackets have an odd number of teams. This means that one middle school team would debate one high school team. Do you want to continue under these circumstances?");
            if(!confMix) {
                return;
            } else {
                alert("This scenario hasn't been implemented yet, sorry.");
                return;
            }
        } else if(lenM % 2 !== 0) {
            alert("There is an odd number of middle school teams\u2014add or remove a team to generate the draw.");
            return;
        } else if(lenH % 2 !== 0) {
            alert("There is an odd number of high school teams\u2014add or remove a team to generate the draw.");
            return;
        }

        // Check whether previous draws have happened
        if(this.props.r === "2") {
            if(draws_generated[0] !== true) {
                alert("You can't generate the draw for round 2 before generating the draw for round 1.");
                return;
            }
        } else if(this.props.r === "3") {
            if(draws_generated[0] !== true || draws_generated[1] !== true) {
                alert("You can't generate the draw for round 3 before generating the draw for rounds 1 and 2.");
                return;
            }
        }

        // Check whether there are enough chairs
        const totalTeams = lenM + lenH;
        if(chairs.length < totalTeams / 2) {
            alert("There are not enough chairs to adjudicate every room. Please add some more.");
            return;
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
        let pairings_middle = [];
        let pairings_high = [];
        let tm = [];
        let th = [];

        if(this.props.r === "1") {
            // Generate lists of team IDs in random order
            tm = teams_middle.map(el => el.teamID);
            for (let i = lenM - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [tm[i], tm[j]] = [tm[j], tm[i]];
            }
            th = teams_high.map(el => el.teamID);
            for (let i = lenH - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [th[i], th[j]] = [th[j], th[i]];
            }
        } else {
            // Generate lists of team IDs in order of total team points
            tm = teams_middle
                .sort((a, b) => (a.totalPoints < b.totalPoints) ? 1 : -1)
                .map(el => el.teamID);
            th = teams_high
                .sort((a, b) => (a.totalPoints < b.totalPoints) ? 1 : -1)
                .map(el => el.teamID);
        }

        // Distribute teams and chairs
        let currProp, currOpp, chIndex;
        for (let i = 0; i < lenM; i += 2) {
            currProp = tm[i];
            currOpp = tm[i + 1];
            let currChair = chairs.pop();
            pairings_middle[i / 2] = {
                prop: currProp,
                opp: currOpp,
                chair: currChair,
                wings: [],
                room: "[room]"
            }

            chIndex = judges.findIndex(el => {
                return el.judgeID.toString() === currChair.toString()
            });
            judges[chIndex].hasChaired.push(currProp, currOpp);
        }
        for (let i = 0; i < lenH; i += 2) {
            currProp = th[i];
            currOpp = th[i + 1];
            let currChair = chairs.pop();
            pairings_high[i / 2] = {
                prop: currProp,
                opp: currOpp,
                chair: currChair,
                wings: [],
                room: "[room]"
            }

            chIndex = judges.findIndex(el => {
                return el.judgeID.toString() === currChair.toString()
            });
            judges[chIndex].hasChaired.push(currProp, currOpp);
        }

        // Add wings
        while(wings.length > 0) {
            for (let i = 0; i < pairings_middle.length; i++) {
                pairings_middle[i].wings.push(wings.pop());
                if(wings.length === 0) {
                    break;
                }
            }
            if(wings.length === 0) {
                break;
            }
            for (let i = 0; i < pairings_high.length; i++) {
                pairings_high[i].wings.push(wings.pop());
                if(wings.length === 0) {
                    break;
                }
            }
        }

        // Save in storage
        const drawr = {
            pairings_middle: pairings_middle,
            pairings_high: pairings_high
        }
        if(this.props.r === "1") {
            draws[0] = drawr;
        } else if(this.props.r === "2") {
            draws[1] = drawr;
        } else {
            draws[2] = drawr;
        }
        localStorage.setItem("draws", JSON.stringify(draws));
        
        // Update chair values
        chairs.forEach(chair => {
            const j = judges.indexOf(chair);
            judges[j] = chair;
        });
        localStorage.setItem("judges", JSON.stringify(judges));

        this.setState({pairings_middle: pairings_middle});
        this.setState({pairings_high: pairings_high});

        draws_generated[this.props.r - 1] = true;
        localStorage.setItem("draws_generated", JSON.stringify(draws_generated));
        this.setState({generated: true});
    }

    updatePairings(pair, bracket, round) {
        const draws = JSON.parse(localStorage.getItem("draws"));
        let pairings;
        if(bracket === "middle") {
            pairings = this.state.pairings_middle;
        } else {
            pairings = this.state.pairings_high;
        }

        const index = pairings.indexOf(pair);
        pairings[index] = pair;

        if(bracket === "middle") {
            this.setState({pairings_middle: pairings});
            draws[this.props.r - 1].pairings_middle = pairings;
        } else {
            this.setState({pairings_high: pairings});
            draws[this.props.r - 1].pairings_high = pairings;
        }
        localStorage.setItem("draws", JSON.stringify(draws));
    }


    render() {
        let tables;
        if(!this.state.generated) {
            tables = <div></div>;
        } else {
            tables = (
                <div>
                    <h3>Middle School</h3>
                    <Table className="table-no-top-margin draw-table-middle" hover>
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
                                this.state.pairings_middle.map((pair, index) => {
                                    return <RoundRow 
                                            key={`middle-pair-${index}`}
                                            pair={pair}
                                            bracket="middle"
                                            round={this.props.r}
                                            updatePairings={this.updatePairings} />;
                                })
                            }
                        </tbody>
                    </Table>
                    
                    <h3>High School</h3>
                    <Table className="table-no-top-margin" hover>
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
                                this.state.pairings_high.map((pair, index) => {
                                    return <RoundRow 
                                            key={`high-pair-${index}`}
                                            pair={pair}
                                            bracket="high" />;
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