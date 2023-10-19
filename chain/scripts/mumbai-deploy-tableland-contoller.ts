import { ethers } from "hardhat";

const main = async () => {
  let controller: any;
  const controllerFactory = await ethers.getContractFactory(
    "AllowAllController"
  );
  controller = (await controllerFactory.deploy()) as any;
  const controllerDeployment = await controller.waitForDeployment();
  console.log(
    `controllerDeployment address = ${await controllerDeployment.getAddress()}`
  );
};

main()
  .then()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
