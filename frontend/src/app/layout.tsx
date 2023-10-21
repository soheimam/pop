"use client";

import "@rainbow-me/rainbowkit/styles.css";
import NavBar from "@/components/NavBar";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import React from "react";
import Header from "@/components/Header";
import WagmiProvider from "./(providers)/wagmi";
import { XmtpProvider } from "./(context)/xmtpContext";
import { TablelandProvider } from "./(context)/tablelandContext";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   manifest: "/manifest.json",
//   themeColor: "#ffffff",
// };

export default function RootLayout({ children }: any) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-sky-50 mx-10   md:mx-auto pb-40 max-w-xl`}
      >
        <WagmiProvider>
          <XmtpProvider>
            <TablelandProvider>
              <Header />
              {children}
              <NavBar />
            </TablelandProvider>
          </XmtpProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
