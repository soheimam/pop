// import { ethers } from "hardhat";
// import { PopCar } from "../typechain-types";

// require("dotenv").config();
// const privateKey = process.env.PRIVATE_KEY;
// const provider = new ethers.JsonRpcProvider(
//   "https://polygon-mumbai.infura.io/v3/0cc2884f03d545ada8f5d794b5fa9bd2"
// );
// const owner = new ethers.Wallet(privateKey!, provider);
// export const POP_CAR_ADDRESS = `0x0f6E8b805341d1d6E9cCe8b3f0d167d6c20f7FEF`;
// const main = async () => {
//   const SOHEY_ADDRESS = `0x773660A24E683AA999bAe850ddF1B13B2b233135`;
//   const DAN_ADDRESS = `0x7516e89D7111fEfaa312b58A06130F5B5DcDd01D`;
//   const carFactory = await ethers.getContractFactory("PopCar");
//   let instance = new ethers.Contract(
//     POP_CAR_ADDRESS,
//     carFactory.interface.format(),
//     owner
//   ) as unknown as PopCar;
//   let transaction = await instance.mintCar(DAN_ADDRESS, 2);
//   console.log(`transaction = ${transaction.hash}`);
//   let transactionReceipt = await transaction.wait();
//   console.log(JSON.stringify(transactionReceipt));
// };

// main()
//   .then()
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
