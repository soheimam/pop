import { ethers } from "hardhat";
import { PopCar } from "../typechain-types";

const main = async () => {
  let popCar: PopCar;
  const carFactory = await ethers.getContractFactory("PopCar");
  popCar = (await carFactory.deploy({ gasLimit: "21000000" })) as PopCar;
  const carDeployment = await popCar.waitForDeployment();
  console.log(`Car record address = ${await carDeployment.getAddress()}`);
};

main()
  .then()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
