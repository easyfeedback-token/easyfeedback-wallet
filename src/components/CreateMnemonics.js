import React from 'react';
import WalletService from '../services/Ethereum'
import MnemonicService from '../services/Mnemonic'
import { withRouter } from 'react-router-dom';

class CreateMnemonics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mnemonic: '',
            mnemonicArray: [],
            checked: '',
            message: '',
        }
        this.handleChecked = this.handleChecked.bind(this);
    }

    componentDidMount() {
        this.makeTempMnemonic();
    }
    makeTempMnemonic() {
        const newMnemonic = WalletService.getTempMnemonic();
        const array = MnemonicService.StringToArray(newMnemonic);
        const newState = {
            mnemonic: newMnemonic,
            mnemonicArray: array,
        }

        this.setState(newState)
    }
    proceedToVerify() {
        //change page to VerifyMnemonic
        const { history } = this.props;
        if (history) history.push('/verify');
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

    render() {
        return (
            <div className="container create-wallet">
                <br />
                <h1> Please Carefully Write Down This Seed Phrase (12 words, in the same order, with spaces between words)</h1>
                <div className="flex-container create-mnemonic-container">
                    {this.state.mnemonicArray.map((word, index) => { return (<div className="mnemonic-word" key={index}>{word}</div>) })}
                </div>
                <p className="mnemonic-info">
                    <ul>
                        <li>The seed phrase is used to backup your wallet. This seed phrase is unique and should be kept
                        secret because it ´ s the key to access and spend your digital token.</li>
                        <li>Do not take a screenshot of this seed phrase. We advice you to write it down on physical paper.</li>
                        <li>We cannot recover or reset your seed phrase .</li>
                    </ul>
                    Keep your seed phrase safe, <b>it's your responsibility!</b>
                </p>
                <h3>Tips on storing it safely</h3>
                <ol>
                    <li>Do not store this seed phrase on your computer.</li>
                    <li>Save a backup in multiple places.</li>
                    <li>Never share the phrase with anyone.</li>
                    <li>Be careful of phishing! EasyFeedback will never spontaneously ask for your seed
                        phrase</li>
                </ol>
                <br />
                <div className="accept-check">
                    <input type="checkbox" className="" checked={this.state.checked} onChange={this.handleChecked} />
                    <label>I have read and aggree to the <a href="https://www.easyfeedbacktoken.io/easy-feedback-token-ou-legal-documents/">Terms of Use</a></label>
                </div>
                <p className="alert-msg">{this.state.message}</p>
                <button
                    disabled={!this.state.checked}
                    className="btn action-btn btn-block" onClick={() => this.proceedToVerify()} >I have written the words down</button>
            </div>
        );
    }
}

export default withRouter(CreateMnemonics)

