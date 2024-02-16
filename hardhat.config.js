require("@nomicfoundation/hardhat-toolbox");


const INFURA_API_KEY = "1c2959aaaaea48b29dcbd39b41844ef0";

const SEPOLIA_PRIVATE_KEY = "a36c24e21862a145c4d6c9b75af8185d3018a8f6d6c0dfc126efa79475081bb7";

module.exports = {
  solidity: "0.8.23",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY]
    }
  }
};