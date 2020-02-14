import React from 'react';
import './Judges.scss';

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
            judges: JSON.parse(localStorage.getItem("judges")),
            addJudgeForm: ""
        }

        this.handleJudgeFormChange = this.handleJudgeFormChange.bind(this);
        this.handleJudgeFormSubmit = this.handleJudgeFormSubmit.bind(this);
        this.handleJudgeUpdate = this.handleJudgeUpdate.bind(this);
        this.handleJudgeDelete = this.handleJudgeDelete.bind(this);
    }


    handleJudgeFormChange(event) {
        this.setState({addJudgeForm: event.target.value});
    }

    handleJudgeFormSubmit(event) {
        event.preventDefault();

        let judges = this.state.judges;
        let counter = localStorage.getItem("judges_counter");

        judges.push(new Judge(counter++, this.state.addJudgeForm));

        this.setState({judges: judges});
        localStorage.setItem("judges", JSON.stringify(judges));
        localStorage.setItem("judges_counter", counter);
    }

    handleJudgeUpdate(judge) {
        let judges = this.state.judges;

        const index = judges.indexOf(judge);
        judges[index] = judge;

        localStorage.setItem("judges", JSON.stringify(judges));
        this.setState({judges: judges});
    }

    handleJudgeDelete(judge) {
        const conf = window.confirm(`Are you sure you want to delete judge ${judge.name}?`);

        if(conf) {
            let judges = this.state.judges;

            const index = judges.indexOf(judge);
            judges.splice(index, 1);

            localStorage.setItem("judges", JSON.stringify(judges));
            this.setState({judges: judges});
        }
    }


    render() {
        let table;
        if(this.state.judges.length === 0) {
            table = <p className="none-yet">No judges yet!</p>;
        } else {
            table = (
                <Table className="judge-table" hover bordered>
                    <thead>
                        <tr>
                            <th className="judge-table-name">Name</th>
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
                        {this.state.judges.map(judge => {
                            return (
                                <JudgeRow
                                    key={`judge-row-${judge.name}`}
                                    judge={judge}
                                    updateJudge={this.handleJudgeUpdate}
                                    deleteJudge = {this.handleJudgeDelete} />
                            );
                        })}
                    </tbody>
                </Table>
            );
        }


        return (
            <Tab.Container id={`judges-view`} defaultActiveKey="judges">
                <Row>
                    <Col sm={2}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="judges" className="sub-nav-link">Judges</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={10}>
                        <Tab.Content>
                            <Tab.Pane eventKey="judges">
                                <Row>
                                    <Col>
                                        <h2>Judges</h2>
                                        <Form onSubmit={this.handleJudgeFormSubmit}>
                                            <Form.Row>
                                                <Col md={4}>
                                                    <Form.Control name="judgeName" type="text" placeholder="Name" onChange={this.handleJudgeFormChange} />
                                                </Col>
                                                <Col>
                                                    <Button variant="primary" type="submit">Add judge</Button>
                                                </Col>
                                            </Form.Row>
                                        </Form>
                                        <div id="total-judges">
                                            <p>
                                                Total judges each round: {this.state.judges.filter(el => el.r1).length} &middot; {this.state.judges.filter(el => el.r2).length} &middot; {this.state.judges.filter(el => el.r3).length}
                                                <br />
                                                Total chairs each round: {this.state.judges.filter(el => el.canChair && el.r1).length} &middot; {this.state.judges.filter(el => el.canChair && el.r2).length} &middot; {this.state.judges.filter(el => el.canChair && el.r3).length}
                                            </p>
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={8} className="table-col">
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