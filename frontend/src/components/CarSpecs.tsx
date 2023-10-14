"use client";
import React, { useState, useEffect } from "react";
import StatisticCard from "./StatisticCard";
import { Skeleton } from "@/components/ui/skeleton";

interface HighScores {
  region: string;
  vehicle: string;
  model_make: string;
  color: string;
  orientation: string;
}

interface CarSpecsProps {
  highScores: any;
}

const CarSpecs: React.FC<CarSpecsProps> = ({ highScores }: CarSpecsProps) => {
  const [highScoresArray, setHighScoresArray] = useState<[string, any][]>([]);

  useEffect(() => {
    // Check if highScores.data.highestScores is defined before calling Object.entries()
    if (highScores && highScores.data && highScores.data.highestScores) {
      setHighScoresArray(Object.entries(highScores.data.highestScores));
    }
  }, [highScores]);

  if (!highScores) {
    return (
      <div className="grid grid-cols-6 py-4 gap-4">
        <h2 className=" max-w-[200px]  border-b pb-2 col-span-6 text-3xl font-semibold tracking-tight transition-colors  text-blue-500 my-8">
          Snap & Sell List Car
        </h2>

        <Skeleton className="col-span-2 py-6 rounded-sm" />
        <Skeleton className="col-span-2 py-6 rounded-sm" />
        <Skeleton className="col-span-2 py-6 rounded-sm" />
        <Skeleton className="col-span-2 py-6 rounded-sm" />
        <Skeleton className="col-span-2 py-6 rounded-sm" />
        <Skeleton className="col-span-2 py-6 rounded-sm" />
      </div>
    );
  }

  return (
    <div className=" py-4">
      <div className=" grid col-span-6 md:col-span-12 space-y-1 ">
        <h4 className="text-sm font-medium leading-none col-span-6">
          Specifications
        </h4>
        <p className="text-sm text-muted-foreground col-span-4">
          These specification are generated from our machine learning model
          based on your photo.
        </p>
      </div>
      <div className="grid grid-cols-6 gap-4 py-4">
        {highScoresArray.map(([key, value], index) => (
          <StatisticCard key={index} keyName={key} value={value} />
        ))}
      </div>
    </div>
  );
};

export default CarSpecs;
