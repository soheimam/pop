import { ethers } from "hardhat";
import { deployedContracts } from "./deployedContractAddresses";
import { Wallet, BigNumberish, BytesLike } from "ethers";
import { account1publicKey, account1privateKey } from "./accountData";
import { ComputeRegistryAddress } from "../typechain-types";
require("dotenv").config();
async function main() {
  const privateKey = process.env.PRIVATE_KEY;

  const [deployer] = await ethers.getSigners();
  console.log(`Deploying from: ${deployer.address}`);

  let compute = await ethers.getContractFactory("ComputeRegistryAddress");
  let computeInstance = (await compute.attach(
    "0xf7a8a843B9fE1179A3172770a157B2913fb4cf27"
  )) as ComputeRegistryAddress;

  console.log(computeInstance);

  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const owner = new Wallet(privateKey!, provider);

  console.log(owner.address);

  let computedValue = await computeInstance.connect(owner).getComputeValue();

  console.log(computedValue);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
