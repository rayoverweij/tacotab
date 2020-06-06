import React from 'react';
import './Round.scss';
import RoundRow from './RoundRow';
import { Config } from '../types/Config';
import { Speaker } from '../types/Speaker';
import { Team } from '../types/Team';
import { Judge } from '../types/Judge';
import { Draw } from '../types/Draw';
import { Room } from '../types/Room';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { Bullseye, ArrowRepeat, Trash, ArrowsAngleExpand, InfoCircle } from 'react-bootstrap-icons';


type RoundProps = {
    round: number,
    config: Config,
    speakersOne: Speaker[],
    speakersTwo: Speaker[],
    teamsOne: Team[],
    teamsTwo: Team[],
    judges: Judge[],
    draws: Draw[]
}

type RoundState = {
    generated: boolean,
    roomsOne: Room[],
    roomsTwo: Room[],
    fullScreen: boolean
}

class Round extends React.Component<RoundProps, RoundState> {
    constructor(props: RoundProps) {
        super(props);

        const pairings = this.props.draws[this.props.round - 1];

        this.state = {
            generated: pairings.generated,
            roomsOne: pairings.roomsOne,
            roomsTwo: pairings.roomsTwo,
            fullScreen: false
        }

        this.generateDraw = this.generateDraw.bind(this);
        this.deleteDraw = this.deleteDraw.bind(this);
        this.updateRooms = this.updateRooms.bind(this);
        this.fullScreenDraw = this.fullScreenDraw.bind(this);
        this.modalHide = this.modalHide.bind(this);
    }


    generateDraw() {
        const round = this.props.round;
        let draws = this.props.draws;

        // Check whether previous or next draws have happened
        if(round === 1) {
            if(draws[1].generated || draws[2].generated) {
                alert("You can't regenerate a draw after you've generated the next one.");
                return false;
            }
        } else if(round === 2) {
            if(!draws[0].generated) {
                alert("You can't generate the draw for round 2 before generating the draw for round 1.");
                return false;
            } else if(draws[2].generated) {
                alert("You can't regenerate a draw after you've generated the next one.");
                return false;
            }
        } else if(round === 3) {
            if(!draws[0].generated || !draws[1].generated) {
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
        let teamsOne = this.props.teamsOne;
        let teamsTwo = this.props.teamsTwo;
        let judges = this.props.judges;
        const len1 = teamsOne.length;
        const len2 = teamsTwo.length;

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
            alert(`There is an odd number of ${this.props.config.numDivisions === 2 ? `${this.props.config.divisionNames![0]} ` : ""}teams\u2014add or remove a team to generate the draw.`);
            return false;
        } else if(len2 % 2 !== 0) {
            alert(`There is an odd number of ${this.props.config.numDivisions === 2 ? `${this.props.config.divisionNames![1]} ` : ""}teams\u2014add or remove a team to generate the draw.`);
            return false;
        }

        // Select only the judges that are available this round
        let availableJudges: Judge[];
        if(round === 1) {
            availableJudges = judges.filter(el => el.atRound1 === true);
        } else if(round === 2) {
            availableJudges = judges.filter(el => el.atRound2 === true);
        } else {
            availableJudges = judges.filter(el => el.atRound3 === true);
        }

        // Split chairs and wings
        const chairs = availableJudges.filter(el => el.canChair === true);
        let wings = availableJudges.filter(el => el.canChair === false);

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
            wings.push(chairs.pop()!);
        }

        // Generate pairings
        let roomCounter = JSON.parse(localStorage.getItem("roomCounter")!);
        let roomsOne = [];
        let roomsTwo = [];
        let t1 = teamsOne.slice(0);
        let t2 = teamsTwo.slice(0);

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
            const roundOneRoomsOne = draws[0].roomsOne;
            const roundOneRoomsTwo = draws[0].roomsTwo;
            const propsOne = roundOneRoomsOne.map(r => r.prop);
            const propsTwo = roundOneRoomsTwo.map(r => r.opp);

            t1.forEach((team, index) => {
                let wasProp = false;
                if(propsOne.includes(team.teamID)) wasProp = true;

                if(index % 2 === 0 && wasProp) {
                    for(let i = index + 1; i < len1; i++) {
                        let iWasProp = false;
                        if(propsOne.includes(t1[i].teamID)) iWasProp = true;
                        if(!iWasProp) {
                            [t1[index], t1[i]] = [t1[i], t1[index]];
                            break;
                        }
                    }
                } else if(index % 2 === 1 && !wasProp) {
                    for(let i = index + 1; i < len1; i++) {
                        let iWasProp = false;
                        if(propsOne.includes(t1[i].teamID)) iWasProp = true;
                        if(iWasProp) {
                            [t1[index], t1[i]] = [t1[i], t1[index]];
                            break;
                        }
                    }
                }
            });
            t2.forEach((team, index) => {
                let wasProp = false;
                if(propsTwo.includes(team.teamID)) wasProp = true;

                if(index % 2 === 0 && wasProp) {
                    for(let i = index + 1; i < len2; i++) {
                        let iWasProp = false;
                        if(propsTwo.includes(t2[i].teamID)) iWasProp = true;
                        if(!iWasProp) {
                            [t2[index], t2[i]] = [t2[i], t2[index]];
                            break;
                        }
                    }
                } else if(index % 2 === 1 && !wasProp) {
                    for(let i = index + 1; i < len2; i++) {
                        let iWasProp = false;
                        if(propsTwo.includes(t2[i].teamID)) iWasProp = true;
                        if(iWasProp) {
                            [t2[index], t2[i]] = [t2[i], t2[index]];
                            break;
                        }
                    }
                }
            });
        }

        // Distribute teams and chairs
        let currPropID, currOppID, currChair, currChairID;
        for (let i = 0; i < len1; i += 2) {
            currPropID = t1[i].teamID;
            currOppID = t1[i + 1].teamID;

            currChair = chairs.pop()!;
            currChairID = currChair.judgeID;

            const newRoom: Room = {
                roomID: roomCounter++,
                name: "",
                prop: currPropID,
                opp: currOppID,
                chair: currChairID,
                wings: []
            }
            roomsOne[i / 2] = newRoom;
        }
        for (let i = 0; i < len2; i += 2) {
            currPropID = t2[i].teamID;
            currOppID = t2[i + 1].teamID;

            currChair = chairs.pop()!;
            currChairID = currChair.judgeID;

            const newRoom: Room = {
                roomID: roomCounter++,
                name: "",
                prop: currPropID,
                opp: currOppID,
                chair: currChairID,
                wings: []
            }
            roomsTwo[i / 2] = newRoom;
        }

        // Add wings
        while(wings.length > 0) {
            for (let i = 0; i < roomsOne.length; i++) {
                roomsOne[i].wings.push(wings.pop()!.judgeID);
                if(wings.length === 0) {
                    break;
                }
            }
            if(wings.length === 0) {
                break;
            }
            for (let i = 0; i < roomsTwo.length; i++) {
                roomsTwo[i].wings.push(wings.pop()!.judgeID);
                if(wings.length === 0) {
                    break;
                }
            }
        }

        // Randomize row order
        for (let i = roomsOne.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [roomsOne[i], roomsOne[j]] = [roomsOne[j], roomsOne[i]];
        }
        for (let i = roomsTwo.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [roomsTwo[i], roomsTwo[j]] = [roomsTwo[j], roomsTwo[i]];
        }

        // Save in storage
        const drawr: Draw = {
            generated: true,
            roomsOne: roomsOne,
            roomsTwo: roomsTwo
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
            const i = teamsOne.indexOf(team);
            teamsOne[i] = team;
        });
        localStorage.setItem("teamsOne", JSON.stringify(teamsOne));
        t2.forEach(team => {
            const i = teamsTwo.indexOf(team);
            teamsTwo[i] = team;
        });
        localStorage.setItem("teamsTwo", JSON.stringify(teamsTwo));

        // Update local state
        this.setState({roomsOne: roomsOne});
        this.setState({roomsTwo: roomsTwo});
        this.setState({generated: true});

        localStorage.setItem("roomCounter", JSON.stringify(roomCounter));
    }

    deleteDraw() {
        const round = this.props.round;
        let draws = this.props.draws;

        if(round === 1 && (draws[1].generated || draws[2].generated)) {
            alert("You can't delete a draw after you've generated the next one.");
            return false;
        } else if(round === 2 && draws[2].generated) {
            alert("You can't delete a draw after you've generated the next one.");
            return false;
        }

        let conf = window.confirm(`Are you sure you want to delete the draw for round ${round}?`);
        if(!conf) return false;

        const draw: Draw = {
            generated: false,
            roomsOne: [],
            roomsTwo: []
        }
        if(round === 1) {
            draws[0] = draw;
        } else if(round === 2) {
            draws[1] = draw;
        } else {
            draws[2] = draw;
        }
        localStorage.setItem("draws", JSON.stringify(draws));

        this.setState({roomsOne: []});
        this.setState({roomsTwo: []});
        this.setState({generated: false});
    }


    updateRooms(room: Room, div: number) {
        const draws = JSON.parse(localStorage.getItem("draws")!);
        let rooms;
        if(div === 1) {
            rooms = this.state.roomsOne;
        } else {
            rooms = this.state.roomsTwo;
        }

        const index = rooms.findIndex(r => r.roomID === room.roomID);
        rooms[index] = room;

        if(div === 1) {
            this.setState({roomsOne: rooms});
            draws[this.props.round - 1].roomsOne = rooms;
        } else {
            this.setState({roomsTwo: rooms});
            draws[this.props.round - 1].roomsTwo = rooms;
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
                    <h3>{this.props.config.numDivisions === 2 ? this.props.config.divisionNames![0] : "Draw"}</h3>
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
                                this.state.roomsOne.map((room, index) => {
                                    return <RoundRow 
                                            key={`one-room-${index}`}
                                            room={room}
                                            div={1}
                                            round={this.props.round}
                                            speakers={this.props.speakersOne}
                                            teams={this.props.teamsOne}
                                            judges={this.props.judges}
                                            draws={this.props.draws}
                                            updateRooms={this.updateRooms} />;
                                })
                            }
                        </tbody>
                    </Table>
                    
                    <h3>{this.props.config.numDivisions === 2 ? this.props.config.divisionNames![1] : ""}</h3>
                    <Table className={`table-no-top-margin ${this.props.config.numDivisions === 1 ? "hidden" : ""}`} hover striped>
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
                                this.state.roomsTwo.map((room, index) => {
                                    return <RoundRow 
                                            key={`two-room-${index}`}
                                            room={room}
                                            div={2}
                                            round={this.props.round}
                                            speakers={this.props.speakersTwo}
                                            teams={this.props.teamsTwo}
                                            judges={this.props.judges}
                                            draws={this.props.draws}
                                            updateRooms={this.updateRooms} />;
                                })
                            }
                        </tbody>
                    </Table>
                </div>
            );
        }

        return (
            <div>
                <h2>Round {this.props.round}</h2>
                <Row className="draw-header">
                    <Col>
                        <Button
                            onClick={this.generateDraw}
                            className={this.state.generated ? "hidden" : ""}>
                            <Bullseye className="btn-icon"/>
                            Generate draw
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={this.generateDraw}
                            className={!this.state.generated ? "hidden" : ""}>
                            <ArrowRepeat className="btn-icon" />
                            Regenerate draw
                        </Button>
                        <Button
                            variant="danger"
                            onClick={this.deleteDraw}
                            className={!this.state.generated ? "hidden" : ""}>
                            <Trash className="btn-icon" />
                            Delete draw
                        </Button>
                        <Button
                            variant="primary"
                            onClick={this.fullScreenDraw}
                            className={!this.state.generated ? "hidden" : ""}>
                            <ArrowsAngleExpand className="btn-icon" />
                            Display fullscreen
                        </Button>
                        <div className={`draw-legend ${!this.state.generated ? "hidden" : ""}`}>
                            <OverlayTrigger
                                trigger={["hover", "focus"]}
                                placement="bottom-start"
                                overlay={
                                    <Popover id="draw-legend-popover">
                                        <Popover.Content>
                                            Teams in <span className="orange">orange</span> have already debated each other before.<br />
                                            Chairs in <span className="orange">orange</span> have already chaired one of the teams in their room before.<br />
                                            Judges in <span className="red">red</span> clash with one of the teams in their room.<br />
                                            Note that these colors do not show up when the draw is displayed fullscreen.
                                        </Popover.Content>
                                    </Popover>
                                } 
                                rootClose>
                                <abbr title=""><p>
                                    <InfoCircle className="icon-info" />
                                    &nbsp;&nbsp;<span>Legend</span>
                                </p></abbr>
                            </OverlayTrigger>
                        </div>
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
                        <div className="draw-modal-table">
                            {tables}
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default Round;