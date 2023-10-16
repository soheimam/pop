"use client";
import React from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Page({ params }: { params: { id: string } }) {
  // If the profile is not found, display a message
  console.log(params, "profile");
  const { id } = params;

  const [messages, setMessages] = React.useState([
    {
      role: "agent",
      content: "Hi, how can I help you today?",
    },
    {
      role: "user",
      content: "Hey, I'm having trouble with my account.",
    },
    {
      role: "agent",
      content: "What seems to be the problem?",
    },
    {
      role: "user",
      content: "I can't log in.",
    },
  ]);
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

      <div className="flex-grow space-y-4 mb-4 overflow-auto">
        {messages.map((message, index) => (
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
        ))}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (inputLength === 0) return;
          setMessages([
            ...messages,
            {
              role: "user",
              content: input,
            },
          ]);
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
