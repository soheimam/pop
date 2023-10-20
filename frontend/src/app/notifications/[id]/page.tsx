import CarCard from "./CarCard";
import { useState } from "react";

function Page({ params }: { params: { id: string } }) {
  const [cars, setCars] = useState(mockCars);
  //notification
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
  return (
    <main>
      <h1 className="text-blue-800"> Notis</h1>
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
