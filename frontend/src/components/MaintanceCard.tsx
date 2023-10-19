import React, { useState, useEffect } from "react";
import {
  ChevronDownIcon,
  CircleIcon,
  PlusIcon,
  StarIcon,
} from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface MaintenanceCardProps {
  eventTitle: string;
  eventContext: string;
  blockchainConfirmation: string;
  eventDate: string;
}

const MaintenanceCard: React.FC<MaintenanceCardProps> = ({
  eventTitle,
  eventContext,
  blockchainConfirmation,
  eventDate,
}) => {
  return (
    <Card className="my-6 bg-muted-foreground/10">
      <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>{eventTitle}</CardTitle>
          <CardDescription>{eventContext}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <CircleIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
            {blockchainConfirmation}
          </div>

          <div>{eventDate}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceCard;
