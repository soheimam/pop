import { ethers } from "hardhat";
import { ContractFactory, Contract, Signer } from "ethers";
import {
  ERC6551Registry,
  UserProfileNFT,
  ERC6551Account,
  CarNFT,
} from "../typechain-types";

async function main() {
  // We get the contract to deploy
  let UserProfileNFT: ContractFactory;
  let ERC6551Registry: ContractFactory;
  let ERC6551Account: ContractFactory;
  let CarNFT: ContractFactory;
  let userProfileNFTInstance: UserProfileNFT;
  let ERC6551RegistryInstance: ERC6551Registry;
  let ERC6551AccountInstance: ERC6551Account;
  let carProofOfPurchase: CarNFT;

  UserProfileNFT = await ethers.getContractFactory("UserProfileNFT");
  ERC6551Registry = await ethers.getContractFactory("ERC6551Registry");
  ERC6551Account = await ethers.getContractFactory("ERC6551Account");
  CarNFT = await ethers.getContractFactory("CarNFT");

  const user = await UserProfileNFT.deploy();
  await user.waitForDeployment();
  const registry = await ERC6551Registry.deploy();
  await registry.waitForDeployment();
  const account = await ERC6551Account.deploy();
  await account.waitForDeployment();
  const pop = await CarNFT.deploy("ProofOfPurchase", "POP");
  await pop.waitForDeployment();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
