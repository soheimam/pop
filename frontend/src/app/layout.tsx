"use client";

import "@rainbow-me/rainbowkit/styles.css";

import NavBar from "@/components/NavBar";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
// import {
//   ComethWallet,
//   ConnectAdaptor,
//   SupportedNetworks,
// } from "@cometh/connect-sdk";
// import { WalletProvider } from "./(context)/cometh-context";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// import { WalletProvider } from "./(context)/privy-context";
import React from "react";
import Header from "@/components/Header";
import WagmiProvider from "./(providers)/wagmi";
import { XmtpProvider } from "./(context)/xmtpContext";

// import { TablelandProvider } from "./(context)/tableland-context";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   manifest: "/manifest.json",
//   themeColor: "#ffffff",
// };

export default function RootLayout({ children }: any) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-blue-50 mx-10  lg:mx-24 pb-40`}>
        <WagmiProvider>
          <Header />

          <XmtpProvider>
            {/* <TablelandProvider> */}
            {children}
          </XmtpProvider>
          {/* </TablelandProvider> */}
          <NavBar />
        </WagmiProvider>
      </body>
    </html>
  );
}
