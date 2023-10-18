"use client";

import React, { useEffect, useState } from "react";
import Camera from "@/components/Camera";
// import { WalletContext } from "@/app/(context)/context";
import { Button } from "@/components/ui/button";
import MintButton from "@/components/MintButton";
import CarSpecs from "@/components/CarSpecs";

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
import { ToastAction } from "@/components/ui/toast";
import SubNFTUpload from "@/components/SubNFTUpload";
import Stepper from "@/components/stepper";
import { CarRow, UserRow, insertCarRow, insertUserRow } from "@/lib/tableland";

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
  const [capturedImageService, setCapturedImageService] = useState<File | null>(
    null
  );
  const [capturedImageRoadworthy, setCapturedImageRoadWorthy] =
    useState<File | null>(null);
  const [carApiData, setCarApiData] = useState<any>(null);
  const [mintButtonVisible, setMintButtonVisible] = useState(
    Boolean(carApiData)
  );
  const [confirmCar, setConfirmCar] = useState(false);
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
    data: writeDataRoadWorthy,
    isLoading: writeLoadingRoadWorthy,
    isSuccess: writeSuccessRoadWorthy,
    write: writeRoadWorthy,
  } = useContractWrite({
    address: MUMBAI_ROAD_WORTHY_CONTRACT_ADDRESS, // Another dummy contract address
    abi: ROAD_WORTHY_RECORD_ABI, // Another dummy ABI
    functionName: "mintRoadWorthyRecord", // Another function to be called within the other contract
    args: [address],
  });

  useWaitForTransaction({
    hash: writeDataRoadWorthy?.hash,
    enabled: Boolean(writeDataRoadWorthy),
    onSuccess: async (transactionReceipt) => {
      const tokenId = getTokenId(transactionReceipt);
      // await createTBA(+tokenId); - LINK this asset now to the TBA
      const base64 = await fileToBase64(capturedImageRoadworthy!);
      const traits = [
        {
          trait_type: "Road Worthy",
          value: "Made Road Worthy at Y by Mechanic Z",
        },
      ];

      const _data = await fetch(`/cars/api`, {
        method: "POST",
        body: JSON.stringify({
          base64,
          tokenId,
          projectId: "e56510e1-48c8-432e-9295-883b1531a0bc",
          visibility: "PRIVATE",
          traits,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(_data);
    },
  });

  const {
    data: writeDataService,
    isLoading: writeLoadingService,
    isSuccess: writeSuccessService,
    write: writeService,
  } = useContractWrite({
    address: MUMBAI_SERVICE_CONTRACT_ADDRESS, // Another dummy contract address
    abi: SERVICE_RECORD_ABI, // Another dummy ABI
    functionName: "mintServiceRecord", // Another function to be called within the other contract
    args: [address],
  });

  useWaitForTransaction({
    hash: writeDataService?.hash,
    enabled: Boolean(writeDataService),
    onSuccess: async (transactionReceipt) => {
      const tokenId = getTokenId(transactionReceipt);
      setMintedTokenId(parseInt(tokenId));
      const base64 = await fileToBase64(capturedImageService!);
      const traits = [
        {
          trait_type: "Service Record",
          value: "Location X",
        },
      ];
      const _data = await fetch(`/cars/api`, {
        method: "POST",
        body: JSON.stringify({
          base64,
          tokenId,
          projectId: "dcdee2eb-b6bf-4267-97b4-c671b85aee6a",
          visibility: "PRIVATE",
          traits,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(_data);
    },
  });

  const {
    data: writeDataCar,
    isLoading: writeLoadingCar,
    isSuccess: writeSuccessCar,
    write: writeCar,
  } = useContractWrite({
    address: MUMBAI_CAR_CONTRACT_ADDRESS,
    abi: CAR_ABI,
    functionName: "mintCar",
    args: [address],
  });

  useWaitForTransaction({
    hash: writeDataCar?.hash,
    enabled: Boolean(writeDataCar),
    onSuccess: async (transactionReceipt) => {
      const tokenId = getTokenId(transactionReceipt);
      await createTBA(+tokenId);
      const base64 = await fileToBase64(capturedImage!);
      const traits = convertToTraitTypeValue(carApiData.data);

      const _data = await fetch(`/cars/api`, {
        method: "POST",
        body: JSON.stringify({
          base64,
          projectId: "be82af4a-9515-4c14-979f-27685ede3bbd",
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
    setConfirmCar(true);
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
    writeCar?.();
  };

  const handleServiceMint = () => {
    writeService?.();
  };

  const handleRoadWorthyMint = () => {
    writeRoadWorthy?.();
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
      <h2 className="max-w-[200px] pb-2 text-3xl font-semibold tracking-tight transition-colors text-blue-500 my-8">
        Snap & Sell List Car
      </h2>
      <Stepper currentStep={currentStep} />
      {currentStep === 1 && (
        <>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-4 mt-12">
            <Camera onCapture={handleImageCapture} onConfirm={handleConfirm} />
          </div>

          {confirmCar ? <CarSpecs highScores={carApiData} /> : null}

          <div className="flex ">
            <div>
              {!account && mintButtonVisible && capturedImage && (
                <MintButton
                  onUpload={handleUpload}
                  onMint={mintCarNFT}
                  setCurrentStep={setCurrentStep}
                  isLoading={writeLoadingCar}
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
          </div>
        </>
      )}
      {currentStep === 2 && (
        <>
          <h4 className="mt-6 mb-2 text-xl font-semibold tracking-tight text-blue-800">
            Add Details
          </h4>

          <p className=" text-blue-400 text-small">
            By adding more valid documents your car sales posting will have
            higher trust score.
          </p>
          <SubNFTUpload
            uploadHandler={setCapturedImageRoadWorthy}
            title="Road Worthy Report"
            onMint={handleRoadWorthyMint}
          />
          <SubNFTUpload
            title="Service Report"
            onMint={handleServiceMint}
            uploadHandler={setCapturedImageService}
          />
        </>
      )}
      {currentStep >= 3 && (
        <button
          onClick={async () => {
            // insert a user details row
            const userRow: UserRow = {
              userAddress: address!,
              userTba: account!,
              tokenId: mintedTokenId,
            };
            await insertUserRow(userRow);

            const carRow: CarRow = {
              carName: "",
              tansmissionType: "",
              tokenId: 0,
              bid: 0,
              price: 0,
              rating: "",
            };
            await insertCarRow(carRow);

            // insert a car details row
          }}
        >
          Finish
        </button>
      )}{" "}
      {/* Here we are finishing the process, so save all of the data */}
    </main>
  );
}

export default Page;
