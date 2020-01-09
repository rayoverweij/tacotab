import React from 'react';

class Participants extends React.Component {
    render() {
        return (
            <div>
                <p>Participants in bracket {this.props.bracket}</p>
            </div>
        );
    }
}

export default Participants;