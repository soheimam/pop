import React from "react";

interface StatisticCard {
  keyName: string;
  value: any;
}
function StatisticCard({ keyName, value }: StatisticCard) {
  return (
    <article className="bg-primary/10 py-6 px-4 col-span-2 rounded-sm">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{keyName}</p>

        <p className="text-2xl font-medium text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </article>
  );
}

export default StatisticCard;
