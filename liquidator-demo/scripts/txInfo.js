//打印收据和logs
require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const hash = "0x731b34a1f0474b7ff126cc4a4d77f4940e6d9345e273dc7aa0911d0e96012848"; // 你的交易哈希
  const receipt = await ethers.provider.getTransactionReceipt(hash);

  for (const log of receipt.logs) {
    if (log.topics[0] === ethers.id("Transfer(address,address,uint256)")) {
      console.log("✅ Token contract:", log.address);
      return;
    }
  }
  console.log("❌ 没找到 Transfer 日志，检查哈希是否正确");
}
main().catch(console.error);
