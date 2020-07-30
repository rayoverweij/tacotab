import React, { ChangeEvent, FocusEvent } from 'react';
import TeamPill from './TeamPill';
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
    draws: Draw[],
    updateRooms: (room: Room, div: number) => void
}

type RoundRowState = {
    roomName: string
}

class RoundRow extends React.PureComponent<RoundRowProps, RoundRowState> {
    constructor(props: RoundRowProps) {
        super(props);

        this.state = {
            roomName: this.props.room.name
        }

        this.handleRoomChange = this.handleRoomChange.bind(this);
        this.handleRoomSubmit = this.handleRoomSubmit.bind(this);
        this.updateRoomTeam = this.updateRoomTeam.bind(this);
        this.updateRoomJudge = this.updateRoomJudge.bind(this);
    }


    handleRoomChange(event: ChangeEvent<HTMLTextAreaElement>) {
        const value = event.target.value;
        this.setState({roomName: value});
    }

    handleRoomSubmit(event: FocusEvent<HTMLTextAreaElement>) {
        event.preventDefault();
        const value = this.state.roomName;
        const room = {...this.props.room, name: value};
        this.props.updateRooms(room, this.props.div);
    }

    updateRoomTeam(thisTeamID: number, swapTeamID: number) {
        const div = this.props.div;
        const round = this.props.round - 1;
        let draw = this.props.draws[round];
        let thisRoom = this.props.room;

        let rooms;
        if(div === 1) rooms = draw.roomsOne;
        else rooms = draw.roomsTwo;

        let thisTeamPos = "prop";
        if(thisRoom.opp === thisTeamID) thisTeamPos = "opp";

        let newRoom: Room;
        for(let checkRoom of rooms) {
            if(checkRoom.prop === swapTeamID) {
                if(thisTeamPos === "prop") [thisRoom.prop, checkRoom.prop] = [checkRoom.prop, thisRoom.prop];
                else [thisRoom.opp, checkRoom.prop] = [checkRoom.prop, thisRoom.opp];
                newRoom = checkRoom;
                break;

            } else if(checkRoom.opp === swapTeamID) {
                if(thisTeamPos === "prop") [thisRoom.prop, checkRoom.opp] = [checkRoom.opp, thisRoom.prop];
                else [thisRoom.opp, checkRoom.opp] = [checkRoom.opp, thisRoom.opp];
                newRoom = checkRoom;
                break;
            }
        }

        this.props.updateRooms(newRoom!, div);
        this.props.updateRooms(thisRoom, div);
    }

    updateRoomJudge(judgeID: number, isChair: boolean, newRoomID: number) {
        const round = this.props.round - 1;
        let room = {...this.props.room};
        let draw = this.props.draws[round];
        const roomlistOne = draw.roomsOne.map(r => r.roomID);
        const nextDiv = roomlistOne.includes(newRoomID) ? 1 : 2;

        let rooms;
        if(nextDiv === 1) rooms = [...draw.roomsOne];
        else rooms = [...draw.roomsTwo];

        const newRoom = rooms.findIndex(r => r.roomID === newRoomID);

        if(!isChair) {
            rooms[newRoom].wings.push(judgeID);
            const oldIndex = room.wings.indexOf(judgeID);
            room.wings.splice(oldIndex, 1);
        } else {
            const swapChairID = rooms[newRoom].chair;
            if(swapChairID === judgeID) return false;

            const conf = window.confirm(`You are about to swap the chairs ${this.props.judges.find(j => j.judgeID === judgeID)!.name} and ${this.props.judges.find(j => j.judgeID === swapChairID)!.name}. Do you wish to continue?`);
            if(conf) {
                rooms[newRoom].chair = judgeID;
                room.chair = swapChairID;
            } else return false;
        }
        this.props.updateRooms(rooms[newRoom], nextDiv);
        this.props.updateRooms(room, this.props.div);
    }


    render() {
        const speakers = this.props.speakers;
        const teams = this.props.teams;
        const judges = this.props.judges;
        const room = this.props.room;
        const round = this.props.round;
        const draws = this.props.draws;
        const div = this.props.div;

        const prop = teams.find(el => el.teamID === room.prop)!;
        const opp = teams.find(el => el.teamID === room.opp)!;
        const chair = judges.find(el => el.judgeID === room.chair)!;


        // Compile a list of speakers' schools for determining judge conflicts
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


        // Initialize values for next checks
        let roomNum: string;
        if(div === 1) roomNum = "roomsOne";
        else roomNum = "roomsTwo";


        // Check whether the teams have met before
        let teamConflict = false;
        if(round === 2 || round === 3) {
            let propsR1: number[];

            const rooms: Room[] = draws[0][roomNum] as Room[];
            propsR1 = rooms.map(r => r.prop);

            if(propsR1.includes(prop.teamID)) {
                const roomR1 = rooms.find(r => r.prop === prop.teamID)!;
                if(roomR1.opp === opp.teamID) teamConflict = true;
            } else {
                const roomR1 = rooms.find(r => r.opp === prop.teamID)!;
                if(roomR1.prop === opp.teamID) teamConflict = true;
            }
        }
        if(round === 3) {
            let propsR2: number[];

            const rooms: Room[] = draws[1][roomNum] as Room[];
            propsR2 = rooms.map(r => r.prop);

            if(propsR2.includes(prop.teamID)) {
                const roomR1 = rooms.find(r => r.prop === prop.teamID)!;
                if(roomR1.opp === opp.teamID) teamConflict = true;
            } else {
                const roomR1 = rooms.find(r => r.opp === prop.teamID)!;
                if(roomR1.prop === opp.teamID) teamConflict = true;
            }
        }


        // Check whether the chair has chaires the teams before
        let hasChairedBefore = false;
        if(round === 2 || round === 3) {
            let chairsR1: number[];

            const rooms: Room[] = draws[0][roomNum] as Room[];
            chairsR1 = rooms.map(r => r.chair);

            if(chairsR1.includes(chair.judgeID)) {
                const roomR1 = rooms.find(r => r.chair === chair.judgeID)!;
                if(roomR1.prop === prop.teamID || roomR1.prop === opp.teamID
                    || roomR1.opp === prop.teamID || roomR1.opp === opp.teamID) {
                        hasChairedBefore = true;
                }
            }
        }
        if(round === 3) {
            let chairsR2: number[];

            const rooms: Room[] = draws[1][roomNum] as Room[];
            chairsR2 = rooms.map(r => r.chair);

            if(chairsR2.includes(chair.judgeID)) {
                const roomR1 = rooms.find(r => r.chair === chair.judgeID)!;
                if(roomR1.prop === prop.teamID || roomR1.prop === opp.teamID
                    || roomR1.opp === prop.teamID || roomR1.opp === opp.teamID) {
                        hasChairedBefore = true;
                }
            }
        }


        return (
            <tr>
                <td className="editable draw-table-room-cell">
                    <textarea
                        className="cell-valupdate"
                        rows={1}
                        cols={this.state.roomName.length > 8 ? this.state.roomName.length : 8}
                        autoComplete="off"
                        placeholder="room"
                        value={this.state.roomName}
                        onChange={this.handleRoomChange}
                        onBlur={this.handleRoomSubmit} />
                </td>
                <td className="draw-table-team-cell">
                    <TeamPill 
                        team={prop}
                        hasConflict={teamConflict}
                        teams={this.props.teams}
                        updateRoom={this.updateRoomTeam} />
                </td>
                <td className="draw-table-team-cell">
                    <TeamPill 
                        team={opp}
                        hasConflict={teamConflict}
                        teams={this.props.teams}
                        updateRoom={this.updateRoomTeam} />
                </td>
                <td>
                    <div className="judgepill-container">
                        <JudgePill
                            judge={chair}
                            isChair={true}
                            hasConflict={speakerSchools.includes(chair.school)}
                            hasChairedBefore={hasChairedBefore}
                            room={room}
                            draw={draws[round - 1]}
                            updateRoom={this.updateRoomJudge} />
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
                                    hasChairedBefore={false}
                                    room={room}
                                    draw={draws[round - 1]}
                                    updateRoom={this.updateRoomJudge} />
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