// scripts/fundB.js  ——钱包 A 执行
require("dotenv").config();
const { ethers } = require("hardhat");

(async () => {
  const signer = (await ethers.getSigners())[0];           // 钱包 A
  const B = "0xd2628bf5ae2e8f319d248d3465aa3f78b75a3833";  // Borrower B

  // 1. 转 0.02 Sepolia-ETH 过去做抵押&Gas
  await (await signer.sendTransaction({to: B, value: ethers.parseEther("0.02")})).wait();

  // 2. 转 5 USDC-V3 过去做借款本金
  const usdcV3 = "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238";
  const token = new ethers.Contract(usdcV3, ["function transfer(address,uint256) returns (bool)"], signer);
  await (await token.transfer(B, ethers.parseUnits("5", 6))).wait();

  console.log("✅ 已给 B 转 0.02 ETH + 5 USDC-V3");
})();
