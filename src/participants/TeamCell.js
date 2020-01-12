import React from 'react';
import './TeamCell.scss';

class TeamCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.type === "score" ? this.props.speaker.scores[this.props.no] : this.props.speaker.ranks[this.props.no]
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        let value = event.target.value;
        this.setState({value: value});
        if(!value || isNaN(value)) {
            value = 0;
        }
        this.props.fn(this.props.speaker, this.props.no, value);
    }

    render() {
        return (
            <textarea
                rows="1"
                cols={this.props.type === "score" ? 2 : 1}
                maxLength={this.props.type === "score" ? 2 : 1}
                autoComplete="off"
                value={this.state.value}
                onChange={this.handleChange} />
        );
    }
}

export default TeamCell;