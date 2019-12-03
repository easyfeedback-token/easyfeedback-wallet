import React from "react";
import "../css/styles.css";
import "../css/terms-styles.css";
import ShowMnemonic from "./ShowMnemonic";
import ImportMnemonicModal from "./importMnemonicModal";
import DeleteWallet from "./DelWallet";

class NavBar extends React.Component {
    render() {
        let rightSide = null;

        if (this.props.mnemonic) {
            rightSide = (
                <NavBarRight
                    mnemonic={this.props.mnemonic}
                    onUpdateMnemonic={
                        this.props.onUpdateMnemonic
                    }></NavBarRight>
            );
        }

        return (
            <nav className="navbar navbar-dark bg-dark">
                <a className="navbar-brand" href="/">
                    <img className="logo-img"
                        src={require("../img/Easy-Feedback-Token-EFT-Logo-Blanco.png")}
                        alt="easyfeedbacktoken"
                    />
                </a>
                {rightSide}
            </nav>
        );
    }
}

class NavBarRight extends React.Component {
    render() {
        return (
            <ul className="nav navbar-nav navbar-right">
                <li className="nav-item dropdown">
                    <label
                        className="nav-link"
                        id="walletOptions"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false">
                        <img
                            src={require("../img/wallet.svg")}
                            alt="easyfeedbacktoken"
                            height="40px"
                        />
                    </label>
                    <NavBarRightOptions
                        mnemonic={this.props.mnemonic}
                        onUpdateMnemonic={
                            this.props.onUpdateMnemonic
                        }></NavBarRightOptions>
                </li>
            </ul>
        );
    }
}

class NavBarRightOptions extends React.Component {
    render() {
        return (
            <ul className="dropdown-menu" aria-labelledby="walletOptions">
                <ImportMnemonicModal
                    onUpdateMnemonic={this.props.onUpdateMnemonic}
                />
                <ShowMnemonic mnemonic={this.props.mnemonic} />
                <DeleteWallet
                    onUpdateMnemonic={this.props.onUpdateMnemonic}
                />
            </ul>
        );
    }
}

export default NavBar;
