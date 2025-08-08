require("dotenv").config();  // 加载 .env 文件
const { ethers } = require("hardhat");

async function main() {
  const usdcV3 = process.env.USDC_V3_ADDRESS;

  // 确保 USDC 合约地址存在
  if (!usdcV3) {
    console.log("USDC_V3_ADDRESS is not defined in .env file.");
    return;
  }

  // 创建 USDC 合约实例
  const erc20 = new ethers.Contract(
    usdcV3,
    ["function balanceOf(address) view returns (uint256)"],
    ethers.provider
  );

  // 目标地址（B 地址）
  const address = "0xd2628bf5ae2e8f319d248d3465aa3f78b75a3833";

  // 查询 USDC 余额
  const usdcBalance = await erc20.balanceOf(address);
  console.log(`USDC Balance of ${address}:`, ethers.formatUnits(usdcBalance, 6));  // 6 是 USDC 的小数位数

  // 查询 ETH 余额
  const ethBalance = await ethers.provider.getBalance(address);
  console.log(`ETH Balance of ${address}:`, ethers.formatEther(ethBalance));

  // 查询 WETH 余额
  const WETH_ADDRESS = "0xfff9976782d46cc05630d1f6ebab18b2324d6b14";  // Sepolia 网络上的 WETH 地址
  const weth = new ethers.Contract(
    WETH_ADDRESS,
    ["function balanceOf(address) view returns (uint256)"],
    ethers.provider
  );
  try {
  const wethBalance = await weth.balanceOf(address);
  console.log(`WETH Balance of ${address}:`, ethers.formatUnits(wethBalance, 18));  // WETH 的小数位数是 18
} catch (error) {
  console.error("Error fetching WETH balance:", error);
}

  // 提示调试信息
  const wethDepositTx = await ethers.provider.getTransaction("0x25a9ead7580abb327eb9dd685648bf5b5225d97ac6013708262f59556338c521");
  console.log("WETH deposit transaction status:", wethDepositTx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
