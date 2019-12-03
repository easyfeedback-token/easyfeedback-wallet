import React from 'react';
import './css/styles.css';
import './css/terms-styles.css';
import MnemonicService from './services/Mnemonic'
import NavBar from './components/NavBar'
import NavBarAlt from './components/NavBarAlt'
import WalletInfo from './components/WalletInfo'
import CreateMnemonics from './components/CreateMnemonics'
import VerifyMnemonics from './components/VerifyMnemonics'
import NotFound from './components/NotFound'
import FirstPage from './components/FirstPage'
import {
    Route,
    HashRouter,
    Switch,
} from "react-router-dom";

import ImportMnemonic from './components/ImportMnemonic';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasMnemonic: this.hasMnemonic(),
            mnemonic: MnemonicService.getMnemonicFrom(),
        };

        this.hasMnemonic = this.hasMnemonic.bind(this);
        this.updateMnemonic = this.updateMnemonic.bind(this);
    }


    hasMnemonic() {
        return MnemonicService.hasMnemonic();
    }

    updateMnemonic(mnemonic) {
        MnemonicService.saveMnemonicTo(mnemonic);
        //encrypth and save state
        const newState = {mnemonic : MnemonicService.justEncrypt(mnemonic)};
        this.setState(newState);
    }
    decodeMnemonic(mnemonic){
        try{
            let decripted = MnemonicService.justDecrypt(mnemonic);
            return decripted;
        }
        catch (e) {
            return "";
        }

    }

    render() {
        const Start = () => (
            <div>
                <NavBarAlt />
                <FirstPage mnemonic = {this.state.mnemonic} onDecode={this.decodeMnemonic}/>
            </div>
        );
        const Verify = () => (
            <div>
                <NavBar/>
                <VerifyMnemonics onUpdateMnemonic = {this.updateMnemonic}/>
            </div>
        );
        const Create = () => (
            <div>
                <NavBar/>
                <CreateMnemonics />
            </div>
        );
        const Import = () => (
            <div>
                <NavBar/>
                <div className="import-container">
                    <ImportMnemonic onUpdateMnemonic = {this.updateMnemonic}/>
                </div>
            </div>
        );
        const Wallet = () => (
            <div>
                <NavBar mnemonic = {this.state.mnemonic} onUpdateMnemonic = {this.updateMnemonic}/>
                <WalletInfo mnemonic = {this.state.mnemonic}/>
            </div>
        );
        const E404 = () => (
            <div>
                <NavBar />
                <NotFound/>
            </div>
        );
        return (
            <HashRouter >
                <div>
                    <Switch>
                        <Route exact path="/" component={Start}/>
                        <Route path="/import" component={Import}/>
                        <Route path="/create" component={Create}/>
                        <Route path="/verify" component={Verify}/>
                        <Route path="/wallet" component={Wallet}/>
                        <Route component={E404} />
                    </Switch>
                </div>
            </HashRouter>
        );
    }
}

export default App;
