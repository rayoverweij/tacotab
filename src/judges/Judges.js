import React from 'react';
import './Judges.scss';
import { ReactComponent as IconJudge } from '../images/icon-judge.svg';

import JudgeRow from './JudgeRow';
import Judge from '../structures/judge';

import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';


class Judges extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            addJudgeForm: {
                judgeName: "",
                judgeSchool: ""
            }
        }

        this.handleAddJudgeFormChange = this.handleAddJudgeFormChange.bind(this);
        this.handleAddJudgeFormSubmit = this.handleAddJudgeFormSubmit.bind(this);
        this.updateJudge = this.updateJudge.bind(this);
        this.deleteJudge = this.deleteJudge.bind(this);
    }


    handleAddJudgeFormChange(event) {
        const value = event.target.value;
        const name = event.target.name;
        let judgeAddFormState = {...this.state.addJudgeForm};
        judgeAddFormState[name] = value;
        this.setState({addJudgeForm: judgeAddFormState});
    }

    handleAddJudgeFormSubmit(event) {
        event.preventDefault();

        let judges = this.props.judges;
        let counter = localStorage.getItem("judges_counter");

        judges.push(new Judge(counter++, this.state.addJudgeForm.judgeName, this.state.addJudgeForm.judgeSchool));

        this.props.updateJudges(judges);
        localStorage.setItem("judges_counter", counter);

        let blankForm = {...this.state.addJudgeForm};
        blankForm.name = "";
        this.setState({addJudgeForm: blankForm});
    }

    updateJudge(judge) {
        let judges = this.props.judges;

        const index = judges.indexOf(judge);
        judges[index] = judge;

        this.props.updateJudges(judges);
    }

    deleteJudge(judge) {
        const draws = JSON.parse(localStorage.getItem("draws"));
        for (const round of draws) {
            for(const pairs of Object.keys(round)) {
                for (const pair of round[pairs]) {
                    if(pair.chair === judge.judgeID || pair.wings.includes(judge.judgeID)) {
                        alert("This judge has already taken part in a round. You can't delete them anymore. You can still change their availability for each round.");
                        return;
                    }
                }
            }
        }

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
                <Table className="judge-table" hover bordered>
                    <thead>
                        <tr>
                            <th className="judge-table-name">Name</th>
                            <th>School</th>
                            <th>Chair?</th>
                            <th>Round 1?</th>
                            <th>Round 2?</th>
                            <th>Round 3?</th>
                            <th className="table-delete">
                                <div className="icon icon-trash-filled"></div>
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
        const chairsR1 = judges.filter(el => el.canChair && el.r1).length;
        const chairsR2 = judges.filter(el => el.canChair && el.r2).length;
        const chairsR3 = judges.filter(el => el.canChair && el.r3).length;

        return (
            <Tab.Container id={`judges-view`} defaultActiveKey="judges">
                <Row>
                    <Col md={3} lg={2}>
                        <Nav variant="pills">
                            <Nav.Item>
                                <Nav.Link eventKey="judges" className="sub-nav-link">
                                    <IconJudge className="btn-icon" alt="Icon of an award" />
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
                                                        name="judgeSchool"
                                                        type="text"
                                                        placeholder="School"
                                                        value={this.state.addJudgeForm.judgeSchool}
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
                                                Total judges each round: {this.props.judges.filter(el => el.r1).length} &middot; {this.props.judges.filter(el => el.r2).length} &middot; {this.props.judges.filter(el => el.r3).length}
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
                                    <Col lg={10} xl={8} className="table-col">
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