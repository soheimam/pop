"use client";
import { useTablelandProvider } from "@/app/(context)/tablelandContext";
import { Button } from "./ui/button";
import { useAccount } from "wagmi";
import { addFavoriteForUesr } from "@/lib/tableland";

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
    <div>
      <Button
        variant="outline"
        className="btn"
        onClick={async () => await addToFavourites()}
      >
        Add to Favourites
      </Button>
    </div>
  );
};

export default AddToFavorites;
