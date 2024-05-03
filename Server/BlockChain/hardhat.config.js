require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  networks: {
    hardhat: {},
    goerli: {
      accounts: [process.env.GOERLI_PRIVATE_KEY],
      // url: `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      url: "https://solemn-boldest-uranium.ethereum-goerli.discover.quiknode.pro/2fa18f9c7ae3a5af935955b33a53c887d660ccca"
    },
  },
}; 
