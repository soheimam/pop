"use client";

import React, { useEffect, useState } from "react";
import Camera from "@/components/Camera";
// import { WalletContext } from "@/app/(context)/context";
import { Button } from "@/components/ui/button";
import MintButton from "@/components/MintButton";
import { Progress } from "@/components/ui/progress";

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
import { BigNumber, ethers } from "ethers";
import { useWalletContext } from "../(hooks)/useWalletContext";
import CarSpecs from "@/components/CarSpecs";

import { insertRow } from "@/lib/tableland";
import Stepper from "@/components/stepper";

function convertToTraitTypeValue(jsonObj: any) {
  const highestScores = jsonObj.highestScores;
  const traitTypeValueArray = Object.keys(highestScores).map((key) => {
    return { trait_type: key, value: highestScores[key] };
  });
  return traitTypeValueArray;
}

function getTokenId(transactionReceipt: any) {
  // Find the CarMinted event in the events array
  const carMintedEvent = transactionReceipt.events.find(
    (event: { event: string }) => event.event === "CarMinted"
  );

  if (!carMintedEvent) {
    throw new Error("CarMinted event not found in transaction receipt");
  }

  // Extract the tokenId from the CarMinted event
  const tokenId = carMintedEvent.args[1];
  console.log("Minted token was: ", tokenId);
  return tokenId;
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
  const [mintedTokenId, setMintedTokenId] = useState<number>(0);
  const { wallet, provider } = useWalletContext();
  const [currentStep, setCurrentStep] = useState(1);

  //TODO: here is example of insert row
  async function runner() {
    await insertRow();
  }

  useEffect(() => {
    console.log("attempting to insert a row ...");
    runner();
  });

  const handleImageCapture = async (imageFile: File) => {
    console.log(imageFile);
    setCapturedImage(imageFile);
  };

  const handleConfirm = async (imageUrl: any) => {
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
    console.log(data);
    if (data.status === 200) {
      const _data = await data.json();
      setMintButtonVisible(true);
      console.log(_data);
      setCarApiData(_data);
    } else {
      console.log("error");
      // Toast Here to say its an error
    }
  };

  const mintCarNFT = async () => {
    const _walletAddress = wallet?.getAddress();

    const _getCarContract = await getCarContract(provider!);
    console.log(_getCarContract);
    console.log(`attempting a mint`);
    console.log(`wallet address = ${_walletAddress}`);

    const estimatedGasLimit = await _getCarContract.estimateGas.mintCar(
      _walletAddress
    );
    const _gasLimit = estimatedGasLimit.add(500000);

    const mintTransaction: RelayTransactionResponse =
      await _getCarContract.mintCar(wallet?.getAddress(), {
        gasLimit: _gasLimit,
      }); // need a way here to get back the tokenId that was just minted
    console.log(mintTransaction);
    console.log(`should wait for receipt now ..`);
    const mintReceipt: any = await mintTransaction.wait(); // Wait for the transaction to complete
    const tokenId = getTokenId(mintReceipt);

    setCurrentStep(2);
    setMintedTokenId(tokenId.toString());

    const traits = convertToTraitTypeValue(carApiData.data);
    const base64 = await fileToBase64(capturedImage!);
    const data = await fetch(`/cars/api`, {
      method: "POST",
      body: JSON.stringify({
        base64,
        tokenId: tokenId.toString(),
        traits,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(data);
  };

  const saveToTableLand = () => {};

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
  };

  console.log(carApiData, "logging for chat");
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
        {provider != null ? (
          <>
            <div>
              {mintButtonVisible && capturedImage && (
                <MintButton
                  onUpload={handleUpload}
                  onMint={mintCarNFT}
                  setCurrentStep={setCurrentStep}
                />
              )}
            </div>

            <div>
              {/* this is the tba button */}
              <Button onClick={async () => await createTBA(mintedTokenId)}>
                Add documents
              </Button>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      {currentStep >= 2 && <button>Test</button>}
      {currentStep === 3 && <div>Hello Third</div>}
    </main>
  );
}

export default Page;
