"use client";
import { useTablelandProvider } from "@/app/(context)/tablelandContext";
import { Button } from "./ui/button";
import { useAccount } from "wagmi";
import { addFavoriteForUesr } from "@/lib/tableland";
import { StarFilledIcon } from "@radix-ui/react-icons";

interface IAddToFavs {
  carTokenId: number;
}
const AddToFavorites = ({ carTokenId }: IAddToFavs) => {
  const { dbClient } = useTablelandProvider();
  const { address } = useAccount();

  const addToFavourites = async () => {
    try {
      await addFavoriteForUesr(address!, carTokenId, dbClient);
    } catch (error) {
      console.log(error);
    }
  };

  if (!address) return null;

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="btn w-full"
        onClick={async () => await addToFavourites()}
      >
        <StarFilledIcon className="w-6 h-6 text-yellow-400 mr-2" />
        Favourite
      </Button>
    </>
  );
};

export default AddToFavorites;
