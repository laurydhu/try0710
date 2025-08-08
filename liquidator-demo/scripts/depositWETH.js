const { ethers } = require("hardhat");

async function main() {
  const signer = (await ethers.getSigners())[0];
  const WETH_ADDRESS = "0x4200000000000000000000000000000000000006";  // Sepolia WETH 地址
  const WETH = new ethers.Contract(
    WETH_ADDRESS,
    ["function deposit() payable", "function balanceOf(address) view returns (uint256)"],
    signer
  );

  // 转账 ETH 到 WETH 合约
  const depositAmount = ethers.parseEther("0.01");  // 转账 0.01 ETH
  const tx = await WETH.deposit({ value: depositAmount });
  console.log(`Transaction hash: ${tx.hash}`);
  await tx.wait();

  // 查询 WETH 余额
  const balance = await WETH.balanceOf(signer.address);
  console.log(`WETH Balance: ${ethers.formatUnits(balance, 18)}`);
}
  const wethAddress = "WETH_CONTRACT_ADDRESS"; // 替换为 Sepolia 上的 WETH 合约地址
  const weth = new ethers.Contract(wethAddress, wethABI, signer);

// 发送铸造请求
  const depositTx = await weth.deposit({ value: ethers.utils.parseEther("1.0") }); // 假设你想存入 1 ETH
  console.log("Deposit transaction hash:", depositTx.hash);

// 等待交易确认
  await depositTx.wait();
  console.log("Deposit successful");

// 然后尝试调用 balanceOf
  const balance = await weth.balanceOf(address);
  console.log(`Balance of ${address}: ${ethers.utils.formatEther(balance)} WETH`);


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
