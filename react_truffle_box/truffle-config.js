const path = require("path");
const provider = require("@truffle/hdwallet-provider");
const fs = require("fs");

const secret = JSON.parse(
  fs.readFileSync(".secrect.json").toString().trim()
);

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    kovan: {
      provider: () =>
        new provider(
          secret.privateKeys,
          "https://kovan.infura.io/v3/30c46791dc8445929d39d68688ce9c73",
          0, // start of first private key
          3 // number of address
        ),
      network_id: '*'
    }
    // develop: {
    //   port: 8545
    // }
  },
  compilers: {
    solc: {
      version: "0.6.0",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  },
};
