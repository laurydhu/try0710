// scripts/liquidate.js
require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners();  // 使用默认钱包

  // Comet 合约地址
  const comet = new ethers.Contract(
    process.env.COMET_USDC_ETH,  // 通过 .env 文件传入 Comet 地址
    [
      "function liquidate(address, address) external", // 清算函数
      "function isBorrowCollateralized(address) view returns (bool)"  // 检查健康度
    ],
    signer
  );

  // B 钱包地址
  const victimAddress = "0xd2628bf5ae2e8f319d248d3465aa3f78b75a3833";  // 借款人地址

  // 检查是否健康
  const health = await comet.isBorrowCollateralized(victimAddress);
  console.log(`Victim Health: ${health}`);

  if (!health) {
    console.log("Victim is unhealthy. Proceeding with liquidation...");
    // 执行清算操作
    const tx = await comet.liquidate(victimAddress, process.env.COMET_USDC_ETH);
    console.log("Liquidation transaction hash:", tx.hash);
    await tx.wait();
    console.log("Liquidation completed.");
  } else {
    console.log("Victim is healthy, no liquidation needed.");
  }
}

main().catch(console.error);
