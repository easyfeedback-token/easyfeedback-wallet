const Web3 = require("web3");

async function getConfirmations(txHash, INFURA_TOKEN) {
    try {
        const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_TOKEN));
        txHash = txHash.toString("hex");
        // Get transaction details
        const trx = await web3.eth.getTransaction(txHash);

        // Get current block number
        const currentBlock = await web3.eth.getBlockNumber();

        // When transaction is unconfirmed, its block number is null.
        // In this case we return 0 as number of confirmations
        return trx.blockNumber === null ? 0 : currentBlock - trx.blockNumber;
    } catch (error) {
        //error
    }
}

function confirmEtherTransaction(txHash, obj, INFURA_TOKEN, confirmations = 2) {
    setTimeout(async () => {
        // Get current number of confirmations and compare it with sought-for value
        const trxConfirmations = await getConfirmations(txHash, INFURA_TOKEN);

        //console.log("Transaction with hash " + txHash + " has " + trxConfirmations + " confirmation(s)");

        if (trxConfirmations >= confirmations) {
            // Handle confirmation event according to your business logic

            //console.log("Transaction with hash " + txHash + " has been successfully confirmed");
            //callback();
            obj.changeStatusState("Transaction block was mined successfully");
            //resolve("termine");
            return;
        }
        // Recursive call
        return confirmEtherTransaction(
            txHash,
            obj,
            INFURA_TOKEN,
            confirmations
        );
    }, 20 * 1000);
}

export default confirmEtherTransaction;
