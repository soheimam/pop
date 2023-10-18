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
  const { id } = params;
  const { xmtpClient } = useXmtpProvider();
  const [conversation, setConversation] = useState<any>(null);
  const [messagesInConversation, setMessagesInConversation] = useState<any>([]);

  /*
    get all of the conversations
  */
  const fetchConvos = async () => {
    // find any convo with car owner
    const convo = (await xmtpClient.conversations.list()).find(
      (convo: any) => convo.peerAddress === `${id}`
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
    }
  }, [conversation]);

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
                  message.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {message.content}
              </div>
            ))
          : null}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (inputLength === 0) return;
          // setMessages([
          //   ...messages,
          //   {
          //     role: "user",
          //     content: input,
          //   },
          // ]);
          setInput("");
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
