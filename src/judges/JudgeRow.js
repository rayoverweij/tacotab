import React from 'react';
import IconTrash from '../images/icon-trash.svg';
import IconTrashFilled from '../images/icon-trash-fill.svg';

import Form from 'react-bootstrap/Form';


class JudgeRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: this.props.judge.name,
            canChair: this.props.judge.canChair,
            r1: this.props.judge.r1,
            r2: this.props.judge.r2,
            r3: this.props.judge.r3,
            trash: IconTrash
        }

        this.handleJudgeNameEdit = this.handleJudgeNameEdit.bind(this);
        this.handleJudgeNameUpdate = this.handleJudgeNameUpdate.bind(this);
        this.handleJudgeToggle = this.handleJudgeToggle.bind(this);
        this.trashOnMouseEnter = this.trashOnMouseEnter.bind(this);
        this.trashOnMouseLeave = this.trashOnMouseLeave.bind(this);
    }

    handleJudgeNameEdit(event) {
        this.setState({name: event.target.value});
    }

    handleJudgeNameUpdate(event) {
        event.preventDefault();
        const name = this.state.name;
        const judge = this.props.judge;
        judge.name = name;
        this.props.updateJudge(judge);
    }

    handleJudgeToggle(event) {
        const name = event.target.name;
        const checked = event.target.checked;
        const judge = this.props.judge;

        judge[name] = checked;
        this.setState({[name]: checked});

        this.props.updateJudge(judge);
    }

    trashOnMouseEnter() {
        this.setState({trash: IconTrashFilled});
    }

    trashOnMouseLeave() {
        this.setState({trash: IconTrash});
    }

    
    render() {
        return (
            <tr>
                <td className="judge-table-name editable">
                    <textarea
                        className="cell-valupdate"
                        rows="1"
                        cols="25"
                        autoComplete="off"
                        spellCheck="false"
                        value={this.state.name}
                        onChange={this.handleJudgeNameEdit}
                        onBlur={this.handleJudgeNameUpdate} />
                </td>
                <td className="judge-table-school">{this.props.judge.school}</td>
                <td className="judge-table-toggle cell-low-padding">
                    <Form.Switch
                        id={`judge-canchair-${this.props.judge.judgeID}`}
                        name="canChair"
                        label=""
                        onChange={this.handleJudgeToggle}
                        checked={this.state.canChair}
                        className={this.state.canChair ? "on" : "off"} />
                </td>
                <td className="judge-table-toggle cell-low-padding">
                    <Form.Switch
                        id={`judge-r1-${this.props.judge.judgeID}`}
                        name="r1"
                        label=""
                        onChange={this.handleJudgeToggle}
                        checked={this.state.r1}
                        className={this.state.r1 ? "on" : "off"} />
                </td>
                <td className="judge-table-toggle cell-low-padding">
                    <Form.Switch
                        id={`judge-r2-${this.props.judge.judgeID}`}
                        name="r2"
                        label=""
                        onChange={this.handleJudgeToggle}
                        checked={this.state.r2}
                        className={this.state.r2 ? "on" : "off"} />
                </td>
                <td className="judge-table-toggle cell-low-padding">
                    <Form.Switch
                        id={`judge-r3-${this.props.judge.judgeID}`}
                        name="r3"
                        label=""
                        onChange={this.handleJudgeToggle}
                        checked={this.state.r3}
                        className={this.state.r3 ? "on" : "off"} />
                </td>
                <td className="table-delete">
                    <img
                        src={this.state.trash}
                        alt="Icon of trash can"
                        role="button"
                        className="icon"
                        onMouseEnter={this.trashOnMouseEnter}
                        onMouseLeave={this.trashOnMouseLeave}
                        onClick={() => this.props.deleteJudge(this.props.judge)} />
                </td>
            </tr>
        );
    }
}

export default JudgeRow;