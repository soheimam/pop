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

  const loadCars = async (address: string, dbClient: Database) => {
    let favoriteCarTokens = await findFavoritesForUser(address, dbClient);
    console.log("finding favorites ...");
    console.log(favoriteCarTokens);
    console.log("finding cars for favs...");
    let cars = await findCarsForUser(
      favoriteCarTokens.map((user) => user.tokenId),
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
      <h1 className="text-blue-800"> Notis</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
        {cars != null && cars.length > 0 ? (
          cars.map((car) => (
            <CarCard
              key={car.tokenId}
              id={car.tokenId}
              make={car.make}
              model={car.model}
              year={car.year}
              price={car.price}
              imageUrl={`/car2.png`}
              engine={car.tansmissionType}
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
