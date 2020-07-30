import React, { ChangeEvent, FormEvent } from 'react';
import './Pill.scss';
import { Team } from '../types/Team';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


type TeamPillProps = {
    team: Team,
    hasConflict: boolean,
    teams: Team[],
    updateRoom: (thisTeamID: number, swapTeamID: number) => void
}

type TeamPillState = {
    swapTeamID: number
}

class TeamPill extends React.PureComponent<TeamPillProps, TeamPillState> {
    constructor(props: TeamPillProps) {
        super(props);

        this.state = {
            swapTeamID: this.props.team.teamID
        }

        this.handleRoomFormChange = this.handleRoomFormChange.bind(this);
        this.handleRoomFormSubmit = this.handleRoomFormSubmit.bind(this);
    }


    handleRoomFormChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({swapTeamID: parseInt(event.target.value)});
    }

    handleRoomFormSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        this.props.updateRoom(this.props.team.teamID, this.state.swapTeamID);
        document.body.click();
    }


    render() {
        const popover = (
            <Popover id="teampill-popover">
                <Popover.Title as="h3">Switch teams</Popover.Title>
                <Popover.Content>
                    <Form onSubmit={this.handleRoomFormSubmit}>
                        {this.props.teams.map((team, index) => {
                            return (
                                <Form.Check custom
                                    key={`team-check-${index}`}
                                    id={`team-check-${team.teamID}-${index}`}
                                    name="room"
                                    type="radio"
                                    label={team.name}
                                    value={team.teamID}
                                    checked={this.state.swapTeamID === team.teamID}
                                    onChange={this.handleRoomFormChange} />
                            );
                        })}
                        <Button className="btn-popover" variant="primary" type="submit">Change</Button>
                    </Form>
                </Popover.Content>
            </Popover>
        );

        return (
            <OverlayTrigger trigger="click" placement="right" overlay={popover} rootClose>
                <div className={`pill ${this.props.hasConflict ? "orange" : ""}`}>
                    {this.props.team.name}
                </div>
            </OverlayTrigger>
        );
    }
}

export default TeamPill;