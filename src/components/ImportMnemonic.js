import React from 'react';
import WalletService from "../services/Ethereum";
import { withRouter } from 'react-router-dom';
import ReactModal from "react-modal";


ReactModal.setAppElement('#root');

class ImportMnemonic extends React.Component {

    constructor() {
        super();
        this.state = {
            mnemonic: '',
            message: '',
            checked: '',
            isChecked: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleImport = this.handleImport.bind(this);
        this.failedMnemonic = this.failedMnemonic.bind(this);
        this.handleChecked = this.handleChecked.bind(this);
    }

    render() {
        return (
            <div className="container">
                <h1>Import Your Existing Wallet Using a 12 Word Seed Phrase</h1>
                <br />
                <h3>Please insert your 12 words, in the same order, with spaces between words.</h3>
                <br />
                <div className="accept-check">
                    <input type="checkbox" className="" checked={this.state.checked} onChange={this.handleChecked} />
                    <label>I have read and aggree to the <a href="https://www.easyfeedbacktoken.io/easy-feedback-token-ou-legal-documents/">Terms of Use</a></label>
                </div>
                <p className="alert-msg">{this.state.message}</p>
                <div className="input-group mb-3">
                    <input className="form-control" type='text' onChange={this.handleChange} />
                    <div className="input-group-append">
                        <button
                            disabled={!this.state.checked}
                            className="btn action-btn" onClick={this.handleImport}>Import</button>
                    </div>
                </div>
            </div>
        )
    }

    failedMnemonic() {
        const newState = {
            message:
                "Invalid seed phrase. A seed phrase consist of twelve words separated by spaces."
        };
        this.setState(newState);
    }


    handleImport() {
        const mnemonic = this.state.mnemonic.trim();
        try {
            if (WalletService.checkMnemonicFormat(mnemonic) && WalletService.validateMnemonic(mnemonic)) {
                this.props.onUpdateMnemonic(mnemonic);
                const newState = {
                    message: ''
                };
                this.setState(newState);
                //refresh/go to wallet
                const { history } = this.props;
                if (history) history.push('/wallet');
            } else {
                this.failedMnemonic();
            }
        } catch (e) {
            this.failedMnemonic();
        }
    }

    handleChange(e) {
        const newState = { mnemonic: e.target.value };
        this.setState(newState);
    }

    handleChecked(e) {
        const newState = { checked: e.target.checked };
        this.setState(newState);
        if (this.state.checked === true) {
            this.failedCheck();
        } else {
            const newState = {
                message: ''
            };
            this.setState(newState);
        }
    }

    failedCheck() {
        const newState = { message: 'Please accept the Terms and Conditions to continue' };
        this.setState(newState);
    }

}

export default withRouter(ImportMnemonic);