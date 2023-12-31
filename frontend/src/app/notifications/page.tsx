"use client";
import CarCard from "@/components/CarCard";
import { useEffect, useState } from "react";
import { useTablelandProvider } from "../(context)/tablelandContext";
import { CarRow, findCarsForUser, findFavoritesForUser } from "@/lib/tableland";
import { useAccount } from "wagmi";
import { Database } from "@tableland/sdk";

function Page({ params }: { params: { id: string } }) {
  const { dbClient } = useTablelandProvider();
  const { address } = useAccount();
  const [cars, setCars] = useState<CarRow[]>();
  const [favoriteCarTokens, setFavoriteCarTokens] = useState<number[]>([]);

  const loadCars = async (address: string, dbClient: Database) => {
    let favoriteCarTokens = await findFavoritesForUser(address, dbClient);
    console.log("finding favorites ...");
    console.log(favoriteCarTokens);
    if (favoriteCarTokens != undefined && favoriteCarTokens.length >= 0) {
      setFavoriteCarTokens(favoriteCarTokens.map((user) => user.tokenId));
    } else {
      setFavoriteCarTokens([]);
    }

    console.log("finding cars for favs...");
    let cars = await findCarsForUser(
      favoriteCarTokens!.map((user) => user.tokenId),
      dbClient
    );
    console.log(cars);
    setCars(cars);
  };

  useEffect(() => {
    console.log(`running the use effect`);
    if (dbClient && address) {
      console.log(`loading cars..`);
      loadCars(address, dbClient);
    }
  }, [address, dbClient]);

  return (
    <main>
      <h1 className="text-blue-800"> Favourites</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
        {cars != null && cars.length > 0 ? (
          cars.map((car, index) => (
            <CarCard
              key={index}
              id={car.tokenId}
              make={car.make}
              model={car.model}
              year={car.year}
              rating={parseFloat(car.rating).toFixed(1).toString()}
              price={car.price}
              imageUrl={`https://api.metafuse.me/assets/be82af4a-9515-4c14-979f-27685ede3bbd/${car.tokenId}.png`}
              engine={car.transmissionType}
              //@ts-ignore
              fav={favoriteCarTokens.includes(car.tokenId)}
            />
          ))
        ) : (
          <></>
        )}
      </div>
    </main>
  );
}

export default Page;
