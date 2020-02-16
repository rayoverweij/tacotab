import React from 'react';

class RoundRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            room: this.props.pair.room
        }

        this.handleRoomChange = this.handleRoomChange.bind(this);
    }

    handleRoomChange(event) {
        const newRoom = event.target.value;
        const pair = this.props.pair;
        this.setState({room: newRoom});
        pair.room = newRoom;
        this.props.updatePairings(pair, this.props.bracket, this.props.round);
    }

    render() {
        const teams = this.props.bracket === "middle" ? JSON.parse(localStorage.getItem("teams_middle")) : JSON.parse(localStorage.getItem("teams_high"));
        const judges = JSON.parse(localStorage.getItem("judges"));
        const pair = this.props.pair;

        return (
            <tr>
                <td className="editable">
                    <textarea
                        className="cell-valupdate"
                        rows="1"
                        cols="12"
                        autoComplete="off"
                        value={this.state.room}
                        onChange={this.handleRoomChange} />
                </td>
                <td className="draw-table-team-cell">
                    {teams.find(el => el.teamID === pair.prop).teamName}
                </td>
                <td className="draw-table-team-cell">
                    {teams.find(el => el.teamID === pair.opp).teamName}
                </td>
                <td>
                    {judges.find(el => el.judgeID === pair.chair).name}&copy;{pair.wings.map(el => {
                        return ", " + judges.find(j => j.judgeID === el).name
                    })}
                </td>
            </tr>
        );
    }
}

export default RoundRow;