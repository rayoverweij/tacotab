import React, { ChangeEvent } from 'react';
import { EditText } from '../utils/EditText';
import { TrashButton } from '../utils/TrashButton';
import { Judge } from '../types/Judge';
import Form from 'react-bootstrap/Form';


type JudgeRowProps = {
    judge: Judge,
    updateJudge: (judge: Judge) => void,
    deleteJudge: (judge: Judge) => void
}

type JudgeRowState = {
    canChair: boolean,
    atRound1: boolean,
    atRound2: boolean,
    atRound3: boolean,
    [key: string]: boolean
}

class JudgeRow extends React.PureComponent<JudgeRowProps, JudgeRowState> {
    constructor(props: JudgeRowProps) {
        super(props);

        this.state = {
            canChair: this.props.judge.canChair,
            atRound1: this.props.judge.atRound1,
            atRound2: this.props.judge.atRound2,
            atRound3: this.props.judge.atRound3
        }

        this.handleJudgeUpdate = this.handleJudgeUpdate.bind(this);
        this.handleJudgeToggle = this.handleJudgeToggle.bind(this);
    }


    handleJudgeUpdate(name: string, value: string) {
        const judge = {...this.props.judge, [name]: value};
        this.props.updateJudge(judge);
    }

    handleJudgeToggle(event: ChangeEvent<HTMLInputElement>) {
        const {name, checked} = event.target;
        const judge = {...this.props.judge};

        judge[name] = checked;
        this.setState({[name]: checked});

        this.props.updateJudge(judge);
    }

    
    render() {
        const judge = this.props.judge;

        return (
            <tr>
                <td className="judge-table-name editable">
                    <EditText
                        name="name"
                        init={judge.name}
                        cols="auto"
                        fn={this.handleJudgeUpdate} />
                </td>
                <td className="judge-table-school editable">
                    <EditText
                        name="school"
                        init={judge.school}
                        cols="auto"
                        fn={this.handleJudgeUpdate} />
                </td>
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
                    <div onClick={() => this.props.deleteJudge(judge)}>
                        <TrashButton />
                    </div>
                </td>
            </tr>
        );
    }
}

export default JudgeRow;