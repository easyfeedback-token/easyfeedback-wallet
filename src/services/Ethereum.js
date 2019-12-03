import Wallet from '../models/Wallet'
import MnemonicService from './Mnemonic'

const bip39 = require('bip39');
//const hdkey = require('ethereumjs-wallet/hdkey')


function createMnemonicPhrase() {
    const mnemonic = bip39.generateMnemonic();
    let mnemonicEnc = MnemonicService.justEncrypt(mnemonic);
    return mnemonicEnc;
}

const WalletService = {
    getWallet: function (mnemonic) {
        const seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
        const ethers = require('ethers');
        let zeroWallet = ethers.Wallet.fromMnemonic(mnemonic);

        const wallet = new Wallet(zeroWallet.address, mnemonic, zeroWallet.privateKey, zeroWallet.privateKey, zeroWallet.publicKey,
                                  zeroWallet.publicKey, seed, );
        

        return wallet
    },

    getMnemonic: function () {
        if (localStorage.getItem("mnemonic") === null) {
            localStorage.setItem("mnemonic", createMnemonicPhrase()) 
        }
        return localStorage.getItem("mnemonic")
    },

    getTempMnemonic: function () {
        if (localStorage.getItem("vault_temp") === null) {
            localStorage.setItem("vault_temp", createMnemonicPhrase())
        }
        return MnemonicService.justDecrypt(localStorage.getItem("vault_temp"));
    },


    validateMnemonic : function (mnemonic) {
        return bip39.validateMnemonic(mnemonic);
    },

    checkMnemonicFormat : function(mnemonic) {
        return mnemonic.trim().split(/\s+/g).length >= 12;
    }

};

export default WalletService;