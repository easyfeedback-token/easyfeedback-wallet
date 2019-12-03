import React from "react";
import "../css/styles.css";
import "../css/terms-styles.css";
import ContractService from "../services/Contract";
import TabContent from "../components/TabContent";
import { withRouter } from "react-router-dom";
import WalletService from "../services/Ethereum";
import MnemonicService from "../services/Mnemonic";

class WalletInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            balanceEFT: "0.0000",
            balanceETH: "0.0000",
            coin: "EFT",
            selected: "eft-coin"
        };
        this.refreshBalance = this.refreshBalance.bind(this);
    }

    componentDidMount() {
        let tempMnem = MnemonicService.justDecrypt(this.props.mnemonic);
        if (
            this.props.mnemonic == null ||
            this.props.mnemonic === "" ||
            this.props.mnemonic === undefined
        ) {
            const { history } = this.props;
            if (history) history.push("/");
        } else {
            if (
                WalletService.checkMnemonicFormat(tempMnem) &&
                WalletService.validateMnemonic(tempMnem)
            ) {
                this.refreshBalance(1000);
                // ContractService.contractListener(this);
            } else {
                const { history } = this.props;
                if (history) history.push("/");
            }
        }
    }

    refreshBalance(time) {
        setTimeout(
            function() {
                let tempMnem = MnemonicService.justDecrypt(this.props.mnemonic);
                ContractService.getBalance(tempMnem)
                    .then(result => {
                        let balance = result.toString();
                        balance = ContractService.removeDigits(balance, 18);
                        balance = Math.round(balance);
                        var number = parseInt(balance, 10);
                        const newState = {
                            balanceEFT: number
                        };
                        this.setState(newState);
                    })
                    .catch(err => {});
            }.bind(this),
            time
        );

        ContractService.getEthBalance(
            MnemonicService.justDecrypt(this.props.mnemonic)
        )
            .then(result => {
                const newState = {
                    balanceETH: Number(result).toFixed(5)
                };
                this.setState(newState);
            })
            .catch(err => {
                //error in eth balance
            });
    }

    switchToEFT() {
        let newState;
        newState = {
            coin: "EFT",
            selected: "eft-coin"
        };
        this.setState(newState);
    }

    switchToETH() {
        let newState;
        newState = {
            coin: "ETH",
            selected: "eth-coin"
        };
        this.setState(newState);
    }

    isActive(addClass) {
        return (
            "btn coin-switch " +
            (addClass === this.state.selected ? "coin-active" : "default")
        );
    }

    render() {
        if (MnemonicService.justDecrypt(this.props.mnemonic)) {
            return (
                <div className="section">
                    <div className="amount">
                        <div className="wallet-info-title">
                            <p>
                                {" "}
                                Personal Wallet in the Ethereum Blockchain that
                                gives you access to the token:{" "}
                            </p>
                        </div>
                        <div className="row wallet-type">
                            <div align="right" className="col">
                                <button
                                    className={this.isActive("eft-coin")}
                                    onClick={() => this.switchToEFT()}>
                                    <p>
                                        EFT (EasyFeedback Token. Our Token
                                        created with the Ethereum Blockchain)
                                    </p>
                                </button>
                            </div>
                            <div align="left" className="col">
                                <button
                                    className={this.isActive("eth-coin")}
                                    onClick={() => this.switchToETH()}>
                                    <p>
                                        ETH (Ether. It is the “fuel” that moves
                                        Ethereum Blockchain)
                                    </p>
                                </button>
                            </div>
                        </div>
                        <div>
                            <p className="wallet-info wallet-amount">
                                {this.state.coin === "EFT"
                                    ? this.state.balanceEFT
                                    : this.state.balanceETH}
                                <span>&nbsp;</span>
                            </p>
                            <p className="wallet-info wallet-currency">
                                {this.state.coin}
                                <span>&nbsp;</span>
                            </p>
                        </div>
                    </div>
                    <TabContent
                        mnemonic={this.props.mnemonic}
                        coin={this.state.coin}
                        update={this.refreshBalance}
                    />
                </div>
            );
        } else {
            return null;
        }
    }
}

export default withRouter(WalletInfo);
