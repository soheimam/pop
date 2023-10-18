import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface InboxItemProps {
  peerAddress: string;
  email: string;
  avatarSrc: string;
  fallbackText: string;
  id: string;
}

function InboxItem({
  peerAddress,
  email,
  avatarSrc,
  fallbackText,
  id,
}: InboxItemProps) {
  return (
    <Link className="col-span-6" href={`/inbox/${peerAddress}`} passHref>
      <li
        className="bg-blue-100 rounded-md p-4 flex cursor-pointer w-full"
        style={{ minWidth: "max-content" }}
      >
        <div className="relative ">
          <Avatar>
            <AvatarImage src={avatarSrc} />
            <AvatarFallback>{fallbackText}</AvatarFallback>
          </Avatar>
          {id === "1" && (
            <span className="z-20 absolute top-0 right-0 bg-green-500 p-2 h-2 rounded-full animate-ping"></span>
          )}
        </div>

        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">{peerAddress}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </li>
    </Link>
  );
}

export default InboxItem;
