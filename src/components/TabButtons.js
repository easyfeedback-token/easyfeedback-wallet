import React from "react";
class TabButtons extends React.Component {
    render() {
        return <div className="tab">
            <button className="tablinks" onClick="openCity(event, 'Send')">
                <img src={require('../img/send.svg')} className="tab-icon" />
                <p>Send</p>
            </button>
            <button className="tablinks" onClick="openCity(event, 'Transactions')">
                <img src={require('../img/transaction.png')} className="tab-icon" />
                <p>Transactions</p>
            </button>
            <button className="tablinks" onClick="openCity(event, 'Receive')">
                <img src={require('../img/receive.svg')} className="tab-icon" />
                <p>Receive</p>
            </button>
        </div>;
    }

}

export default TabButtons;