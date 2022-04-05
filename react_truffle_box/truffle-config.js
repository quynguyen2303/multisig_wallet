const path = require("path");
const provider = require("@truffle/hdwallet-provider");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    kovan: {
      provider: () =>
        new provider(
          [
            "5ec33ce4d60d6b6f8b0c47ff31d5a669129c0e2090d3d9d8078fd001a6413187",
            "5609b0ddcaf8b12c0fc50a5cf12ef05c7d7ff4852c42b6545cb601df27c4983c",
            "cd79187b55156795c4b1df543c6b2fa1075538961502d10d0cf94b5526dfb802"
          ],
          "https://kovan.infura.io/v3/30c46791dc8445929d39d68688ce9c73",
          0, // start of first private key
          3 // number of address
        )
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
