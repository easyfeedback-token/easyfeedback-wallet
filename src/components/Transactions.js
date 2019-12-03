import React from "react";
//import ContractService from "../services/Contract";
//import WalletService from "../services/Ethereum";
import BlockbookService from "../services/Blockbook";

function TransactionRow(props) {
    return (
        <tr>
            <td>{props.transaction["type"]}</td>
            <td>{props.transaction.date.toLocaleString()}</td>
            <td>
                {props.transaction.type === "Received"
                    ? props.transaction.from
                    : props.transaction.to}
            </td>
            <td>{"" + props.transaction["value"] + " " + props.coin}</td>
        </tr>
    );
}

class Transactions extends React.Component {
    constructor(props) {
        super(props);

        this.loadStatus = Object.freeze({
            pending: 1,
            resolved: 2,
            rejected: 3
        });
        this.state = {
            transactions: [{}],
            status: this.loadStatus.pending,
            currentAddress: this.props.address,
            currentCoin: this.props.coin
        };

        this.handleTransactions = this.handleTransactions.bind(this);
        this.failedFetch = this.failedFetch.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.fetchData();
    }

    failedFetch() {
        const newState = {
            transactions: [],
            status: this.loadStatus.rejected
        };
        this.setState(newState);
    }

    handleTransactions(transactions) {
        const newState = {
            transactions: transactions,
            status: this.loadStatus.resolved
        };

        this.setState(newState);
    }

    fetchData() {
        const address = this.props.address;

        switch (this.props.coin) {
            case "ETH":
                BlockbookService.getTransactions(address, "ETH")
                    .then(this.handleTransactions)
                    .catch(this.failedFetch);
                break;
            case "EFT":
                BlockbookService.getTransactions(address, "EFT")
                    .then(this.handleTransactions)
                    .catch(this.failedFetch);
                break;
            default:
                console.log(this.props.coin);
                this.failedFetch();
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    isUpdateNeeded() {
        return (
            this.state.currentAddress !== this.props.address ||
            this.state.currentCoin !== this.props.coin
        );
    }

    render() {
        if (this.isUpdateNeeded()) {
            const newState = {
                currentAddress: this.props.address,
                currentCoin: this.props.coin,
                transactions: [],
                status: this.loadStatus.pending
            };
            this.setState(newState);
            this.fetchData();
        }

        switch (this.state.status) {
            case this.loadStatus.pending:
                return <p>Loading...</p>;
            //break;
            case this.loadStatus.rejected:
                console.log(this.state);
                return <p>Could not load transactions</p>;
            //break;
            case this.loadStatus.resolved:
                //let first = this.state.transactions;

                let rows = this.state.transactions.map(transaction => (
                    <TransactionRow
                        key={transaction.hash}
                        transaction={transaction}
                        coin={this.props.coin}
                    />
                ));
                return (
                    <div className="table-responsive">
                        <table className="table table-hover ">
                            <thead>
                                <tr>
                                    <th>Transaction Type</th>
                                    <th>Date/Time</th>
                                    <th>Wallet Address</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>{rows}</tbody>
                        </table>
                    </div>
                );
            default:
                break;
        }
    }
}

export default Transactions;
