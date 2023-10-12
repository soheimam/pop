import { ethers } from "hardhat";
import {
  ERC6551Account,
  ERC6551Registry,
  UserAdminProfileNFT,
  SimpleStorage,
} from "../typechain-types";
import { BytesLike, ContractFactory } from "ethers";

require("dotenv").config();
const privateKey = process.env.PRIVATE_KEY;

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const owner = new ethers.Wallet(privateKey!, provider);

let userAdminProfileNFT: UserAdminProfileNFT;
let _ERC6551Registry: ERC6551Registry;
let _ERC6551Account: ERC6551Account;
let _simpleStorage: SimpleStorage;

/*
user address = 0x4453c80716300CA58C9fA10B95FaC877b82890aE
registry address = 0x7fB1bAEEf4573Af779c141dad3D67E710A70CeE2
account address = 0x83073adBCD7a46018CfA438Bd1673496351Bb499
simpleStorage address = 0x6C680227ED93267eC50676704dfe7653dD551361
*/

//TODO: Overwrite these variables with the addresses of your deployed contracts
const USER_ADMIN_PROFILE_NFT_ADDRESS = `0x4453c80716300ca58c9fa10b95fac877b82890ae`;
const REGISTRY_CONTRACT_ADDRESSS = `0x7fb1baeef4573af779c141dad3d67e710a70cee2`;
const ACCOUNT_CONTRACT_ADDRESS = `0x83073adbcd7a46018cfa438bd1673496351bb499`;
const SIMPLE_STORAGE_CONTRACT_ADDRESS = `0x6c680227ed93267ec50676704dfe7653dd551361`;
const ACCOUNT_TOKEN_ONE_ADDRESS = "0x6F7f7f15F443DFb32a1A302C3c7C1e2acCD3D085";

export interface AccountCreationArgs {
  implementation_: string; // Ethereum address as string
  chainId_: any; // BigNumerishish to handle large integers
  tokenContract_: string; // Ethereum address as string
  tokenId_: any; // BigNumerishish to handle large integers
  salt_: any; // BigNumerishish to handle large integers
  initData?: BytesLike; // Bytes to handle arbitrary data
}

//TODO: RUn this function once to get all the contract addresses
let deployments = async () => {
  // Factories
  const userFactory = await ethers.getContractFactory("UserAdminProfileNFT");
  const registryFactory = await ethers.getContractFactory("ERC6551Registry");
  const accountFactory = await ethers.getContractFactory("ERC6551Account");
  const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  // Deploymnets
  userAdminProfileNFT = (await userFactory.deploy()) as UserAdminProfileNFT;
  const userDeployment = await userAdminProfileNFT.waitForDeployment();
  console.log(`user address = ${await userDeployment.getAddress()}`);

  _ERC6551Registry = (await registryFactory.deploy()) as ERC6551Registry;
  const registryDeployment = await _ERC6551Registry.waitForDeployment();
  console.log(`registry address = ${await registryDeployment.getAddress()}`);

  _ERC6551Account = (await accountFactory.deploy()) as ERC6551Account;
  const accountDeployment = await _ERC6551Account.waitForDeployment();
  console.log(`account address = ${await accountDeployment.getAddress()}`);

  _simpleStorage = (await simpleStorageFactory.deploy()) as SimpleStorage;
  const simpleStorageDeployment = await _simpleStorage.waitForDeployment();
  console.log(
    `simpleStorage address = ${await simpleStorageDeployment.getAddress()}`
  );
};

async function createTBA(registryFactory: any) {
  let args: AccountCreationArgs = {
    implementation_: ethers.getAddress(ACCOUNT_CONTRACT_ADDRESS),
    chainId_: ethers.toBigInt(31337),
    tokenContract_: ethers.getAddress(USER_ADMIN_PROFILE_NFT_ADDRESS),
    tokenId_: ethers.toBigInt(1),
    salt_: "0x6551655165516551655165516551655165516551655165516551655165516551",
  };

  // Source the contract
  const registryInstance: ERC6551Registry = new ethers.Contract(
    REGISTRY_CONTRACT_ADDRESSS,
    registryFactory.interface.format(),
    owner
  ) as unknown as ERC6551Registry;

  let accountCreation = await registryInstance.createAccount(
    args.implementation_,
    args.chainId_,
    args.tokenContract_,
    args.tokenId_,
    args.salt_,
    ethers.randomBytes(0)
  );

  console.log(`accountCreation = ${JSON.stringify(accountCreation)}`);

  let accountCreationTransaction = await accountCreation.wait();
  console.log(
    `accountCreationTransaction = ${JSON.stringify(accountCreationTransaction)}`
  );
}

let mintUserNFT = async (contractAddress: string, factory: any) => {
  let instance = new ethers.Contract(
    contractAddress,
    factory.interface.format(),
    owner
  ) as unknown as UserAdminProfileNFT;
  let transaction = await instance.mintNFT(owner.address, 1);
  console.log(`transaction = ${JSON.stringify}`);
  let transactionReceipt = transaction.wait();
  console.log(transactionReceipt);
};

async function getTBAAddressForTokenID(tokenId: number, registryFactory: any) {
  let args: AccountCreationArgs = {
    implementation_: ethers.getAddress(ACCOUNT_CONTRACT_ADDRESS),
    chainId_: ethers.toBigInt(31337),
    tokenContract_: ethers.getAddress(USER_ADMIN_PROFILE_NFT_ADDRESS),
    tokenId_: ethers.toBigInt(tokenId),
    salt_: "0x6551655165516551655165516551655165516551655165516551655165516551",
  };

  // Source the contract
  const registryInstance: ERC6551Registry = new ethers.Contract(
    REGISTRY_CONTRACT_ADDRESSS,
    registryFactory.interface.format(),
    owner
  ) as unknown as ERC6551Registry;

  let accountAddress = await registryInstance.account(
    args.implementation_,
    args.chainId_,
    args.tokenContract_,
    args.tokenId_,
    args.salt_
  );

  console.log(accountAddress);
  return accountAddress;
}

const getSimpleStorageValue = async (simpleStorageFactory: ContractFactory) => {
  const simpleStorage = new ethers.Contract(
    SIMPLE_STORAGE_CONTRACT_ADDRESS,
    simpleStorageFactory.interface.format(),
    owner
  );
  const value = await simpleStorage.getValue();
  console.log(value.toString());
};

const setSimpleStorageValue = async (
  value: number,
  simpleStorageFactory: ContractFactory,
  accountFactory: ContractFactory
) => {
  const simpleStorageJsonABI = simpleStorageFactory.interface.formatJson(); // Return the JSON-encoded ABI. This is the format Solidiy returns.
  let simpleStorageInterface = new ethers.Interface(simpleStorageJsonABI);
  const calldata = simpleStorageInterface.encodeFunctionData("setValue", [
    // Extract the calldata
    value, // The value to store
  ]);

  // get the created account
  const accountOneContract: ERC6551Account = new ethers.Contract(
    ACCOUNT_TOKEN_ONE_ADDRESS,
    accountFactory.interface.format(),
    owner
  ) as unknown as ERC6551Account;

  let accountMintCar = await accountOneContract.execute(
    SIMPLE_STORAGE_CONTRACT_ADDRESS,
    0, // value
    calldata, // calldata
    0, // operationType only 0 supported (call)
    { gasLimit: 30000000 } // gasLimit through the roof
  );

  console.log(`accountMintCar = ${JSON.stringify(accountMintCar)}`);
  let accountMintCarTransaction = await accountMintCar.wait();
  console.log(accountMintCarTransaction);

  console.log(
    `accountMintCarTransaction = ${JSON.stringify(accountMintCarTransaction)}`
  );
};

let main = async () => {
  const userFactory = await ethers.getContractFactory("UserAdminProfileNFT");
  const registryFactory = await ethers.getContractFactory("ERC6551Registry");
  const accountFactory = await ethers.getContractFactory("ERC6551Account");
  const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");

  //TODO: Run this first and then comment out or remove, replace address constants above
  // await deployments();
  //TODO: Mint a user NFT, create a TBA, and get the TBA address, then comment out or remove, it's required to uncomment then comment these functions and run one at a time to ensure stability
  // await mintUserNFT(USER_ADMIN_PROFILE_NFT_ADDRESS, userFactory);
  // await createTBA(registryFactory);
  // await getTBAAddressForTokenID(1, registryFactory);
  // await setSimpleStorageValue(20, simpleStorageFactory, accountFactory);
  // await getSimpleStorageValue(simpleStorageFactory);
};

main()
  .then()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
