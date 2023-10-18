import { findUserOfTokenId } from "./tableland";
import { Client } from "@xmtp/xmtp-js";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const xmtpMessageSeller = async (
  tokenId: number,
  message: string,
  signer: any
) => {
  if (!signer) {
    console.log("No signer, cannot perform XMTP chat");
  }
  // let sellerDetails = await findUserOfTokenId(tokenId);
  // console.log(sellerDetails);
  // letawait wallet.connect(wallet.getAddress());
  const xmtp = await Client.create(signer, { env: "dev" });
  const conversation = await xmtp.conversations.newConversation(
    "0x937C0d4a6294cdfa575de17382c7076b579DC176" // replace with sellerDetails.address
  );
  const stream = await xmtp.conversations.stream();
  // Load all messages in the conversation
  const messages = await conversation.messages();
  console.log("loading all messages");
  console.log(messages);
  // Send a message

  for await (const conversation of stream) {
    console.log(`New conversation started with ${conversation.peerAddress}`);
    // Say hello to your new friend
    await conversation.send("Hi there!");
    console.log("sending reply in loop");
    // Break from the loop to stop listening
    //This stream will continue infinitely. To end the stream,
    //You can either break from the loop, or call `await stream.return()`.
    break;
  }

  console.log("Sending message");

  // // Listen for new messages in the conversation
  // for await (const message of await conversation.streamMessages()) {
  //   console.log(message);
  //   console.log(`[${message.senderAddress}]: ${message.content}`);
  // }
  // return sellerDetails;
};

export const sendAMessage = async (message: string, conversation) => {
  let sendResult = await conversation.send(message);
  console.log("listening for messages");
  console.log(sendResult);
};
