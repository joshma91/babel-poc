var HDWalletProvider = require("truffle-hdwallet-provider");

var infura_apikey = process.env.INFURA_API_KEY;
var mnemonic = process.env.ETH_MNEMONIC_KEY;

module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 4710000      
    },
    ropsten: {
      network_id: 3,
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"+infura_apikey),
      gas: 4500000
    },
  }
};