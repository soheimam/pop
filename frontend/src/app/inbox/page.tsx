"use client";
import React from "react";
import InboxItem from "@/components/InboxItem";

const messages = [
  {
    id: "1",
    title: "Alice Johnson",
    email: "dummy.text1@example.com",
    avatarSrc: "https://github.com/alicej.png",
    fallbackText: "AJ",
  },
  {
    id: "2",
    title: "Bob Smith",
    email: "dummy.text2@example.com",
    avatarSrc: "https://github.com/bobs.png",
    fallbackText: "BS",
  },
  {
    id: "3",
    title: "Boo URNS",
    email: "dummy.text2@example.com",
    avatarSrc: "https://github.com/bobs.png",
    fallbackText: "BS",
  },
];

function Page({ params }: { params: { id: string } }) {
  // If the profile is not found, display a message
  console.log(params, "messages");

  return (
    <main className="py-4 ">
      <h2 className=" max-w-[200px]   pb-2 text-3xl font-semibold tracking-tight transition-colors  text-blue-500 my-8">
        Inbox
      </h2>
      <ul className=" grid grid-cols-6 py-4 gap-4">
        {messages.map((message) => (
          <InboxItem
            key={message.id}
            title={message.title}
            email={message.email}
            avatarSrc={message.avatarSrc}
            fallbackText={message.fallbackText}
            id={message.id}
          />
        ))}
      </ul>
    </main>
  );
}

export default Page;
