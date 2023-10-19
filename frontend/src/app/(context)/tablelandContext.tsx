"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@xmtp/xmtp-js";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { Database } from "@tableland/sdk";

const AppContext = createContext({} as ITablelandProvider);

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface ITablelandProvider {
  dbClient: Database;
}

export function TablelandProvider({ children }: any) {
  const [dbClient, setDbClient] = useState<any>(null);
  const { connector: activeConnector, isConnected } = useAccount();

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const runner = async () => {
    await delay(2000);
    // Your code to run after the 2-second delay goes here
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const db = new Database({ signer });
    console.log(`setting tableland db client...`);
    console.log(db);
    await setDbClient(db);
  };

  /*
    just setup the client for use in other components
  */
  useEffect(() => {
    if (!dbClient && isConnected) {
      runner();
    }
  }, [dbClient, isConnected]);

  return (
    <AppContext.Provider
      value={{
        dbClient,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useTablelandProvider() {
  return useContext(AppContext);
}
