
var HDWalletProvider = require("truffle-hdwallet-provider");
require('babel-register');
require('babel-polyfill');
var mnemonic = "";
module.exports = {
  networks : {
    development: {
      host: "localhost",
      port: "8545",
      network_id: "*"
    },
    ropsten: {
     provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"),
     network_id: 3
   }
  }
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
};