import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;

if (!privateKey || !privateKey.startsWith("0x") || privateKey.length !== 66) {
  throw new Error("Invalid or missing PRIVATE_KEY environment variable");
}

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  networks: {
    hardhat: {
      accounts: [
        {
          privateKey: privateKey,
          balance: `2000000000000000000000`,
        },
      ],
    },
    localhost: {
      url: "http://127.0.0.1:8545", // Default for both Hardhat's node and Ganache
      accounts: [privateKey],
    },
  },
};

export default config;
