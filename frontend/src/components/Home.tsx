"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home({}) {
  return (
    <main className="absolute top-0 left-0 bg-[url('/home_b.jpg')] bg-cover bg-center h-screen w-screen flex flex-col justify-center items-center ">
      <div className="z-20 text-left  mx-10 mb-24 space-y-4 h-[90%]">
        <Image
          src="/pop_logo.svg"
          height={100}
          width={100}
          alt="logo"
          className="my-10"
        />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent  bg-gradient-to-r from-white to-blue-200">
            Snap, Validate & Sell
          </h1>
          <p className="max-w-[600px] text-sky-200 md:text-xl dark:text-sky-100 mx-auto">
            Enhance buyer confidence in your vehicle. Each additional
            maintenance document increases your car's trust score in the
            listing!
          </p>
        </div>

        {/* Start Now Button */}
        <Button>Start Now</Button>
      </div>
    </main>
  );
}
