import { useContractWrite, useWaitForTransaction } from "wagmi";
import { useState } from "react";
import {
  AccountCreationArgs,
  MUMBAI_ACCOUNT_ADDRESS,
  MUMBAI_CAR_CONTRACT_ADDRESS,
  MUMBAI_REGISTRY_ADDRESS,
  REGISTRY_ABI,
} from "@/lib/chainUtils";

export const useCreateTBA = () => {
  const {
    data: writeData,
    isLoading,
    isSuccess,
    write,
  } = useContractWrite({
    address: MUMBAI_REGISTRY_ADDRESS,
    abi: REGISTRY_ABI,
    functionName: "createAccount",
  });

  const [account, setAccount] = useState<string | null>(null);

  useWaitForTransaction({
    hash: writeData?.hash,
    enabled: Boolean(writeData),
    onSuccess: async (transactionReceipt) => {
      console.log(transactionReceipt);
      setAccount(transactionReceipt.logs[0].address);
    },
  });

  const createTBA = async (tokenId: number) => {
    console.log(`starting TBA creation...`);
    let args: AccountCreationArgs = {
      implementation_: MUMBAI_ACCOUNT_ADDRESS,
      chainId_: 80001,
      tokenContract_: MUMBAI_CAR_CONTRACT_ADDRESS,
      tokenId_: tokenId,
      salt_:
        "0x6551655165516551655165516551655165516551655165516551655165516551",
      initData: "0x",
    };
    write({
      args: [
        args.implementation_,
        args.chainId_,
        args.tokenContract_,
        args.tokenId_,
        args.salt_,
        "0x",
      ],
    });
  };

  return {
    createTBA,
    isLoading,
    isSuccess,
    account,
  };
};
