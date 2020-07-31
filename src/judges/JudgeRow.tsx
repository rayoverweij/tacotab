import React from 'react';
import { EditText } from '../utils/EditText';
import { Toggle } from '../utils/Toggle';
import { Judge } from '../types/Judge';
import { Trash } from 'react-bootstrap-icons';


type JudgeRowProps = {
    judge: Judge,
    updateJudge: (judge: Judge) => void,
    deleteJudge: (judge: Judge) => void
}

class JudgeRow extends React.PureComponent<JudgeRowProps> {
    constructor(props: JudgeRowProps) {
        super(props);

        this.handleJudgeUpdate = this.handleJudgeUpdate.bind(this);
    }

    handleJudgeUpdate(name: string, value: string | boolean) {
        const judge = {...this.props.judge, [name]: value};
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
                        fn={this.handleJudgeUpdate} />
                </td>
                <td className="judge-table-school editable">
                    <EditText
                        name="school"
                        init={judge.school}
                        fn={this.handleJudgeUpdate} />
                </td>
                <td className="judge-table-toggle cell-low-padding">
                    <Toggle
                        id={judge.judgeID}
                        name="canChair"
                        init={judge.canChair}
                        fn={this.handleJudgeUpdate} />
                </td>
                <td className="judge-table-toggle cell-low-padding">
                    <Toggle
                        id={judge.judgeID}
                        name="atRound1"
                        init={judge.atRound1}
                        fn={this.handleJudgeUpdate} />
                </td>
                <td className="judge-table-toggle cell-low-padding">
                    <Toggle
                        id={judge.judgeID}
                        name="atRound2"
                        init={judge.atRound2}
                        fn={this.handleJudgeUpdate} />
                </td>
                <td className="judge-table-toggle cell-low-padding">
                    <Toggle
                        id={judge.judgeID}
                        name="atRound3"
                        init={judge.atRound3}
                        fn={this.handleJudgeUpdate} />
                </td>
                <td className="table-delete">
                    <div title={`Remove ${judge.name}`}
                        onClick={() => this.props.deleteJudge(judge)}>
                        <Trash
                            role="button"
                            className="icon trash" />
                    </div>
                </td>
            </tr>
        );
    }
}

export default JudgeRow;