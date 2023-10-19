"use client";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import Camera from "@/components/Camera";
// import { WalletContext } from "@/app/(context)/context";
import { Button } from "@/components/ui/button";
import MintButton from "@/components/MintButton";
import CarSpecs from "@/components/CarSpecs";

import { useWaitForTransaction, useContractWrite, useAccount } from "wagmi";

import {
  CAR_ABI,
  MUMBAI_CAR_CONTRACT_ADDRESS,
  MUMBAI_SERVICE_CONTRACT_ADDRESS,
  SERVICE_RECORD_ABI,
  MUMBAI_ROAD_WORTHY_CONTRACT_ADDRESS,
  ROAD_WORTHY_RECORD_ABI,
} from "@/lib/chainUtils";
import { toast } from "@/components/ui/use-toast";
import { useCreateTBA } from "../(hooks)/useCreateTBA";
import SubNFTUpload from "@/components/SubNFTUpload";
import Stepper from "@/components/stepper";
import { CarRow, UserRow, insertCarRow, insertUserRow } from "@/lib/tableland";
import { Database } from "@tableland/sdk";
import { useTablelandProvider } from "../(context)/tablelandContext";

function Page({ params }: { params: { id: string } }) {
  return <main className="grid grid-cols-2">dashboard</main>;
}

export default Page;
