import { ethers } from "hardhat";
import { Wallet, BigNumberish, BytesLike } from "ethers";
import { deployedContracts } from "./deployedContractAddresses";
import { account1publicKey, account1privateKey } from "./accountData";
import {
  CarNFT,
  ERC6551Account,
  ERC6551Registry,
  UserAdminProfileNFT,
} from "../typechain-types";

async function main() {
  // Constants
  const chainId = "80001";
  const tokenId = "1";
  const salt = "0";
  const initData = "0x";
  // Definitions
  let UserAdminProfileNFT: UserAdminProfileNFT;
  let ERC6551Registry: ERC6551Registry;
  let ERC6551Account: ERC6551Account;
  let CarNFT: CarNFT;
  // Addresses
  let IERC6551RegistryContractAddress: string =
    deployedContracts.ERC6551Registry;
  let IERC6551AccountContractAddress: string = deployedContracts.ERC6551Account;
  let carNftContractAddress: string = deployedContracts.CarNFT;
  let UserAdminProfileNFTAddress: string =
    deployedContracts.UserAdminProfileNFT;
  // Factories
  UserAdminProfileNFT = await ethers.getContractFactory("UserAdminProfileNFT");
  ERC6551Registry = await ethers.getContractFactory("ERC6551Registry");
  ERC6551Account = await ethers.getContractFactory("ERC6551Account");
  CarNFT = await ethers.getContractFactory("CarNFT");
  // Instances
  let userProfileInstance = (await UserAdminProfileNFT.attach(
    UserAdminProfileNFTAddress
  )) as UserAdminProfileNFT; // UserAdminProfileNFT - Not really needed, but just for reference
  let registryInstance = (await ERC6551Registry.attach(
    IERC6551RegistryContractAddress
  )) as ERC6551Registry;
  let accountInstance = (await ERC6551Account.attach(
    IERC6551AccountContractAddress
  )) as ERC6551Account;
  let carProofOfPurchaseInstance = await CarNFT.attach(carNftContractAddress);

  const provider = new ethers.JsonRpcProvider(
    "https://polygon-mumbai.infura.io/v3/cfd227411813452cb3c81dec14c167ec"
  );
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

  let tokenOneOwner = await userProfileInstance.connect(owner).ownerOf(0);
  console.log(`tokenOneOwner = ${tokenOneOwner}`);

  console.log(
    `addressess before = ${IERC6551AccountContractAddress} ,  ${UserAdminProfileNFTAddress}`
  );
  interface ContractArgs {
    implementation_: string; // Ethereum address as string
    chainId_: any; // BigNumerishish to handle large integers
    tokenContract_: string; // Ethereum address as string
    tokenId_: any; // BigNumerishish to handle large integers
    salt_: any; // BigNumerishish to handle large integers
    initData: BytesLike; // Bytes to handle arbitrary data
  }

  let args: ContractArgs = {
    implementation_: IERC6551AccountContractAddress,
    chainId_: ethers.toBigInt(chainId),
    tokenContract_: UserAdminProfileNFTAddress,
    tokenId_: ethers.toBigInt(tokenId),
    salt_: ethers.toBigInt(salt),
    initData: "0x", // Bytes to handle arbitrary data
  };

  //@ts-ignore
  let accountCreation = await registryInstance
    .connect(owner)
    .createAccount(
      args.implementation_,
      args.chainId_,
      args.tokenContract_,
      args.tokenId_,
      args.salt_,
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
    `addressess after = ${IERC6551AccountContractAddress} ,  ${UserAdminProfileNFTAddress}`
  );
  const accountAddress = registryInstance
    .connect(owner)
    .account(
      args.implementation_,
      args.chainId_,
      args.tokenContract_,
      args.tokenId_,
      args.salt_
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
