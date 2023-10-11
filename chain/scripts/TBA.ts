import { ethers } from "hardhat";
import {
  CarNFT,
  ERC6551Account,
  ERC6551Registry,
  UserAdminProfileNFT,
  ICarNFT,
} from "../typechain-types";
import {
  ContractTransactionResponse,
  ContractTransactionReceipt,
  BytesLike,
} from "ethers";
import { carNftContractSol } from "../typechain-types/contracts";

require("dotenv").config();
const privateKey = process.env.PRIVATE_KEY;

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const owner = new ethers.Wallet(privateKey!, provider);

let UserAdminProfileNFT: UserAdminProfileNFT;
let ERC6551Registry: ERC6551Registry;
let ERC6551Account: ERC6551Account;
let CarNFT: CarNFT;

interface AccountCreationArgs {
  implementation_: string; // Ethereum address as string
  chainId_: any; // BigNumerishish to handle large integers
  tokenContract_: string; // Ethereum address as string
  tokenId_: any; // BigNumerishish to handle large integers
  salt_: any; // BigNumerishish to handle large integers
  initData?: BytesLike; // Bytes to handle arbitrary data
}

async function main() {
  let userFactory = await ethers.getContractFactory(
    "UserAdminProfileNFT",
    owner
  );

  const _reg = await ethers.getContractFactory("ERC6551Registry");
  const account = await ethers.getContractFactory("ERC6551Account");

  const IEC721_TBA_DEPLOY = async () => {
    let user = await userFactory.deploy();
    console.log(`UserAdminProfileNFT deployed to: ${await user.getAddress()}`);
    return await user.waitForDeployment();
  };

  async function mint721UserTBA() {
    // Call the function
    let userFactory = await ethers.getContractFactory(
      "UserAdminProfileNFT",
      owner
    );
    let amountToSend = ethers.parseEther("1"); // sending 1 Ether
    let instance = new ethers.Contract(
      "0x4453c80716300CA58C9fA10B95FaC877b82890aE",
      userFactory.interface.format(),
      owner
    ) as unknown as UserAdminProfileNFT;
    let transaction = await instance.mintNFT(owner.address, 1);
    // let transaction = await instance.mintNFT(owner.address, 1, {
    //   value: amountToSend,
    // });

    return transaction;
  }

  async function registry() {
    const _regDeploy = await _reg.connect(owner).deploy();
    const _regTransaction = await _regDeploy.waitForDeployment();
    console.log(`Registry deployed to: ${await _regDeploy.getAddress()}`);
    return _regTransaction;
  }

  async function accountContract() {
    const account = await ethers.getContractFactory("ERC6551Account");
    const accountDeploy = await account.connect(owner).deploy();
    const accountTransaction = await accountDeploy.waitForDeployment();
    console.log(
      `Account deployed to: ${await accountTransaction.getAddress()}`
    );
    return accountTransaction;
  }

  async function car() {
    let carFactory = await ethers.getContractFactory("CarNFT", owner);
    let car = await carFactory.deploy();
    console.log(`CarNFT deployed to: ${await car.getAddress()}`);
    await car.waitForDeployment();
  }

  async function createTBA() {
    let args: AccountCreationArgs = {
      implementation_: ethers.getAddress(
        "0x6e947870361964AfA76ca3C68d5190C95AB00143"
      ),
      chainId_: ethers.toBigInt(31337),
      tokenContract_: ethers.getAddress(
        "0x4453c80716300ca58c9fa10b95fac877b82890ae"
      ),
      tokenId_: ethers.toBigInt(1),
      salt_:
        "0x6551655165516551655165516551655165516551655165516551655165516551",
    };

    // Source the contract
    const registryInstance: ERC6551Registry = new ethers.Contract(
      `0x70993A5438c3dd991D508f8FBAB33C0164d3Ed18`,
      _reg.interface.format(),
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

    let accountCreationTransaction = await accountCreation.wait();
    console.log(accountCreationTransaction);
  }

  async function getTBAAddressForTokenID(tokenId: number) {
    let args: AccountCreationArgs = {
      implementation_: ethers.getAddress(
        "0x6e947870361964AfA76ca3C68d5190C95AB00143"
      ),
      chainId_: ethers.toBigInt(31337),
      tokenContract_: ethers.getAddress(
        "0x4453c80716300ca58c9fa10b95fac877b82890ae"
      ),
      tokenId_: ethers.toBigInt(tokenId),
      salt_:
        "0x6551655165516551655165516551655165516551655165516551655165516551",
    };

    // Source the contract
    const registryInstance: ERC6551Registry = new ethers.Contract(
      `0x83073adbcd7a46018cfa438bd1673496351bb499`,
      _reg.interface.format(),
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

  async function deployTest() {
    // create factory and instance for deploy of SimpleStorage
    const simple = await ethers.getContractFactory("SimpleStorage", owner);
    const simpleInstance = await simple.deploy();
    let result = await simpleInstance.waitForDeployment();
    console.log(
      `SimpleStorage deployed to: ${await simpleInstance.getAddress()}`
    );
  }

  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  //   async function exampleFunction() {
  //     console.log("Starting...");
  //     await sleep(10000);  // Sleep for 10 seconds
  //     console.log("...Finished sleeping for 10 seconds");
  // }

  // await IEC721_TBA_DEPLOY();
  // await mint721UserTBA();
  // await createTBA();
  // await registry();
  // await accountContract();
  // await getTBAAddress();
  //
  // await deployTest();

  // async function mintACar() {
  //   //get the contract
  //   let carFactory = await ethers.getContractFactory("CarNFT", owner);

  //   //let mintFn = carFactory.interface.getFunction("mint");

  //   // let calldata = carFactory.interface.getFunction("mint", [
  //   //   ethers.getAddress("0xb6D9f614907368499bAF7b288b54B839fC891660"),
  //   //   ethers.toBigInt(1),
  //   // ]);
  //   // let calldata = carFactory.interface.encodeFunctionData("mint", ["0xb6D9f614907368499bAF7b288b54B839fC891660", 1]);

  //   // let calldata = carFactory.interface.encodeFunctionData("mint", [
  //   //   ethers.getAddress("0xb6D9f614907368499bAF7b288b54B839fC891660"),
  //   //   ethers.toBigInt(1),
  //   // ]);

  //   let cdata = {
  //     inputs: [],
  //     name: "hello",
  //     outputs: [
  //       {
  //         internalType: "string",
  //         name: "",
  //         type: "string",
  //       },
  //     ],
  //     stateMutability: "pure",
  //     type: "function",
  //   };

  //   let ABI = ["function mint(address to, uint256 tokenId)"];
  //   let iface = new ethers.Interface(ABI);
  //   let calldata = iface.encodeFunctionData("mint", [
  //     "0xAD6d5fFEeA5Cc649938b0FA06D452c3ca14695a6",
  //     1,
  //   ]);
  //   const account = await ethers.getContractFactory("ERC6551Account");
  //   const accountOneContract: ERC6551Account = new ethers.Contract(
  //     `0x6e947870361964AfA76ca3C68d5190C95AB00143`,
  //     account.interface.format(),
  //     owner
  //   ) as unknown as ERC6551Account;
  //   console.log(accountOneContract.interface.formatJson());
  //   const carContract: CarNFT = new ethers.Contract(
  //     `0xF8b68956c8636C05f3D2F184Ce2B1719A30fb494`,
  //     carFactory.interface.format(),
  //     owner
  //   ) as unknown as CarNFT;
  //   console.log(accountOneContract.interface.formatJson());

  //   // * @param to        The target address of the operation
  //   // * @param value     The Ether value to be sent to the target
  //   // * @param data      The encoded operation calldata
  //   // * @param operation A value indicating the type of operation to perform
  //   let accountMintCar = await accountOneContract.execute(
  //     await carContract.getAddress(),
  //     0,
  //     calldata,
  //     0
  //   );
  //   let accountMintCarTransaction = await accountMintCar.wait();
  //   console.log(accountMintCarTransaction);
  // }

  // async function debugcar() {
  //   let carFactory = await ethers.getContractFactory("CarNFT", owner);
  //   const carContract: CarNFT = new ethers.Contract(
  //     `0xF8b68956c8636C05f3D2F184Ce2B1719A30fb494`,
  //     carFactory.interface.format(),
  //     owner
  //   ) as unknown as CarNFT;
  //   console.log(carContract.interface.formatJson());
  // }
  // await debugcar();
  // // Deploy the ERC721 contract TBA
  // let userInstance = await IEC721_TBA_DEPLOY(); // 0xf7a8a843b9fe1179a3172770a157b2913fb4cf27
  // // Mint a ERC721 NFT TBA TOKEN #1
  // await mint721UserTBA(userInstance);
  // Create the registry
  //let registryInstance = await registry(); // registry made 0x70993A5438c3dd991D508f8FBAB33C0164d3Ed18

  //let accountInstance = await accountContract(); // account made 0x6e947870361964AfA76ca3C68d5190C95AB00143

  //await car(); // 0xF8b68956c8636C05f3D2F184Ce2B1719A30fb494

  // await createTBA();

  // await getAccount#1Address(); //0xAD6d5fFEeA5Cc649938b0FA06D452c3ca14695a6

  // async function getChainId() {
  //   const network = await provider.getNetwork();
  //   console.log("Chain ID:", network.chainId);
  //   return network.chainId;
  // }

  // await getChainId();

  // await mintACar();

  // await deployTest();
  // let simpleABI = [
  //   {
  //     constant: true,
  //     inputs: [],
  //     name: "getValue",
  //     outputs: [{ name: "", type: "uint256" }],
  //     payable: false,
  //     stateMutability: "view",
  //     type: "function",
  //   },
  //   {
  //     constant: false,
  //     inputs: [{ name: "newValue", type: "uint256" }],
  //     name: "setValue",
  //     outputs: [],
  //     payable: false,
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  // ];

  async function executeMintTransaction() {
    let ABI = ["function setValue(uint256 newValue)"];
    let iface = new ethers.Interface(ABI);
    // const simpleStorageInterface = new ethers.Interface(ABI);
    const calldata = iface.encodeFunctionData("setValue", [123]);
    console.log("Calldata for setValue(123):", calldata);

    // If you need to decode:
    const decoded = iface.decodeFunctionData("setValue", calldata);
    console.log("Decoded:", decoded);

    const account = await ethers.getContractFactory("ERC6551Account");
    const accountOneContract: ERC6551Account = new ethers.Contract(
      `0x3aE0Fe9Af9B86d26c21bf1A09985C878e5D27565`,
      account.interface.format(),
      owner
    ) as unknown as ERC6551Account;

    let accountMintCar = await accountOneContract.execute(
      ethers.getAddress("0xa5787607134fA965E4626896Fa51A5F7199FEfee"),
      0,
      calldata,
      0
    );
    let accountMintCarTransaction = await accountMintCar.wait();
    console.log(accountMintCarTransaction);
  }

  async function executeGetValue() {
    let testABI = await ethers.getContractFactory("SimpleStorage", owner);
    console.log(`Json format test ABI = ${testABI.interface.format()}`);
    // const ifacetest= new Interface(jsonAbi);
    // ifacetest.format(FormatTypes.minimal);

    let ABI = ["function getValue() view returns (uint256)"];
    let iface = new ethers.Interface(ABI);
    // const simpleStorageInterface = new ethers.Interface(ABI);
    const calldata = iface.encodeFunctionData("getValue", []);
    // console.log("Calldata for setValue(123):", calldata);

    // If you need to decode:
    const decoded = iface.decodeFunctionData("getValue", calldata);
    console.log("Decoded:", decoded);

    const account = await ethers.getContractFactory("ERC6551Account");
    const accountOneContract: ERC6551Account = new ethers.Contract(
      `0x3aE0Fe9Af9B86d26c21bf1A09985C878e5D27565`,
      account.interface.format(),
      owner
    ) as unknown as ERC6551Account;

    let accountMintCar = await accountOneContract.execute(
      ethers.getAddress("0xa5787607134fA965E4626896Fa51A5F7199FEfee"),
      0,
      calldata,
      0
    );

    console.log(
      `getValue transaction result = ${JSON.stringify(accountMintCar)}`
    );

    console.log(`transaction data = ${accountMintCar.data}`);

    // let demo = ethers.AbiCoder.defaultAbiCoder().encode(["uint256"], [123]);
    // // console.log(demo);
    // const decodedValuesdemo = ethers.AbiCoder.defaultAbiCoder().decode(
    //   ["uint256"],
    //   demo
    // );

    // console.log(decodedValuesdemo);

    const decodedValues = ethers.AbiCoder.defaultAbiCoder().decode(
      ["uint256"],
      accountMintCar.data
    );

    console.log(`decodedValues = ${decodedValues}`);

    // const uint256Value = decodedValues[0];

    // console.log(uint256Value.toString()); // To display the value

    let accountMintCarTransaction = await accountMintCar.wait();
    console.log(accountMintCarTransaction);
  }

  const setValue = async (value: number, storageAddress: string) => {
    let testABI = await ethers.getContractFactory("SimpleStorage", owner);
    console.log(`Json format test ABI = ${testABI.interface.format()}`);
    let jsonABI = testABI.interface.formatJson();
    let iface = new ethers.Interface(jsonABI);
    // const simpleStorageInterface = new ethers.Interface(ABI);
    const calldata = iface.encodeFunctionData("setValue", [
      ethers.getBigInt(value),
    ]);

    console.log(`call data = ${calldata}`);

    const account = await ethers.getContractFactory("ERC6551Account");
    const accountOneContract: ERC6551Account = new ethers.Contract(
      `0x3aE0Fe9Af9B86d26c21bf1A09985C878e5D27565`,
      account.interface.format(),
      owner
    ) as unknown as ERC6551Account;

    console.log(
      `account one address = ${await accountOneContract.getAddress()}`
    );

    let user = new ethers.Contract(
      "0x4453c80716300ca58c9fa10b95fac877b82890ae",
      userFactory.interface.format(),
      owner
    ) as unknown as UserAdminProfileNFT;

    const accountOwner = await accountOneContract.connect(owner).owner();
    const nftOwner = await user.ownerOf(1);

    console.log(`account owner address = ${accountOwner}`);
    console.log(`owner of token 1 address = ${nftOwner}`);

    if (accountOwner.toLowerCase() === nftOwner.toLowerCase()) {
      console.log("The ownership is consistent!");
    } else {
      console.log("Mismatch in ownership!");
    }

    let accountMintCar = await accountOneContract.execute(
      storageAddress,
      5,
      calldata,
      0,
      { gasLimit: 1000000 }
    );

    console.log(`accountMintCar = ${JSON.stringify(accountMintCar)}`);
    let accountMintCarTransaction = await accountMintCar.wait();
    console.log(accountMintCarTransaction);
    return accountMintCarTransaction;
  };

  const getValue = async () => {
    let testABI = await ethers.getContractFactory("SimpleStorage", owner);
    let humanABI = testABI.interface.formatJson();
    console.log(JSON.stringify(humanABI));
    let iface = new ethers.Interface(humanABI);
    // const simpleStorageInterface = new ethers.Interface(ABI);
    const calldata = iface.encodeFunctionData("getValue", undefined);

    const account = await ethers.getContractFactory("ERC6551Account");
    const accountOneContract: ERC6551Account = new ethers.Contract(
      `0x3aE0Fe9Af9B86d26c21bf1A09985C878e5D27565`,
      account.interface.format(),
      owner
    ) as unknown as ERC6551Account;

    let accountMintCar = await accountOneContract.execute(
      ethers.getAddress("0xa5787607134fA965E4626896Fa51A5F7199FEfee"),
      0,
      calldata,
      0
    );

    console.log(`data = ${accountMintCar.data}`);

    console.log(`accountMintCar = ${JSON.stringify(accountMintCar)}`);
    let accountMintCarTransaction = await accountMintCar.wait();
    console.log(accountMintCarTransaction);
  };

  // let result = await setValue();
  // let result = await getValue();

  // let userFactory = await ethers.getContractFactory(
  //   "UserAdminProfileNFT",
  //   owner
  // );

  // let user = new ethers.Contract(
  //   "0x4453c80716300ca58c9fa10b95fac877b82890ae",
  //   userFactory.interface.format(),
  //   owner
  // ) as unknown as UserAdminProfileNFT;

  // console.log(await user.ownerOf(1));

  // await setValue(200);

  let testABI = await ethers.getContractFactory("SimpleStorage", owner);
  let humanABI = testABI.interface.formatJson();
  const simpleStorage = new ethers.Contract(
    "0x294fd61e997f75c2e62c21a21a46387f9534fbcf",
    humanABI,
    owner
  );

  let ssaddress = await simpleStorage.getAddress();
  console.log(ssaddress);

  let proxySetTransaction = await setValue(200, ssaddress);
  console.log(proxySetTransaction);

  // const setthevalue = await simpleStorage.setValue(10);
  // console.log(setthevalue);

  // // Wait for the transaction to be mined
  // const receipt = await setthevalue.wait();
  // console.log(receipt); // This will print the transaction receipt, including logs.

  // const value = await simpleStorage.getValue();
  // console.log(value.toString());
  // console.log(`VALUE = ${value.toString()}`);

  // let acc = await getTBAAddressForTokenID(1);
  // console.log(`acc = ${acc}`); // 0x3aE0Fe9Af9B86d26c21bf1A09985C878e5D27565

  // console.log(`result = ${JSON.stringify(result)}`);

  // let setValue =

  // await executeMintTransaction();
  //let value = await executeGetValue();
  //console.log(`value = ${value}`);
}

main()
  .then()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
