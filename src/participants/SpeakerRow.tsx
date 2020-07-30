import React, { ChangeEvent, FocusEvent } from 'react';
import { TrashButton } from '../utils/TrashButton';
import Form from 'react-bootstrap/Form';
import { Speaker } from '../types/Speaker';


type SpeakerRowProps = {
    speaker: Speaker,
    updateSpeaker: (speaker: Speaker) => void,
    deleteSpeaker: (speaker: Speaker) => void
}

type SpeakerRowState = {
    name: string,
    school: string,
    disqualified: boolean,
    [key: string]: string|boolean
}

class SpeakerRow extends React.Component<SpeakerRowProps, SpeakerRowState> {
    constructor(props: SpeakerRowProps) {
        super(props);

        this.state = {
            name: this.props.speaker.name,
            school: this.props.speaker.school,
            disqualified: this.props.speaker.disqualified
        }

        this.handleTextEdit = this.handleTextEdit.bind(this);
        this.handleTextUpdate = this.handleTextUpdate.bind(this);
        this.handleDisqUpdate = this.handleDisqUpdate.bind(this);
    }

    handleTextEdit(event: ChangeEvent<HTMLTextAreaElement>) {
        const {name, value} = event.target;
        let state = {...this.state};
        state[name] = value;
        this.setState(state);
    }
    
    handleTextUpdate(event: FocusEvent<HTMLTextAreaElement>) {
        event.preventDefault();
        const name = event.target.name;
        const value = this.state[name];
        const speaker = this.props.speaker;
        speaker[name] = value;
        this.props.updateSpeaker(speaker);
    }

    handleDisqUpdate(event: ChangeEvent<HTMLInputElement>) {
        const checked = event.target.checked;
        const speaker = this.props.speaker;
        speaker.disqualified = checked;
        this.setState({disqualified: checked});
        this.props.updateSpeaker(speaker);
    }
    
    render() {
        const speaker = this.props.speaker;

        return (
            <tr key={`speaker-row-${speaker.speakerID}`}>
                <td className="editable">
                    <textarea
                        className="cell-valupdate"
                        name="name"
                        rows={1}
                        cols={this.state.name.length > 8 ? this.state.name.length : 8}
                        autoComplete="off"
                        spellCheck="false"
                        value={this.state.name}
                        onChange={this.handleTextEdit}
                        onBlur={this.handleTextUpdate} />
                </td>
                <td className="editable">
                    <textarea
                        className="cell-valupdate"
                        name="school"
                        rows={1}
                        cols={this.state.school.length > 8 ? this.state.school.length : 8}
                        autoComplete="off"
                        spellCheck="false"
                        value={this.state.school}
                        onChange={this.handleTextEdit}
                        onBlur={this.handleTextUpdate} />
                </td>
                <td className="cell-low-padding">
                    <Form.Check
                        id={`speaker-disq-${speaker.speakerID}`}
                        type="switch"
                        name="disqualified"
                        label=""
                        onChange={this.handleDisqUpdate}
                        checked={this.state.disqualified}
                        className={this.state.disqualified ? "on" : "off"} />
                </td>
                <td className="table-delete">
                    <div onClick={() => this.props.deleteSpeaker(speaker)}>
                        <TrashButton />
                    </div>
                </td>
            </tr>
        );
    }
}

export default SpeakerRow;