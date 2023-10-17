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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

// import { SendMessage } from "@/components/SendMessage";
// import { useConversations } from "@xmtp/react-sdk";
import { useXmtpProvider } from "@/app/(context)/xmtpContext";
import BidRow from "@/components/BidRow";

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

function Page({ params }: { params: { id: string } }) {
  // If the car is not found, display a message

  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({});
  // const { sendXMTPMessage, listenForMessages } = useXmtpProvider();
  const [renderSendMessage, setRenderSendMessage] = useState(false);
  // const { conversations, error, isLoading } = useConversations(); // THIS HOOK WILL THROW KEYSTORE ERROR
  const [carOwnerAddress, setCarOwnerAddress] = useState(
    "0x7516e89D7111fEfaa312b58A06130F5B5DcDd01D"
  );
  const { xmtpClient } = useXmtpProvider();

  const [conversations, setConversations] = useState<any>([]);

  const fetchConvos = async () => {
    const convos = await xmtpClient.conversations.list();
    console.log(convos);
    setConversations(convos);
  };

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
      setContent(jsonData.tokens);
      setLoading(false);
    };
    _fetch();
  }, []);

  // if (isLoading) {
  //   return null;
  // }
  const squares = Array(3).fill(null);
  return (
    <main>
      {/* <SendMessage conversation={null} newConvoPeerAddress={carOwnerAddress} /> */}
      {/* if user clicks send message and there is already a conversation with this person cached */}
      {/* {renderSendMessage &&
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
      )} */}

      <div className="grid grid-cols-6 md:grid-cols-12 gap-4">
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
        <div className="flex gap-x-3 col-span-6">
          <Button
            key={"send msg"}
            onClick={async () => {
              setRenderSendMessage(true);
              if (conversations != null) {
                let doesContactExist = await conversations.find(
                  (convo: any) => convo.peerAddress == carOwnerAddress
                );

                if (!doesContactExist) {
                  doesContactExist =
                    await xmtpClient.conversations.newConversation(
                      carOwnerAddress
                    );
                }
                console.log(doesContactExist);
                const preparedTextMessage =
                  await doesContactExist.prepareMessage(
                    "I HATE YOU KEYSTORE ERROR"
                  );
                //After preparing an optimistic message, use its `send` method to send it.
                try {
                  console.log("SENDING MESSAGE");
                  preparedTextMessage.send();
                } catch (e) {
                  // handle error, enable canceling and retries (see below)
                  console.log("Error sending message... ");
                  console.log(e);
                }
                let test = await doesContactExist.send(
                  "Hello, I hate you key store!!!"
                );
                console.log(`DID THIS SEND ?`);
                console.log(test);
              }
              // // await listenForMessages();
            }}
          >
            Message Seller
          </Button>

          <Button key={"buyout"}>Buyout</Button>
        </div>
      </div>

      <div className="my-10">
        <Tabs defaultValue="auction">
          <TabsList>
            <TabsTrigger value="auction">Auction</TabsTrigger>
            <TabsTrigger value="password">Car History</TabsTrigger>
          </TabsList>
          <TabsContent value="auction">
            <h4 className="mt-6 mb-2 text-xl font-semibold tracking-tight text-blue-800">
              Your Bid
            </h4>
            <div className="flex w-full max-w-sm items-center space-x-2 my-5  py-6 justify-center text-white rounded-md bg-blue-950">
              <Input
                className="max-w-[250px] "
                type="text"
                placeholder="Place your bid"
              />
              <Button key={"bid"} variant="secondary" type="submit">
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
          <TabsContent value="Car History">
            Change your password here.
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-6 md:grid-cols-12 gap-4">
        <h4 className="mt-8 mb-2 text-xl font-semibold tracking-tight text-blue-800 col-span-2 col-start-1">
          Confirmed Details
        </h4>

        {/* <Accordion
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
        </Accordion> */}
      </div>
    </main>
  );
}

export default Page;
