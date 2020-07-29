import React, { ChangeEvent, KeyboardEvent } from 'react';
import { Speaker } from '../types/Speaker';


type TeamCellProps = {
    type: string,
    speaker: Speaker,
    round: number,
    fn: (speaker: Speaker, no: number, value: number) => void
}

type TeamCellState = {
    value: string
}

class TeamCell extends React.Component<TeamCellProps, TeamCellState> {
    constructor(props: TeamCellProps) {
        super(props);

        this.state = {
            value: this.props.type === "score" ? this.props.speaker.scores[this.props.round].toString() : this.props.speaker.ranks[this.props.round].toString()
        }

        this.handleEdit = this.handleEdit.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }


    handleEdit(event: ChangeEvent<HTMLTextAreaElement>) {
        this.setState({value: event.target.value});
    }

    handleLoseFocus(event: KeyboardEvent<HTMLTextAreaElement>) {
        if(event.which == 13) (event.target as HTMLTextAreaElement).blur();
    }

    handleUpdate(event: ChangeEvent<HTMLTextAreaElement>) {
        event.preventDefault();
        let value: string = this.state.value;
        if(!value || isNaN(Number(value))) {
            value = "0";
        }
        this.props.fn(this.props.speaker, this.props.round, Number(value));
    }


    render() {
        return (
            <textarea
                rows={1}
                cols={this.props.type === "score" ? 2 : 1}
                maxLength={this.props.type === "score" ? 2 : 1}
                autoComplete="off"
                value={this.state.value}
                onChange={this.handleEdit}
                onKeyUp={this.handleLoseFocus}
                onBlur={this.handleUpdate} />
        );
    }
}

export default TeamCell;