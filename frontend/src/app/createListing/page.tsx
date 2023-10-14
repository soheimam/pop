"use client";

import React, { useContext, useState } from "react";
import Camera from "@/components/Camera";
// import { WalletContext } from "@/app/(context)/context";

import {
  CAR_ABI,
  createTBAAccount,
  getCarContract,
  getRegistryContract,
  getTBAAccount,
} from "@/lib/chainUtils";
import { RelayTransactionResponse } from "@cometh/connect-sdk";
import {
  TransactionReceipt,
  TransactionResponse,
} from "@ethersproject/abstract-provider";
import { ethers } from "ethers";
import { useWalletContext } from "../(hooks)/useWalletContext";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
  });
}

function Page({ params }: { params: { id: string } }) {
  const [capturedImage, setCapturedImage] = useState<File | null>(null);
  const [carApiData, setCarApiData] = useState<any>(null);
  const { wallet, provider } = useWalletContext();

  const handleImageCapture = async (imageFile: File) => {
    console.log(imageFile);
    setCapturedImage(imageFile);
  };

  const handleConfirm = async (imageUrl: any) => {
    console.log("Image URL Confirmed:", imageUrl);
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
    const _data = await data.json();
    setCarApiData(_data);
  };

  const mintCarNFT = async () => {
    const _getCarContract = await getCarContract(provider!);
    console.log(_getCarContract);
    console.log(`attempting a mint`);
    console.log(`wallet address = ${wallet?.getAddress()}`);
    const mintTransaction: RelayTransactionResponse =
      await _getCarContract.mintCar(wallet?.getAddress()); // need a way here to get back the tokenId that was just minted
    console.log(mintTransaction);
    console.log(`should wait for receipt now ..`);
    const mintReceipt: any = await mintTransaction.wait(); // Wait for the transaction to complete
    console.log(`here is the receipt..`);
    console.log(mintReceipt);
  };

  //TODO: Need a check or some way to get what the tokenId should be
  const createTBA = async (tokenId: number) => {
    console.log(`starting TBA creation...`);
    const tbaCreateTransaction: RelayTransactionResponse =
      await createTBAAccount(provider!, tokenId);
    console.log(`tbaCreateTransaction = ${tbaCreateTransaction}`);
    const tbaCreationReceipt: any = await tbaCreateTransaction.wait();
    console.log(tbaCreationReceipt);
    const tbaCreationEvents = tbaCreationReceipt.events;
    for (let k = 0; k < tbaCreationEvents.length; k++) {
      if (tbaCreationEvents[k].event === "AccountCreated") {
        console.log("AccountCreated event found!");
        const account = await getTBAAccount(provider!, tokenId);
        console.log(`TBA account address = ${account}`);
        break;
      }
    }
  };

  const handleUpload = async () => {
    if (!capturedImage) return;
    console.log(capturedImage);
    const base64 = await fileToBase64(capturedImage);

    const data = await fetch(`/cars/api`, {
      method: "POST",
      body: JSON.stringify({
        base64: base64,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(data);
  };

  return (
    <main>
      <h2 className=" max-w-[200px]  border-b pb-2 text-3xl font-semibold tracking-tight transition-colors  text-blue-500 my-8">
        Snap & Sell List Car
      </h2>

      <div className="grid grid-cols-6 md:grid-cols-12 gap-4">
        <Camera onCapture={handleImageCapture} onConfirm={handleConfirm} />
      </div>
      {capturedImage && <button onClick={handleUpload}>Submit</button>}
      {carApiData ? JSON.stringify(carApiData) : null}

      <div className="flex">
        {provider != null ? (
          <div className="flex-col">
            <div>
              <button onClick={async () => await mintCarNFT()}>Mint Car</button>
            </div>

            <div>
              <button onClick={async () => await createTBA(11)}>
                Create TBA For Minted Car
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </main>
  );
}

export default Page;
