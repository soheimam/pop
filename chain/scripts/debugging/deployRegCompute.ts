import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying from: ${deployer.address}`);

  let compute = await ethers.getContractFactory("ComputeRegistryAddress");
  let computeDeploy = await compute.deploy();
  let computeInstance = await computeDeploy.waitForDeployment();

  console.log(`deployment finished at ${await computeInstance.getAddress()}`);
  console.log(`deployment finished at ${await computeInstance.getAddress()}`);

  let computedValue = await computeInstance.getComputeValue();
  console.log(`computedValue ${computedValue}`);

  let computedValue2 = await computeInstance.getComputeValue2();
  console.log(`computedValue ${computedValue2}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
