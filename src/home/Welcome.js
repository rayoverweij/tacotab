import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class Welcome extends React.Component {
    render() {
        return (
            <Row>
                <Col>
                    <h2>Welcome!</h2>
                    <p><strong>This is prerelease software, still under active development. Use at your own risk.</strong> For more information, see the <a href="https://github.com/rayoverweij/tacotab" rel="noopener noreferrer" target="_blank">GitHub repository</a>.</p>
                </Col>
            </Row>
        );
    }
}

export default Welcome;