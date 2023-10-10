import { ethers } from "hardhat";
import { Wallet, BigNumberish, BytesLike } from "ethers";
import { deployedContracts } from "./deployedContractAddresses";
import { account1publicKey, account1privateKey } from "./accountData";
import {
  CarNFT,
  ERC6551Account,
  ERC6551Registry,
  UserAdminProfileNFT,
  ICarNFT,
} from "../typechain-types";

async function main() {
  // Constants
  const REGISTRY_COMPUTED_ADDRESS =
    "0x0b0c71f325faB660A39d2DAa67e1336230070389";
  const chainId = "31337";
  const tokenId = "1";
  const salt =
    "0x6551655165516551655165516551655165516551655165516551655165516551";
  const initData = "0x0b0c71f325faB660A39d2DAa67e1336230070389";
  // Definitions
  let UserAdminProfileNFT: UserAdminProfileNFT;
  let ERC6551Registry: ERC6551Registry;
  let ERC6551Account: ERC6551Account;
  let CarNFT: CarNFT;
  let ICarNFT: ICarNFT;
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
  let carProofOfPurchaseInstance = (await CarNFT.attach(
    carNftContractAddress
  )) as ICarNFT;

  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const owner = new Wallet(account1privateKey, provider);
  console.log(`owner address : ${owner.address}`);

  // let admin1 = await userProfileInstance.mintNFT(owner.address, 0);
  // let admin1MintResult = await admin1.wait();
  // console.log(
  //   `Admin token #1 transaction : ${JSON.stringify(admin1MintResult)}\n\n`
  // );

  // // // Mint the 'Admin' User profile NFT (tokenId = 0)
  // let admin2 = await userProfileInstance
  //   .connect(owner)
  //   .mintNFT(owner.address, 1);
  // let admin2MintResult = await admin2.wait();
  // console.log(
  //   `Admin token #2 transaction : ${JSON.stringify(admin2MintResult)}\n\n`
  // );

  // // console.log(
  // //   `addressess before = ${IERC6551AccountContractAddress} ,  ${UserAdminProfileNFTAddress}`
  // // );
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

  // @ts-ignore
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

  // console.log(JSON.stringify(accountCreation));
  // const receipt = await accountCreation.wait();
  // const event = receipt.events?.find((e) => e.event === "AccountCreated");
  // if (event) {
  //   const address = event.args?.account;
  //   console.log(`Account Created Address: ${address}`);
  // }

  // console.log(
  //   `addressess after = ${IERC6551AccountContractAddress} ,  ${UserAdminProfileNFTAddress}`
  // );
  const accountAddress = await registryInstance
    .connect(owner)
    .account(
      args.implementation_,
      args.chainId_,
      args.tokenContract_,
      args.tokenId_,
      args.salt_
    );
  console.log(`Account Address: ${await accountAddress}`);

  // let callData = await carProofOfPurchaseInstance.interface.encodeFunctionData(
  //   "mint",
  //   [accountAddress, 0]
  // );

  // let carMint = await carProofOfPurchaseInstance
  //   .connect(owner)
  //   .mint(accountAddress, 0);

  // let carwait = await carMint.wait();

  // console.log(carwait + "CAR MINT");

  console.log(`about to excute the mint function via 6155`);
  const callData = carProofOfPurchaseInstance.interface.encodeFunctionData(
    "hello",
    undefined
  );

  console.log(`callData : ${callData}`);

  let accountConnection = await accountInstance.connect(owner);
  let deletgator = await accountConnection
    .connect(owner)
    .execute(IERC6551AccountContractAddress, 2, callData, 0);
  let result = await deletgator.wait();
  console.log(result);

  // async function executeMintTransaction() {
  //   const maxPriorityFeePerGas = ethers.parseUnits("2", "gwei");
  //   const maxFeePerGas = ethers.parseUnits("100", "gwei"); // This value should be adjusted based on the network's current fees.
  //   const nonce = await ethers.provider.getTransactionCount(
  //     UserAdminProfileNFTAddress
  //   );
  //   const tx = {
  //     to: accountInstance, // Address of the contract with the 'execute' function
  //     value: 1, // Ether value sent with the transaction; adjust if needed
  //     gasLimit: ethers.parseUnits("500000", "wei"), // Your desired gas limit
  //     gasPrice: maxFeePerGas, // Gas price; adjust if needed
  //     nonce: 0, // Nonce; adjust if needed
  //     data: accountInstance.interface.encodeFunctionData("execute", [
  //       carNftContractAddress,
  //       5,
  //       callData,
  //       3,
  //     ]), // Encoded function call
  //   };
  //   const txResponse = await owner.sendTransaction(tx); // Assuming 'wallet' is your ethers.Wallet instance
  //   let result = txResponse.wait();
  //   console.log(result);
  // }

  // let a = await executeMintTransaction();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
