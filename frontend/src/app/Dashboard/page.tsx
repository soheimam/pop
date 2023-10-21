"use client";

import CarCard from "@/components/CarCard";
import React, { useEffect, useState } from "react";
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
];

function Page({ params }: { params: { id: string } }) {
  const [cars, setCars] = useState(mockCars);

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

export default Page;
