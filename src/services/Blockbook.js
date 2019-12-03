const axios = require("axios");

const BlockbookService = {
    getTransactions: function(address, coin) {
        return new Promise(function(resolve, reject) {
            const URL =
                process.env.REACT_APP_CORS +
                process.env.REACT_APP_BLOCKBOOK +
                address +
                "?details=txs";
            axios.get(URL).then(response => {
                var parsedTransactions = [];
                const txs = response.data.transactions;

                switch (coin) {
                    case "ETH":
                        txs.forEach(tx => {
                            if (tx.value !== "0") {
                                var parsed = BlockbookService.parseTransaction(
                                    tx,
                                    address,
                                    "ETH"
                                );
                                parsedTransactions.push(parsed);
                            }
                        });
                        resolve(parsedTransactions);
                        break;
                    case "EFT":
                        txs.forEach(tx => {
                            if (tx.value === "0") {
                                var parsed = BlockbookService.parseTransaction(
                                    tx,
                                    address,
                                    "EFT"
                                );
                                parsedTransactions.push(parsed);
                            }
                        });
                        resolve(parsedTransactions);
                        break;

                    default:
                        reject("Invalid Coin");
                }
            });
        });
    },

    parseTransaction: function(tx, address, coin) {
        var parsed;
        switch (coin) {
            case "ETH":
                const fromAddress = tx.vin[0].addresses[0];
                const toAddress = tx.vout[0].addresses[0];

                parsed = {
                    from: fromAddress,
                    to: toAddress,
                    value: Number(tx.value) / Math.pow(10, 18),
                    type:
                        fromAddress === address.toLowerCase()
                            ? "Sent"
                            : "Received",
                    hash: tx.blockHash,
                    block: tx.blockHeight,
                    date: new Date(tx.blockTime * 1000),
                    timestamp: tx.blockTime
                };
                break;

            case "EFT":
                const tokenInfo = tx.tokenTransfers[0];
                if (tokenInfo.symbol === "EFT") {
                    parsed = {
                        from: tokenInfo.from,
                        to: tokenInfo.to,
                        value: Number(tokenInfo.value) / Math.pow(10, 18),
                        type:
                            tokenInfo.from === address.toLowerCase()
                                ? "Sent"
                                : "Received",
                        hash: tx.blockHash,
                        block: tx.blockHeight,
                        date: new Date(tx.blockTime * 1000),
                        timestamp: tx.blockTime
                    };

                    return parsed;
                }

            default:
                break;
        }

        return parsed;
    }
};

export default BlockbookService;
