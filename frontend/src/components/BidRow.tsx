import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BidRowProps {
  avatarSrc: string;
  avatarFallback: string;
  address: string;
  price: string;
  index: number;
}

const BidRow: React.FC<BidRowProps> = ({
  avatarSrc,
  avatarFallback,
  address,
  price,
  index,
}) => {
  const backgroundColor = index % 2 === 0 ? "bg-white" : "";

  return (
    <div
      className={`grid grid-cols-6 my-4 rounded-sm items-center overflow-hidden ${backgroundColor}`}
    >
      <div className="col-start-1 col-span-1">
        <Avatar>
          <AvatarImage src={avatarSrc} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
      </div>
      <p className="col-start-2 col-span-3 text-md font-medium text-blue-800 leading-none">
        {address}
      </p>
      <p className="col-start-5 text-md text-blue-800 font-bold ">{price}</p>
    </div>
  );
};

export default BidRow;
