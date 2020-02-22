import React from 'react';

import JudgePill from './JudgePill';


class RoundRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            room: this.props.pair.room
        }

        this.handleRoomChange = this.handleRoomChange.bind(this);
        this.updateRoom = this.updateRoom.bind(this);
    }


    handleRoomChange(event) {
        const newRoom = event.target.value;
        const pair = this.props.pair;
        this.setState({room: newRoom});
        pair.room = newRoom;
        this.props.updatePairings(pair, this.props.div);
    }

    updateRoom(pair, judgeID, chair, newRoom) {
        let draws = this.props.draws;
        const roomlist_one = draws.pairings_one.map(el => el.room);
        const nextDiv = roomlist_one.includes(newRoom) ? 1 : 2;

        if(nextDiv === 1) {
            draws = draws.pairings_one;
        } else {
            draws = draws.pairings_two;
        }
        const newPair = draws.findIndex(el => el.room === newRoom);

        if(!chair) {
            draws[newPair].wings.push(judgeID);
            const oldIndex = pair.wings.indexOf(judgeID);
            pair.wings.splice(oldIndex, 1);
        } else {
            const swapChair = draws[newPair].chair;
            if(swapChair === judgeID) return false;
            const conf = window.confirm(`You are about to swap the chairs ${this.props.judges.find(j => j.judgeID === judgeID).name} and ${this.props.judges.find(j => j.judgeID === swapChair).name}. Do you wish to continue?`);
            if(conf) {
                draws[newPair].chair = judgeID;
                pair.chair = swapChair;
            } else return false;
        }
        this.props.updatePairings(draws[newPair], nextDiv === 1 ? "one" : "two");
        this.props.updatePairings(pair, this.props.div);
    }


    render() {
        const speakers = this.props.speakers;
        const teams = this.props.teams;
        const judges = this.props.judges;
        const pair = this.props.pair;
        const round = this.props.round;

        const prop = teams.find(el => el.teamID === pair.prop);
        const opp = teams.find(el => el.teamID === pair.opp);
        const chair = judges.find(el => el.judgeID === pair.chair);

        // Look for institutional judge conflicts
        let chair_conflict = false;

        let speakers_in_teams = [];
        if(round === 1) {
            prop.round1.forEach(sp => speakers_in_teams.push(speakers.find(el => el.debaterID.toString() === sp)));
            opp.round1.forEach(sp => speakers_in_teams.push(speakers.find(el => el.debaterID.toString() === sp)));
        } else if(round === 2) {
            prop.round2.forEach(sp => speakers_in_teams.push(speakers.find(el => el.debaterID.toString() === sp)));
            opp.round2.forEach(sp => speakers_in_teams.push(speakers.find(el => el.debaterID.toString() === sp)));
        } else {
            prop.round3.forEach(sp => speakers_in_teams.push(speakers.find(el => el.debaterID.toString() === sp)));
            opp.round3.forEach(sp => speakers_in_teams.push(speakers.find(el => el.debaterID.toString() === sp)));
        }
        let speaker_schools = [];
        speakers_in_teams
            .filter(sp => sp !== undefined)
            .forEach(sp => speaker_schools.push(sp.school));

        if(speaker_schools.includes(chair.school)) chair_conflict = true;

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
                    {prop.teamName}
                </td>
                <td className="draw-table-team-cell">
                    {opp.teamName}
                </td>
                <td>
                    <JudgePill
                        judge={chair}
                        chair={true}
                        conflict={chair_conflict}
                        pair={pair}
                        draws={this.props.draws}
                        updateRoom={this.updateRoom} />
                    {pair.wings.map((el, index) => {
                        let wing = judges.find(j => j.judgeID === el);
                        return (
                            <div key={`judgepil-${index}`} className="judgepill-container">
                                ,&nbsp;<JudgePill
                                        judge={wing}
                                        chair={false}
                                        conflict={speaker_schools.includes(wing.school)}
                                        pair={pair}
                                        draws={this.props.draws}
                                        updateRoom={this.updateRoom} />
                            </div>
                        );
                    })}
                </td>
            </tr>
        );
    }
}

export default RoundRow;