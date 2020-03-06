import React from 'react';
import IconTrash from '../images/icon-trash.svg';
import IconTrashFilled from '../images/icon-trash-fill.svg';

import Form from 'react-bootstrap/Form';


class SpeakerRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: this.props.speaker.name,
            disqualified: this.props.speaker.disqualified,
            trash: IconTrash
        }

        this.handleSpeakerNameEdit = this.handleSpeakerNameEdit.bind(this);
        this.handleSpeakerNameUpdate = this.handleSpeakerNameUpdate.bind(this);
        this.handleDisqUpdate = this.handleDisqUpdate.bind(this);
        this.trashOnMouseEnter = this.trashOnMouseEnter.bind(this);
        this.trashOnMouseLeave = this.trashOnMouseLeave.bind(this);
    }

    handleSpeakerNameEdit(event) {
        this.setState({name: event.target.value});
    }
    
    handleSpeakerNameUpdate(event) {
        event.preventDefault();
        const name = this.state.name;
        const speaker = this.props.speaker;
        speaker.name = name;
        this.props.updateSpeaker(speaker);
    }

    handleDisqUpdate(event) {
        const checked = event.target.checked;
        const speaker = this.props.speaker;
        speaker.disqualified = checked;
        this.setState({disqualified: checked});
        this.props.updateSpeaker(speaker);
    }

    trashOnMouseEnter() {
        this.setState({trash: IconTrashFilled});
    }

    trashOnMouseLeave() {
        this.setState({trash: IconTrash});
    }
    
    render() {
        const speaker = this.props.speaker;

        return (
            <tr key={`speaker-row-${speaker.debaterID}`}>
                <td className="editable">
                    <textarea
                        className="cell-valupdate"
                        rows="1"
                        cols="25"
                        autoComplete="off"
                        spellCheck="false"
                        value={this.state.name}
                        onChange={this.handleSpeakerNameEdit}
                        onBlur={this.handleSpeakerNameUpdate} />
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
                    <img
                        src={this.state.trash}
                        alt="Icon of trash can"
                        role="button"
                        className="icon"
                        onMouseEnter={this.trashOnMouseEnter}
                        onMouseLeave={this.trashOnMouseLeave}
                        onClick={() => this.props.deleteSpeaker(speaker)} />
                </td>
            </tr>
        );
    }
}

export default SpeakerRow;