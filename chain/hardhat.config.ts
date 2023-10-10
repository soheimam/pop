import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
// require("dotenv").config();

// const privateKey = process.env.PRIVATE_KEY;

// if (!privateKey || !privateKey.startsWith("0x") || privateKey.length !== 66) {
//   throw new Error("Invalid or missing PRIVATE_KEY environment variable");
// }

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
          privateKey: `0x052dd1e481a2790416040640f2e8cebb8a8a69a68365a851c2ec403a7cfc6294`,
          balance: `2000000000000000000000`,
        },
      ],
    },
    localhost: {
      url: "http://127.0.0.1:8545", // Default for both Hardhat's node and Ganache
      accounts: [
        `0x052dd1e481a2790416040640f2e8cebb8a8a69a68365a851c2ec403a7cfc6294`,
      ],
    },
  },
};

export default config;
