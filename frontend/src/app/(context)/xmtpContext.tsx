"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@xmtp/xmtp-js";
import { ethers } from "ethers";
import { Stream } from "@xmtp/react-sdk";

// The useStreamMessages hook streams new conversation messages on mount
// and exposes an error state.
import { useStreamMessages } from "@xmtp/react-sdk";
import type { CachedConversation, DecodedMessage } from "@xmtp/react-sdk";

const AppContext = createContext({} as IXMTPProvider);

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface IXMTPProvider {
  isListenEnabled: any;
  setIsListenEnabled: any;
  xmtpClient: any;
  setXmtpClient: any;
  setXmtpStream: any;
  killXMTPStream: () => void;
  startXMTPStream: () => void;
  sendXMTPMessage: (to: string, msg: string) => void;
}

export function XmtpProvider({ children }: any) {
  // const [conversations, setConversations] = useState<Map<string, any>>(
  //   new Map()
  // );
  const [isListenEnabled, setIsListenEnabled] = useState<boolean>(false);
  const [xmtpClient, setXmtpClient] = useState<any>(null);
  const [xmtpStream, setXmtpStream] = useState<Stream<any>>();

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  async function updateConversationsAfterDelay() {}

  const runner = async () => {
    await delay(2000);
    // Your code to run after the 2-second delay goes here
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const xmtp = await Client.create(signer, {
      env: "dev",
    });
    console.log(`setting xmtp client...`);
    await setXmtpClient(xmtp);
    const allConversations = await xmtp.conversations.list();
    // let conversationsMap = new Map();
    // setConversations(conversationsMap);
    console.log(`all conversations...`);
    console.log(allConversations);

    for (const conversation of await xmtp.conversations.list()) {
      // All parameters are optional and can be omitted
      const opts = {
        // Only show messages from last 24 hours
        startTime: new Date(new Date().setDate(new Date().getDate() - 1)),
        endTime: new Date(),
      };
      const messagesInConversation = await conversation.messages(opts);
      console.log(messagesInConversation);
    }
  };

  const initListener = async () => {
    await listenForMessages(xmtpClient);
  };

  useEffect(() => {
    if (!xmtpClient) {
      runner();
    }
  }, [xmtpClient]);

  const receiveAllMessagesInConvo = async () => {
    for (const conversation of await xmtpClient.conversations.list()) {
      // All parameters are optional and can be omitted
      const opts = {
        // Only show messages from last 24 hours
        startTime: new Date(new Date().setDate(new Date().getDate() - 1)),
        endTime: new Date(),
      };
      const messagesInConversation = await conversation.messages(opts);
    }
  };

  const killXMTPStream = async () => {
    if (xmtpStream) await xmtpStream.return();
    setIsListenEnabled(false);
  };

  const startXMTPStream = async () => {
    let stream = await xmtpClient.conversations.stream();
    setIsListenEnabled(true);
    setXmtpStream(stream);
    return stream;
  };

  // const loadAllMessages = async (to: string) => {
  //   let conversatoin = await xmtpClient.conversations.list().filter((convo: any) => convo.peerAddress === to)
  //   if (conversatoin) {
  //     return await conversations.get(to).messages();
  //   } else {
  //     return "No conversation found";
  //   }
  // };

  const listenForMessages = async (xmtp: any) => {
    console.log(xmtp);
    console.log(`is xmtp defined ? ${xmtp}`);
    const conversation = await xmtp.conversations.newConversation(
      "0x937C0d4a6294cdfa575de17382c7076b579DC176"
    );
    for await (const message of await conversation.streamMessages()) {
      if (message.senderAddress === xmtp.address) {
        // This message was sent from me
        continue;
      }
      console.log(
        `New message from ${message.senderAddress}: ${message.content}`
      );
    }
    // let stream;
    // if (!isListenEnabled) {
    //   stream = await startXMTPStream();
    //   console.log(`setting stream.. ${stream}`);
    // } else {
    //   stream = xmtpStream;
    // }
    // console.log("listen for messages...");
    // for await (const conversation of stream) {
    //   console.log(`New conversation started with ${conversation.peerAddress}`);
    //   // Say hello to your new friend
    //   await conversation.send("Hi there!");
    //   console.log("sending reply in loop");
    //   // Break from the loop to stop listening
    //   //This stream will continue infinitely. To end the stream,
    //   //You can either break from the loop, or call `await stream.return()`.
    //   break;
    //   // killXMTPStream();
    // }
  };

  const sendXMTPMessage = async (to: string, msg: string) => {
    console.log("Here is the to addres " + to);
    let conversatoin = (await xmtpClient.conversations.list()).filter(
      (convo: any) => convo.peerAddress === to
    );
    if (conversatoin) {
      console.log("Sending a message with existing convo...");
      await conversatoin.send();
    } else {
      console.log("Starting a new conversation...");
      const conversation = await xmtpClient.conversations.newConversation(to);
      console.log("Sending a message...");
      await conversatoin.send();
    }
  };

  return (
    <AppContext.Provider
      value={{
        isListenEnabled,
        setIsListenEnabled,
        xmtpClient,
        setXmtpClient,
        setXmtpStream,
        killXMTPStream,
        startXMTPStream,
        sendXMTPMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useXmtpProvider() {
  return useContext(AppContext);
}
