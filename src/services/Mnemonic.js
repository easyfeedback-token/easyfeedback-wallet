//import Wallet from '../models/Wallet'
import WalletService from './Ethereum'
import ContractService from './Contract'
const CryptoJS = require("crypto-js");



const MnemonicService = {
    GetWordList: function () {
        const mnemonic  = WalletService.getTempMnemonic();
        let list=[]
        let word="";
        for(let i=0; i<mnemonic.length; i++){

            if(mnemonic[i] === " "){
                  list.push(word);
                  word="";
            }
            else
                word+=mnemonic[i];
        }
        list.push(word);
        //randomize
        for (var i = list.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = list[i];
            list[i] = list[j];
            list[j] = temp;
        }

        return list;
    },
    StringToArray:function(inserted){
        let list=[]
        let word="";
        for(let i=0; i<inserted.length; i++){

            if(inserted[i] === " "){
                list.push(word);
                word="";
            }
            else
                word+=inserted[i];
        }
        if(word!=="")
            list.push(word);
        return list;
    },
    GetBoolList: function(){
        let array = [false, false, false, false, false, false, false, false, false, false, false, false];
        return array;
    },
    SetBoolList: function (list, index) {
        let newl = list;
        newl[index]=true;
        return newl;
    },
    verify:function (inserted, mnemonic) {
        var hash1 = "";
        var hash2 = "";
        for(let i=0; i<mnemonic.length; i++){

            if(mnemonic[i] !== " "){
                hash1+=mnemonic[i];
            }
            if(inserted[i] !== " "){
                hash2+=mnemonic[i];
            }
        }
        if(hash1 === hash2)
            return true;
        else
            return false;
    },
    canConfirm:function (boolist) {
        for(let i=0; i<boolist.length; i++){
            if(!boolist[i]){
                return true;
            }
        }
        return false;

    },
    saveMnemonicTo:function (mnemonic) {
        localStorage.setItem("vault_", MnemonicService.justEncrypt(mnemonic));
    },
    getMnemonicFrom:function () {
        if(MnemonicService.hasMnemonic()){
            var encrypted = localStorage.getItem("vault_");
            //return MnemonicService.justDecrypt(encrypted);
            return encrypted;
        }
        return "";

    },
    hasMnemonic:function () {
        if (localStorage.getItem("vault_") === null) {
            return false;
        }
        return true;
    },
    justEncrypt:function (mnemonic) {
        return CryptoJS.AES.encrypt(mnemonic, ContractService.AES_PASS);
    },
    justDecrypt:function (encrypted) {
        var bytes  = CryptoJS.AES.decrypt(encrypted.toString(), ContractService.AES_PASS);
       return  bytes.toString(CryptoJS.enc.Utf8);
    },



};

export default MnemonicService;