import React from 'react';

import Form from 'react-bootstrap/Form';


class SpeakerRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            disqualified: this.props.speaker.disqualified
        }

        this.handleDisqUpdate = this.handleDisqUpdate.bind(this);
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
                <td>{speaker.name}</td>
                <td>{speaker.school}</td>
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