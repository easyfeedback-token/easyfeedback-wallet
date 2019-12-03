import React from "react";
import ReactModal from "react-modal";
//import { withRouter } from "react-router-dom";

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

class DeleteWallet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        };

        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }

    handleOpenModal() {
        this.setState({ showModal: true });
    }

    handleUpdate() {
        this.props.onUpdateMnemonic("");
        localStorage.removeItem("vault_");
        this.handleCloseModal();
    }

    render() {
        return (
            <div>
                <label
                    className="dropdown-item"
                    onClick={this.handleOpenModal}>
                    <span>Remove Wallet</span>
                </label>
                <ReactModal
                    isOpen={this.state.showModal}
                    onRequestClose={this.handleCloseModal}
                    style={customStyles}
                    contentLabel="Warning">
                    <div className="modal-body">
                        <h1 className="alert-msg">Warning</h1>
                        <h3>
                            You are going to remove your wallet from this
                            browser
                        </h3>
                        <br />
                        <div className="delete-message">
                            <p>Be sure to have a backup of your 12 words seed phrase</p>
                            <p><b>This action cannot be undone.</b></p>
                            <br />
                            <div align="center">
                                <button className="btn passive-btn" onClick={this.handleCloseModal}>Cancel</button>
                                <button className="btn danger-btn" onClick={this.handleUpdate}>Remove Wallet</button>
                            </div>
                        </div>
                    </div>
                </ReactModal>
            </div>
        );
    }
}

export default DeleteWallet;
