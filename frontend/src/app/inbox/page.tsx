"use client";
import React, { useEffect, useState } from "react";
import InboxItem from "@/components/InboxItem";
import { useXmtpProvider } from "../(context)/xmtpContext";

function Page({ params }: { params: { id: string } }) {
  const dummyAvatars = [
    "https://github.com/alicej.png",
    "https://github.com/bobs.png",
    "https://github.com/alicej.png",
    "https://github.com/bobs.png",
  ];

  function getRandomNumberBetween0And4(): number {
    return Math.floor(Math.random() * 5);
  }

  console.log(getRandomNumberBetween0And4());

  // If the profile is not found, display a message
  console.log(params, "messages");
  const { xmtpClient } = useXmtpProvider();
  const [conversations, setConversations] = useState([]);

  /*
    get all of the conversations
  */
  const fetchConvos = async () => {
    // find any convo with car owner
    const convos = await xmtpClient.conversations.list();
    console.log(convos);
    setConversations(convos);
  };

  /*
    Init all convos and filter for convo with car owner
  */
  useEffect(() => {
    if (xmtpClient) {
      fetchConvos();
    }
  }, [xmtpClient]);

  // let's get all of the conversations for our inbox ...

  return (
    <main className="py-4 ">
      <h2 className=" max-w-[200px] pb-2 text-3xl font-semibold tracking-tight transition-colors  text-blue-500 my-8">
        Inbox test
      </h2>
      <ul className=" grid grid-cols-6 py-4 gap-4 overflow-x-scroll overflow-y-scroll">
        {conversations.map((convo: any, index: number) => (
          <InboxItem
            key={index}
            peerAddress={convo.peerAddress}
            email={convo.topic}
            fallbackText={`${index}`}
            avatarSrc={dummyAvatars[getRandomNumberBetween0And4()]}
            id={`${index + 1}`}
          />
        ))}
      </ul>
    </main>
  );
}

export default Page;
