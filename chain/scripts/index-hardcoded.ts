import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { deployedContracts } from "./deployedContractAddresses";
const { Wallet } = require("ethers");
import { account2publicKey, account2privateKey } from "./accountData";
import { CarNFT, ERC6551Account, ERC6551Registry } from "../typechain-types";
import { UserAdminProfileNFT } from "../typechain-types/contracts/UserAdminProfileNFT.sol";

async function main() {
  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Constants
  const chainId = 1337;
  const tokenId = 1; // Since we minted only one token and the tokenId starts from 0
  const salt = ethers.getBigInt(123456789);
  const initData = "0x";
  // Definitions
  let UserAdminProfileNFT: UserAdminProfileNFT;
  let ERC6551Registry: ERC6551Registry;
  let ERC6551Account: ERC6551Account;
  let CarNFT: CarNFT;
  // Addresses
  let IERC6551RegistryContractAddress: string =
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  let IERC6551AccountContractAddress: string =
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  let carNftContractAddress: string = deployedContracts.CarNFT;
  let UserAdminProfileNFTAddress: string =
    "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  // Factories
  UserAdminProfileNFT = await ethers.getContractFactory("UserAdminProfileNFT");
  ERC6551Registry = await ethers.getContractFactory("ERC6551Registry");
  ERC6551Account = await ethers.getContractFactory("ERC6551Account");
  CarNFT = await ethers.getContractFactory("CarNFT");
  // Instances
  let userProfileInstance = (await UserAdminProfileNFT.attach(
    UserAdminProfileNFTAddress
  )) as UserAdminProfileNFT;
  let registryInstance = await ERC6551Registry.attach(
    IERC6551RegistryContractAddress
  );
  let accountInstance = await ERC6551Account.attach(
    IERC6551AccountContractAddress
  );
  let carProofOfPurchaseInstance = await CarNFT.attach(carNftContractAddress);

  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  let owner = new Wallet(account2privateKey, provider);
  console.log(`owner address : ${owner.address}`);

  // Mint the 'Admin' User profile NFT (tokenId = 0)
  let admin1 = await userProfileInstance
    .connect(owner)
    .mintNFT(account2publicKey);
  let admin1MintResult = await admin1.wait();
  console.log(
    `Admin token #1 transaction : ${JSON.stringify(admin1MintResult)}\n\n`
  );

  // Mint the 'Admin' User profile NFT (tokenId = 0)
  let admin2 = await userProfileInstance
    .connect(owner)
    .mintNFT(account2publicKey);
  let admin2MintResult = await admin2.wait();
  console.log(
    `Admin token #2 transaction : ${JSON.stringify(admin2MintResult)}\n\n`
  );

  //@ts-ignore
  let accountCreation = await registryInstance
    .connect(owner)
    .createAccount(
      "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      chainId,
      "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      tokenId,
      salt,
      initData
    );

  await accountCreation.wait();

  let accountAddress = await registryInstance
    .connect(owner)
    .account(
      "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      chainId,
      "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      tokenId,
      salt
    );

  let callData = await carProofOfPurchaseInstance.interface.encodeFunctionData(
    "mint",
    [accountAddress, 0]
  );

  let accountConnection = await accountInstance.connect(owner);

  console.log(`about to excute the mint function via 6155`);

  let delegatedMintOfCarNFT = await accountConnection.execute(
    carNftContractAddress,
    0,
    callData,
    0
  );
  console.log(
    `this is the delegatedMintOfCarNFT result : ${delegatedMintOfCarNFT}`
  );
  let result = await delegatedMintOfCarNFT.wait();
  console.log(result);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
