"use client";

import { Database } from "@tableland/sdk";

const userTableName = "cli_pop_table_80001_7957";
const carTableName = "cli_popcar_table_80001_7956";
const favTableName = "cli_popfav_table_80001_7948";
const bidTableName = "cli_popbid_table_80001_7949";

export interface CarRow {
  make: string;
  model: string;
  transmissionType: string;
  tokenId: number;
  price: number;
  rating: string;
  year: number;
}

export interface UserRow {
  userAddress: string;
  userTba: string;
  tokenId: number;
}

export interface FavRow {
  userAddress: string;
  tokenId: number;
}

export const insertUserRow = async (userRow: UserRow, db: Database) => {
  if (db == null) {
    console.error("No db connection trying to insert user row");
    return;
  }
  console.log(`trying to insert user row `);
  let insert = await db
    .prepare(
      `INSERT INTO ${userTableName} (userAddress, userTba, tokenId) VALUES (?1, ?2, ?3);`
    )
    .bind(userRow.userAddress, userRow.userTba, userRow.tokenId)
    .run();

  console.log(`here is the insert ...`);
  // console.log(test);

  try {
    //@ts-ignore
    await insert.txn?.wait();
    const { results } = await db
      .prepare(`SELECT ROWID FROM ${userTableName};`)
      .all();
    console.log(`all the user table rows...`);
    console.log(results);
  } catch (error) {
    console.log(error);
  }
};

export const insertCarRow = async (carRow: CarRow, dbClient: Database) => {
  if (dbClient == null) {
    console.error("No db connection trying to insert car row");
    return;
  }
  // "carName text, tansmissionType text, tokenId int, year int, price int, rating text"
  const { meta: insert } = await dbClient
    .prepare(
      `INSERT INTO ${carTableName} (make, model, tansmissionType, tokenId, year, price, rating) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7);`
    )
    .bind(
      carRow.make,
      carRow.model,
      carRow.transmissionType,
      carRow.tokenId,
      carRow.year,
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
  if (dbClient == null) {
    console.error("No db connection trying to findCarsForHome");
    return;
  }
  const transaction = await dbClient
    .prepare(`SELECT * FROM ${carTableName} LIMIT 10;`)
    .run();
  let result = await transaction.results;
  return result as CarRow[];
};

export const findCarTokenIdsForUser = async (
  userAddress: string,
  dbClient: Database
) => {
  if (dbClient == null) {
    console.error("No db connection trying to findCarsForUser");
    return;
  }

  const transaction = await dbClient
    .prepare(
      `SELECT * FROM ${userTableName} where userAddress = "${userAddress}";`
    )
    .run();

  return transaction.results.map((row: UserRow) => row.tokenId);
};

export const findCarsForUser = async (
  tokenIds: number[],
  dbClient: Database
) => {
  if (dbClient == null) {
    console.error("No db connection trying to findCarsForUser");
    return;
  }
  let queryString = "";
  for (let i = 0; i < tokenIds.length; i++) {
    if (i != tokenIds.length - 1) {
      queryString += `tokenId = '${tokenIds[i]}' OR `;
    } else {
      queryString += `tokenId = '${tokenIds[i]}'`;
    }
  }
  const transaction = await dbClient
    .prepare(`SELECT * FROM ${carTableName} WHERE ${queryString};`)
    .run();
  let result = await transaction.results;
  return result as CarRow[]; // array, but will only be limit 1
};

export const findCarForUser = async (tokenId: number, dbClient: Database) => {
  if (dbClient == null) {
    console.error("No db connection trying to findCarForUser");
    return;
  }

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
  if (dbClient == null) {
    console.error("No db connection trying to findUserOfTokenId");
    return;
  }

  const transaction = await dbClient
    .prepare(`SELECT * FROM ${userTableName} where tokenId = ${tokenId};`)
    .run();
  let result = await transaction.results;
  console.log(result);
  return result as UserRow[];
};

export const findFavoritesForUser = async (
  userAddress: string,
  dbClient: Database
) => {
  if (dbClient == null) {
    console.error("No db connection trying to findFavoritesForUser");
    return;
  }

  const transaction = await dbClient
    .prepare(
      `SELECT * FROM ${favTableName} where userAddress = "${userAddress}";`
    )
    .run();
  let result = await transaction.results;
  console.log(result);
  return result as FavRow[];
};

export const findBidsForCar = async (tokenId: number, dbClient: Database) => {
  if (dbClient == null) {
    console.error("No db connection trying to findBidsForCar");
    return;
  }

  const transaction = await dbClient
    .prepare(`SELECT * FROM ${bidTableName} where tokenId = ${tokenId};`)
    .run();
  let result = await transaction.results;
  console.log(result);
  return result as UserRow[];
};
