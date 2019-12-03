import React from "react";
import Transactions from './Transactions'

class TransactionsTab extends React.Component {
    render() {
        return <div id="Transactions" className="tabcontent">
            <Transactions address= {this.props.address} coin={this.props.coin}/>
        </div>;
    }

}

export default TransactionsTab;