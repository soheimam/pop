"use client";

import React, { useEffect, useState } from "react";
import Camera from "@/components/Camera";
// import { WalletContext } from "@/app/(context)/context";
import { Button } from "@/components/ui/button";
import MintButton from "@/components/MintButton";
import CarSpecs from "@/components/CarSpecs";
import { insertRow } from "@/lib/tableland";
import Stepper from "@/components/stepper";
import {
  useWalletClient,
  useTransaction,
  useWaitForTransaction,
  useContractRead,
  useContractWrite,
  useAccount,
  usePrepareContractWrite,
} from "wagmi";

// import {
//   CAR_ABI,
//   createTBAAccount,
//   getCarContract,
//   getRegistryContract,
//   getTBAAccount,
// } from "@/lib/chainUtils";
// import { RelayTransactionResponse } from "@cometh/connect-sdk";
import {
  TransactionReceipt,
  TransactionResponse,
} from "@ethersproject/abstract-provider";
import { BigNumber, ethers } from "ethers";
import { CAR_ABI, MUMBAI_CAR_CONTRACT_ADDRESS } from "@/lib/chainUtils";
import { toast } from "@/components/ui/use-toast";
import { useCreateTBA } from "../(hooks)/useCreateTBA";
import { ToastAction } from "@/components/ui/toast";

// import { useConnectWallet } from "@privy-io/react-auth";

// import { useWalletContext } from "../(hooks)/useWalletContext";

function convertToTraitTypeValue(jsonObj: any) {
  const highestScores = jsonObj.highestScores;
  const traitTypeValueArray = Object.keys(highestScores).map((key) => {
    return { trait_type: key, value: highestScores[key] };
  });
  return traitTypeValueArray;
}

function getTokenId(transactionReceipt: any) {
  if (
    transactionReceipt &&
    transactionReceipt.logs &&
    transactionReceipt.logs[0] &&
    transactionReceipt.logs[0].topics &&
    transactionReceipt.logs[0].topics[3]
  ) {
    const tokenIdHex = transactionReceipt.logs[0].topics[3];
    const tokenId = BigInt(tokenIdHex); // Convert hexadecimal to BigInt
    return tokenId.toString(); // Convert BigInt to string
  }
  throw new Error("Token ID not found");
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result: string = reader.result as string;
      const base64: string = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
}

function Page({ params }: { params: { id: string } }) {
  const [capturedImage, setCapturedImage] = useState<File | null>(null);
  const [carApiData, setCarApiData] = useState<any>(null);
  const [mintButtonVisible, setMintButtonVisible] = useState(
    Boolean(carApiData)
  );
  const { address } = useAccount();
  const [showEnableMinting, setShowEnableMinting] = useState<boolean>(false);
  const [mintedTokenId, setMintedTokenId] = useState<number>(0);
  const { createTBA, account } = useCreateTBA();
  const [currentStep, setCurrentStep] = useState(1);
  const [transactionHash, setTransactionHash] = useState<any>(null);
  // const { config, refetch } = usePrepareContractWrite({
  //   address: MUMBAI_CAR_CONTRACT_ADDRESS,
  //   enabled: showEnableMinting,
  //   abi: CAR_ABI,
  //   functionName: "mintCar",
  //   args: [address],
  // });

  // const {
  //   data: transactionData,
  //   isError: transactionError,
  //   isLoading: transactionLoading,
  // } = useTransaction({
  //   enabled: Boolean(transactionHash),
  //   hash: transactionHash,
  // });
  // console.log(transactionData);

  const {
    data: writeData,
    isLoading,
    isSuccess,
    write,
  } = useContractWrite({
    address: MUMBAI_CAR_CONTRACT_ADDRESS,
    abi: CAR_ABI,
    functionName: "mintCar",
    args: [address],
  });

  useWaitForTransaction({
    hash: writeData?.hash,
    enabled: Boolean(writeData),
    onSuccess: async (transactionReceipt) => {
      const tokenId = getTokenId(transactionReceipt);
      await createTBA(+tokenId);
      const base64 = await fileToBase64(capturedImage!);
      const traits = convertToTraitTypeValue(carApiData.data);

      const _data = await fetch(`/cars/api`, {
        method: "POST",
        body: JSON.stringify({
          base64,
          tokenId,
          traits,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(_data);
    },
  });

  //TODO: here is example of insert row
  // async function runner() {
  //   await insertRow();
  // }

  // useEffect(() => {
  //   console.log("attempting to insert a row ...");
  //   runner();
  // });

  const handleImageCapture = async (imageFile: File) => {
    console.log(imageFile);
    setCapturedImage(imageFile);
  };

  const handleConfirm = async () => {
    const base64 = await fileToBase64(capturedImage!);

    const data = await fetch(`/cars/api`, {
      method: "PUT",
      body: JSON.stringify({
        base64: base64,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (data.status === 200) {
      const _data = await data.json();
      setMintButtonVisible(true);
      setCarApiData(_data);
      setShowEnableMinting(true);
    } else {
      console.log("error");
      toast({
        description: `Error: ${data.status}`,
      });
      // Toast Here to say its an error
    }
  };

  const mintCarNFT = async () => {
    console.log("Calling mint car");

    // await refetch?.();
    write?.();
  };

  const saveToTableLand = () => {};

  //TODO: Need a check or some way to get what the tokenId should be
  // const createTBA = async (tokenId: number) => {
  //   console.log(`starting TBA creation...`);

  //   const tbaCreateTransaction: RelayTransactionResponse =
  //     await createTBAAccount(provider!, tokenId);
  //   console.log(`tbaCreateTransaction = ${tbaCreateTransaction}`);
  //   const tbaCreationReceipt: any = await tbaCreateTransaction.wait();
  //   console.log(tbaCreationReceipt);
  //   const tbaCreationEvents = tbaCreationReceipt.events;
  //   for (let k = 0; k < tbaCreationEvents.length; k++) {
  //     if (tbaCreationEvents[k].event === "AccountCreated") {
  //       console.log("AccountCreated event found!");
  //       const account = await getTBAAccount(provider!, tokenId);
  //       console.log(`TBA account address = ${account}`);
  //       break;
  //     }
  //   }
  // };

  const handleUpload = async () => {
    if (!capturedImage) return;
    console.log(capturedImage);
  };

  return (
    <main>
      <h2 className=" max-w-[200px]   pb-2 text-3xl font-semibold tracking-tight transition-colors  text-blue-500 my-8">
        Snap & Sell List Car
      </h2>
      <Stepper currentStep={currentStep} />
      <div className="grid grid-cols-6 md:grid-cols-12 gap-4 mt-12">
        <Camera onCapture={handleImageCapture} onConfirm={handleConfirm} />
      </div>
      <CarSpecs highScores={carApiData} />

      <div className="flex ">
        <>
          <div>
            {!account && mintButtonVisible && capturedImage && (
              <MintButton
                onUpload={handleUpload}
                onMint={mintCarNFT}
                setCurrentStep={setCurrentStep}
                isLoading={isLoading}
              />
            )}
          </div>

          <div>
            {/* this is the tba button */}
            {/* <Button onClick={async () => await createTBA(mintedTokenId)}> */}
            <Button onClick={async () => () => console.log("Create tba")}>
              Add documents
            </Button>
          </div>
        </>
      </div>
      {currentStep >= 2 && <button>Test</button>}
      {currentStep === 3 && <div>Hello Third</div>}
    </main>
  );
}

export default Page;
