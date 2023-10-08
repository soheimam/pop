import fs from "fs-extra";
import path from "path";

const filePath = "./deployment/logs/node_output.txt";
const deploymentPath = "./scripts/accountData.ts";

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function checkHardhatNode() {
  try {
    const { stdout } = await execAsync("lsof -i :8545");

    if (stdout.includes("LISTEN")) {
      const details = stdout.split("\n")[1].split(/\s+/);
      const ipAndPort = details[8].split(":");
      const ipAddress = ipAndPort[0];
      const port = ipAndPort[1];

      await parseFile().catch((error) => {
        console.error("Error:", error);
      });

      console.log("Hardhat node is running.");
      console.log(`IP Address: ${ipAddress}`);
      console.log(`Port: ${port}`);

      // Run the deployment script
      console.log("Running deployment script...");
      const { stderr: deployError } = await execAsync(
        "npx hardhat run ./scripts/deploy.ts"
      );
      if (deployError) {
        console.error("Error running deployment script:", deployError);
      } else {
        console.log("Deployment script completed successfully.");
      }
    } else {
      console.log("Hardhat node is not running.");
    }
  } catch (error: any) {
    if (error.code === 1) {
      console.log("Hardhat node is not running.");
    } else {
      console.error("Error checking Hardhat node:", error.message);
    }
  }
}

async function parseFile() {
  // Ensure the logs directory exists
  const dirPath = path.dirname(filePath);
  const content = await fs.readFile(filePath, "utf8");
  console.log(`Read ${filePath}`);
  console.log("Parsing data...");
  console.log(content);

  // Matches each account and private key pair
  const matches = [
    ...content.matchAll(
      /Account #\d+: ([^\s]+) \(.*\)\nPrivate Key: ([^\s]+)/g
    ),
  ];

  let output = "";

  matches.forEach((match, index) => {
    const publicKey = match[1];
    const privateKey = match[2];

    output += `export const account${index}publicKey = "${publicKey}";\n`;
    output += `export const account${index}privateKey = "${privateKey}";\n\n`;
  });

  await fs.outputFile(deploymentPath, output);
  console.log(`Data saved to ${deploymentPath}`);
}

setTimeout(checkHardhatNode, 20000);
