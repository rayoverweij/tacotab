import React, { ChangeEvent, FocusEvent } from 'react';
import { Judge } from '../types/Judge';
import Form from 'react-bootstrap/Form';
import { Trash, TrashFill } from 'react-bootstrap-icons';


type JudgeRowProps = {
    judge: Judge,
    updateJudge: (judge: Judge) => void,
    deleteJudge: (judge: Judge) => void
}

type JudgeRowState = {
    name: string,
    canChair: boolean,
    atRound1: boolean,
    atRound2: boolean,
    atRound3: boolean,
    trashFill: boolean,
    [key: string]: string|boolean
}

class JudgeRow extends React.Component<JudgeRowProps, JudgeRowState> {
    constructor(props: JudgeRowProps) {
        super(props);

        this.state = {
            name: this.props.judge.name,
            canChair: this.props.judge.canChair,
            atRound1: this.props.judge.atRound1,
            atRound2: this.props.judge.atRound2,
            atRound3: this.props.judge.atRound3,
            trashFill: false
        }

        this.handleJudgeNameEdit = this.handleJudgeNameEdit.bind(this);
        this.handleJudgeNameUpdate = this.handleJudgeNameUpdate.bind(this);
        this.handleJudgeToggle = this.handleJudgeToggle.bind(this);
        this.trashOnMouseEnter = this.trashOnMouseEnter.bind(this);
        this.trashOnMouseLeave = this.trashOnMouseLeave.bind(this);
    }

    handleJudgeNameEdit(event: ChangeEvent<HTMLTextAreaElement>) {
        this.setState({name: event.target.value});
    }

    handleJudgeNameUpdate(event: FocusEvent<HTMLTextAreaElement>) {
        event.preventDefault();
        const name = this.state.name;
        const judge = this.props.judge;
        judge.name = name;
        this.props.updateJudge(judge);
    }

    handleJudgeToggle(event: ChangeEvent<HTMLInputElement>) {
        const name: keyof Judge = event.target.name;
        const checked = event.target.checked;
        const judge = this.props.judge;

        judge[name] = checked;
        this.setState({[name]: checked});

        this.props.updateJudge(judge);
    }

    trashOnMouseEnter() {
        this.setState({trashFill: true});
    }

    trashOnMouseLeave() {
        this.setState({trashFill: false});
    }

    
    render() {
        const judge = this.props.judge;

        return (
            <tr>
                <td className="judge-table-name editable">
                    <textarea
                        className="cell-valupdate"
                        rows={1}
                        cols={this.state.name.length}
                        autoComplete="off"
                        spellCheck="false"
                        value={this.state.name}
                        onChange={this.handleJudgeNameEdit}
                        onBlur={this.handleJudgeNameUpdate} />
                </td>
                <td className="judge-table-school">{judge.school}</td>
                <td className="judge-table-toggle cell-low-padding">
                    <Form.Check
                        id={`judge-canchair-${judge.judgeID}`}
                        type="switch"
                        name="canChair"
                        label=""
                        onChange={this.handleJudgeToggle}
                        checked={this.state.canChair}
                        className={this.state.canChair ? "on" : "off"} />
                </td>
                <td className="judge-table-toggle cell-low-padding">
                    <Form.Check
                        id={`judge-r1-${judge.judgeID}`}
                        type="switch"
                        name="atRound1"
                        label=""
                        onChange={this.handleJudgeToggle}
                        checked={this.state.atRound1}
                        className={this.state.atRound1 ? "on" : "off"} />
                </td>
                <td className="judge-table-toggle cell-low-padding">
                    <Form.Check
                        id={`judge-r2-${judge.judgeID}`}
                        type="switch"
                        name="atRound2"
                        label=""
                        onChange={this.handleJudgeToggle}
                        checked={this.state.atRound2}
                        className={this.state.atRound2 ? "on" : "off"} />
                </td>
                <td className="judge-table-toggle cell-low-padding">
                    <Form.Check
                        id={`judge-r3-${judge.judgeID}`}
                        type="switch"
                        name="atRound3"
                        label=""
                        onChange={this.handleJudgeToggle}
                        checked={this.state.atRound3}
                        className={this.state.atRound3 ? "on" : "off"} />
                </td>
                <td className="table-delete">
                    {this.state.trashFill ? 
                        <TrashFill
                            role="button"
                            className="icon red"
                            onMouseEnter={this.trashOnMouseEnter}
                            onMouseLeave={this.trashOnMouseLeave}
                            onClick={() => this.props.deleteJudge(judge)} />
                        :
                        <Trash
                            role="button"
                            className="icon"
                            onMouseEnter={this.trashOnMouseEnter}
                            onMouseLeave={this.trashOnMouseLeave}
                            onClick={() => this.props.deleteJudge(judge)} />
                    }
                </td>
            </tr>
        );
    }
}

export default JudgeRow;