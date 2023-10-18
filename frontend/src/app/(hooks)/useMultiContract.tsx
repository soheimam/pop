import { useState, useCallback } from "react";
import { ethers } from "ethers";

function useMultiContractWrite() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const writeContract = useCallback(
    async ({ abi, address, functionName, args }) => {
      setIsLoading(true);
      setIsSuccess(false);
      setError(null);
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(address, abi, signer);

        const transaction = await contract[functionName](...args);
        const transactionResult = await transaction.wait();

        setIsLoading(false);
        setIsSuccess(true);
        setData(transactionResult);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
        setError(err);
      }
    },
    []
  );

  return {
    isLoading,
    isSuccess,
    error,
    data,
    writeContract,
  };
}

export default useMultiContractWrite;
