import React from 'react';
import './Ranking.scss';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


class Ranking extends React.Component {
    // doesn't automatically update yet
    render() {
        const speakers_ranked = this.props.speakers.sort((a, b) => {
            const a_sum = a.scores.reduce((x, y) => x + y, 0);
            const b_sum = b.scores.reduce((x, y) => x + y, 0);
            const a_ranks = a.ranks.reduce((x, y) => x + y, 0);
            const b_ranks = b.ranks.reduce((x, y) => x + y, 0);

            if(a_sum > b_sum) {
                return -1;
            } else if(a_sum < b_sum) {
                return 1;
            } else {
                if(a_ranks < b_ranks) {
                    return -1;
                } else if(a_ranks > b_ranks) {
                    return 1;
                } else {
                    return 1;
                }
            }
        });

        const speaker_ranking = speakers_ranked.map((speaker, index) => {
            return (
                <li key={`speaker_rank_${index + 1}`}>{speaker.name}</li>
            );
        }).splice(0, 20);
        

        return (
            <div>
                <Row>
                    <Col>
                        <h2>Ranking</h2>
                    </Col>
                </Row>
                <Row>
                    <Col md={6} className="table-col">
                        <h4>Speakers</h4>
                        <ol>
                            {speaker_ranking}
                        </ol>
                    </Col>
                    <Col md={6} className="table-col">
                        <h4>Teams</h4>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Ranking;