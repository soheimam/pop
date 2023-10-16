"use client";

import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ethers } from "ethers";
import { xmtpMessageSeller } from "@/lib/xmtp";
import { useXmtpProvider } from "@/app/(context)/xmtpContext";
import { SendMessage } from "@/components/SendMessage";
import { useConversations } from "@xmtp/react-sdk";
import { StartConversation } from "@/components/StartANewConversation";

function Page({ params }: { params: { id: string } }) {
  // If the car is not found, display a message

  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({});
  // const { sendXMTPMessage, listenForMessages } = useXmtpProvider();
  const [renderSendMessage, setRenderSendMessage] = useState(false);
  const { conversations, error, isLoading } = useConversations();
  const [carOwnerAddress, setCarOwnerAddress] = useState(
    "0x937C0d4a6294cdfa575de17382c7076b579DC176"
  );

  const { id } = params;

  useEffect(() => {
    const _fetch = async () => {
      const data = await fetch(`/cars/${id}`, {
        method: "GET",
        headers: {},
      });
      console.log(data);
      const jsonData = await data.json();
      setContent(jsonData.tokens);
      setLoading(false);
    };
    _fetch();
  }, []);

  const squares = Array(3).fill(null);
  return (
    <main>
      {/* if user clicks send message and there is already a conversation with this person cached */}
      {renderSendMessage &&
      conversations.find(
        (conversation) => conversation.peerAddress == carOwnerAddress
      ) ? (
        <SendMessage
          conversation={
            conversations.find(
              (conversation) => conversation.peerAddress == carOwnerAddress
            )!
          }
        />
      ) : (
        <SendMessage
          conversation={
            conversations.find(
              (conversation) => conversation.peerAddress == carOwnerAddress
            )!
          }
          newConvoPeerAddress={carOwnerAddress}
        />
      )}

      <div className="grid grid-cols-6 md:grid-cols-12 gap-4">
        <div className="col-span-6 md:col-span-12 bg-gray-700 p-24 rounded-md"></div>

        {squares.map((square) => (
          <div
            key={square}
            className="bg-gray-700 p-12 rounded-md col-span-2 md:col-span-4"
          ></div>
        ))}
      </div>
      <div className="grid grid-cols-6 md:grid-cols-12 gap-4">
        <div className="col-span-6 md:col-span-12">
          <h3 className="mt-5 scroll-m-20 text-2xl font-semibold tracking-tight text-blue-800 ">
            {id}
          </h3>
          <div className="flex">
            <Image src="/engine.svg" height={20} width={20} alt="engine icon" />
            <p className="ml-2 text-blue-400 text-small">automatic</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-6 md:grid-cols-12 gap-4">
        <div className="col-span-6 md:col-span-12">
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
      </div>

      <div className="">
        <h4 className="mt-8 mb-2 text-xl font-semibold tracking-tight text-blue-800">
          Purchase Details
        </h4>
        <div className="flex gap-x-3">
          <Button
            key={"send msg"}
            onClick={async () => {
              setRenderSendMessage(true);
              // // await listenForMessages();
            }}
          >
            Message Seller
          </Button>
          <Button key={"bid"}>Place Bid</Button>
          <Button key={"buyout"}>Buyout</Button>
        </div>
      </div>

      <div className="grid grid-cols-6 md:grid-cols-12 gap-4">
        <h4 className="mt-8 mb-2 text-xl font-semibold tracking-tight text-blue-800 col-span-2 col-start-1">
          Confirmed Details
        </h4>

        <Accordion
          type="single"
          collapsible
          className="col-span-6 col-start-1 bg-white rounded-md p-4"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is it styled?</AccordionTrigger>
            <AccordionContent>
              Yes. It comes with default styles that matches the other
              components&apos; aesthetic.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is it animated?</AccordionTrigger>
            <AccordionContent>
              Yes. It's animated by default, but you can disable it if you
              prefer.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </main>
  );
}

export default Page;
