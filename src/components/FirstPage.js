import React from 'react';
import { withRouter } from 'react-router-dom';


class FirstPage extends React.Component {

  componentDidMount() {
    let currentMnemo = this.props.onDecode(this.props.mnemonic);
   if(currentMnemo != null && currentMnemo !== "" && currentMnemo!== undefined) {//valid mnemonic saved
      this.proceedToWallet();
   }

  }

  proceedToWrite() {
    localStorage.removeItem("vault_temp");
    const { history } = this.props;
    if (history) history.push('/create');
  }

  proceedToImport() {
    const { history } = this.props;
    if (history) history.push('/import');
  }

  proceedToWallet() {
    const { history } = this.props;
    if (history) history.push('/wallet');
  }

  render() {
    return (
      <div className="container create-import">
        <h1>Let's get started!</h1>
        <p className="wallet-type"> You can create a new wallet if it is your first time or import your wallet from another place.</p>
        <div className="row">
          <div className="col-sm-6 box-container">
            <img src={require('../img/create.svg')} alt="create" height="100px" /> <br />
            <p>
              Generate a new wallet and seed phrase (composed of 12 words)
            </p>
            <button className="btn action-btn btn-block" onClick={() => this.proceedToWrite()} >Create wallet</button>
          
          </div>
          <div className="col-sm-6 box-container">
            <img src={require('../img/import.svg')} alt="import" height="100px" /><br />
            <p>
              Import your existing wallet using a 12 word seed phrase
            </p>
            <button className="btn action-btn btn-block" onClick={() => this.proceedToImport()} >Import wallet</button>
          </div>

        </div>
      </div>
    );
  }
}

export default withRouter(FirstPage)

