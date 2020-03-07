import React from 'react';
import './JudgePill.scss';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


class JudgePill extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            room: this.props.pair.room
        }

        this.handleRoomFormChange = this.handleRoomFormChange.bind(this);
        this.handleRoomFormSubmit = this.handleRoomFormSubmit.bind(this);
    }


    handleRoomFormChange(event) {
        this.setState({room: event.target.value});
    }

    handleRoomFormSubmit(event) {
        event.preventDefault();
        this.props.updateRoom(this.props.pair, this.props.judge.judgeID, this.props.chair, this.state.room);
        document.body.click();
    }


    render() {
        const popover = (
            <Popover className="judgepill-popover">
                <Popover.Title as="h3">Switch rooms</Popover.Title>
                <Popover.Content>
                    {(this.props.draws.pairings_one.map(room => room.room).includes("") ||
                      this.props.draws.pairings_two.map(room => room.room).includes("") )
                        ?
                        <p>You need to assign each round to a room before you can switch judges.</p>
                        :
                        <Form onSubmit={this.handleRoomFormSubmit}>
                            {this.props.draws.pairings_one.map((room, index) => {
                                return (
                                    <Form.Check custom
                                        key={`room-check-${index}`}
                                        id={`room-check-${Math.floor(Math.random() * 1000000)}`}
                                        name="room"
                                        type="radio"
                                        label={room.room}
                                        value={room.room}
                                        checked={this.state.room === room.room}
                                        onChange={this.handleRoomFormChange} />
                                );
                            })}
                            {this.props.draws.pairings_two.map((room, index) => {
                                return (
                                    <Form.Check custom
                                        key={`room-check-${index}`}
                                        id={`room-check-${Math.floor(Math.random() * 1000000)}`}
                                        name="room"
                                        type="radio"
                                        label={room.room}
                                        value={room.room}
                                        checked={this.state.room === room.room}
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
                <div className={`judgepill ${this.props.conflict ? "red" : ""}`}>
                    {this.props.judge.name}{this.props.chair ? "\u00A9" : ""}
                </div>
            </OverlayTrigger>
        );
    }
}

export default JudgePill;