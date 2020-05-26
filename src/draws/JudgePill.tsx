import React, { ChangeEvent, FormEvent } from 'react';
import './Pill.scss';
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
    updateRoom: (judgeID: number, isChair: boolean, newRoomID: number) => void
}

type JudgePillState = {
    roomID: number
}

class JudgePill extends React.Component<JudgePillProps, JudgePillState> {
    constructor(props: JudgePillProps) {
        super(props);

        this.state = {
            roomID: this.props.room.roomID
        }

        this.handleRoomFormChange = this.handleRoomFormChange.bind(this);
        this.handleRoomFormSubmit = this.handleRoomFormSubmit.bind(this);
    }


    handleRoomFormChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({roomID: parseInt(event.target.value)});
    }

    handleRoomFormSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        this.props.updateRoom(this.props.judge.judgeID, this.props.isChair, this.state.roomID);
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
                                        id={`room-check-one-${room.roomID}-${index}`}
                                        name="room"
                                        type="radio"
                                        label={room.name}
                                        value={room.roomID}
                                        checked={this.state.roomID === room.roomID}
                                        onChange={this.handleRoomFormChange} />
                                );
                            })}
                            {this.props.draw.roomsTwo.map((room, index) => {
                                return (
                                    <Form.Check custom
                                        key={`room-check-${index}`}
                                        id={`room-check-two-${room.roomID}-${index}`}
                                        name="room"
                                        type="radio"
                                        label={room.name}
                                        value={room.roomID}
                                        checked={this.state.roomID === room.roomID}
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
                <div className={`pill ${this.props.hasConflict ? "red" : ""}`}>
                    {this.props.judge.name}{this.props.isChair ? "\u00A9" : ""}
                </div>
            </OverlayTrigger>
        );
    }
}

export default JudgePill;