"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import CarCard from "./CarCard";
import { useTablelandProvider } from "@/app/(context)/tablelandContext";
import { CarRow, findCarsForHome, findFavoritesForUser } from "@/lib/tableland";
import { useAccount } from "wagmi";

const mockCars = [
  {
    tokenId: 1,
    make: "Toyota",
    model: "Corolla",
    year: 2018,
    price: 15000,
    image: "/2.png",
    engine: "automatic",
  },
  {
    tokenId: 2,
    make: "Honda",
    model: "Civic",
    year: 2019,
    price: 17000,
    image: "/3.png",
    engine: "automatic",
  },
  {
    tokenId: 3,
    make: "Ford",
    model: "Mustang",
    year: 2020,
    price: 25000,
    image: "/4.png",
    engine: "manual",
  },
] as CarRow[];

export default function MarketPlace({ title = "" }) {
  const [cars, setCars] = useState<CarRow[]>(null);
  const [caughtError, setCaughtError] = useState(false);
  const { dbClient } = useTablelandProvider();
  const { address } = useAccount();
  const [userFavs, setUserFavs] = useState();

  const initCarData = async () => {
    try {
      let cars = await findCarsForHome(dbClient);
      let userFavs = await findFavoritesForUser(address, dbClient);
      setCars(cars);
    } catch (error) {
      console.log(error);
      setCars(mockCars);
    }
  };

  useEffect(() => {
    if (!cars && dbClient) {
      try {
        initCarData();
      } catch (error) {
        setCars(mockCars);
        console.log(error);
      }
    }
  }, [dbClient]);

  return (
    <main>
      <div className="grid grid-cols-6 bg-blue-500 rounded-b-2xl pt-4 pb-12 px-8 ">
        <h2 className="col-start-1 mt-8 text-3xl font-semibold   text-white text-wrap col-span-4  ">
          You snap it! We sell it
        </h2>
        <p className="col-start-1 col-span-4 leading-7 text-white [&:not(:first-child)]:mt-3 ">
          Take a photo of your car, use machine learning to detect the car and
          its data.
        </p>
      </div>
      <h4 className="mt-9 mb-6 blue-900 text-xl font-semibold tracking-tight text-blue-900">
        Todays picks
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
