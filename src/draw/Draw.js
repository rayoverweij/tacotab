import React from 'react';

import Round from './Round';

import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';


class Draw extends React.Component {
    render() {
        return (
            <Tab.Container id={`draw-view`} defaultActiveKey="round1">
                <Row>
                    <Col sm={2}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="round1" className="sub-nav-link">Round 1</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="round2" className="sub-nav-link">Round 2</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="round3" className="sub-nav-link">Round 3</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={10}>
                        <Tab.Content>
                            <Tab.Pane eventKey="round1">
                                <Round r="1" />
                            </Tab.Pane>
                            <Tab.Pane eventKey="round2">
                                <Round r="2" />
                            </Tab.Pane>
                            <Tab.Pane eventKey="round3">
                                <Round r="3" />
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        );
    }
}

export default Draw;