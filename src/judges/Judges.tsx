import React, { ChangeEvent, FormEvent } from 'react';
import './Judges.scss';
import JudgeRow from './JudgeRow';
import { Judge } from '../types/Judge';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { AwardFill, TrashFill } from 'react-bootstrap-icons';


type JudgesProps = {
    judges: Judge[],
    updateJudges: (judges: Judge[]) => void,
    getTotalTeams: () => number
}

type JudgesState = {
    addJudgeForm: {
        judgeName: string,
        school: string,
        [key: string]: string
    }
}

class Judges extends React.Component<JudgesProps, JudgesState> {
    constructor(props: JudgesProps) {
        super(props);

        this.state = {
            addJudgeForm: {
                judgeName: "",
                school: ""
            }
        }

        this.handleAddJudgeFormChange = this.handleAddJudgeFormChange.bind(this);
        this.handleAddJudgeFormSubmit = this.handleAddJudgeFormSubmit.bind(this);
        this.updateJudge = this.updateJudge.bind(this);
        this.deleteJudge = this.deleteJudge.bind(this);
    }


    handleAddJudgeFormChange(event: ChangeEvent<HTMLInputElement>) {
        const {name, value} = event.target;
        let judgeAddFormState = {...this.state.addJudgeForm};
        judgeAddFormState[name] = value;
        this.setState({addJudgeForm: judgeAddFormState});
    }

    handleAddJudgeFormSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        let judges = this.props.judges;
        let counter = JSON.parse(localStorage.getItem("judgeCounter")!);

        const newJudge: Judge = {
            judgeID: counter++,
            name: this.state.addJudgeForm.judgeName,
            school: this.state.addJudgeForm.school,
            canChair: false,
            atRound1: true, atRound2: true, atRound3: true,
            hasChaired: []
        }
        judges.push(newJudge);

        this.props.updateJudges(judges);
        localStorage.setItem("judgeCounter", JSON.stringify(counter));

        let blankForm = {...this.state.addJudgeForm};
        blankForm.name = "";
        this.setState({addJudgeForm: blankForm});
    }

    updateJudge(judge: Judge) {
        let judges = this.props.judges;

        const index = judges.indexOf(judge);
        judges[index] = judge;

        this.props.updateJudges(judges);
    }

    deleteJudge(judge: Judge) {
        const draws = JSON.parse(localStorage.getItem("draws")!);
        
        // Check if the judge has already been part of a round
        let inRound = false;
        for (const round of draws) {
            for(const pair of round.roomsOne) {
                if(pair.chair === judge.judgeID || pair.wings.includes(judge.judgeID)) {
                    inRound = true;
                }
            }
            for(const pair of round.roomsTwo) {
                if(pair.chair === judge.judgeID || pair.wings.includes(judge.judgeID)) {
                    inRound = true;
                }
            }
        }
        if(inRound) {
            alert("This judge has already taken part in a round. You can't delete them anymore. You can still change their availability for each round.");
            return false;
        }

        // Confirm deletion
        const conf = window.confirm(`Are you sure you want to delete judge ${judge.name}?`);
        if(conf) {
            let judges = this.props.judges;

            const index = judges.indexOf(judge);
            judges.splice(index, 1);

            this.props.updateJudges(judges);
        }
    }


    render() {
        const judges = this.props.judges;

        let table;
        if(this.props.judges.length !== 0) {
            table = (
                <Table className="judge-table table-no-top-margin" hover bordered>
                    <thead>
                        <tr>
                            <th className="judge-table-name">Name</th>
                            <th>School</th>
                            <th className="judge-table-toggle">Chair?</th>
                            <th className="judge-table-toggle">Round 1?</th>
                            <th className="judge-table-toggle">Round 2?</th>
                            <th className="judge-table-toggle">Round 3?</th>
                            <th className="table-delete">
                                <TrashFill className="icon" />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.judges.map(judge => {
                            return (
                                <JudgeRow
                                    key={`judge-row-${judge.name}`}
                                    judge={judge}
                                    updateJudge={this.updateJudge}
                                    deleteJudge={this.deleteJudge} />
                            );
                        })}
                    </tbody>
                </Table>
            );
        }

        const totalRooms = Math.round(this.props.getTotalTeams() / 2);
        const chairsR1 = judges.filter(el => el.canChair && el.atRound1).length;
        const chairsR2 = judges.filter(el => el.canChair && el.atRound2).length;
        const chairsR3 = judges.filter(el => el.canChair && el.atRound3).length;

        return (
            <Tab.Container id={`judges-view`} defaultActiveKey="judges">
                <Row>
                    <Col md={3} lg={2}>
                        <Nav variant="pills" className="no-show-sm">
                            <Nav.Item>
                                <Nav.Link eventKey="judges" className="sub-nav-link">
                                    <AwardFill className="btn-icon" />
                                    Judges
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col md={9} lg={10}>
                        <Tab.Content>
                            <Tab.Pane eventKey="judges">
                                <Row>
                                    <Col>
                                        <h2>Judges</h2>
                                        <Form onSubmit={this.handleAddJudgeFormSubmit}>
                                            <Form.Row>
                                                <Col md={4}>
                                                    <Form.Control
                                                        name="judgeName"
                                                        type="text"
                                                        placeholder="Name"
                                                        value={this.state.addJudgeForm.judgeName}
                                                        onChange={this.handleAddJudgeFormChange} />
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Control
                                                        name="school"
                                                        type="text"
                                                        placeholder="School"
                                                        value={this.state.addJudgeForm.school}
                                                        onChange={this.handleAddJudgeFormChange} />
                                                </Col>
                                                <Col>
                                                    <Button
                                                        variant="primary"
                                                        className="btn-submit"
                                                        type="submit">
                                                        Add judge
                                                    </Button>
                                                </Col>
                                            </Form.Row>
                                        </Form>
                                        <div id="total-judges">
                                            <p>
                                                Total judges each round: {this.props.judges.filter(el => el.atRound1).length} &middot; {this.props.judges.filter(el => el.atRound2).length} &middot; {this.props.judges.filter(el => el.atRound3).length}
                                                <br />
                                                Total chairs each round: {chairsR1} &middot; {chairsR2} &middot; {chairsR3}
                                                <br />
                                                <span className={(totalRooms > chairsR1 || totalRooms > chairsR2 || totalRooms > chairsR3) ? "red" : ""}>
                                                    Total chairs needed: {totalRooms}
                                                </span>
                                            </p>
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col lg={10} xl={9} className="table-col">
                                        {table}
                                    </Col>
                                </Row>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        );
    }
}

export default Judges;