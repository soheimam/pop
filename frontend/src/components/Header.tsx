"use client";

import React from "react";
import Image from "next/image";
import NextLink from "next/link";
// import { useWalletAuth } from "@/app/(hooks)/useWalletAuth";

function Header() {
  // const { wallet } = useWalletAuth();
  return (
    <header className="p-6 bg-blue-500 w-full flex justify-between rounded-bl-md rounded-br-md mb-10">
      <NextLink href="/">
        <Image src="/pop_logo.svg" alt="pop logo" width={100} height={50} />
      </NextLink>
      <div className="flex items-center border-white border text-ellipsis overflow-hidden ... bg-white/20 text-blue-900 rounded-full p-2 text-bold max-w-xs text-left">
        {/* {wallet?.getAddress()} */}
      </div>
    </header>
  );
}

export default Header;
