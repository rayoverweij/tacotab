import React from 'react';

import Form from 'react-bootstrap/Form';


class JudgeRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            canChair: this.props.judge.canChair,
            r1: this.props.judge.r1,
            r2: this.props.judge.r2,
            r3: this.props.judge.r3
        }

        this.handleJudgeToggle = this.handleJudgeToggle.bind(this);
    }


    handleJudgeToggle(event) {
        const name = event.target.name;
        const checked = event.target.checked;
        const judge = this.props.judge;

        judge[name] = checked;
        this.setState({[name]: checked});

        this.props.updateJudge(judge);
    }

    
    render() {
        return (
            <tr>
                <td className="judge-table-name">{this.props.judge.name}</td>
                <td className="cell-low-padding">
                    <Form.Switch
                        name="canChair"
                        onChange={this.handleJudgeToggle}
                        checked={this.state.canChair}
                        className={this.state.canChair ? "on" : "off"} />
                </td>
                <td className="cell-low-padding">
                    <Form.Switch
                        name="r1"
                        onChange={this.handleJudgeToggle}
                        checked={this.state.r1}
                        className={this.state.r1 ? "on" : "off"} />
                </td>
                <td className="cell-low-padding">
                    <Form.Switch
                        name="r2"
                        onChange={this.handleJudgeToggle}
                        checked={this.state.r2}
                        className={this.state.r2 ? "on" : "off"} />
                </td>
                <td className="cell-low-padding">
                    <Form.Switch
                        name="r3"
                        onChange={this.handleJudgeToggle}
                        checked={this.state.r3}
                        className={this.state.r3 ? "on" : "off"} />
                </td>
                <td className="table-delete cell-low-padding">
                    <div onClick={() => this.props.deleteJudge(this.props.judge)} className="icon icon-trash"></div>
                </td>
            </tr>
        );
    }
}

export default JudgeRow;