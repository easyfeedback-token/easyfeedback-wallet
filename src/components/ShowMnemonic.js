import React from "react";
import ReactModal from 'react-modal';
import FileService from "../services/File";
import MnemonicService from "../services/Mnemonic";


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

class ShowMnemonic extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
        };

        this.handleDownloadClick = this.handleDownloadClick.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);

        this.mnemonicArea = React.createRef();

    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }

    handleOpenModal() {
        this.setState({ showModal: true });
    }

    render() {
        const words = MnemonicService.justDecrypt(this.props.mnemonic).split(' ');
        /*const mnemonicAreaStyle = {
            display : 'none'
        };*/
        return (
            <div>
                <label
                    className="dropdown-item"
                    onClick={this.handleOpenModal}>
                        <span>Export Wallet</span>
                </label>
                <ReactModal
                    isOpen={this.state.showModal}
                    onRequestClose={this.handleCloseModal}
                    style={customStyles}
                    contentLabel="Info"
                >
                    <div className="container">
                        <h1>Export Your 12 Words Seed Phrase</h1>
                        <div className="flex-container create-mnemonic-container">
                            {words.map((word, index) => { return (<div className="mnemonic-word" key={index}>{word}</div>) })}
                        </div>
                        <div>
                            <button className="btn action-btn btn-block" onClick={this.handleDownloadClick}>Download to file</button>
                        </div>
                    </div>
                </ReactModal>
            </div>
        )
    }

    handleDownloadClick() {
        FileService.download('Easyfeedback wallet file', MnemonicService.justDecrypt(this.props.mnemonic));
    }
}

export default ShowMnemonic;