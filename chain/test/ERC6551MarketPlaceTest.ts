import { ethers } from "hardhat";
import { ContractFactory, Contract, Signer } from "ethers";
import { expect } from "chai";
import {
  ERC6551Registry,
  UserAdminProfileNFT,
  ERC6551Account,
  CarNFT,
} from "../typechain-types";

describe("ERC6551 Workflow", function () {
  let UserAdminProfileNFT: ContractFactory;
  let ERC6551Registry: ContractFactory;
  let ERC6551Account: ContractFactory;
  let CarNFT: ContractFactory;

  let owner: Signer;
  let otherAccount: Signer;

  let UserAdminProfileNFTInstance: UserAdminProfileNFT;
  let ERC6551RegistryInstance: ERC6551Registry;
  let ERC6551AccountInstance: ERC6551Account;
  let carProofOfPurchase: CarNFT;

  let carAccountAccountRetrieve: any;
  let carAccountInstance: any;

  // before(async () => {
  //   [owner, otherAccount] = await ethers.getSigners();

  //   UserAdminProfileNFT = await ethers.getContractFactory("UserAdminProfileNFT");
  //   ERC6551Registry = await ethers.getContractFactory("ERC6551Registry");
  //   ERC6551Account = await ethers.getContractFactory("ERC6551Account");
  //   CarNFT = await ethers.getContractFactory("CarNFT");

  //   UserAdminProfileNFTInstance = await UserAdminProfileNFT.deploy();
  //   ERC6551RegistryInstance = await ERC6551Registry.deploy();
  //   ERC6551AccountInstance = await ERC6551Account.deploy();
  //   carProofOfPurchase = await CarNFT.deploy("ProofOfPurchase", "POP");
  // });

  it("Workflow: From minting user NFT to adding car NFT to the car account", async function () {
    console.log("WHAT IS GOING ON");
    [owner, otherAccount] = await ethers.getSigners();
    let onwerAddress = await owner.getAddress();
    UserAdminProfileNFT = await ethers.getContractFactory(
      "UserAdminProfileNFT"
    );
    ERC6551Registry = await ethers.getContractFactory("ERC6551Registry");
    ERC6551Account = await ethers.getContractFactory("ERC6551Account");
    CarNFT = await ethers.getContractFactory("CarNFT");

    UserAdminProfileNFTInstance = await UserAdminProfileNFT.deploy();
    await UserAdminProfileNFTInstance.waitForDeployment();
    ERC6551RegistryInstance = await ERC6551Registry.deploy();
    await ERC6551RegistryInstance.waitForDeployment();
    ERC6551AccountInstance = await ERC6551Account.deploy();
    await ERC6551AccountInstance.waitForDeployment();
    carProofOfPurchase = await CarNFT.deploy("ProofOfPurchase", "POP");
    await carProofOfPurchase.waitForDeployment();
    // Mint user profile NFT
    let nftMint = await UserAdminProfileNFTInstance.mintNFT(onwerAddress, 1);
    await nftMint.wait();
    expect(await UserAdminProfileNFTInstance.ownerOf(1)).to.equal(onwerAddress);
    const chainId = await ethers.provider.send("eth_chainId");
    const tokenContractAddress = await UserAdminProfileNFTInstance.getAddress();
    const tokenId = 1;
    const salt = ethers.hexlify(ethers.randomBytes(32));
    const initData = "0x";
    let accAddy = await ERC6551AccountInstance.getAddress();
    let popAddy = await carProofOfPurchase.getAddress();

    console.log("Account address = " + accAddy);
    console.log(`tokenContractAddress = ${tokenContractAddress}`);

    let account = await ERC6551RegistryInstance.createAccount(
      accAddy,
      chainId,
      tokenContractAddress,
      tokenId,
      salt,
      initData
    );

    await account.wait();

    let accountAddress = await ERC6551RegistryInstance.account(
      accAddy,
      chainId,
      tokenContractAddress,
      tokenId,
      salt
    );

    console.log("NFT account address = " + accountAddress);

    // Execute the mint function via the car account
    let callData = await carProofOfPurchase.interface.encodeFunctionData(
      "mint",
      [popAddy, 1]
    );
    console.log("About to execute the mint function via the car account");
    console.log(`address = ${popAddy}`);

    let accountConnection = await ERC6551AccountInstance.connect(owner);

    accountConnection.waitForDeployment();

    let transactionResponse = await accountConnection.execute(
      popAddy,
      0,
      callData,
      0
    );

    transactionResponse.wait();

    let result = transactionResponse.wait();

    // Add further checks or logs as necessary
    console.log(result);
  });
});
