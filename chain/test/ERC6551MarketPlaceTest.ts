import { ethers } from "hardhat";
import { ContractFactory, Contract, Signer } from "ethers";
import { expect } from "chai";
import {
  ERC6551Registry,
  UserProfileNFT,
  ERC6551Account,
  CarNFT,
} from "../typechain-types";

describe("ERC6551 Workflow", function () {
  let UserProfileNFT: ContractFactory;
  let ERC6551Registry: ContractFactory;
  let ERC6551Account: ContractFactory;
  let CarNFT: ContractFactory;

  let owner: Signer;
  let otherAccount: Signer;

  let userProfileNFTInstance: UserProfileNFT;
  let ERC6551RegistryInstance: ERC6551Registry;
  let ERC6551AccountInstance: ERC6551Account;
  let carProofOfPurchase: CarNFT;

  let carAccountAccountRetrieve: any;
  let carAccountInstance: any;

  before(async () => {
    [owner, otherAccount] = await ethers.getSigners();

    UserProfileNFT = await ethers.getContractFactory("UserProfileNFT");
    ERC6551Registry = await ethers.getContractFactory("ERC6551Registry");
    ERC6551Account = await ethers.getContractFactory("ERC6551Account");
    CarNFT = await ethers.getContractFactory("CarNFT");

    userProfileNFTInstance = await UserProfileNFT.deploy();
    ERC6551RegistryInstance = await ERC6551Registry.deploy();
    ERC6551AccountInstance = await ERC6551Account.deploy();
    carProofOfPurchase = await CarNFT.deploy("ProofOfPurchase", "POP");
  });

  it("Workflow: From minting user NFT to adding car NFT to the car account", async function () {
    // Mint user profile NFT
    await userProfileNFTInstance.mintNFT(owner.getAddress());
    expect(await userProfileNFTInstance.ownerOf(0)).to.equal(
      await owner.getAddress()
    );

    const chainId = await ethers.provider.send("eth_chainId");
    const tokenContractAddress = await userProfileNFTInstance.getAddress();
    const tokenId = 1; // Since we minted only one token and the tokenId starts from 0
    const salt = ethers.getBigInt(123456789);
    const initData = "0x";

    carAccountInstance = await ERC6551RegistryInstance.createAccount(
      await ERC6551AccountInstance.getAddress(),
      chainId,
      tokenContractAddress,
      tokenId,
      salt,
      initData
    );

    carAccountAccountRetrieve = await ERC6551RegistryInstance.account(
      await ERC6551AccountInstance.getAddress(),
      chainId,
      tokenContractAddress,
      tokenId,
      salt
    );

    // Execute the mint function via the car account
    let callData = await carProofOfPurchase.interface.encodeFunctionData(
      "mint",
      [carAccountAccountRetrieve, 1]
    );

    let accountConnection = ERC6551AccountInstance.connect(owner);
    let transactionResponse = await accountConnection.execute(
      carProofOfPurchase.getAddress(),
      0,
      callData,
      0
    );

    // Add further checks or logs as necessary
    console.log(transactionResponse);
  });

  it("Should check token details on the car account", async function () {
    // Create a new instance of ERC6551Account at the given address.
    const carAccount = ERC6551Account.attach(carAccountAccountRetrieve);

    let [chainId, tokenContract, tokenId] = await carAccount.token();
    console.log("Token details from the car account:");
    console.log(`Chain ID: ${chainId}`);
    console.log(`Token Contract Address: ${tokenContract}`);
    console.log(`Token ID: ${tokenId}`);

    expect(tokenContract).to.equal(await userProfileNFTInstance.getAddress());
    console.log(tokenId);
    expect(tokenId).to.equal(0); // since you're using the tokenId 1
  });
});
