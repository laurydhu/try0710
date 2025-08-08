require("dotenv").config();  // 加载 .env 文件
const { ethers } = require("hardhat");

async function main() {
  const signer = (await ethers.getSigners())[0];

  // 地址
  const comet = new ethers.Contract(
    process.env.COMET_USDC_ETH,
    [
      "function baseToken() view returns (address)",
      "function isBorrowCollateralized(address) view returns (bool)",
      "function supply(address,uint256) external",
      "function withdraw(address,uint256) external",
      "function minimumCollateralizationRatio() view returns (uint256)", // 查询最低抵押比率
      "function maxLoanToValue() view returns (uint256)"  // 查询最大借款比率
    ],
    signer
  );

  // 检查 baseToken 是否能正常工作
  try {
    const baseToken = await comet.baseToken();
    console.log("Base Token Address:", baseToken); // 打印 baseToken 地址
  } catch (err) {
    console.error("Error fetching base token address:", err); // 如果失败，输出错误信息
  }

  // 在查询其他数据之前先验证合约状态
  try {
    const maxLoanToValue = await comet.maxLoanToValue();
    console.log("Max Loan To Value:", ethers.formatUnits(maxLoanToValue, 18));  // 格式化为 18 位小数
  } catch (err) {
    console.error("Error fetching max loan to value:", err);  // 捕获查询最大借款比率的错误
  }

  try {
    // ① 查询最低抵押比率
    const collateralizationRatio = await comet.minimumCollateralizationRatio();
    console.log("Minimum Collateralization Ratio:", ethers.formatUnits(collateralizationRatio, 18)); // 18 位小数
  } catch (err) {
    console.error("Error fetching data from comet contract:", err);  // 捕获查询最低抵押比率的错误
  }

  const WETH = "0xfff9976782d46cc05630d1f6ebab18b2324d6b14";

  try {
    // ③ 获取 WETH 余额
    const weth = new ethers.Contract(
      WETH,
      ["function deposit() payable", "function approve(address,uint256)", "function balanceOf(address) view returns (uint256)"],
      signer
    );

    const wethBalance = await weth.balanceOf(signer.address);
    console.log("WETH Balance:", wethBalance ? ethers.formatUnits(wethBalance, 18) : "Error: No balance found");

    // 如果 wethBalance 为 undefined，或者余额不足，则终止
    if (!wethBalance || ethers.BigNumber.from(wethBalance).lt(ethers.parseEther("0.02"))) {
      console.log("Insufficient WETH balance to supply");
      return;
    }

    // 存入 0.02 ETH 成为 WETH
    await (await weth.deposit({ value: ethers.parseEther("0.02") })).wait();

    // ④ 授权 Comet 使用 WETH
    await (await weth.approve(comet.target, ethers.MaxUint256)).wait();

    // ⑤ 只供应 0.02 WETH 当抵押
    const tx = await comet.supply(WETH, ethers.parseEther("0.02"));
    await tx.wait();  // 确保交易已经确认

    // ⑥ 借光 5 USDC-V3
    const usdcV3 = await comet.baseToken();
    const withdrawTx = await comet.withdraw(usdcV3, ethers.parseUnits("5", 6));
    await withdrawTx.wait();  // 等待交易确认

    // ⑦ 检查健康度（应为 false）
    const ok = await comet.isBorrowCollateralized(signer.address);
    console.log("Health OK? ", ok);        // 预期输出 false
  } catch (err) {
    console.error("Error in executing transaction:", err);
  }
}

main().catch(console.error);
