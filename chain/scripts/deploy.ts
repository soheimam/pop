import { ethers } from "hardhat";
import { ContractFactory, Contract } from "ethers";
import { writeFileSync } from "fs";

async function main() {
  let UserProfileNFT: any;
  let ERC6551Registry: any;
  let ERC6551Account: any;
  let CarNFT: any;

  UserProfileNFT = await ethers.getContractFactory("UserProfileNFT");
  ERC6551Registry = await ethers.getContractFactory("ERC6551Registry");
  ERC6551Account = await ethers.getContractFactory("ERC6551Account");
  CarNFT = await ethers.getContractFactory("CarNFT");

  let user = await UserProfileNFT.deploy();
  user = await user.waitForDeployment();

  let registry = await ERC6551Registry.deploy();
  registry = await registry.waitForDeployment();

  let account = await ERC6551Account.deploy();
  account = await account.waitForDeployment();

  let pop = await CarNFT.deploy("ProofOfPurchase", "POP");
  pop = await pop.waitForDeployment();

  // Saving deployed contract addresses
  const contracts = {
    UserProfileNFT: await user.getAddress(),
    ERC6551Registry: await registry.getAddress(),
    ERC6551Account: await account.getAddress(),
    CarNFT: await pop.getAddress(),
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
