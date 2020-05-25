import React, { ChangeEvent } from 'react';
import JudgePill from './JudgePill';
import { Room } from '../types/Room';
import { Speaker } from '../types/Speaker';
import { Team } from '../types/Team';
import { Judge } from '../types/Judge';
import { Draw } from '../types/Draw';


type RoundRowProps = {
    room: Room,
    div: number,
    round: number,
    speakers: Speaker[],
    teams: Team[],
    judges: Judge[],
    draw: Draw,
    updateRooms: (room: Room, div: number) => void
}

type RoundRowState = {
    roomName: string
}

class RoundRow extends React.Component<RoundRowProps, RoundRowState> {
    constructor(props: RoundRowProps) {
        super(props);

        this.state = {
            roomName: this.props.room.name
        }

        this.handleRoomChange = this.handleRoomChange.bind(this);
        this.updateRoom = this.updateRoom.bind(this);
    }

    componentDidUpdate(prevProps: RoundRowProps) {
        if(this.props.room.name !== prevProps.room.name) {
            this.setState({roomName: this.props.room.name});
        }
    }


    handleRoomChange(event: ChangeEvent<HTMLTextAreaElement>) {
        const value = event.target.value;
        const room = this.props.room;
        this.setState({roomName: value});
        room.name = value;
        this.props.updateRooms(room, this.props.div);
    }

    updateRoom(room: Room, judgeID: number, isChair: boolean, newRoomName: string) {
        let draw = this.props.draw;
        const roomlistOne = draw.roomsOne.map(r => r.name);
        const nextDiv = roomlistOne.includes(newRoomName) ? 1 : 2;

        let rooms;
        if(nextDiv === 1) {
            rooms = draw.roomsOne;
        } else {
            rooms = draw.roomsTwo;
        }
        const newPair = rooms.findIndex(r => r.name === newRoomName);

        if(!isChair) {
            rooms[newPair].wings.push(judgeID);
            const oldIndex = room.wings.indexOf(judgeID);
            room.wings.splice(oldIndex, 1);
        } else {
            const swapChair = rooms[newPair].chair;
            if(swapChair === judgeID) return false;
            const conf = window.confirm(`You are about to swap the chairs ${this.props.judges.find(j => j.judgeID === judgeID)!.name} and ${this.props.judges.find(j => j.judgeID === swapChair)!.name}. Do you wish to continue?`);
            if(conf) {
                rooms[newPair].chair = judgeID;
                room.chair = swapChair;
            } else return false;
        }
        this.props.updateRooms(rooms[newPair], nextDiv);
        this.props.updateRooms(room, this.props.div);
    }


    render() {
        const speakers = this.props.speakers;
        const teams = this.props.teams;
        const judges = this.props.judges;
        const room = this.props.room;
        const round = this.props.round;

        const prop = teams.find(el => el.teamID === room.prop)!;
        const opp = teams.find(el => el.teamID === room.opp)!;
        const chair = judges.find(el => el.judgeID === room.chair)!;

        // Look for institutional judge conflicts
        let chairConflict = false;
        let speakersInTeams: Speaker[] = [];
        if(round === 1) {
            prop.round1.forEach(sp => speakersInTeams.push(speakers.find(el => el.speakerID === sp)!));
            opp.round1.forEach(sp => speakersInTeams.push(speakers.find(el => el.speakerID === sp)!));
        } else if(round === 2) {
            prop.round2.forEach(sp => speakersInTeams.push(speakers.find(el => el.speakerID === sp)!));
            opp.round2.forEach(sp => speakersInTeams.push(speakers.find(el => el.speakerID === sp)!));
        } else {
            prop.round3.forEach(sp => speakersInTeams.push(speakers.find(el => el.speakerID === sp)!));
            opp.round3.forEach(sp => speakersInTeams.push(speakers.find(el => el.speakerID === sp)!));
        }
        let speakerSchools: string[] = [];
        speakersInTeams
            .filter(sp => sp !== undefined)
            .forEach(sp => speakerSchools.push(sp.school));
        if(speakerSchools.includes(chair.school)) chairConflict = true;

        // Check whether the teams have met before
        let team_conflict = false;
        if(round === 2) {
            if(prop.opponents[0] === opp.teamID) team_conflict = true;
        }
        if(round === 3) {
            if(prop.opponents[0] === opp.teamID || prop.opponents[1] === opp.teamID) team_conflict = true;
        }


        return (
            <tr>
                <td className="editable draw-table-room-cell">
                    <textarea
                        className="cell-valupdate"
                        rows={1}
                        cols={this.state.roomName.length}
                        autoComplete="off"
                        placeholder="room"
                        value={this.state.roomName}
                        onChange={this.handleRoomChange} />
                </td>
                <td className="draw-table-team-cell">
                    <span className={team_conflict ? "orange" : ""}>
                        {prop.name}
                    </span>
                </td>
                <td className="draw-table-team-cell">
                    <span className={team_conflict ? "orange" : ""}>
                        {opp.name}
                    </span>
                </td>
                <td>
                    <div className="judgepill-container">
                        <JudgePill
                            judge={chair}
                            isChair={true}
                            hasConflict={chairConflict}
                            room={room}
                            draw={this.props.draw}
                            updateRoom={this.updateRoom} />
                    </div>
                    {room.wings.length !== 0 ? ",\u00A0" : ""}
                    {room.wings.map((el, index) => {
                        let wing = judges.find(j => j.judgeID === el)!;
                        return (
                            <div key={`judgepil-${index}`} className="judgepill-container">
                                <JudgePill
                                    judge={wing}
                                    isChair={false}
                                    hasConflict={speakerSchools.includes(wing.school)}
                                    room={room}
                                    draw={this.props.draw}
                                    updateRoom={this.updateRoom} />
                                {index < room.wings.length - 1 ? ",\u00A0" : ""}
                            </div>
                        );
                    })}
                </td>
            </tr>
        );
    }
}

export default RoundRow;