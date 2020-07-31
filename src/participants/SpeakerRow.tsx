import React from 'react';
import { EditText } from '../utils/EditText';
import { Toggle } from '../utils/Toggle';
import { Speaker } from '../types/Speaker';
import { Trash } from 'react-bootstrap-icons';


type SpeakerRowProps = {
    speaker: Speaker,
    updateSpeaker: (speaker: Speaker) => void,
    deleteSpeaker: (speaker: Speaker) => void
}

class SpeakerRow extends React.PureComponent<SpeakerRowProps> {
    constructor(props: SpeakerRowProps) {
        super(props);

        this.handleSpeakerUpdate = this.handleSpeakerUpdate.bind(this);
    }

    handleSpeakerUpdate(name: string, value: string | boolean) {
        const speaker = {...this.props.speaker, [name]: value};
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
                    <Toggle
                        id={speaker.speakerID}
                        name="disqualified"
                        init={speaker.disqualified}
                        fn={this.handleSpeakerUpdate} />
                </td>
                <td className="table-delete">
                    <div title={`Remove ${speaker.name}`}
                        onClick={() => this.props.deleteSpeaker(speaker)}>
                        <Trash
                            role="button"
                            className="icon trash" />
                    </div>
                </td>
            </tr>
        );
    }
}

export default SpeakerRow;