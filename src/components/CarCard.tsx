"use client";

import React from "react";
import Image from "next/image";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";

interface CarCardProps {
  imageUrl: string;
  make: string;
  model: string;
  year: number;
  price: number;
  engine: string;
}

const CarCard: React.FC<CarCardProps> = ({
  imageUrl,
  make,
  model,
  year,
  price,
  engine,
}) => {
  return (
    <div className="bg-blue-100 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={`${make} ${model}`}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-lg font-bold text-blue-900">{`${make} ${model}`}</h2>
        <div className="flex justify-between">
          <StarFilledIcon className="w-6 h-6 text-yellow-400 mr-2" />
          <p className="text-blue-900"> 4.3</p>
        </div>
      </div>
      <Separator
        orientation="horizontal"
        className="my-2 bg-blue-900/10 w-11/12 mx-auto"
      />
      <div className="p-4 flex justify-between items-center">
        <div className="flex ">
          <Image src="/engine.svg" height={24} width={24} alt="engine icon" />
          <p className="ml-2 text-blue-900">{engine}</p>
        </div>
        <p className="text-blue-900">{`${year} | $${price}`}</p>
      </div>
    </div>
  );
};

export default CarCard;
