import React from "react";
import ContractService from "../services/Contract";
import waitForReceipt from "../services/WatchTransaction";
import confirmEtherTransaction from "../services/WatchTransactionBlock";
import MnemonicService from "../services/Mnemonic";
import cogoToast from 'cogo-toast';

import ReactModal from "react-modal";
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

class SendTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "Not created",
            recipient: "",
            amount: 0,
            showModal: false,
            showSuccModal: false,
            ether: 0,
            costMessage: "",
            wei: 0,
            minwei: 5,
            mediumwei: 10,
            maxwei: 15,
            errormsg: "",
            currentCoin: this.props.coin
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeAmount = this.handleChangeAmount.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleSendModal = this.handleSendModal.bind(this);
        this.handleOpenSuccModal = this.handleOpenSuccModal.bind(this);
        this.handleCloseSuccModal = this.handleCloseSuccModal.bind(this);
    }

    componentDidMount() {
        fetch("https://ethgasstation.info/json/ethgasAPI.json")
            .then(response => response.json())
            .then(data => {
                const gasMin = data.average / 10;
                const gasMax = data.fast / 10;
                const gasMed = (gasMin + gasMax) / 2;
                this.setState({
                    minwei: gasMin,
                    mediumwei: gasMed,
                    maxwei: gasMax,

                    wei: gasMin
                });
            })
            .catch(error => {
                //error in fetching gas values
            });
    }

    handleOptionChange = changeEvent => {
        this.setState({
            wei: changeEvent.target.value
        });
    };

    handleChange(event) {
        this.setState({ recipient: event.target.value });
    }
    handleChangeAmount(event) {
        this.setState({ amount: event.target.value });
    }

    handleOpenModal() {
        ContractService.getEthBalance(
            MnemonicService.justDecrypt(this.props.mnemonic)
        )
            .then(result => {
                this.setState({ ether: result });

                if (this.props.coin === "EFT") {
                    ContractService.getEstimatedEthCost(
                        this.state.wei,
                        this.state.recipient,
                        this.state.amount,
                        MnemonicService.justDecrypt(this.props.mnemonic)
                    )
                        .then(result => {
                            this.errorMessage("");
                            this.setState({
                                showModal: true,
                                costMessage:
                                    "Your estimated cost will be of " +
                                    result.toString() +
                                    " ETH."
                            });
                        })
                        .catch(err => {
                            //error in estimated gas cost
                            console.log(err);
                            cogoToast.error("This transaction will fail. Please check that you filled all the fields correctly");
                            this.errorMessage(
                                "This transaction will fail. Please check that you filled all the fields correctly"
                            );

                        });
                } else {
                    this.errorMessage("");
                    this.setState({
                        showModal: true,
                        costMessage:
                            "Your estimated cost will be of " +
                            ".00000000001" +
                            " ETH."
                    });
                }
            })
            .catch(err => {
                //error in eth balance
            });
    }
    handleOpenSuccModal() {
        this.setState({
            showSuccModal: true,
        })
    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }
    handleCloseSuccModal() {
        this.setState({
            showSuccModal: false
        });
    }

    handleSendModal() {
        this.setState({ showModal: false });
        if (this.props.coin === "EFT") {
            console.log("EFT");
            this.createTransaction();
        } else {
            console.log("ETH");
            this.createETHTransaction();
        }
    }

    errorMessage(text) {
        this.setState({ errormsg: text });
    }

    createTransaction() {
        ContractService.makeTransaction(
            this.state.amount,
            this.state.recipient,
            MnemonicService.justDecrypt(this.props.mnemonic),
            this.state.wei
        )
            .then(result => {
                this.changeStatusState("Creating transaction");

                const infura = ContractService.INFURA_TOKEN;

                waitForReceipt(result, this, infura, function (receipt) { });

                try {
                    confirmEtherTransaction(result, this, infura);
                    this.handleOpenSuccModal();
                } catch (e) {
                    this.changeStatusState("Error in transaction");
                }
            })
            .catch(err => {
                this.changeStatusState("Error in transaction." + err);
            });
    }
    createETHTransaction() {
        ContractService.makeEthTransaction(
            this.state.amount,
            this.state.recipient,
            MnemonicService.justDecrypt(this.props.mnemonic),
            this.state.wei
        )
            .then(result => {
                this.changeStatusState("Creating transaction");

                const infura = ContractService.INFURA_TOKEN;

                waitForReceipt(result, this, infura, function (receipt) { });

                try {
                    confirmEtherTransaction(result, this, infura);
                    this.handleOpenSuccModal();

                } catch (e) {
                    this.changeStatusState("Error in transaction");
                }
            })
            .catch(err => {
                this.changeStatusState("Error in transaction. " + err);
            });
    }

    changeStatusState(mesg) {
        this.setState({
            status: mesg
        });
        this.props.update();
        this.checkStatusMesg(mesg);
    }

    checkStatusMesg(mesg) {
        if (mesg === "Creating transaction") {
            cogoToast.loading(mesg);
        }
        if (mesg === "Error in transaction") {
            cogoToast.error(mesg);
        }
        if (mesg === "Transaction block was mined successfully") {
            cogoToast.success(mesg);
        }
        if (mesg === "Transaction was added to a block") {
            cogoToast.success(mesg);
        }
    }

    onKeyPress(event) {
        const keyCode = event.keyCode || event.which;
        const keyValue = String.fromCharCode(keyCode);
        if (!/^\d*\.?\d*$/.test(keyValue)) event.preventDefault();
    }

    render() {
        return (
            <div id="Send" className="tabcontent">
                <form>
                    <div className="form-group">
                        <label htmlFor="send-wallet-address">
                            Recipient's wallet address
            </label>
                        <input
                            type="text"
                            className="form-control"
                            pattern="[0-9]*"
                            min="0"
                            step="1"
                            value={this.state.recipient}
                            onChange={this.handleChange}
                            style={{
                                backgroundColor: "#F3F3F3"
                            }}
                            id="sendWalletAddress"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Amount</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            value={this.state.amount}
                            onChange={this.handleChangeAmount}
                            onKeyPress={this.onKeyPress.bind(this)}
                            style={{
                                backgroundColor: "#F3F3F3"
                            }}
                            id="sendAmount"
                        />
                    </div>
                    <div></div>
                    <div className="form-group">
                        <label htmlFor="statusDescription">Transaction Status</label>
                        <input
                            type="text"
                            className="form-control"
                            readOnly
                            style={{
                                backgroundColor: "#F3F3F3"
                            }}
                            id="send-description"
                            value={this.state.status}
                        />
                    </div>

                    <div className="form-group container text-center">
                        <label htmlFor="send-wallet-address">
                            Gas cost (transaction cost): {this.state.wei} Gwei (it is the most
                            common unit when talking about gas. Instead of saying that your
                            gas cost is 0.000000001 Ether you can say 1 Gwei
            </label>
                        <label>Approximate time to make the transaction:</label>
                        <div className="row">
                            <div className="col">
                                <label>
                                    <input
                                        type="radio"
                                        name="gasprice"
                                        value={this.state.minwei}
                                        checked={this.state.wei == this.state.minwei}
                                        onChange={this.handleOptionChange}
                                        className="form-check-input"
                                    />
                                    <span>Slow(~10 min)</span>
                                </label>
                            </div>
                            <div className="col">
                                <label>
                                    <input
                                        type="radio"
                                        name="gasprice"
                                        value={this.state.mediumwei}
                                        checked={this.state.wei == this.state.mediumwei}
                                        onChange={this.handleOptionChange}
                                        className="form-check-input"
                                    />
                                    <span>Average(~5 min)</span>
                                </label>
                            </div>
                            <div className="col">
                                <label>
                                    <input
                                        type="radio"
                                        name="gasprice"
                                        value={this.state.maxwei}
                                        checked={this.state.wei == this.state.maxwei}
                                        onChange={this.handleOptionChange}
                                        className="form-check-input"
                                    />
                                    <span>Fast(~1 min)</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <p className="errormsg">{this.state.errormsg}</p>
                    <button
                        type="button"
                        className="btn btn-block action-btn"
                        onClick={() => this.handleOpenModal()}
                    >
                        Send
          </button>
                </form>

                <ReactModal
                    isOpen={this.state.showModal}
                    onRequestClose={this.handleCloseModal}
                    style={customStyles}
                    contentLabel="Warning"
                >
                    <div className="container modal-body">
                        <h2 className="alert-msg">Warning</h2>
                        <div className="send-modal">
                            <p>
                                You are about to send {this.state.amount} {this.props.coin} to the address you specified.
                                <br />
                                <b>This transaction cannot be undone.</b>
                            </p>
                            <p>{this.state.costMessage}</p>
                        </div>
                        <button className="btn passive-btn" onClick={this.handleCloseModal}>
                            Cancel
            </button>

                        <button className="btn action-btn" onClick={this.handleSendModal}>
                            Send
            </button>
                    </div>
                </ReactModal>
                <ReactModal
                    isOpen={this.state.showSuccModal}
                    onRequestClose={this.handleCloseSuccModal}
                    style={customStyles}
                    contentLabel="Success!"
                >
                    <div className="container modal-body">
                        <h2 className="success-msg">Success!</h2>
                        <div className="container">
                            <p>The transaction has been sent succesfully.</p>
                            <p>Until the transaction is propagated on the Ethereum blockchain it will not be reflected in the transactions tab.</p>
                            <p>Now go to the Transactions Tab to see your transaction.</p>
                        </div>
                        <div
                            className="btn action-btn"
                            onClick={this.handleCloseSuccModal}>
                            Close
                        </div>

                    </div>

                </ReactModal>
            </div>
        );
    }
}

export default SendTab;
