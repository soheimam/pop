import { ethers } from "hardhat";
import { writeFileSync } from "fs";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying from: ${deployer.address}`);

  let UserAdminProfileNFT: any;
  let ERC6551Registry: any;
  let ERC6551Account: any;
  let CarNFT: any;
  let ComputeRegAddress: any;

  UserAdminProfileNFT = await ethers.getContractFactory("UserAdminProfileNFT");
  ERC6551Registry = await ethers.getContractFactory("ERC6551Registry");
  ERC6551Account = await ethers.getContractFactory("ERC6551Account");
  CarNFT = await ethers.getContractFactory("CarNFT");
  ComputeRegAddress = await ethers.getContractFactory("ComputeRegistryAddress");

  let user = await UserAdminProfileNFT.deploy();
  user = await user.waitForDeployment();

  // let registry = await ERC6551Registry.deploy();
  // registry = await registry.waitForDeployment();

  // Define the salt

  // Deploy the contract using create2
  console.log("Deploying ERC6551Registry using create2...");
  const salt = `0x6551655165516551655165516551655165516551655165516551655165516551`;
  let contract = await ERC6551Registry.deploy({ salt: salt });
  let registry = await contract.waitForDeployment();

  console.log(`Deployed ERC6551Registry contract address: ${registry.address}`);

  let account = await ERC6551Account.deploy();
  account = await account.waitForDeployment();

  let pop = await CarNFT.deploy();
  pop = await pop.waitForDeployment();

  // let compute = await ComputeRegAddress.deploy();
  // compute = await compute.waitForDeployment();

  // Saving deployed contract addresses
  const contracts = {
    UserAdminProfileNFT: await user.getAddress(),
    ERC6551Registry: await registry.getAddress(),
    ERC6551Account: await account.getAddress(),
    CarNFT: await pop.getAddress(),
    // ComputeRegAddress: await compute.getAddress(),
  };

  console.log(contracts);

  // Write to a file
  const content = `export const deployedContracts = ${JSON.stringify(
    contracts,
    null,
    2
  )};`;
  writeFileSync("./scripts/deployedContractAddresses.ts", content);
  console.log(
    "Deployed contract addresses saved to deployedContractAddresses.ts"
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
