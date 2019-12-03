import WalletService from "./Ethereum";
import { token_abi } from "./TokenABI";

const ContractService = {
    NUMBER_DECIMALS: 18,
    LIMIT_TRANSACTIONS: 50,
    INFURA_ID: process.env.REACT_APP_INFURA_ID,
    INFURA_TOKEN: process.env.REACT_APP_INFURA_TOKEN,
    WEBSOCKET_TOKEN: process.env.REACT_APP_WSS_TOKEN,
    CONTRACT_ABI: { token_abi }.token_abi,
    CONTRACT_ADDRESS: process.env.REACT_APP_CONTRACT_ADDRESS,
    FIRST_CONTRACT_BLOCK: 5690001,
    AES_PASS: process.env.REACT_APP_AES_PASS,

    makeTransaction: async function(amount, address, mnemonic, gasPrice) {
        return new Promise(function(resolve, reject) {
            try {
                const wallet = WalletService.getWallet(mnemonic);

                const WEB3 = require("web3");
                const tx = require("ethereumjs-tx");
                var web3 = new WEB3(
                    new WEB3.providers.HttpProvider(
                        ContractService.INFURA_TOKEN
                    )
                );

                var fromAddr = wallet.address;
                var privateKey = wallet.privateKey;
                var contractAbi = ContractService.CONTRACT_ABI;
                var contractAddr = ContractService.CONTRACT_ADDRESS;

                // get the contract instance
                var contract = new web3.eth.Contract(contractAbi, contractAddr);
                let decimals = "000000000000000000";
                let value = amount + decimals;

                // call `myMethod` method on contract instance
                var method_call_abi = contract.methods
                    .transfer(address, value)
                    .encodeABI(); //

                const gasLimit = 100000;
                web3.eth.getTransactionCount(fromAddr).then(txCount => {
                    // build transaction dict
                    const txData = {
                        nonce: web3.utils.toHex(txCount),
                        gasLimit: web3.utils.toHex(gasLimit), // max gas
                        gasPrice: web3.utils.toHex(
                            web3.utils.toWei(gasPrice.toString(), "gwei")
                        ),
                        to: contractAddr,
                        from: fromAddr,
                        data: method_call_abi
                    };

                    var privateKeyVariant = ContractService.variantPrivateKey(
                        privateKey
                    );
                    // serialize and sign transaction
                    var transaction = new tx(txData);
                    var privateKeyBuf = new Buffer(privateKeyVariant, "hex");
                    transaction.sign(privateKeyBuf);
                    var serializedTx = transaction.serialize().toString("hex");

                    //var tash = "0x" + serializedTx;
                    return web3.eth.sendSignedTransaction(
                        "0x" + serializedTx,
                        function(err, hash) {
                            if (err) {
                                reject(err);
                            } else {
                                console.log(hash);
                                resolve(hash);
                            }
                        }
                    );
                });
            } catch (error) {
                reject(error); //error creating the transaction promise
            }
        });
    },

    makeEthTransaction: async function(amount, address, mnemonic, gasPrice) {
        return new Promise(function(resolve, reject) {
            try {
                const WEB3 = require("web3");
                const Tx = require("ethereumjs-tx");

                const wallet = WalletService.getWallet(mnemonic);

                var gasPrice = 2; //or get with web3.eth.gasPrice
                var gasLimit = 100000;
                var fromAddr = wallet.address;
                var web3 = new WEB3(
                    new WEB3.providers.HttpProvider(
                        ContractService.INFURA_TOKEN
                    )
                );

                web3.eth.getTransactionCount(fromAddr).then(txCount => {
                    var rawTransaction = {
                        from: fromAddr,
                        nonce: web3.utils.toHex(txCount),
                        gasPrice: web3.utils.toHex(gasPrice * 1e9),
                        gasLimit: web3.utils.toHex(gasLimit),
                        to: address,
                        value: web3.utils.toHex(web3.utils.toWei(amount))
                    };
                    const variantPrivateKey = ContractService.variantPrivateKey(
                        wallet.privateKey
                    );

                    var privKey = new Buffer(variantPrivateKey, "hex");

                    var tx = new Tx(rawTransaction);

                    tx.sign(privKey);
                    var serializedTx = tx.serialize();

                    return web3.eth.sendSignedTransaction(
                        "0x" + serializedTx.toString("hex"),
                        function(err, hash) {
                            if (!err) {
                                resolve(hash);
                            } else {
                                reject(err);
                            }
                        }
                    );
                });
            } catch (error) {
                reject(error); //error creating the transaction promise
            }
        });
    },

    variantPrivateKey: function(key) {
        let res = key.substring(2);
        return res;
    },
    getEthBalance: async function(mnemonic) {
        return new Promise(function(resolve, reject) {
            try {
                const WEB3 = require("web3");
                const infura = ContractService.INFURA_TOKEN;
                const web3 = new WEB3(new WEB3.providers.HttpProvider(infura));

                const wallet = WalletService.getWallet(mnemonic);
                const address = wallet.address;
                return web3.eth.getBalance(address, function(err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        const etherValue = web3.utils.fromWei(
                            result.toString(),
                            "ether"
                        );
                        resolve(etherValue);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    getEstimatedEthCost: async function(gwei, address, value, mnemonic) {
        return new Promise(function(resolve, reject) {
            try {
                const WEB3 = require("web3");
                const infura = ContractService.INFURA_TOKEN;
                const web3 = new WEB3(new WEB3.providers.HttpProvider(infura));

                var contractAbi = ContractService.CONTRACT_ABI;
                var contractAddr = ContractService.CONTRACT_ADDRESS;

                // get the contract instance
                var contract = new web3.eth.Contract(contractAbi, contractAddr);
                let decimals = "000000000000000000";
                value = value + decimals;
                var method_call_abi = contract.methods
                    .transfer(address, value)
                    .encodeABI();
                gwei = Math.ceil(gwei);
                gwei = gwei.toString();

                return web3.eth.estimateGas(
                    {
                        to: ContractService.CONTRACT_ADDRESS,
                        from: WalletService.getWallet(mnemonic).address,
                        data: method_call_abi,
                        gasPrice: gwei
                    },
                    function(err, result) {
                        if (err) {
                            reject(err);
                        } else {
                            const wei = gwei * 1000000000;
                            const etherValue = web3.utils.fromWei(
                                (result * wei).toString(),
                                "ether"
                            );
                            resolve(etherValue);
                        }
                    }
                );
            } catch (error) {
                reject(error);
            }
        });
    },

    contractListener: function(wallet) {
        const WEB3 = require("web3");

        var web3 = new WEB3(
            new WEB3.providers.WebsocketProvider(
                ContractService.WEBSOCKET_TOKEN
            )
        );
        web3.eth.clearSubscriptions();
        subscribeLogEvent(web3, wallet);
    },

    transactionsPromise: function(web3, contractAddress, fromAddress) {
        const contractAbi = ContractService.CONTRACT_ABI;
        var contract = new web3.eth.Contract(contractAbi, contractAddress);

        const fromBlock = ContractService.FIRST_CONTRACT_BLOCK;

        const outOptions = {
            fromBlock: fromBlock,
            toBlock: "latest",
            topics: [web3.utils.padLeft(fromAddress, 64)]
        };

        const inOptions = {
            fromBlock: fromBlock,
            toBlock: "latest",
            topics: [null, web3.utils.padLeft(fromAddress, 64)]
        };

        const options = [outOptions, inOptions];

        return Promise.all(
            options.map(x => contract.getPastEvents("Transfer", x))
        );
    },

    transactionDatePromise: function(web3, transaction) {
        return new Promise(function(resolve, reject) {
            web3.eth
                .getBlock(transaction.block)
                .then(function(block) {
                    let timestamp = block.timestamp;
                    let date = new Date(0);
                    date.setUTCSeconds(timestamp);
                    transaction["date"] = date;
                    resolve(transaction);
                })
                .catch(reject);
        });
    },

    handleTransactions: function(resolve, reject, events, web3) {
        let transactions = [];
        //let datePromises = [];
        for (var i = 0; i < events.length; i++) {
            for (var j = 0; j < events[i].length; j++) {
                const event = events[i][j];
                const transaction = {
                    from: event.returnValues[0],
                    to: event.returnValues[1],
                    value:
                        Number(event.returnValues[2].toString()) /
                        Math.pow(10, ContractService.NUMBER_DECIMALS),
                    type: i === 0 ? "Received" : "Sent",
                    hash: event.transactionHash,
                    block: event.blockNumber
                };
                transactions.push(transaction);
            }
        }
        transactions.sort((a, b) => b.block - a.block);
        transactions = transactions.slice(
            0,
            ContractService.LIMIT_TRANSACTIONS
        );

        let datePromise = Promise.all(
            transactions.map(transaction =>
                ContractService.transactionDatePromise(web3, transaction)
            )
        );

        datePromise.then(resolve).catch(reject);
    },

    getTransactions: function(address) {
        return new Promise(function(resolve, reject) {
            const WEB3 = require("web3");
            //const tx = require("ethereumjs-tx");
            var web3 = new WEB3(
                new WEB3.providers.HttpProvider(ContractService.INFURA_TOKEN)
            ); // TODO edit me if you don't use Infura

            var contractAddr = ContractService.CONTRACT_ADDRESS;
            ContractService.transactionsPromise(web3, contractAddr, address)
                .then(events =>
                    ContractService.handleTransactions(
                        resolve,
                        reject,
                        events,
                        web3
                    )
                )
                .catch(reject);
        });
    },

    getBalance: async function(mnemonic) {
        const WEB3 = require("web3");

        const infura = ContractService.INFURA_TOKEN;
        const web3 = new WEB3(new WEB3.providers.HttpProvider(infura));

        let tokenAddress = ContractService.CONTRACT_ADDRESS;

        let contractAbi = ContractService.CONTRACT_ABI;

        const wallet = WalletService.getWallet(mnemonic);
        const address = wallet.address;

        //web3 1.0
        var tokenContract = new web3.eth.Contract(contractAbi, tokenAddress, {
            from: address, // default from address
            gasPrice: "20000000000" // default gas price in wei, 20 gwei in this case
        });

        return tokenContract.methods.balanceOf(address).call({});
    },

    removeDigits: function(x, n) {
        return (x - (x % Math.pow(10, n))) / Math.pow(10, n);
    }
};

const subscribeLogEvent = (web3, wallet) => {
    const subscription = web3.eth.subscribe(
        "logs",
        {
            address: ContractService.CONTRACT_ADDRESS
        },
        (error, result) => {
            if (!error) {
                wallet.refreshBalance(10000);
            } //error
            else {
            }
        }
    );
    return subscription;
};

export default ContractService;
