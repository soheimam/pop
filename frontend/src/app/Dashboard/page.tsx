"use client";

import CarCard from "@/components/CarCard";
import React, { useEffect, useState } from "react";
import { useTablelandProvider } from "../(context)/tablelandContext";
import { findCarTokenIdsForUser, findCarsForUser } from "@/lib/tableland";
import { useAccount } from "wagmi";
const mockCars = [
  {
    tokenId: 1,
    make: "Toyota",
    model: "Corolla",
    year: 2018,
    price: 15000,
    image: "/car2.png",
    transmissionType: "automatic",
  },
];

function Page({ params }: { params: { id: string } }) {
  const [cars, setCars] = useState(null);
  const { dbClient } = useTablelandProvider();
  const { address, isConnected } = useAccount();
  const [caughtError, setCaughtError] = useState(false);

  useEffect(() => {
    const initCarData = async () => {
      try {
        console.log`Initing some data`;
        let tokenIds = await findCarTokenIdsForUser(address, dbClient);
        console.log(tokenIds);
        if (tokenIds == null || tokenIds.length == 0) {
          throw Error("no token ids"); // should fall back to mock cars
        }
        let cars = await findCarsForUser(tokenIds!, dbClient);
        setCars(cars);
      } catch (error) {
        setCaughtError(true);
        console.log(error);
        setCars(mockCars);
      }
    };
    if (cars == null) {
      initCarData();
    }
  }, [isConnected]);

  return (
    <main>
      <div className="grid grid-cols-6">
        <h2 className="max-w-[200px] pb-2 text-3xl font-semibold tracking-tight transition-colors text-blue-500 my-8">
          Dashboard
        </h2>
      </div>
      <h4 className="text-sm font-medium leading-none col-span-6 text-blue-950 my-2">
        Your cars
      </h4>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
        {cars ? (
          cars.map((car, index) => (
            <CarCard
              key={`${car.tokenId}${index}`}
              id={car.tokenId}
              make={car.make}
              model={car.model}
              year={car.year}
              price={car.price}
              imageUrl={
                caughtError
                  ? car.image
                  : `https://api.metafuse.me/assets/be82af4a-9515-4c14-979f-27685ede3bbd/${car.tokenId}.png`
              }
              engine={car.transmissionType}
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
