import React, { ChangeEvent, FormEvent } from 'react';
import './Settings.scss';
import GitHubLogo from '../images/icon-github.svg';
import pkg from '../../package.json';
import { Config } from '../types/Config';
import { importTournament } from '../utils/importTournament';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import bsCustomFileInput from 'bs-custom-file-input';
import { Download, Trash, CheckCircleFill } from 'react-bootstrap-icons';


type SettingsProps = {
    config: Config,
    tournamentName: string,
    updateTournamentName: (name: string) => void,
    updateConfig: (config: Config) => void
}

type SettingsState = {
    nameForm: string,
    nameFormValidated: boolean,
    nameSaved: boolean,
    importFormValidated: boolean,
    showWhatsNew: boolean,
    showPrivacy: boolean
}

class Settings extends React.PureComponent<SettingsProps, SettingsState> {
    constructor(props: SettingsProps) {
        super(props);

        this.state = {
            nameForm: "",
            nameFormValidated: false,
            nameSaved: false,
            importFormValidated: false,
            showWhatsNew: false,
            showPrivacy: false
        }

        this.handleNameFormChange = this.handleNameFormChange.bind(this);
        this.handleNameFormSubmit = this.handleNameFormSubmit.bind(this);
        this.importData = this.importData.bind(this);
        this.exportData = this.exportData.bind(this);
        this.clearData = this.clearData.bind(this);
        this.showWhatsNew = this.showWhatsNew.bind(this);
        this.hideWhatsNew = this.hideWhatsNew.bind(this);
        this.showPrivacy = this.showPrivacy.bind(this);
        this.hidePrivacy = this.hidePrivacy.bind(this);
    }

    componentDidMount() {
        bsCustomFileInput.init();
    }


    handleNameFormChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({nameForm: event.target.value});
    }

    handleNameFormSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        if(form.checkValidity() === false) {
            event.stopPropagation();
            this.setState({nameFormValidated: true});
            return false;
        }

        const name = this.state.nameForm;
        this.props.updateTournamentName(name);
        this.setState({nameForm: ""});
        this.setState({nameFormValidated: false});
        this.setState({nameSaved: true});
        setTimeout(() => this.setState({nameSaved: false}), 3000);
    }

    importData(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        if(form.checkValidity() === false) {
            event.stopPropagation();
            this.setState({importFormValidated: true});
            return false;
        }

        const files = (document.getElementById("import-settings") as HTMLInputElement).files;
        if (files === null) return false;

        this.setState({importFormValidated: false});
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
        data += encodeURIComponent('"draws": ' + localStorage.getItem("draws") + ",");
        data += encodeURIComponent('"roomCounter": ' + localStorage.getItem("roomCounter"));
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

    showWhatsNew() { this.setState({showWhatsNew: true}); }
    hideWhatsNew() { this.setState({showWhatsNew: false}); }
    showPrivacy() { this.setState({showPrivacy: true}); }
    hidePrivacy() { this.setState({showPrivacy: false}); }


    render() {
        return (
            <>
                <div>
                    <h2>Settings</h2>
                    <Row>
                        <Col lg={8} className="col-override-padding">
                            <p>Manage your tournament.</p>
                            <section>
                                <h3>Change tournament name</h3>
                                <Form
                                    noValidate
                                    validated={this.state.nameFormValidated}
                                    onSubmit={this.handleNameFormSubmit}>
                                    <Form.Row>
                                        <Col sm={9} xl={6}>
                                            <Form.Label srOnly>Tournament name</Form.Label>
                                            <Form.Control
                                                name="tournamentName"
                                                type="text"
                                                placeholder="New name"
                                                required
                                                value={this.state.nameForm}
                                                onChange={this.handleNameFormChange} />
                                            <Form.Control.Feedback type="invalid">
                                                Please enter a name for the tournament.
                                            </Form.Control.Feedback>
                                        </Col>
                                        <Col>
                                            <Button
                                                variant={this.state.nameSaved ? "success" : "primary"}
                                                disabled={this.state.nameSaved}
                                                id="btn-save-tournament-name"
                                                type="submit">
                                                {this.state.nameSaved ? <CheckCircleFill /> : "Save"}
                                            </Button>
                                        </Col>
                                    </Form.Row>
                                </Form>
                            </section>
                            <section>
                                <h3>Import tournament data</h3>
                                <p>Open files generated with the Export function below. <strong>Note:</strong> this will override all current data!</p>
                                <Form
                                    noValidate
                                    validated={this.state.importFormValidated}
                                    onSubmit={this.importData}>
                                    <Form.Row>
                                        <Col xs={9} xl={6}>
                                            <div className="custom-file">
                                                <Form.Label srOnly>Select tournament file</Form.Label>
                                                <Form.Control
                                                    name="import"
                                                    id="import-settings"
                                                    className="custom-file-input"
                                                    type="file"
                                                    required
                                                    accept=".tournament,.json" />
                                                <label className="custom-file-label" htmlFor="customFile">Choose file</label>
                                                <Form.Control.Feedback type="invalid">
                                                    Please select a file from your computer.
                                                </Form.Control.Feedback>
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
                        <Col lg={4} className="col-override-padding">
                            <section id="section-about">
                                <h3>About</h3>
                                <p>
                                    TacoTab β version {pkg.version}<br />
                                    &copy; {new Date().getFullYear()} Rayo Verweij<br />
                                    <img src={GitHubLogo} alt="GitHub logo" id="logo-github"/>&nbsp;
                                    <a href="https://github.com/rayoverweij/tacotab" rel="noopener noreferrer" target="_blank">
                                        GitHub
                                    </a>
                                    &nbsp;&middot;&nbsp;<Button variant="link" onClick={this.showWhatsNew}>What's new</Button>
                                    &nbsp;&middot;&nbsp;<Button variant="link" onClick={this.showPrivacy}>Privacy</Button>
                                </p>
                                <p>
                                    <a href="https://rayo.dev" rel="noopener noreferrer" target="_blank">Check out more of Rayo's work</a> or <a href="https://debate.bard.edu" rel="noopener noreferrer" target="_blank">visit the Bard Debate Union</a>&mdash;Bard's best sports team!
                                </p>
                            </section>
                        </Col>
                    </Row>
                </div>

                <Modal
                    show={this.state.showWhatsNew}
                    onHide={this.hideWhatsNew}
                    className="whatsnew-modal"
                    aria-labelledby="whatsnew-modal-title" >
                    <Modal.Header closeButton>
                        <Modal.Title id="whatsnew-modal-title">
                            What's new
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>
                            New in version {pkg.version}:
                            <ul>
                                <li>General: there is now an option for tournaments to include scores for reply speeches, as an extra tie breaker</li>
                                <li>Home: a new start screen was added with tips to get started and links to the documentation</li>
                            </ul>
                            For an overview of changes made in previous versions, see <a href="https://github.com/rayoverweij/tacotab/releases" target="_blank" rel="noreferrer noopener">GitHub</a>.
                        </p>
                    </Modal.Body>
                </Modal>

                <Modal
                    show={this.state.showPrivacy}
                    onHide={this.hidePrivacy}
                    className="privacy-modal"
                    aria-labelledby="privacy-modal-title" >
                    <Modal.Header closeButton>
                        <Modal.Title id="privacy-modal-title">
                            Privacy Policy
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>
                            We don't collect or store any of your data.
                        </p>
                        <p>
                            It is, quite frankly, impossible for us to do so. There are no servers, no accounts, and no analytics. All data that you enter is stored in the local storage of your browser, and never leaves the instance of the browser you are runnning right now. (In fact, you could download the app and use it without even needing an internet connection!)
                        </p>
                        <p>
                            There are also no third-party services or scripts running in the background that might collect your data, or cookies of any kind. The only way for data to leave this app is if you <em>manually</em> use the "export" function on the Settings page.
                        </p>
                        <p>
                            What happens on your computer stays on your computer!
                        </p>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

export default Settings;