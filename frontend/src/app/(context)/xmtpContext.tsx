"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@xmtp/xmtp-js";
import { ethers } from "ethers";
import { Stream } from "@xmtp/react-sdk";

const AppContext = createContext({} as IXMTPProvider);

interface IXMTPProvider {
  conversations: Map<string, any>;
  setConversations: any;
  isListenEnabled: any;
  setIsListenEnabled: any;
  xmtpClient: any;
  setXmtpClient: any;
  setXmtpStream: any;
  killXMTPStream: () => void;
  startXMTPStream: () => void;
  sendXMTPMessage: (to: string, msg: string) => void;
  loadAllMessages: (to: string) => void;
  listenForMessages: () => void;
}

export function XmtpProvider({ children }: any) {
  const [conversations, setConversations] = useState<Map<string, any>>(
    new Map()
  );
  const [isListenEnabled, setIsListenEnabled] = useState<boolean>(false);
  const [xmtpClient, setXmtpClient] = useState<any>(null);
  const [xmtpStream, setXmtpStream] = useState<Stream<any>>();

  const init = async () => {
    const provider = new ethers.BrowserProvider(window?.ethereum);
    const xmtp = await Client.create(await provider.getSigner(), {
      env: "dev",
    });
    console.log(`setting xmtp client...`);
    await setXmtpClient(xmtp);
    await listenForMessages(xmtp);
  };

  useEffect(() => {
    init();
  }, []);

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

  const loadAllMessages = async (to: string) => {
    if (conversations.has(to)) {
      return await conversations.get(to).messages();
    } else {
      return "No conversation found";
    }
  };

  const listenForMessages = async (xmtp: any) => {
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
    if (conversations.has(to)) {
      const conversation = conversations.get(to);
      await conversation.send(msg);
    } else {
      console.log("Starting a new conversation...");
      const conversation = await xmtpClient.conversations.newConversation(to);

      let send = await conversation.send(msg);
      console.log("Send result...");
      console.log(send);
      // Create a new Map based on the previous state
      const updatedConversations = new Map(conversations);
      // Set the new key-value pair in the new Map
      updatedConversations.set(to, conversation);
      // Update the state with the new Map
      setConversations(updatedConversations);
    }
  };

  return (
    <AppContext.Provider
      value={{
        conversations,
        setConversations,
        isListenEnabled,
        setIsListenEnabled,
        xmtpClient,
        setXmtpClient,
        setXmtpStream,
        killXMTPStream,
        startXMTPStream,
        sendXMTPMessage,
        loadAllMessages,
        listenForMessages,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useXmtpProvider() {
  return useContext(AppContext);
}
