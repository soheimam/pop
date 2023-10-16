"use server";

import { Database } from "@tableland/sdk";
import { ethers } from "ethers";

require("dotenv").config();

const privateKey = process.env.WALLET_PRIVATE_KEY!;

if (!privateKey) {
  console.error("Private key is undefined!");
}

//TODO: This private key won't work no matter what unless hard coded

const wallet = new ethers.Wallet(privateKey);
// To avoid connecting to the browser wallet (locally, port 8545).
// For example: "https://polygon-mumbai.g.alchemy.com/v2/YOUR_ALCHEMY_KEY"
const provider = ethers.getDefaultProvider(
  "https://polygon-mumbai.infura.io/v3/9c17b4ee03bf4c75829e260cbea6a92a"
);
const signer = wallet.connect(provider);
const tableName = "cli_pop_table_80001_7766";
// Connect to the database
const db = new Database({ signer });

export const insertRow = async () => {
  //   // Insert a row into the table
  const { meta: insert } = await db
    .prepare(
      `INSERT INTO ${tableName} (userAddress, userTba, tokenId, bid, bidderAddress) VALUES (?1, ?2, ?3, ?4, ?5);`
    )
    .bind(
      "0xb6D9f614907368499bAF7b288b54B839fC891660",
      "0xb6D9f614907368499bAF7b288b54B839fC891660",
      1,
      100,
      "0xb6D9f614907368499bAF7b288b54B839fC891660"
    )
    .run();

  try {
    await insert.txn?.wait();
    const { results } = await db
      .prepare(`SELECT ROWID FROM ${tableName};`)
      .all();

    console.log(results);
  } catch (error) {
    console.log(error);
  }
};

export const findUserOfTokenId = async (tokenId: number) => {
  const transaction = await db
    .prepare(`SELECT * FROM ${tableName} WHERE tokenId = '${tokenId}' LIMIT 1;`)
    .run();
  let result = await transaction.results;
  return result;
};
