import React from "react";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import QRCode from 'qrcode.react';
class ReceiveTab extends React.Component {
    /*constructor(props) {
        super(props);
        //const address = this.props.address;
    }*/

    writeToClipboard = () => {
        alert('Address copied')
    };
    render() {
        return <div id="Receive" className="tabcontent">
            <div className="recieve-section">
                <QRCode className="qr-code" value={this.props.address} size={180} style={{display: 'block', margin: '0 auto'}} />
                <br />
                <label htmlFor="wallet-address">The wallet address to receive your tokens is:</label>
                <input type="text" className="form-control" id="wallet-address" value={this.props.address} readOnly />
                <br />
                <CopyToClipboard text={this.props.address} onCopy={() => this.writeToClipboard()}>
                    <button className="btn btn-success action-btn btn-block" id="wallet-clipboard" >
                        <img src={require('../img/clipboard.svg')} height="40px"  alt="copy to clipboard"/>
                    </button>
                </CopyToClipboard>

            </div>
        </div>;
    }

}

export default ReceiveTab;