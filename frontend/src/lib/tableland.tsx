"use server";

import { Database } from "@tableland/sdk";
import { ethers } from "ethers";

require("dotenv").config();

const privateKey = process.env.WALLET_PRIVATE_KEY!;

if (!privateKey) {
  console.error("Private key is undefined!");
}

const wallet = new ethers.Wallet(privateKey);
const provider = ethers.getDefaultProvider(
  "https://polygon-mumbai.infura.io/v3/9c17b4ee03bf4c75829e260cbea6a92a"
);
const signer = wallet.connect(provider);
const userTableName = "cli_pop_table_80001_7884";
const carTableName = "cli_popcar_table_80001_7882";
// Connect to the database
const db = new Database({ signer });

export interface CarRow {
  carName: string;
  tansmissionType: string;
  tokenId: number;
  bid: number;
  price: number;
  rating: string;
}

export interface UserRow {
  userAddress: string;
  userTba: string;
  tokenId: number;
}

export const insertCarRow = async (carRow: CarRow) => {
  // "carName text, tansmissionType text, tokenId int, year int, price int, rating text"
  const { meta: insert } = await db
    .prepare(
      `INSERT INTO ${carTableName} (carName, tansmissionType, tokenId, bid, price, rating) VALUES (?1, ?2, ?3, ?4, ?5, ?6);`
    )
    .bind(
      carRow.carName,
      carRow.tansmissionType,
      carRow.tokenId,
      carRow.bid,
      carRow.price,
      carRow.rating
    )
    .run();

  try {
    await insert.txn?.wait();
    const { results } = await db
      .prepare(`SELECT ROWID FROM ${userTableName};`)
      .all();

    console.log(results);
  } catch (error) {
    console.log(error);
  }
};

export const insertUserRow = async (userRow: UserRow) => {
  const { meta: insert } = await db
    .prepare(
      `INSERT INTO ${userTableName} (userAddress, userTba, tokenId) VALUES (?1, ?2, ?3);`
    )
    .bind(userRow.userAddress, userRow.userTba, userRow.tokenId)
    .run();

  try {
    await insert.txn?.wait();
    const { results } = await db
      .prepare(`SELECT ROWID FROM ${userTableName};`)
      .all();

    console.log(results);
  } catch (error) {
    console.log(error);
  }
};

export const findCarsForHome = async () => {
  const transaction = await db
    .prepare(`SELECT * FROM ${carTableName} LIMIT 10;`)
    .run();
  let result = await transaction.results;
  return result as CarRow[];
};

export const findCarForUser = async (tokenId: number) => {
  const transaction = await db
    .prepare(
      `SELECT * FROM ${carTableName} WHERE tokenId = '${tokenId}' LIMIT 1;`
    )
    .run();
  let result = await transaction.results;
  return result as CarRow[]; // array, but will only be limit 1
};

export const findUserOfTokenId = async (tokenId: number) => {
  const transaction = await db
    .prepare(
      `SELECT * FROM ${userTableName} WHERE tokenId = '${tokenId}' LIMIT 1;`
    )
    .run();
  let result = await transaction.results;
  return result as UserRow[];
};
