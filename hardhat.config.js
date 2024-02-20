require("@nomicfoundation/hardhat-toolbox");


const INFURA_API_KEY = "1c2959aaaaea48b29dcbd39b41844ef0";

const SEPOLIA_PRIVATE_KEY = "";

module.exports = {
  solidity: "0.8.23",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY]
    }
  }
};