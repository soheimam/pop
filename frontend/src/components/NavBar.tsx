"use client";
import React, { useState } from "react";
// import { useWalletAuth } from "../app/(hooks)/useWalletAuth";
// import ConnectWallet from "./ConnectWallet";
import Link from "next/link";
import {
  HomeIcon,
  PersonIcon,
  ChatBubbleIcon,
  BookmarkIcon,
  MixIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";

function NavBar() {
  // const { isConnecting, isConnected, connect, connectionError, wallet } =
  //   useWalletAuth();
  return (
    <footer className=" z-30 fixed bottom-0 bg-blue-500 rounded-md transform -translate-x-1/2 left-1/2 shadow-md w-full">
      <div className="flex justify-between mx-auto items-center">
        <Link href="/marketplace" passHref legacyBehavior>
          <a
            className="text-white  text-xs bg-blue-500 hover:bg-blue-600 transition ease-in-out p-4  flex flex-col items-center justify-center rounded-bl-md rounded-tl-md"
            aria-label="Home"
          >
            <MixIcon width="24" height="24" />
            Cars
          </a>
        </Link>
        <Link href="/Dashboard" passHref legacyBehavior>
          <a
            className="text-white  text-xs bg-blue-500 hover:bg-blue-600 transition ease-in-out p-4  flex flex-col items-center justify-center"
            aria-label="dashboard"
          >
            <PersonIcon width="24" height="24" />
            Dashboard
          </a>
        </Link>

        <Link href="/createListing" passHref legacyBehavior>
          <a
            className="text-white  text-xs bg-blue-500 hover:bg-blue-600 transition ease-in-out p-4   flex flex-col items-center justify-center"
            aria-label="Inbox"
          >
            <Image src="/car_icon.svg" width="28" height="28" />
            Sell
          </a>
        </Link>
        <Link href="/notifications" passHref legacyBehavior>
          <a
            className="text-white w-[90px] text-xs bg-blue-500 hover:bg-blue-600 transition ease-in-out p-4  flex flex-col items-center justify-center"
            aria-label="Notifications"
          >
            <BookmarkIcon width="24" height="24" />
            Saved
          </a>
        </Link>
        <Link href="/inbox" passHref legacyBehavior>
          <a
            className="text-white  text-xs bg-blue-500 hover:bg-blue-600 transition ease-in-out p-4 rounded-tr-md rounded-br-md flex flex-col items-center justify-center"
            aria-label="Inbox"
          >
            <ChatBubbleIcon width="24" height="24" />
            Inbox
          </a>
        </Link>
      </div>
    </footer>
  );
}

export default NavBar;
