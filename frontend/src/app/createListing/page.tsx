"use client";

import React, { useEffect, useState } from "react";
import Camera from "@/components/Camera";
// import { WalletContext } from "@/app/(context)/context";
import { Button } from "@/components/ui/button";

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
import { ethers } from "ethers";
// import { useWalletContext } from "../(hooks)/useWalletContext";
import CarSpecs from "@/components/CarSpecs";
import { insertRow } from "@/lib/tableland";

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
  // const { wallet, provider } = useWalletContext();

  //TODO: here is example of insert row
  async function runner() {
    await insertRow();
  }

  useEffect(() => {
    console.log("attempting to insert a row ...");
    runner();
  });

  // console.log(wallet, provider);
  const handleImageCapture = async (imageFile: File) => {
    console.log(imageFile);
    setCapturedImage(imageFile);
  };

  const handleConfirm = async (imageUrl: any) => {
    console.log("Image URL Confirmed:", imageUrl);
    console.log(capturedImage);
    const base64 = await fileToBase64(capturedImage!);
    console.log(base64);
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
    console.log(_data);
    setCarApiData(_data);
  };

  const mintCarNFT = async () => {
    // const _walletAddress = wallet?.getAddress();

    // const _getCarContract = await getCarContract(provider!);
    // console.log(_getCarContract);
    console.log(`attempting a mint`);
    // console.log(`wallet address = ${_walletAddress}`);

    // const estimatedGasLimit = await _getCarContract.estimateGas.mintCar(
    //   _walletAddress
    // );
    // const approveTxUnsigned = await _getCarContract.populateTransaction.mintCar(
    //   _walletAddress
    // );
    // approveTxUnsigned.gasLimit = estimatedGasLimit;
    // approveTxUnsigned.gasPrice = await provider!.getGasPrice();
    // approveTxUnsigned.nonce = await provider!.getTransactionCount(
    //   _walletAddress!
    // );

    // const approveTxSigned = await wallet!.signTransaction(approveTxUnsigned!);
    // const submittedTx = await provider!.sendTransaction(approveTxSigned);
    // const approveReceipt = await submittedTx.wait();
    // if (approveReceipt.status === 0)
    //   throw new Error("Approve transaction failed");

    //   const mintTransaction: RelayTransactionResponse =
    //     await _getCarContract.mintCar(wallet?.getAddress(), {
    //       gasLimit: estimatedGasLimit,
    //     }); // need a way here to get back the tokenId that was just minted
    //   console.log(mintTransaction);
    //   console.log(`should wait for receipt now ..`);
    //   const mintReceipt: any = await mintTransaction.wait(); // Wait for the transaction to complete
    //   console.log(`here is the receipt..`);
    //   console.log(mintReceipt);
    // };

    // const saveToTableLand = () => {};

    // //TODO: Need a check or some way to get what the tokenId should be
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
    // console.log(data);
  };
  console.log(carApiData, "logging for chat");
  return (
    <main>
      <h2 className=" max-w-[200px]  border-b pb-2 text-3xl font-semibold tracking-tight transition-colors  text-blue-500 my-8">
        Snap & Sell List Car
      </h2>

      <div className="grid grid-cols-6 md:grid-cols-12 gap-4">
        <Camera onCapture={handleImageCapture} onConfirm={handleConfirm} />
      </div>
      {carApiData ? <CarSpecs highScores={carApiData} /> : null}

      <div className="flex ">
        {null ? (
          <>
            <div>
              {capturedImage && (
                <Button
                  className="mr-4"
                  onClick={async () => {
                    handleUpload();
                    await mintCarNFT();
                  }}
                >
                  Mint Car
                </Button>
              )}
            </div>

            <div>
              {/* this is the tba button */}
              <Button onClick={async () => () => console.log("Create tba")}>
                Add documents
              </Button>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </main>
  );
}

export default Page;
