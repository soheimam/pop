// Import Push SDK & Ethers
import { PushAPI } from "@pushprotocol/restapi";
import { ethers } from "ethers";

// Creating a random signer from a wallet, ideally this is the wallet you will connect
const signer = ethers.Wallet.createRandom();

// Initialize wallet user, pass 'prod' instead of 'staging' for mainnet apps
const userAlice = await PushAPI.initialize(signer, { env: "staging" });

// List inbox notifications
const inboxNotifications = await userAlice.notification.list("INBOX");

// List spam notifications
const spamNotifications = await userAlice.notification.list("SPAM");

// Push channel address
const pushChannelAdress = "0xB88460Bb2696CAb9D66013A05dFF29a28330689D";

// Subscribe to push channel
await userAlice.notification.subscribe(
  `eip155:5:${pushChannelAdress}` // channel address in CAIP format
);

// Send notification, provided userAlice has a channel
const response = await userAlice.channel.send(["*"], {
  notification: {
    title: "You awesome notification",
    body: "from your amazing protocol",
  },
});

// To listen to real time notifications
userAlice.stream.on("STREAM.NOTIF", (data) => {
  console.log(data);
});
