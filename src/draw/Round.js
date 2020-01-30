import React from 'react';
import './Round.scss';

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
    }


    generateDraw() {
        let draws_generated = JSON.parse(localStorage.getItem("draws_generated"));
        let draws = JSON.parse(localStorage.getItem("draws"));
        const teams_middle = JSON.parse(localStorage.getItem("teams_middle"));
        const teams_high = JSON.parse(localStorage.getItem("teams_high"));
        let judges = JSON.parse(localStorage.getItem("judges"));

        // Select only the judges that are available this round
        if(this.props.r === "1") {
            judges = judges.filter(el => el.r1 === true);
        } else if(this.props.r === "2") {
            judges = judges.filter(el => el.r2 === true);
        } else {
            judges = judges.filter(el => el.r3 === true);
        }

        // Split chairs and wings
        const chairs = judges.filter(el => el.canChair === true);
        let wings = judges.filter(el => el.canChair === false);

        // Check for an even number of teams
        if(teams_middle.length % 2 !== 0 && teams_high.length % 2 !== 0) {
            const confMix = window.confirm("Both brackets have an odd number of teams. This means that one middle school team would debate one high school team. Do you want to continue under these circumstances?");
            if(!confMix) {
                return;
            } else {
                alert("This scenario hasn't been implemented yet, sorry.");
                return;
            }
        } else if(teams_middle.length % 2 !== 0) {
            alert("There is an odd number of middle school teams\u2014add or remove a team to generate the draw.");
            return;
        } else if(teams_high.length % 2 !== 0) {
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
        const totalTeams = teams_middle.length + teams_high.length;
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

        if(this.props.r === "1") {
            // Distribute teams and chairs
            for (let i = 0; i < teams_middle.length; i += 2) {
                pairings_middle[i / 2] = {
                    prop: teams_middle[i],
                    opp: teams_middle[i + 1],
                    chair: chairs[i / 2],
                    wings: []
                }
                chairs[i / 2].hasJudged.push(teams_middle[i], teams_middle[i + 1]);
            }
            for (let i = 0; i < teams_high.length; i += 2) {
                const chairPosition = teams_middle.length / 2 + i / 2;
                pairings_high[i / 2] = {
                    prop: teams_high[i],
                    opp: teams_high[i + 1],
                    chair: chairs[chairPosition],
                    wings: []
                }
                chairs[chairPosition].hasJudged.push(teams_high[i], teams_high[i + 1]);
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
            const draw1 = {
                pairings_middle: pairings_middle,
                pairings_high: pairings_high
            }
            draws[0] = draw1;
            localStorage.setItem("draws", JSON.stringify(draws));
        }

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


    render() {
        let tables;
        if(!this.state.generated) {
            tables = <div></div>;
        } else {
            tables = (
                <div>
                    <h3>Middle School</h3>
                    <Table className="draw-table" hover>
                        <thead>
                            <tr>
                                <th className="draw-table-team-cell">Proposition</th>
                                <th className="draw-table-team-cell">Opposition</th>
                                <th>Judges</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.pairings_middle.map((pair, index) => {
                                    return (
                                        <tr key={`middle-pair-${index}`}>
                                            <td className="draw-table-team-cell">{pair.prop.teamName}</td>
                                            <td className="draw-table-team-cell">{pair.opp.teamName}</td>
                                            <td>{pair.chair.name}&copy;{pair.wings.map(el => ", " + el.name)}</td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </Table>
                    
                    <h3>High School</h3>
                    <Table className="draw-table" hover>
                        <thead>
                            <tr>
                                <th className="draw-table-team-cell">Proposition</th>
                                <th className="draw-table-team-cell">Opposition</th>
                                <th>Judges</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.pairings_high.map((pair, index) => {
                                    return (
                                        <tr key={`high-pair-${index}`}>
                                            <td className="draw-table-team-cell">{pair.prop.teamName}</td>
                                            <td className="draw-table-team-cell">{pair.opp.teamName}</td>
                                            <td>{pair.chair.name}&copy;{pair.wings.map(el => ", " + el.name)}</td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </Table>
                </div>
            );
        }

        return (
            <div>
                <Row>
                    <Col>
                        <h2>Round {this.props.r}</h2>
                        <Button
                            onClick={this.generateDraw}
                            className={this.state.generated && "hidden"}>
                            Generate draw
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col md={8} className="table-col">
                        {tables}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Round;