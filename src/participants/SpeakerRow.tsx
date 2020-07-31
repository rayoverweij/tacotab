import React, { ChangeEvent } from 'react';
import { EditText } from '../utils/EditText';
import { TrashButton } from '../utils/TrashButton';
import Form from 'react-bootstrap/Form';
import { Speaker } from '../types/Speaker';


type SpeakerRowProps = {
    speaker: Speaker,
    updateSpeaker: (speaker: Speaker) => void,
    deleteSpeaker: (speaker: Speaker) => void
}

type SpeakerRowState = {
    disqualified: boolean
}

class SpeakerRow extends React.PureComponent<SpeakerRowProps, SpeakerRowState> {
    constructor(props: SpeakerRowProps) {
        super(props);

        this.state = {
            disqualified: this.props.speaker.disqualified
        }

        this.handleSpeakerUpdate = this.handleSpeakerUpdate.bind(this);
        this.handleDisqUpdate = this.handleDisqUpdate.bind(this);
    }


    handleSpeakerUpdate(name: string, value: string) {
        const speaker = {...this.props.speaker, [name]: value};
        this.props.updateSpeaker(speaker);
    }

    handleDisqUpdate(event: ChangeEvent<HTMLInputElement>) {
        const checked = event.target.checked;
        const speaker = {...this.props.speaker, disqualified: checked};
        this.setState({disqualified: checked});
        this.props.updateSpeaker(speaker);
    }
    

    render() {
        const speaker = this.props.speaker;

        return (
            <tr key={`speaker-row-${speaker.speakerID}`}>
                <td className="editable">
                    <EditText
                        name="name"
                        init={speaker.name}
                        fn={this.handleSpeakerUpdate} />
                </td>
                <td className="editable">
                    <EditText
                        name="school"
                        init={speaker.school}
                        fn={this.handleSpeakerUpdate} />
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
                    <div title={`Remove ${speaker.name}`}
                        onClick={() => this.props.deleteSpeaker(speaker)}>
                        <TrashButton />
                    </div>
                </td>
            </tr>
        );
    }
}

export default SpeakerRow;