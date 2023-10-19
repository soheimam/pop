"use client";

import { Database } from "@tableland/sdk";

require("dotenv").config();

const privateKey = process.env.WALLET_PRIVATE_KEY!;

if (!privateKey) {
  console.error("Private key is undefined!");
}

const userTableName = "cli_pop_table_80001_7907";
const carTableName = "cli_popcar_table_80001_7882";

export interface CarRow {
  carName: string;
  tansmissionType: string;
  tokenId: number;
  price: number;
  rating: string;
}

export interface UserRow {
  userAddress: string;
  userTba: string;
  tokenId: number;
}

export const insertUserRow = async (userRow: UserRow, db: Database) => {
  console.log(`trying to insert user row `);
  // const { results } = await db.prepare(`SELECT * FROM ${userTableName};`).all();
  // console.log(results);
  let insert = await db
    .prepare(
      `INSERT INTO ${userTableName} (userAddress, userTba, tokenId) VALUES (?1, ?2, ?3);`
    )
    .bind(
      "0xa70327625a17CaeB2835F00215Aa579566d38987",
      "0xa70327625a17CaeB2835F00215Aa579566d38987",
      1
    )
    .run();

  console.log(`here is the insert ...`);
  // console.log(test);

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

export const insertCarRow = async (carRow: CarRow, dbClient: Database) => {
  // "carName text, tansmissionType text, tokenId int, year int, price int, rating text"
  const { meta: insert } = await dbClient
    .prepare(
      `INSERT INTO ${carTableName} (carName, tansmissionType, tokenId, price, rating) VALUES (?1, ?2, ?3, ?4, ?5);`
    )
    .bind(
      carRow.carName,
      carRow.tansmissionType,
      carRow.tokenId,
      carRow.price,
      carRow.rating
    )
    .run();

  try {
    await insert.txn?.wait();
    const { results } = await dbClient
      .prepare(`SELECT ROWID FROM ${userTableName};`)
      .all();

    console.log(results);
  } catch (error) {
    console.log(error);
  }
};

export const findCarsForHome = async (dbClient: Database) => {
  const transaction = await dbClient
    .prepare(`SELECT * FROM ${carTableName} LIMIT 10;`)
    .run();
  let result = await transaction.results;
  return result as CarRow[];
};

export const findCarForUser = async (tokenId: number, dbClient: Database) => {
  const transaction = await dbClient
    .prepare(
      `SELECT * FROM ${carTableName} WHERE tokenId = '${tokenId}' LIMIT 1;`
    )
    .run();
  let result = await transaction.results;
  return result as CarRow[]; // array, but will only be limit 1
};

export const findUserOfTokenId = async (
  tokenId: number,
  dbClient: Database
) => {
  const transaction = await dbClient
    .prepare(
      `SELECT * FROM ${userTableName} WHERE tokenId = '${tokenId}' LIMIT 1;`
    )
    .run();
  let result = await transaction.results;
  return result as UserRow[];
};
