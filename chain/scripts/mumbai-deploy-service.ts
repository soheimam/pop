import { ethers } from "hardhat";
import { ServiceRecord } from "../typechain-types";

const main = async () => {
  let ServiceRecord: ServiceRecord;
  const serviceFactory = await ethers.getContractFactory("ServiceRecord");
  ServiceRecord = (await serviceFactory.deploy()) as ServiceRecord;
  const serviceDeployment = await ServiceRecord.waitForDeployment();
  console.log(`Car service address = ${await serviceDeployment.getAddress()}`);
};

main()
  .then()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
