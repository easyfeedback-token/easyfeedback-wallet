import React from 'react';
import ReactModal from "react-modal";
import ImportMnemonic from "./ImportMnemonic"

ReactModal.setAppElement('#root');

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

class ImportMnemonicModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
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

    handleUpdate(mnemonic) {
        this.props.onUpdateMnemonic(mnemonic);
        this.handleCloseModal();
    }

    render() {
        return (
            <div>
                <label
                    className="dropdown-item"
                    onClick={this.handleOpenModal}>
                    <span>Import Wallet</span>
                </label>
                <ReactModal
                    isOpen={this.state.showModal}
                    onRequestClose={this.handleCloseModal}
                    style={customStyles}
                    contentLabel="Info"
                >
                    <ImportMnemonic onUpdateMnemonic={this.handleUpdate}></ImportMnemonic>
                </ReactModal>
            </div>
        );
    }
}

export default ImportMnemonicModal;