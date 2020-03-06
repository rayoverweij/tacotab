import React from 'react';

class TeamCell extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.type === "score" ? this.props.speaker.scores[this.props.no] : this.props.speaker.ranks[this.props.no]
        }

        this.handleEdit = this.handleEdit.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    handleEdit(event) {
        this.setState({value: event.target.value});
    }

    handleUpdate(event) {
        event.preventDefault();
        let value = this.state.value;
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
                onChange={this.handleEdit}
                onBlur={this.handleUpdate} />
        );
    }
}

export default TeamCell;