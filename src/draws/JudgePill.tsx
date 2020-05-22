import React, { ChangeEvent, FormEvent } from 'react';
import './JudgePill.scss';
import { Judge } from '../types/Judge';
import { Room } from '../types/Room';
import { Draw } from '../types/Draw';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


type JudgePillProps = {
    judge: Judge,
    isChair: boolean,
    hasConflict: boolean,
    room: Room,
    draw: Draw,
    updateRoom: (room: Room, judgeID: number, isChair: boolean, newRoomName: string) => void
}

type JudgePillState = {
    roomName: string
}

class JudgePill extends React.Component<JudgePillProps, JudgePillState> {
    constructor(props: JudgePillProps) {
        super(props);

        this.state = {
            roomName: this.props.room.name
        }

        this.handleRoomFormChange = this.handleRoomFormChange.bind(this);
        this.handleRoomFormSubmit = this.handleRoomFormSubmit.bind(this);
    }


    handleRoomFormChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({roomName: event.target.value});
    }

    handleRoomFormSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        this.props.updateRoom(this.props.room, this.props.judge.judgeID, this.props.isChair, this.state.roomName);
        document.body.click();
    }


    render() {
        const popover = (
            <Popover id="judgepill-popover">
                <Popover.Title as="h3">Switch rooms</Popover.Title>
                <Popover.Content>
                    {(this.props.draw.roomsOne.map(room => room.name).includes("") ||
                      this.props.draw.roomsTwo.map(room => room.name).includes("") )
                        ?
                        <p>You need to assign each round to a room before you can switch judges.</p>
                        :
                        <Form onSubmit={this.handleRoomFormSubmit}>
                            {this.props.draw.roomsOne.map((room, index) => {
                                return (
                                    <Form.Check custom
                                        key={`room-check-${index}`}
                                        id={`room-check-${Math.floor(Math.random() * 1000000)}`}
                                        name="room"
                                        type="radio"
                                        label={room.name}
                                        value={room.name}
                                        checked={this.state.roomName === room.name}
                                        onChange={this.handleRoomFormChange} />
                                );
                            })}
                            {this.props.draw.roomsTwo.map((room, index) => {
                                return (
                                    <Form.Check custom
                                        key={`room-check-${index}`}
                                        id={`room-check-${Math.floor(Math.random() * 1000000)}`}
                                        name="room"
                                        type="radio"
                                        label={room.name}
                                        value={room.name}
                                        checked={this.state.roomName === room.name}
                                        onChange={this.handleRoomFormChange} />
                                );
                            })}
                            <Button className="btn-popover" variant="primary" type="submit">Change</Button>
                        </Form>}
                </Popover.Content>
            </Popover>
        );

        return (
            <OverlayTrigger trigger="click" placement="right" overlay={popover} rootClose>
                <div className={`judgepill ${this.props.hasConflict ? "red" : ""}`}>
                    {this.props.judge.name}{this.props.isChair ? "\u00A9" : ""}
                </div>
            </OverlayTrigger>
        );
    }
}

export default JudgePill;