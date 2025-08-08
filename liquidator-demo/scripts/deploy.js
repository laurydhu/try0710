// scripts/deploy.js

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const Comet = await ethers.getContractFactory("Comet");
  const comet = await Comet.deploy();
  console.log("Comet deployed to:", comet.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
