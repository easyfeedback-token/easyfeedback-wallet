export default class Wallet {

    constructor(address, mnemonic, privateKey, privateKeyString, publicKey, publicKeyString, seed) {
        this.address = address;
        this.mnemonic = mnemonic;
        this.privateKey = privateKey;
        this.privateKeyString = privateKeyString;
        this.publicKey = publicKey;
        this.publicKeyString = publicKeyString;
        this.seed = seed;
    }

}