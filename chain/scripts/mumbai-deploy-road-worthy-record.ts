import { ethers } from "hardhat";
import { RoadWorthyRecord } from "../typechain-types";

const main = async () => {
  let RoadWorthyRecord: RoadWorthyRecord;
  const serviceFactory = await ethers.getContractFactory("RoadWorthyRecord");
  RoadWorthyRecord = (await serviceFactory.deploy()) as RoadWorthyRecord;
  const serviceDeployment = await RoadWorthyRecord.waitForDeployment();
  console.log(`Road worthy address = ${await serviceDeployment.getAddress()}`);
};

main()
  .then()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
