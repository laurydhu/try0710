require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
};
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.0", // 根据您的智能合约版本调整
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/31146641aa6d49318bda5865591bc7c6`, // 使用您从 Infura 获取的项目 ID
      accounts: [`0xbcbad77f056005b0b826f170f918694feb7e2099e53d65e8a40ea9b9abb143d4`], // 使用您的私钥（确保在 .env 文件中设置）
    }
  }
};
