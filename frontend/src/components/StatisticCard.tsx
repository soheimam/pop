import React from "react";

interface StatisticCard {
  keyName: string;
  value: any;
}
function StatisticCard({ keyName, value }: StatisticCard) {
  return (
    <article className="bg-primary/10 py-6 px-4 col-span-2 rounded-sm overflow-hidden">
      <div>
        <p className="text-lg text-blue-700 dark:text-gray-400">{keyName}</p>

        <p className="text-sm font-medium text-blue-950 dark:text-white">
          {value}
        </p>
      </div>
    </article>
  );
}

export default StatisticCard;
