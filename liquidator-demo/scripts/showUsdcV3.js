//查余额
require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const signer = (await ethers.getSigners())[0];

  // 1️⃣ 连接到你的 Comet（Sepolia USDC-ETH）
  const comet = new ethers.Contract(
    process.env.COMET_USDC_ETH,                 // .env 里那串 Comet 地址
    ["function baseToken() view returns (address)"],
    signer
  );

  // 2️⃣ 读取 baseToken (= USDC-V3) 地址
  const usdcV3 = await comet.baseToken();
  console.log("USDC-V3 token address:", usdcV3);


  // 3️⃣ 看看自己到底有没有 1000 枚
  const erc20 = new ethers.Contract(
    usdcV3,
    ["function balanceOf(address) view returns (uint256)"],
    signer
  );
  const bal = await erc20.balanceOf(signer.address);
  console.log("Your balance     :", ethers.formatUnits(bal, 6), "USDC-V3");
}

main().catch(console.error);
