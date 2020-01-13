import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class Welcome extends React.Component {
    render() {
        return (
            <Row>
                <Col>
                    <h2>Welcome!</h2>
                    <p>Make yourself at home.</p>
                </Col>
            </Row>
        );
    }
}

export default Welcome;