import React from "react";
import WalletService from "../services/Ethereum";
import MnemonicService from "../services/Mnemonic";

import ReactModal from "react-modal";
import { withRouter } from "react-router-dom";
ReactModal.setAppElement("#root");

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)"
    }
};

class VerifyMnemonics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mnemonic: "",
            inserted: "",
            insertedArray: [],
            buttons: [],
            areDisabled: []
        };
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleSendModal = this.handleSendModal.bind(this);
    }

    componentDidMount() {
        this.clearSelection();
    }

    enterWord(index) {
        //.btn:disabled{ /* styles go here */}
        var booleano = this.state.areDisabled[index];
        var insert = this.state.inserted;
        if (!booleano) {
            insert += this.state.buttons[index] + " ";
        }
        let newbool = MnemonicService.SetBoolList(
            this.state.areDisabled,
            index
        );
        let isReady = MnemonicService.canConfirm(newbool);
        let insertArray = MnemonicService.StringToArray(insert);
        this.setState({
            areDisabled: newbool,
            inserted: insert,
            insertedArray: insertArray,
            notSelected: isReady
        });
    }

    verifyMnemonic() {
        var response = MnemonicService.verify(
            this.state.inserted,
            this.state.mnemonic
        );
        if (response) {
            this.props.onUpdateMnemonic(this.state.mnemonic);
            localStorage.removeItem("vault_temp");
            const { history } = this.props;
            if (history) history.push("/wallet");
        } else {
            this.handleOpenModal();
        }
    }
    clearSelection() {
        const newMnemonic = WalletService.getTempMnemonic();
        let list = MnemonicService.GetWordList();
        let list2 = MnemonicService.GetBoolList();
        const newState = {
            mnemonic: newMnemonic,
            buttons: list,
            areDisabled: list2,
            notSelected: true,
            inserted: "",
            insertedArray: []
        };
        this.setState(newState);
    }
    handleOpenModal() {
        this.setState({ showModal: true });
    }
    handleCloseModal() {
        this.setState({ showModal: false });
    }
    handleSendModal() {
        this.setState({ showModal: false });
        this.clearSelection();
    }

    render() {
        return (
            <div className="container verify-mnemonic">
                <h1> Now Verify Your Backup Seed Phrase</h1>
                <div className="flex-container mnemonic-words">
                    {this.state.insertedArray.map((user, index) => {
                        return <div key={index}>{user}</div>;
                    })}
                </div>
                <h3> Select each word in the correct order</h3>
                <div className="flex-container words-buttons">
                    <div>
                        <button
                            className="btn btn-secondary"
                            onClick={() => this.enterWord(0)}
                            disabled={this.state.areDisabled[0]}>
                            {this.state.buttons[0]}
                        </button>
                    </div>
                    <div>
                        {" "}
                        <button
                            className="btn btn-secondary"
                            onClick={() => this.enterWord(1)}
                            disabled={this.state.areDisabled[1]}>
                            {this.state.buttons[1]}
                        </button>
                    </div>
                    <div>
                        <button
                            className="btn btn-secondary"
                            onClick={() => this.enterWord(2)}
                            disabled={this.state.areDisabled[2]}>
                            {this.state.buttons[2]}
                        </button>
                    </div>
                    <div>
                        <button
                            className="btn btn-secondary"
                            onClick={() => this.enterWord(3)}
                            disabled={this.state.areDisabled[3]}>
                            {this.state.buttons[3]}
                        </button>
                    </div>
                    <div>
                        <button
                            className="btn btn-secondary"
                            onClick={() => this.enterWord(4)}
                            disabled={this.state.areDisabled[4]}>
                            {this.state.buttons[4]}
                        </button>
                    </div>
                    <div>
                        <button
                            className="btn btn-secondary"
                            onClick={() => this.enterWord(5)}
                            disabled={this.state.areDisabled[5]}>
                            {this.state.buttons[5]}
                        </button>
                    </div>
                    <div>
                        <button
                            className="btn btn-secondary"
                            onClick={() => this.enterWord(6)}
                            disabled={this.state.areDisabled[6]}>
                            {this.state.buttons[6]}
                        </button>
                    </div>
                    <div>
                        <button
                            className="btn btn-secondary"
                            onClick={() => this.enterWord(7)}
                            disabled={this.state.areDisabled[7]}>
                            {this.state.buttons[7]}
                        </button>
                    </div>
                    <div>
                        <button
                            className="btn btn-secondary"
                            onClick={() => this.enterWord(8)}
                            disabled={this.state.areDisabled[8]}>
                            {this.state.buttons[8]}
                        </button>
                    </div>
                    <div>
                        <button
                            className="btn btn-secondary"
                            onClick={() => this.enterWord(9)}
                            disabled={this.state.areDisabled[9]}>
                            {this.state.buttons[9]}
                        </button>
                    </div>
                    <div>
                        <button
                            className="btn btn-secondary"
                            onClick={() => this.enterWord(10)}
                            disabled={this.state.areDisabled[10]}>
                            {this.state.buttons[10]}
                        </button>
                    </div>
                    <div>
                        <button
                            className="btn btn-secondary"
                            onClick={() => this.enterWord(11)}
                            disabled={this.state.areDisabled[11]}>
                            {this.state.buttons[11]}
                        </button>
                    </div>
                </div>{" "}
                <br />
                <button
                    className="btn action-btn btn-block"
                    onClick={() => this.verifyMnemonic()}
                    disabled={this.state.notSelected}>
                    Confirm
                </button>{" "}
                <br />
                <button
                    className="btn btn-secondary btn-block"
                    onClick={() => this.clearSelection()}>
                    Clear
                </button>
                <ReactModal
                    isOpen={this.state.showModal}
                    onRequestClose={this.handleCloseModal}
                    style={customStyles}
                    contentLabel="Oops!">
                    <div className="container modal-body">
                        <h2>Uh oh...</h2>
                        <div>
                            <p>
                                It's important that you write your backup phrase
                                down correctly. If something happens to your
                                wallet, you'll need this backup to recover your
                                money. Please review your backup and try again.
                            </p>
                        </div>
                        <br />
                        <button
                            className="btn action-btn"
                            onClick={this.handleSendModal}>
                            OK
                        </button>
                    </div>
                </ReactModal>
            </div>
        );
    }
}

export default withRouter(VerifyMnemonics);