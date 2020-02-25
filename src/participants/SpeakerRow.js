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
        this.props.updateSpeaker(speaker);
    }

    handleDisqUpdate(event) {
        const checked = event.target.checked;
        const speaker = this.props.speaker;
        speaker.disqualified = checked;
        this.setState({disqualified: checked});
        this.props.updateSpeaker(speaker);
    }
    
    render() {
        const speaker = this.props.speaker;

        return (
            <tr key={`speaker-row-${speaker.debaterID}`}>
                <td className="editable">
                    <textarea
                        className="cell-valupdate"
                        rows="1"
                        autoComplete="off"
                        spellCheck="false"
                        value={this.state.name}
                        onChange={this.handleNameUpdate} />
                </td>
                <td>
                    {speaker.school}
                </td>
                <td className="cell-low-padding">
                    <Form.Switch
                        id={`speaker-disq-${speaker.debaterID}`}
                        name="disqualified"
                        label=""
                        onChange={this.handleDisqUpdate}
                        checked={this.state.disqualified}
                        className={this.state.disqualified ? "on" : "off"} />
                </td>
                <td className="table-delete">
                    <div onClick={() => this.props.deleteSpeaker(speaker)} className="icon icon-trash"></div>
                </td>
            </tr>
        );
    }
}

export default SpeakerRow;