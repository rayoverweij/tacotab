import React from 'react';

import Form from 'react-bootstrap/Form';


class SpeakerRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: this.props.speaker.name,
            disqualified: this.props.speaker.disqualified
        }

        this.handleNameUpdate = this.handleNameUpdate.bind(this);
        this.handleDisqUpdate = this.handleDisqUpdate.bind(this);
    }

    handleNameUpdate(event) {
        const name = event.target.value;
        const speaker = this.props.speaker;
        speaker.name = name;
        this.setState({name: name});
        this.props.handleSpeakerUpdate(speaker);
    }

    handleDisqUpdate(event) {
        const checked = event.target.checked;
        const speaker = this.props.speaker;
        speaker.disqualified = checked;
        this.setState({disqualified: checked});
        this.props.handleSpeakerUpdate(speaker);
    }
    
    render() {
        const speaker = this.props.speaker;

        return (
            <tr key={`speaker-row-${speaker.debaterID}`}>
                <td>
                    <textarea
                        className="cell-valupdate"
                        rows="1"
                        autoComplete="off"
                        value={this.state.name}
                        onChange={this.handleNameUpdate} />
                </td>
                <td>
                    {speaker.school}
                </td>
                <td className="cell-low-padding">
                    <Form.Switch
                        name="disqualified"
                        onChange={this.handleDisqUpdate}
                        checked={this.state.disqualified}
                        className={this.state.disqualified ? "on" : "off"} />
                </td>
                <td className="table-delete">
                    <div onClick={() => this.props.handleSpeakerDelete(speaker)} className="icon icon-trash"></div>
                </td>
            </tr>
        );
    }
}

export default SpeakerRow;