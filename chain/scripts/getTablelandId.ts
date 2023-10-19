import { ethers } from "hardhat";
import { PopTablelandUser } from "../typechain-types";
require("dotenv").config();

const main = async () => {
  const privateKey = process.env.PRIVATE_KEY;
  const provider = new ethers.JsonRpcProvider(
    "https://polygon-mumbai.infura.io/v3/0cc2884f03d545ada8f5d794b5fa9bd2"
  );
  const owner = new ethers.Wallet(privateKey!, provider);
  let tablelandUser: PopTablelandUser;
  const userFactory = await ethers.getContractFactory("PopTablelandUser");
  let instance = new ethers.Contract(
    "0xbB5c5293B3c23f915d446F80B791B1Be80a3357D",
    userFactory.interface.format(),
    owner
  ) as any;
  let transaction = await instance.tableId();

  console.log(transaction);
};

main()
  .then()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
