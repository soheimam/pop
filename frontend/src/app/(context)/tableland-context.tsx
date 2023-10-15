// "use client"; // This is a client component 👈🏽
// import { Database } from "@tableland/sdk";
// import {
//   createContext,
//   Dispatch,
//   SetStateAction,
//   useContext,
//   useEffect,
//   useState,
// } from "react";
// import { ethers } from "ethers";
// require("dotenv").config();

// const AppContext = createContext({} as ITablelandProvider);

// interface ITablelandProvider {
//   insertRow: () => void;
// }

// export function TablelandProvider({ children }: any) {
//   const tableName = "cli_pop_table_80001_7745";
//   // console.log(ethers.utils.getAddress(privateKey));

//   // To avoid connecting to the browser wallet (locally, port 8545).
//   // For example: "https://polygon-mumbai.g.alchemy.com/v2/YOUR_ALCHEMY_KEY"

//   const [db, setDb] = useState<Database<any> | null>(null);
//   useEffect(() => {
//     const privateKey = process.env.WALLET_PRIVATE_KEY!;
//     const provider = ethers.getDefaultProvider(
//       "https://polygon-mumbai.infura.io/v3/9c17b4ee03bf4c75829e260cbea6a92a"
//     );

//     // console.log(`private key  = ${privateKey}`);
//     const wallet = new ethers.Wallet(privateKey);

//     const signer = wallet.connect(provider!);
//     const tableName = "cli_pop_table_80001_7745";
//     // Connect to the database
//     const db = new Database({ signer });
//     // Initialize your TableLand Database instance and set it to state
//     const myDb = new Database<any>(); // Replace 'any' with your schema type if needed and pass the appropriate options
//     setDb(myDb);
//     console.log("private key is: " + process.env.WALLET_PRIVATE_KEY!);
//     console.log(process.env.WALLET_PRIVATE_KEY);
//   }, []);

//   const insertRow = async () => {
//     // Insert a row into the table
//     const { meta: insert } = await db!
//       .prepare(
//         `INSERT INTO ${tableName} (id, userAddress, userTba, bid, bidderAddress) VALUES (?1, ?2, ?3, ?4, ?5);`
//       )
//       .bind(
//         0,
//         "0xb6D9f614907368499bAF7b288b54B839fC891660",
//         "0xb6D9f614907368499bAF7b288b54B839fC891660",
//         100,
//         "0xb6D9f614907368499bAF7b288b54B839fC891660"
//       )
//       .run();

//     await insert.txn?.wait();

//     const { results } = await db!.prepare(`SELECT * FROM ${tableName};`).all();

//     console.log(results);
//   };

//   return (
//     <AppContext.Provider
//       value={{
//         insertRow,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// }

// export function useTablelandContext() {
//   return useContext(AppContext);
// }
