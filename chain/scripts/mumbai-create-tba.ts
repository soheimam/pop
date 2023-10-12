import { ethers } from "hardhat";
import { AccountCreationArgs } from "./ERC6551-Script";
// import { POP_CAR_ADDRESS } from "./mumbai-mint-car";

const MUMBAI_REGISTRY_ADDRESS = `0x02101dfB77FDE026414827Fdc604ddAF224F0921`;
const MUMBAI_ACCOUNT_ADDRESS = `0x2d25602551487c3f3354dd80d76d54383a243358`;
const POP_CAR_ADDRESS = `0x0f6E8b805341d1d6E9cCe8b3f0d167d6c20f7FEF`;

const DAN_TBA_ADDRESS = `0x4524917ac0b68cFBd27931899e19319F7b48F5E5`;

async function createTBA() {
  let args: AccountCreationArgs = {
    implementation_: ethers.getAddress(MUMBAI_ACCOUNT_ADDRESS),
    chainId_: ethers.toBigInt(80001),
    tokenContract_: ethers.getAddress(POP_CAR_ADDRESS),
    tokenId_: ethers.toBigInt(1), //TODO: Put your token number here
    salt_: "0x6551655165516551655165516551655165516551655165516551655165516551",
  };

  let mumbaiAccountContract = (await ethers.getContractAt(
    "ERC6551Registry",
    MUMBAI_REGISTRY_ADDRESS
  )) as any;

  let accountCreation = await mumbaiAccountContract.createAccount(
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

const getTBAAddress = async (tokenId: number) => {
  let args: AccountCreationArgs = {
    implementation_: ethers.getAddress(MUMBAI_ACCOUNT_ADDRESS),
    chainId_: ethers.toBigInt(80001),
    tokenContract_: ethers.getAddress(POP_CAR_ADDRESS),
    tokenId_: ethers.toBigInt(2), //TODO: Put your token number here
    salt_: "0x6551655165516551655165516551655165516551655165516551655165516551",
  };

  let mumbaiAccountContract = (await ethers.getContractAt(
    "ERC6551Registry",
    MUMBAI_REGISTRY_ADDRESS
  )) as any;

  let account = await mumbaiAccountContract.account(
    args.implementation_,
    args.chainId_,
    args.tokenContract_,
    args.tokenId_,
    args.salt_
  );

  console.log(`Get Address = ${JSON.stringify(account)}`);
};

const main = async () => {
  console.log(`Running tba script ...`);
  await createTBA();
  // await getTBAAddress(1);
};

main()
  .then()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
