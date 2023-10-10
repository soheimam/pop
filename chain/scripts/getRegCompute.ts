import { ethers } from "hardhat";
import { deployedContracts } from "./deployedContractAddresses";
import { Wallet, BigNumberish, BytesLike } from "ethers";
import { account1publicKey, account1privateKey } from "./accountData";
import { ComputeRegistryAddress } from "../typechain-types";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying from: ${deployer.address}`);

  let compute = await ethers.getContractFactory("ComputeRegistryAddress");
  let computeInstance = (await compute.attach(
    "0xf7a8a843B9fE1179A3172770a157B2913fb4cf27"
  )) as ComputeRegistryAddress;

  console.log(computeInstance);

  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const owner = new Wallet(
    `0x052dd1e481a2790416040640f2e8cebb8a8a69a68365a851c2ec403a7cfc6294`,
    provider
  );

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
