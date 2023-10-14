"use client";
import React, { useContext, useState } from "react";
import Camera from "@/components/Camera";
import { WalletContext } from "@/app/(context)/context";
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

function Page({ params }: { params: { id: string } }) {
  const [capturedImage, setCapturedImage] = useState(null);
  const { provider, wallet } = useContext(WalletContext);

  // If the profile is not found, display a message
  console.log(params, "listing");

  const handleImageCapture = (imageFile: React.SetStateAction<null>) => {
    // Store the image file from the Camera component in state
    setCapturedImage(imageFile);
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

    // Implement logic to upload the image.
    // For example, using `fetch` and FormData:
    alert("Image uploaded! (or implement actual upload functionality)");
  };

  return (
    <main>
      <h2 className=" max-w-[200px]  border-b pb-2 text-3xl font-semibold tracking-tight transition-colors  text-blue-500 my-20">
        Snap & Sell List Car
      </h2>

      <div className="grid grid-cols-6 md:grid-cols-12 gap-4">
        <Camera onCapture={handleImageCapture} />
      </div>

      {/* Only show the "Upload Photo" button when an image is captured */}
      {capturedImage && <button onClick={handleUpload}>Submit</button>}

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
