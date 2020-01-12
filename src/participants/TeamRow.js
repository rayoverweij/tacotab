import React from 'react';
import TeamCell from './TeamCell';

class TeamRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            speakers: [
                this.props.speakers.find(el => el.debaterID.toString() === this.props.team.round1[0]),
                this.props.speakers.find(el => el.debaterID.toString() === this.props.team.round1[1]),
                this.props.speakers.find(el => el.debaterID.toString() === this.props.team.round1[2])
            ]
        }

        this.setScore = this.setScore.bind(this);
        this.setRank = this.setRank.bind(this);
    }


    setScore(speaker, no, value) {
        // Update local storage
        let globalSpeakers = this.props.speakers;
        
        globalSpeakers
            .find(el => el.debaterID.toString() === speaker.debaterID.toString())
            .scores[no] = parseInt(value);

        if(this.props.bracket === "middle") {
            localStorage.setItem("speakers_middle", JSON.stringify(globalSpeakers));
        } else {
            localStorage.setItem("speakers_high", JSON.stringify(globalSpeakers));
        }

        // Update component state
        let localState = this.state.speakers;

        localState
            .find(el => el.debaterID.toString() === speaker.debaterID.toString())
            .scores[no] = parseInt(value);    
        
        this.setState({speakers: localState});
    }

    setRank(speaker, no, value) {
        // Update local storage
        let globalSpeakers = this.props.speakers;

        globalSpeakers
            .find(el => el.debaterID.toString() === speaker.debaterID.toString())
            .ranks[no] = parseInt(value);
        
        if(this.props.bracket === "middle") {
            localStorage.setItem("speakers_middle", JSON.stringify(globalSpeakers));
        } else {
            localStorage.setItem("speakers_high", JSON.stringify(globalSpeakers));
        }

        // Update component state
        let localState = this.state.speakers;

        localState
            .find(el => el.debaterID.toString() === speaker.debaterID.toString())
            .ranks[no] = parseInt(value);

        this.setState({speakers: localState});
    }


    render() {
        const team = this.props.team;
        const d1 = this.state.speakers[0];
        const d2 = this.state.speakers[1];
        const d3 = this.state.speakers[2];
        
        const speakerRows = this.state.speakers.map(speaker => {
            return (
                <tr key={`${speaker.name}_row`}>
                    <td>{speaker.name}</td>
                    <td className="editable"><TeamCell type="score" speaker={speaker} no={0} fn={this.setScore} /></td>
                    <td className="editable"><TeamCell type="rank" speaker={speaker} no={0} fn={this.setRank} /></td>
                    <td className="editable"><TeamCell type="score" speaker={speaker} no={1} fn={this.setScore} /></td>
                    <td className="editable"><TeamCell type="rank" speaker={speaker} no={1} fn={this.setRank} /></td>
                    <td className="editable"><TeamCell type="score" speaker={speaker} no={2} fn={this.setScore} /></td>
                    <td className="editable"><TeamCell type="rank" speaker={speaker} no={2} fn={this.setRank} /></td>
                    <td>{parseInt(speaker.scores[0]) + parseInt(speaker.scores[1]) + parseInt(speaker.scores[2])}</td>
                    <td></td>
                </tr>
            );
        });

        return (
            <tbody>
                <tr>
                    <th rowSpan="5">
                        {team.teamName}
                        <br />
                        <div className="icon-trash" onClick={() => this.props.deleteTeam(team)}></div>
                    </th>
                </tr>
                {speakerRows}
                <tr className="row-total">
                    <td>Team total</td>
                    <td>{d1.scores[0] + d2.scores[0] + d3.scores[0]}</td>
                    <td></td>
                    <td>{d1.scores[1] + d2.scores[1] + d3.scores[1]}</td>
                    <td></td>
                    <td>{d1.scores[2] + d2.scores[2] + d3.scores[2]}</td>
                    <td></td>
                    <td>{d1.scores[0] + d2.scores[0] + d3.scores[0] + d1.scores[1] + d2.scores[1] + d3.scores[1] + d1.scores[2] + d2.scores[2] + d3.scores[2]}</td>
                    <td></td>
                </tr>
            </tbody>
        );
    }
}

export default TeamRow;