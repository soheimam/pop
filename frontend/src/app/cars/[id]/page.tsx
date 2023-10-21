"use client";

import Image from "next/image";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useXmtpProvider } from "@/app/(context)/xmtpContext";
import MessageSeller from "@/components/chat/SendMessageModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

// import { SendMessage } from "@/components/SendMessage";
// import { useConversations } from "@xmtp/react-sdk";

import BidRow from "@/components/BidRow";

import MaintenanceCard from "@/components/MaintanceCard";
import AddToFavorites from "@/components/AddToFavourites";

const mockData = [
  {
    avatarSrc: "https://github.com/bobs.png",
    avatarFallback: "fall back",
    address: "0x001",
    price: "$12,000",
  },
  {
    avatarSrc: "https://github.com/alice.png",
    avatarFallback: "fall back",
    address: "0x002",
    price: "$15,000",
  },
  {
    avatarSrc: "https://github.com/eve.png",
    avatarFallback: "fall back",
    address: "0x003",
    price: "$18,000",
  },
  {
    avatarSrc: "https://github.com/mallory.png",
    avatarFallback: "fall back",
    address: "0x004",
    price: "$21,000",
  },
];
const dummyCarData = [
  {
    eventTitle: "Engine Maintenance",
    eventContext: "Oil Change",
    blockchainConfirmation: "Confirmed on Block12345",
    eventDate: "05.05.2023",
  },
  {
    eventTitle: "Tire Replacement",
    eventContext: "Replaced all four tires",
    blockchainConfirmation: "Confirmed on Block12346",
    eventDate: "06.05.2023",
  },
  {
    eventTitle: "Brake Inspection",
    eventContext: "Brake pads replaced",
    blockchainConfirmation: "Confirmed on Block12347",
    eventDate: "07.05.2023",
  },
  {
    eventTitle: "Engine Maintenance",
    eventContext: "Oil Change",
    blockchainConfirmation: "Confirmed on Block12345",
    eventDate: "05.05.2023",
  },
  {
    eventTitle: "Tire Replacement",
    eventContext: "Replaced all four tires",
    blockchainConfirmation: "Confirmed on Block12346",
    eventDate: "06.05.2023",
  },
  {
    eventTitle: "Brake Inspection",
    eventContext: "Brake pads replaced",
    blockchainConfirmation: "Confirmed on Block12347",
    eventDate: "07.05.2023",
  },
];

export interface IMessageDetails {
  to: string;
  conversation: any;
}

function Page({ params }: { params: { id: string } }) {
  const { xmtpClient } = useXmtpProvider();
  // If the car is not found, display a message
  const [selectedTab, setSelectedTab] = useState("auction");
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({});
  const [conversations, setConversations] = useState<any>([]);

  //TODO: Replace this with address from tableland user table
  const [carOwnerAddress, setCarOwnerAddress] = useState(
    "0x773660A24E683AA999bAe850ddF1B13B2b233135"
  );

  /*
    We want to check if we have an open convo with the seller of the car
  */
  const fetchConvos = async () => {
    // find any convo with car owner
    const convo = (await xmtpClient.conversations.list()).find(
      (convo: any) => convo.peerAddress === `${carOwnerAddress}`
    );
    console.log(convo);
    setConversations(convo);
  };

  /*
    Init all convos and filter for convo with car owner
  */
  useEffect(() => {
    if (xmtpClient) {
      fetchConvos();
    }
  }, [xmtpClient]);

  const { id } = params;

  useEffect(() => {
    const _fetch = async () => {
      const data = await fetch(`/cars/${id}`, {
        method: "GET",
        headers: {},
      });
      console.log(data);
      const jsonData = await data.json();
      console.log(jsonData);
      //TODO: we weren't doing anything with loading and content
      setContent(jsonData.tokens);
      setLoading(false);
    };
    _fetch();
  }, []);

  const squares = Array(1).fill(null);
  return (
    <main>
      <div className="grid grid-cols-6  gap-4">
        {squares.map((square) => (
          <div
            key={square}
            className="bg-gray-700 p-12 rounded-md col-span-6 h-96"
          ></div>
        ))}
      </div>
      <div className="grid grid-cols-6  gap-4">
        <div className="col-start-1 col-span-3 ">
          <h3 className="mt-5 scroll-m-20 text-2xl font-semibold tracking-tight text-blue-800 ">
            {id}
          </h3>

          <div className="flex">
            <Image src="/engine.svg" height={20} width={20} alt="engine icon" />
            <p className="ml-2 text-blue-400 text-small">automatic</p>
          </div>
        </div>
        <div className="col-start-5 col-span-2 self-end">
          <AddToFavorites carTokenId={+id} />
        </div>
      </div>
      <div className="grid grid-cols-6  gap-4">
        <div className="col-span-6 ">
          <h4 className="mt-6 mb-2 text-xl font-semibold tracking-tight text-blue-800">
            Description
          </h4>

          <p className=" text-blue-400 text-small">
            More practical than the Ceed hatchback and more stylish than the
            Ceed Sportswagon estate, the Proceed is a good-looking and
            individual choice with a premium vibe, eye-catching styling,
            generous equipment levels and that confidence-inspiring seven-year
            warranty. It drives pretty well too.
          </p>
        </div>
        <div className="col-start-1 col-span-2">
          <Button key={"buyout"}>Buy</Button>
        </div>
        <div className="col-start-3 col-span-4">
          <MessageSeller to={carOwnerAddress} conversation={conversations} />
        </div>
      </div>
      <div className="">
        <h4 className="mt-8 mb-2 text-xl font-semibold tracking-tight text-blue-800">
          Purchase Details
        </h4>
      </div>

      <Tabs defaultValue="auction" className="w-full my-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="auction">Auction</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="auction">
          <h4 className="mt-6 mb-2 text-xl font-semibold tracking-tight text-blue-800">
            Your Bid
          </h4>
          <div className="flex w-full  items-center space-x-2 my-5  py-6 justify-center text-white rounded-md bg-blue-950">
            <Input
              className=" border-0 w-3/5"
              type="text"
              placeholder="Place your bid"
            />
            <Button variant="secondary" type="submit">
              Place Bid
            </Button>
          </div>
          <h4 className="mt-6 mb-2 text-xl font-semibold tracking-tight text-blue-800">
            Top Bidders
          </h4>
          {mockData.map((data, index) => (
            <BidRow
              key={index}
              index={index}
              avatarSrc={data.avatarSrc}
              avatarFallback={data.avatarFallback}
              address={data.address}
              price={data.price}
            />
          ))}
        </TabsContent>
        <TabsContent value="history">
          <h4 className="mt-6 mb-2 text-xl font-semibold tracking-tight text-center text-blue-800">
            Verified History
          </h4>

          {dummyCarData.map((data, index) => (
            <MaintenanceCard
              key={index}
              eventTitle={data.eventTitle}
              eventContext={data.eventContext}
              blockchainConfirmation={data.blockchainConfirmation}
              eventDate={data.eventDate}
            />
          ))}
        </TabsContent>
      </Tabs>
    </main>
  );
}
export default Page;
