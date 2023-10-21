"use client";
import { ethers } from "ethers";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Camera from "@/components/Camera";
// import { WalletContext } from "@/app/(context)/context";
import { Button } from "@/components/ui/button";

import MintButton from "@/components/MintButton";
import CarSpecs from "@/components/CarSpecs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Compressor from "compressorjs";
import { useWaitForTransaction, useContractWrite, useAccount } from "wagmi";

import { Input } from "@/components/ui/input";
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
import {
  CarRow,
  UserRow,
  findUserOfTokenId,
  insertCarRow,
  insertUserRow,
} from "@/lib/tableland";
import { Database } from "@tableland/sdk";
import { useTablelandProvider } from "../(context)/tablelandContext";

// import { useConnectWallet } from "@privy-io/react-auth";

// import { useWalletContext } from "../(hooks)/useWalletContext";

function convertToTraitTypeValue(jsonObj: any, setAidata: any) {
  const highestScores = jsonObj.highestScores;
  setAidata(highestScores);
  const traitTypeValueArray = Object.keys(highestScores).map((key) => {
    return { trait_type: key, value: highestScores[key] };
  });
  return traitTypeValueArray;
}

function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    var reader = new FileReader();
    reader.onload = function () {
      var dataUrl = reader.result;
      var base64 = dataUrl.split(",")[1];
      resolve(base64);
    };
    reader.readAsDataURL(blob);
  });
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
  const [aiData, setAidata] = useState<any>(null);
  const { dbClient } = useTablelandProvider();
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [selectedOption, setSelectedOption] = useState("automatic");

  let runner = async () => {
    findUserOfTokenId(1, dbClient);
  };

  useEffect(() => {
    runner();
  }, []);

  const {
    data: writeDataRoadWorthy,
    isLoading: writeLoadingRoadWorthy,
    isSuccess: writeSuccessRoadWorthy,
    write: writeRoadWorthy,
  } = useContractWrite({
    address: MUMBAI_ROAD_WORTHY_CONTRACT_ADDRESS, // Another dummy contract address
    abi: ROAD_WORTHY_RECORD_ABI, // Another dummy ABI
    functionName: "mintRoadWorthyRecord", // Another function to be called within the other contract
    args: [address, account],
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
    args: [address, account],
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
      const traits = convertToTraitTypeValue(carApiData.data, setAidata);

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

  const handleImageCapture = async (imageFile: File) => {
    console.log(imageFile);

    setCapturedImage(imageFile);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };
  const handleTransmisson = (event) => {
    setSelectedOption(event.target.value);
  };
  const handleConfirm = async () => {
    setConfirmCar(true);

    new Compressor(capturedImage!, {
      quality: 0.6,

      async success(result: File) {
        // console.log(result);
        const base64 = await blobToBase64(result);
        // console.log(base64);
        // const base64 = await fileToBase64(result);

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
      },
      error(err: { message: any }) {
        console.log(err);
        console.log(err.message);
      },
    });
  };

  const mintCarNFT = async () => {
    console.log("Calling mint car");
    writeCar?.();
  };

  function getRandomBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  const handleServiceMint = () => {
    writeService?.();
  };

  const handleRoadWorthyMint = () => {
    writeRoadWorthy?.();
  };

  const saveToTableLand = () => {};

  const handleUpload = async () => {
    if (!capturedImage) return;
    console.log(capturedImage);
  };

  return (
    <main>
      <Stepper currentStep={currentStep} />
      <h2 className="max-w-[200px] pb-2 text-3xl font-semibold tracking-tight transition-colors text-blue-500 my-8">
        Snap & Sell List Car
      </h2>
      <p className=" text-blue-400 text-small my-6">
        Start now—snap a photo, upload, and watch as our platform creates a
        comprehensive, attractive listing that's ready to go live. Sell smarter,
        not harder, with 'Snap & Sell List Car'!
      </p>
      {currentStep === 1 && (
        <>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-4 mt-12">
            <Camera onCapture={handleImageCapture} onConfirm={handleConfirm} />
          </div>

          {confirmCar ? (
            <>
              <CarSpecs highScores={carApiData} />
              <h4 className="text-sm font-medium leading-none col-span-6 text-blue-950 my-2">
                {" "}
                Transmission{" "}
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Select your cars transmission.
              </p>

              <div className="grid w-full max-w-sm items-center gap-2.5 mb-4">
                <RadioGroup defaultValue="automatic" className="mb-2 ">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="automatic"
                      id="automatic"
                      onClick={handleTransmisson}
                      checked={selectedOption === "automatic"}
                    />
                    <Label htmlFor="option-one">Automatic</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="manual"
                      id="manual"
                      onClick={handleTransmisson}
                      checked={selectedOption === "manual"}
                    />
                    <Label htmlFor="option-two">Manual</Label>
                  </div>
                </RadioGroup>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="year">Enter year</Label>
                  <Input
                    type="text"
                    id="year"
                    maxLength={4}
                    value={year}
                    onChange={handleYearChange}
                  />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="price">Sale Price</Label>
                  <Input
                    type="text"
                    id="price"
                    value={price}
                    onChange={handlePriceChange}
                  />
                </div>
              </div>
            </>
          ) : null}

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
        </>
      )}
      {currentStep === 2 && (
        <>
          <h4 className="mt-6 mb-2 text-xl font-semibold tracking-tight text-blue-800">
            Verify Your Maintenance History & Authenticate Your Car
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
          <Button
            onClick={async () => {
              // insert a user details row
              const userRow: UserRow = {
                userAddress: address!,
                userTba: account!,
                tokenId: mintedTokenId,
              };
              await insertUserRow(userRow, dbClient);

              const carRow: CarRow = {
                make: aiData.make,
                model: aiData.model,
                transmissionType: selectedOption,
                tokenId: mintedTokenId,
                price: +price,
                rating: getRandomBetween(3.5, 5).toString(),
                year: +year,
              };
              await insertCarRow(carRow, dbClient);

              // insert a car details row
            }}
          >
            Confirm
          </Button>
        </>
      )}
      {currentStep >= 3 && <div>hello</div>}{" "}
      {/* Here we are finishing the process, so save all of the data */}
    </main>
  );
}

export default Page;
