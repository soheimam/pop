"use client";

import React from "react";
import Image from "next/image";
import NextLink from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function Header() {
  return (
    <header className="flex-col justify-center">
      <div className=" p-6 bg-blue-500 w-full rounded-bl-md rounded-br-md mb-10">
        <NextLink href="/" className="w-full flex-col justify-center">
          <div className="w-full flex justify-center p-3 mb-2">
            <Image src="/pop_logo.svg" alt="pop logo" width={100} height={50} />
          </div>

          <div className="flex justify-center w-full">
            <ConnectButton />
          </div>
        </NextLink>
      </div>
    </header>
  );
}

export default Header;
