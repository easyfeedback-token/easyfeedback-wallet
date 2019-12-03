function waitForReceipt(hash, obj, INFURA_TOKEN, callback) {
    const WEB3 = require("web3");
    const infura = INFURA_TOKEN;
    const web3 = new WEB3(new WEB3.providers.HttpProvider(infura));
    return web3.eth.getTransactionReceipt(hash, function(err, receipt) {
        if (err) {
           //error
        }

        if (receipt !== null) {
            // Transaction went through
            if (callback) {
                obj.changeStatusState("Transaction was added to a block");
                callback(receipt);
            }
            //resolve(receipt);
        } else {
            // Try again in 1 second
            window.setTimeout(function() {
                waitForReceipt(hash, obj, INFURA_TOKEN, callback);
            }, 1000);
        }
    });
}

export default waitForReceipt;
