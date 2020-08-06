import React from 'react';
import './Start.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import Button from 'react-bootstrap/Button';
import { CheckCircleFill, People, JournalText, QuestionCircle } from 'react-bootstrap-icons';


class Start extends React.PureComponent {
    render() {
        return (<>
            <Row>
                <Col lg={8} className="col-override-padding">
                    <h2>Start</h2>
                    <Alert variant="success">
                        <CheckCircleFill />&nbsp;&nbsp;
                        The tournament is set up and running correctly. Congrats, you can do this!
                    </Alert>
                </Col>
            </Row>
            <Row className="get-started-row">
                <Col className="col-override-padding">
                    <h3>Getting started</h3>
                    <CardDeck>
                        <Card bg="light" text="dark" border="primary">
                            <Card.Body>
                                <Card.Title>
                                    <People />
                                    Add participants
                                </Card.Title>
                                <Card.Text>
                                    You don't have to do all the work the night before the tournament. As soon as the first speakers and judges are confirmed, you can start adding them. Don't worry if you don't have the final configurations yet&mdash;everything can be edited or deleted later!
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <Card bg="light" text="dark" border="secondary">
                            <Card.Body>
                                <Card.Title>
                                    <JournalText />
                                    Read the documentation
                                </Card.Title>
                                <Card.Text>
                                    A detailed manual on how to tab tournaments using TacoTab is currently under construction. Check back soon!
                                </Card.Text>
                                <Button variant="secondary" disabled>
                                    Coming soon
                                </Button>
                            </Card.Body>
                        </Card>
                        <Card bg="light" text="dark" border="danger">
                            <Card.Body>
                                <Card.Title>
                                    <QuestionCircle />
                                    Get help
                                </Card.Title>
                                <Card.Text>
                                    Technical trouble? Rayo lives in Eindhoven, the Netherlands, and you are welcome to stop by for tea sometime to discuss your issues.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </CardDeck>
                </Col>
            </Row>
        </>);
    }
}

export default Start;