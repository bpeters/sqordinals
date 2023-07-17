const {Web3} = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/9a9c5c7e10084eaa98fd8b71b9cb5dd1'));

const account = web3.eth.accounts.privateKeyToAccount('0x' + '7061c8cf980cb28042914080266ff0e5ced8945ea97c0cc36350b84de1b2f194');

const message = web3.utils.soliditySha3("all your base are belong to you. (Hex:0x616c6c20796f75722062617365206172652062656c6f6e6720746f20796f752e)");
const prefix = '\x19Ethereum Signed Message:\n' + message.length;

const dataToSign = web3.utils.soliditySha3(prefix, message);
const signatureObject = account.sign(dataToSign);
const signature = signatureObject.signature;

const signatureBytes = web3.utils.hexToBytes(signature);
const signatureHex = web3.utils.bytesToHex(signatureBytes);

console.log(signatureHex);
