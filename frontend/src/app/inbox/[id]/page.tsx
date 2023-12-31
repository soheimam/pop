"use client";
import React from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useXmtpProvider } from "@/app/(context)/xmtpContext";

function Page({ params }: { params: { id: string } }) {
  // If the profile is not found, display a message
  console.log(params, "profile");
  const { id: peerAddress } = params;
  const { xmtpClient } = useXmtpProvider();
  const [conversation, setConversation] = useState<any>(null);
  const [messagesInConversation, setMessagesInConversation] = useState<any>([]);
  const [refreshConvo, setRefreshConvo] = useState<any>(false);

  const messageSellerAction = async (
    message: string,
    to: string,
    conversation: any
  ) => {
    let actionConvo = conversation;
    // if we found no conversation it's a new one... so create it
    if (actionConvo == null) {
      actionConvo = await xmtpClient.conversations.newConversation(to);
    }
    // now we are guarenteed to haev a conversation, prepare the message
    console.log(`preparing the message to send ...`);
    const preparedTextMessage = await actionConvo.prepareMessage(message);

    // now try and send the message
    try {
      console.log(`trying to send message...`);
      preparedTextMessage.send();
      console.log(`message send successfully `);
    } catch (e) {
      // handle error, enable canceling and retries (see below)
      console.error("Error sending message... ");
      console.error(e);
    }
  };

  /*
    get all of the conversations
  */
  const fetchConvos = async () => {
    // find any convo with car owner
    const convo = (await xmtpClient.conversations.list()).find(
      (convo: any) => convo.peerAddress === `${peerAddress}`
    );
    console.log(convo);
    setConversation(convo);
  };

  const fetchMessages = async () => {
    const opts = {
      // Only show messages from last 24 hours
      startTime: new Date(new Date().setDate(new Date().getDate() - 100)),
      endTime: new Date(),
    };
    const messagesInConversation = await conversation.messages(opts);
    console.log(`messages in convo...`);
    console.log(messagesInConversation);
    setMessagesInConversation(messagesInConversation);
  };

  /*
    Init all convos and filter for convo with car owner
  */
  useEffect(() => {
    if (xmtpClient) {
      fetchConvos();
    }
  }, [xmtpClient]);

  useEffect(() => {
    if (conversation) {
      fetchMessages();
      setRefreshConvo(false);
    }
  }, [conversation, refreshConvo]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Your code to run every 5 seconds goes here
      setRefreshConvo(true);
    }, 5000);

    // Cleanup: Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this useEffect runs once when the component mounts

  const [input, setInput] = React.useState("");

  const inputLength = input.trim().length;

  return (
    <main className="flex flex-col min-h-[60vh] p-4">
      <div className="mb-4">
        <Link href="/inbox" passHref>
          <Button variant="ghost" className="mb-4">
            Back to Inbox
          </Button>
        </Link>
      </div>

      <div className="space-y-4 mb-4 overflow-auto max-h-[12rem]">
        {messagesInConversation.length >= 0
          ? messagesInConversation.map((message: any, index: number) => (
              <div
                key={index}
                className={cn(
                  "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                  message.senderAddress === peerAddress
                    ? "bg-muted"
                    : "ml-auto bg-primary text-primary-foreground"
                )}
              >
                {message.content}
              </div>
            ))
          : null}
      </div>
      {/* [0].conversation.peerAddress */}
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (inputLength === 0) return;
          await messageSellerAction(input, peerAddress, conversation);
          setInput("");
          setRefreshConvo(true);
        }}
        className="flex w-full items-center space-x-2 mt-4"
      >
        <Input
          id="message"
          placeholder="Type your message..."
          className="flex-1 p-2"
          autoComplete="off"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <Button type="submit" size="icon" disabled={inputLength === 0}>
          <PaperPlaneIcon className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </main>
  );
}

export default Page;
