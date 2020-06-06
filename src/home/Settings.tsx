import React, { ChangeEvent, FormEvent } from 'react';
import './Settings.scss';
import GitHubLogo from '../images/icon-github.svg';
import { Config } from '../types/Config';
import { importTournament } from '../utils/importTournament';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import bsCustomFileInput from 'bs-custom-file-input';
import { Download, Trash } from 'react-bootstrap-icons';


type SettingsProps = {
    config: Config,
    tournamentName: string,
    updateTournamentName: (name: string) => void,
    updateConfig: (config: Config) => void
}

type SettingsState = {
    nameForm: string,
    showModal: boolean
}

class Settings extends React.Component<SettingsProps, SettingsState> {
    constructor(props: SettingsProps) {
        super(props);

        this.state = {
            nameForm: "",
            showModal: false
        }

        this.handleNameFormChange = this.handleNameFormChange.bind(this);
        this.handleNameFormSubmit = this.handleNameFormSubmit.bind(this);
        this.importData = this.importData.bind(this);
        this.exportData = this.exportData.bind(this);
        this.clearData = this.clearData.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    componentDidMount() {
        bsCustomFileInput.init();
    }


    handleNameFormChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({nameForm: event.target.value});
    }

    handleNameFormSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const name = this.state.nameForm;
        this.props.updateTournamentName(name);
        this.setState({nameForm: ""});
    }

    importData(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const files = (document.getElementById("import-settings") as HTMLInputElement).files;
        if (files === null) return false;
        importTournament(files);
    }

    exportData() {
        let data = "data:text/json;charset=utf-8,";
        data += encodeURIComponent("{");
        data += encodeURIComponent('"init": ' + localStorage.getItem("init") + ",");
        data += encodeURIComponent('"tournamentName": ' + localStorage.getItem("tournamentName") + ",");
        data += encodeURIComponent('"config": ' + localStorage.getItem("config") + ",");
        data += encodeURIComponent('"speakersOne": ' + localStorage.getItem("speakersOne") + ",");
        data += encodeURIComponent('"teamsOne": ' + localStorage.getItem("teamsOne") + ",");
        data += encodeURIComponent('"speakersTwo": ' + localStorage.getItem("speakersTwo") + ",");
        data += encodeURIComponent('"teamsTwo": ' + localStorage.getItem("teamsTwo") + ",");
        data += encodeURIComponent('"speakerCounter": ' + localStorage.getItem("speakerCounter") + ",");
        data += encodeURIComponent('"teamCounter": ' + localStorage.getItem("teamCounter") + ",");
        data += encodeURIComponent('"judges": ' + localStorage.getItem("judges") + ",");
        data += encodeURIComponent('"judgeCounter": ' + localStorage.getItem("judgeCounter") + ",");
        data += encodeURIComponent('"draws": ' + localStorage.getItem("draws"));
        data += encodeURIComponent("}");
        
        let name = this.props.tournamentName;
        name = name.replace(/\s+/g, '-').toLowerCase();
        name += ".tournament";

        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", data);
        downloadAnchorNode.setAttribute("download", name);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
 
    clearData() {
        const conf = window.confirm("Are you sure you want to delete all data?");
        if(!conf) return false;
        localStorage.clear();
        window.location.reload();
    }

    showModal() { this.setState({showModal: true}); }
    hideModal() { this.setState({showModal: false}); }


    render() {
        return (
            <>
                <div>
                    <h2>Settings</h2>
                    <Row>
                        <Col lg={8} className="col-settings">
                            <p>Manage your tournament.</p>
                            <section>
                                <h3>Change tournament name</h3>
                                <Form onSubmit={this.handleNameFormSubmit}>
                                    <Form.Row>
                                        <Col sm={9} xl={6}>
                                            <Form.Control
                                                name="tournament-name"
                                                type="text"
                                                placeholder="New name"
                                                value={this.state.nameForm}
                                                onChange={this.handleNameFormChange} />
                                        </Col>
                                        <Col>
                                            <Button
                                                variant="primary"
                                                type="submit">
                                                Save
                                            </Button>
                                        </Col>
                                    </Form.Row>
                                </Form>
                            </section>
                            <section>
                                <h3>Import tournament data</h3>
                                <p>Open files generated with the Export function below. <strong>Note:</strong> this will override all current data!</p>
                                <Form onSubmit={this.importData}>
                                    <Form.Row>
                                        <Col xs={9} xl={6}>
                                            <div className="custom-file">
                                                <Form.Control
                                                    name="import"
                                                    id="import-settings"
                                                    className="custom-file-input"
                                                    type="file"
                                                    accept=".tournament,.json" />
                                                <label className="custom-file-label" htmlFor="customFile">Choose file</label>
                                            </div>
                                        </Col>
                                        <Col>
                                            <Button variant="primary" type="submit">Import</Button>
                                        </Col>
                                    </Form.Row>
                                </Form>
                            </section>
                            <section>
                                <h3>Export tournament data</h3>
                                <p>Save all tournament data to a file on your PC.</p>
                                <Button
                                    variant="primary"
                                    onClick={this.exportData}>
                                    <Download className="btn-icon" />
                                    Export data
                                </Button>
                            </section>
                            <section id="section-cleardata">
                                <h3>Clear tournament data</h3>
                                <p>Warning: this will delete <strong>all</strong> entered data. Save your data using the Export function first.</p>
                                <Button
                                    variant="danger"
                                    onClick={this.clearData}>
                                    <Trash className="btn-icon" />
                                    Clear data
                                </Button>
                            </section>
                        </Col>
                        <Col lg={4} className="col-settings">
                            <section id="section-about">
                                <h3>About</h3>
                                <p>
                                    TacoTab β version 0.4.1<br />
                                    &copy; {new Date().getFullYear()} Rayo Verweij<br />
                                    <img src={GitHubLogo} alt="GitHub logo" id="logo-github"/>&nbsp;
                                    <a href="https://github.com/rayoverweij/tacotab" rel="noopener noreferrer" target="_blank">
                                        GitHub
                                    </a>
                                    &nbsp;&middot;&nbsp;<span className="fake-anchor" onClick={this.showModal}>What's new</span>
                                </p>
                                <p>
                                    <a href="https://rayo.dev" rel="noopener noreferrer" target="_blank">Check out more of Rayo's work</a> or <a href="https://debate.bard.edu" rel="noopener noreferrer" target="_blank">visit the Bard Debate Union</a>&mdash;Bard's best sports team!
                                </p>
                            </section>
                        </Col>
                    </Row>
                </div>

                <Modal
                    show={this.state.showModal}
                    onHide={this.hideModal}
                    className="whatsnew-modal"
                    aria-labelledby="whatsnew-modal-title" >
                    <Modal.Header closeButton>
                        <Modal.Title id="whatsnew-modal-title">
                            What's new
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>
                            New in version 0.4.1:
                            <ul>
                                <li>General: last update's design refresh has been refined, with clearer headings and more space to work</li>
                                <li>Draw: chairs that have already chaired one of the teams in their room before are marked in orange</li>
                                <li>Draw: a new legend explains the colors that teams and judges get when there is a clash</li>
                                <li>Fixed some bugs with team swapping</li>
                                <li>Fixed a bug where teams didn't properly remember their opponents for checking in later draws</li>
                                <li>Under-the-hood: information that can be gathered from looking at previous round (e.g. a team's previous opponents, or a chair's previous rooms) is now only stored in the draw, and not duplicated in the team and judge objects</li>
                            </ul>
                            For an overview of changes made in previous versions, see <a href="https://github.com/rayoverweij/tacotab/releases" target="_blank" rel="noreferrer noopener">GitHub</a>.
                        </p>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

export default Settings;