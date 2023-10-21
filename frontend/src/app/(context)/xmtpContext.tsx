"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@xmtp/xmtp-js";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

const AppContext = createContext({} as IXMTPProvider);

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface IXMTPProvider {
  xmtpClient: any;
  makeClient: () => any;
}

export function XmtpProvider({ children }: any) {
  const [xmtpClient, setXmtpClient] = useState<any>(null);
  const { connector: activeConnector, isConnected } = useAccount();

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const runner = async () => {
    await delay(1000);
    // Your code to run after the 2-second delay goes here
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const xmtp = await Client.create(signer, {
      env: "dev",
    });
    console.log(`setting xmtp client...`);
    await setXmtpClient(xmtp);
    return xmtp;
  };

  const makeClient = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const xmtp = await Client.create(signer, {
      env: "dev",
    });
    console.log(`setting xmtp client...`);
    await setXmtpClient(xmtp);
  };

  /*
    just setup the client for use in other components
  */
  useEffect(() => {
    if (!xmtpClient && isConnected && activeConnector) {
      runner();
    }
  }, [xmtpClient, isConnected]);

  return (
    <AppContext.Provider
      value={{
        xmtpClient,
        makeClient,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useXmtpProvider() {
  return useContext(AppContext);
}
