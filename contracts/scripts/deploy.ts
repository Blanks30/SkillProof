import hre from "hardhat";
const { ethers } = hre;

async function main() {
  console.log("==========================================");
  console.log("SkillProof Registry Smart Contract Deploy");
  console.log("==========================================");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  const Factory = await ethers.getContractFactory("SkillProofRegistry");
  const registry = await Factory.deploy();
  await registry.waitForDeployment();

  const contractAddress = await registry.getAddress();
  console.log("SkillProofRegistry deployed successfully to:", contractAddress);
  console.log("Owner / Initial Authorized Issuer:", deployer.address);
  console.log("==========================================");

  return contractAddress;
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
