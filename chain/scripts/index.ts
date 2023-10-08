import { ethers } from "hardhat";
import { ContractFactory, Contract, Signer } from "ethers";
import {
  ERC6551Registry,
  UserProfileNFT,
  ERC6551Account,
  CarNFT,
} from "../typechain-types";
const { Wallet } = require("ethers");

// scripts/index.js
async function main() {
  let UserProfileNFT: ContractFactory;
  let ERC6551Registry: ContractFactory;
  let ERC6551Account: ContractFactory;
  let CarNFT: ContractFactory;
  const regAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";
  const carAddress = "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9";
  const accountAttatchAddress = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0";
  UserProfileNFT = await ethers.getContractFactory("UserProfileNFT");
  ERC6551Registry = await ethers.getContractFactory("ERC6551Registry");
  ERC6551Account = await ethers.getContractFactory("ERC6551Account");
  CarNFT = await ethers.getContractFactory("CarNFT");
  let carAccountInstance = await ERC6551Registry.attach(regAddress);
  let carAccountConnection = await ERC6551Account.attach(accountAttatchAddress);
  let carProofOfPurchase = await CarNFT.attach(carAddress);
  const chainId = 1337;
  const tokenContractAddress = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0";
  const tokenId = 1; // Since we minted only one token and the tokenId starts from 0
  const salt = ethers.getBigInt(123456789);
  const initData = "0x";

  // let accountCreation = await carAccountInstance.interface.encodeFunctionData(
  //   "createAccount",
  //   [
  //     "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0",
  //     chainId,
  //     tokenContractAddress,
  //     tokenId,
  //     salt,
  //     initData,
  //   ]
  // );

  const ownerPrivateKey =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  let owner = new Wallet(ownerPrivateKey, provider);

  //@ts-ignore
  let accountCreation = await carAccountInstance
    .connect(owner)
    .createAccount(
      "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0",
      chainId,
      tokenContractAddress,
      tokenId,
      salt,
      initData
    );

  await accountCreation.wait();

  let accountAddress = await carAccountInstance
    .connect(owner)
    .account(
      "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0",
      chainId,
      tokenContractAddress,
      tokenId,
      salt
    );

  // let accountAddress = await carAccountInstance.interface.encodeFunctionData(
  //   "account",
  //   [

  //   ]
  // );

  console.log(`this is the account address : ${accountAddress}`);

  // console.log(accountCreation);

  let callData = await carProofOfPurchase.interface.encodeFunctionData("mint", [
    accountAddress,
    0,
  ]);

  let accountConnection = await carAccountConnection.connect(owner);

  console.log(`about to excute the mint function via 6155`);

  let test = await accountConnection.execute(carAddress, 0, callData, 0);
  console.log(`this is the test result : ${test}`);
  let result = await test.wait();
  // let transaction = await accountConnection.interface.encodeFunctionData(
  //   "execute",
  //   [carAddress, 0, callData, 0]
  // );

  // let NFTMINT = await carAccountInstance
  //   .connect(owner)
  //   .execute(carAddress, 0, callData, 0);

  console.log(result);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
