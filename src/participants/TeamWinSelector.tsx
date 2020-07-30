import React, { ChangeEvent } from 'react';
import { Team } from '../types/Team';
import Form from 'react-bootstrap/Form';


type TeamWinSelectorProps = {
    team: Team,
    round: number,
    updateTeam: (team: Team) => void
}

type TeamWinSelectorState = {
    win: boolean
}

class TeamWinSelector extends React.PureComponent<TeamWinSelectorProps, TeamWinSelectorState> {
    constructor(props: TeamWinSelectorProps){
        super(props);

        this.state = {
            win: this.props.team.wins[this.props.round - 1]
        }

        this.handleWinFormUpdate = this.handleWinFormUpdate.bind(this);
    }


    handleWinFormUpdate(event: ChangeEvent<HTMLInputElement>) {
        let team = {...this.props.team};

        if(event.target.value === "true") {
            team.wins[this.props.round - 1] = true;
            team.totalWins += 1;
            this.setState({win: true});
        } else {
            team.wins[this.props.round - 1] = false;
            team.totalWins -= 1;
            this.setState({win: false});
        }

        this.props.updateTeam(team);
    }


    render() {
        return (
            <Form>
                <Form.Control
                    as="select"
                    name={`win-form-${this.props.team.teamID}-round-${this.props.round}`}
                    value={this.state.win.toString()}
                    onChange={this.handleWinFormUpdate}>
                        <option value="true">Win</option>
                        <option value="false">Loss</option>
                </Form.Control>
            </Form>
        );
    }
}

export default TeamWinSelector;