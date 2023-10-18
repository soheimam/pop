import { ethers } from "hardhat";
import { ServiceRecord } from "../typechain-types";

const main = async () => {
  let ServiceRecord: ServiceRecord;
  const carFactory = await ethers.getContractFactory("ServiceRecord");
  ServiceRecord = (await carFactory.deploy()) as ServiceRecord;
  const carDeployment = await ServiceRecord.waitForDeployment();
  console.log(`Car service address = ${await carDeployment.getAddress()}`);
};

main()
  .then()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
