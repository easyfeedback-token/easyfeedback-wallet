import React, { Component } from "react";
import TabList from "./TabList";
import SendTab from "./SendTab";
import TransactionsTab from "./TransactionsTab";
import ReceiveTab from "./ReceiveTab";
import WalletService from "../services/Ethereum";
import MnemonicService from "../services/Mnemonic";

import "../App.css";

export default class TabContent extends Component {
    render() {
        const wallet = WalletService.getWallet(
            MnemonicService.justDecrypt(this.props.mnemonic)
        );
        const address = wallet.address;

        return (
            <TabList>
                <div label="Receive" src={require("../img/receive.svg")}>
                    <ReceiveTab address={address} />
                </div>

                <div
                    label="Transactions"
                    src={require("../img/transaction.png")}>
                    <TransactionsTab address={address} coin={this.props.coin} />
                </div>

                <div label="Send" src={require("../img/send.svg")}>
                    <SendTab
                        mnemonic={this.props.mnemonic}
                        update={this.props.update}
                        coin={this.props.coin}
                    />
                </div>
            </TabList>
        );
    }
}
