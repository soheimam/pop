"use client";

import { useState } from "react";
import Image from "next/image";
import CarCard from "./CarCard";

const mockCars = [
  {
    id: 1,
    make: "Toyota",
    model: "Corolla",
    year: 2018,
    price: 15000,
    image: "/car2.png",
    engine: "automatic",
  },
  {
    id: 2,
    make: "Honda",
    model: "Civic",
    year: 2019,
    price: 17000,
    image: "/car3.png",
    engine: "automatic",
  },
  {
    id: 3,
    make: "Ford",
    model: "Mustang",
    year: 2020,
    price: 25000,
    image: "/car4.png",
    engine: "manual",
  },
];

export default function MarketPlace({ title = "" }) {
  const [cars, setCars] = useState(mockCars);

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
        {cars.map((car) => (
          <CarCard
            key={car.id}
            id={car.id}
            make={car.make}
            model={car.model}
            year={car.year}
            price={car.price}
            imageUrl={car.image}
            engine={car.engine}
          />
        ))}
      </div>
    </main>
  );
}
