import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class Welcome extends React.Component {
    render() {
        return (
            <Row>
                <Col>
                    <h2>Hi David!</h2>
                    <p>Yay! You made it work!</p>
                </Col>
            </Row>
        );
    }
}

export default Welcome;