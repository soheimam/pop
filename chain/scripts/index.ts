import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { deployedContracts } from "./deployedContractAddresses";
const { Wallet } = require("ethers");
import { account1publicKey, account1privateKey } from "./accountData";
import { CarNFT, ERC6551Account, ERC6551Registry } from "../typechain-types";
import { UserProfileNFT } from "../typechain-types/contracts/UserProfileNFT.sol";

async function main() {
  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Constants
  // const chainId: Uint256 = 31337;
  let chainId = ethers.toBigInt(1337);
  const tokenId = ethers.toBigInt(1); // Since we minted only one token and the tokenId starts from 0
  const salt = ethers.getBigInt(111);
  const initData = "0x";
  // Definitions
  let UserProfileNFT: UserProfileNFT;
  let ERC6551Registry: ERC6551Registry;
  let ERC6551Account: ERC6551Account;
  let CarNFT: CarNFT;
  // Addresses
  let IERC6551RegistryContractAddress: string =
    deployedContracts.ERC6551Registry;
  let IERC6551AccountContractAddress: string = deployedContracts.ERC6551Account;
  let carNftContractAddress: string = deployedContracts.CarNFT;
  let UserProfileNFTAddress: string = deployedContracts.UserProfileNFT;
  // Factories
  UserProfileNFT = await ethers.getContractFactory("UserProfileNFT");
  ERC6551Registry = await ethers.getContractFactory("ERC6551Registry");
  ERC6551Account = await ethers.getContractFactory("ERC6551Account");
  CarNFT = await ethers.getContractFactory("CarNFT");
  // Instances
  let userProfileInstance = (await UserProfileNFT.attach(
    UserProfileNFTAddress
  )) as UserProfileNFT; // UserProfileNFT - Not really needed, but just for reference
  let registryInstance = await ERC6551Registry.attach(
    IERC6551RegistryContractAddress
  );
  let accountInstance = await ERC6551Account.attach(
    IERC6551AccountContractAddress
  );
  let carProofOfPurchaseInstance = await CarNFT.attach(carNftContractAddress);

  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const owner = new Wallet(account1privateKey, provider);
  console.log(`owner address : ${owner.address}`);

  // Mint the 'Admin' User profile NFT (tokenId = 0)
  let admin1 = await userProfileInstance
    .connect(owner)
    .mintNFT(owner.address, 0);
  let admin1MintResult = await admin1.wait();
  console.log(
    `Admin token #1 transaction : ${JSON.stringify(admin1MintResult)}\n\n`
  );

  // Mint the 'Admin' User profile NFT (tokenId = 0)
  let admin2 = await userProfileInstance
    .connect(owner)
    .mintNFT(owner.address, 1);
  let admin2MintResult = await admin2.wait();
  console.log(
    `Admin token #2 transaction : ${JSON.stringify(admin2MintResult)}\n\n`
  );

  console.log(
    `addressess before = ${IERC6551AccountContractAddress} ,  ${UserProfileNFTAddress}`
  );

  //@ts-ignore
  let accountCreation = await registryInstance
    .connect(owner)
    .createAccount(
      IERC6551AccountContractAddress,
      chainId,
      UserProfileNFTAddress,
      tokenId,
      salt,
      initData
    );

  console.log(JSON.stringify(accountCreation));
  const receipt = await accountCreation.wait();
  const event = receipt.events?.find((e) => e.event === "AccountCreated");
  if (event) {
    const address = event.args?.account;
    console.log(`Account Created Address: ${address}`);
  }

  console.log(
    `addressess after = ${IERC6551AccountContractAddress} ,  ${UserProfileNFTAddress}`
  );
  const accountAddress = registryInstance
    .connect(owner)
    .account(
      IERC6551AccountContractAddress,
      chainId,
      UserProfileNFTAddress,
      tokenId,
      salt
    );
  console.log(`Account Address: ${await accountAddress}`);

  let callData = await carProofOfPurchaseInstance.interface.encodeFunctionData(
    "mint",
    [await accountAddress, 0]
  );

  console.log(`about to excute the mint function via 6155`);

  let delegatedMintOfCarNFT = await accountInstance
    .connect(owner)
    .execute(carNftContractAddress, 0, callData, 0);
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
