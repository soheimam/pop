import { ethers } from "hardhat";
import { PopCar } from "../typechain-types";

require("dotenv").config();
const privateKey = process.env.PRIVATE_KEY;
const provider = new ethers.JsonRpcProvider(
  "https://polygon-mumbai.infura.io/v3/0cc2884f03d545ada8f5d794b5fa9bd2"
);
const owner = new ethers.Wallet(privateKey!, provider);
// export const POP_CAR_ADDRESS = `0x5eEB59224A2B33E307803634256aa90002d0a30c`;
const service_address = `0xa70327625a17CaeB2835F00215Aa579566d38987`;
const tba_address = `0x02101dfb77fde026414827fdc604ddaf224f0921`;

const main = async () => {
  const SOHEY_ADDRESS = `0x773660A24E683AA999bAe850ddF1B13B2b233135`;
  const DAN_ADDRESS = `0x7516e89D7111fEfaa312b58A06130F5B5DcDd01D`;
  const carFactory = await ethers.getContractFactory("ServiceRecord");
  let instance = new ethers.Contract(
    service_address,
    carFactory.interface.format(),
    owner
  ) as any;
  let transaction = await instance.mintServiceRecord(DAN_ADDRESS, tba_address);
  console.log(`transaction = ${transaction.hash}`);
  let transactionReceipt = await transaction.wait();
  console.log(JSON.stringify(transactionReceipt));
};

main()
  .then()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
