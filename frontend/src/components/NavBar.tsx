"use client";
import React, { useState } from "react";
// import { useWalletAuth } from "../app/(hooks)/useWalletAuth";
// import ConnectWallet from "./ConnectWallet";
import Link from "next/link";
import {
  HomeIcon,
  PersonIcon,
  ChatBubbleIcon,
  BellIcon,
  ExitIcon,
} from "@radix-ui/react-icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function NavBar() {
  // const { isConnecting, isConnected, connect, connectionError, wallet } =
  //   useWalletAuth();
  return (
    <footer className=" fixed bottom-0 max-w-2/3   bg-blue-500 rounded-md transform -translate-x-1/2 left-1/2">
      <div className="flex justify-between max-w-screen-md mx-auto">
        <Link href="/" passHref legacyBehavior>
          <a
            className="text-white text-xs bg-blue-500 hover:bg-blue-600 transition ease-in-out p-4 rounded-tr-md rounded-br-md flex flex-col items-center justify-center rounded-bl-md rounded-tl-md"
            aria-label="Home"
          >
            <HomeIcon width="24" height="24" />
            Home
          </a>
        </Link>
        <Link href="/createListing" passHref legacyBehavior>
          <a
            className="text-white text-xs bg-blue-500 hover:bg-blue-600 transition ease-in-out p-4 rounded-tr-md rounded-br-md flex flex-col items-center justify-center"
            aria-label="Profile"
          >
            <PersonIcon width="24" height="24" />
            Dashboard
          </a>
        </Link>
        <Link href="/inbox" passHref legacyBehavior>
          <a
            className="text-white text-xs bg-blue-500 hover:bg-blue-600 transition ease-in-out p-4 rounded-tr-md rounded-br-md flex flex-col items-center justify-center"
            aria-label="Inbox"
          >
            <ChatBubbleIcon width="24" height="24" />
            Inbox
          </a>
        </Link>
        <Link href="/notifications" passHref legacyBehavior>
          <a
            className="text-white text-xs bg-blue-500 hover:bg-blue-600 transition ease-in-out p-4 rounded-tr-md rounded-br-md flex flex-col items-center justify-center"
            aria-label="Notifications"
          >
            <BellIcon width="24" height="24" />
            Notifications
          </a>
        </Link>
        {/* <Link href="/wallet" passHref legacyBehavior>
          <a
            className="text-white bg-blue-500 hover:bg-blue-600 transition ease-in-out p-4 rounded-tr-md rounded-br-md"
            aria-label="Wallet"
          >
            <ExitIcon width="24" height="24" />
          </a>
        </Link> */}
        <ConnectButton />
        {/* <div className="flex items-center opacity-100">
  
        </div> */}

        {/* <ConnectWallet
          isConnected={isConnected}
          isConnecting={isConnecting}
          connect={connect}
          connectionError={connectionError}
          wallet={wallet!}
        /> */}
      </div>
    </footer>
  );
}

export default NavBar;
