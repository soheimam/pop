"use client";
import React from "react";
import {
  connectorsForWallets,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  walletConnectWallet,
  rainbowWallet,
  metaMaskWallet,
} from "@rainbow-me/rainbowkit/wallets";
import {
  arbitrum,
  mainnet,
  optimism,
  polygon,
  base,
  zora,
  polygonMumbai,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { rainbowWeb3AuthConnector } from "./RainbowKitConnector";
// import { PrivyWagmiConnector } from "@privy-io/wagmi-connector";

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base, zora, polygonMumbai],
  [publicProvider()]
);
declare global {
  interface Window {
    ethereum?: any;
  }
}
const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      rainbowWallet({ chains, projectId: "2fd65f52a50707f4ea6190f3fc7c3e36" }),
      walletConnectWallet({
        chains,
        projectId: "2fd65f52a50707f4ea6190f3fc7c3e36",
      }),
      metaMaskWallet({ chains, projectId: "2fd65f52a50707f4ea6190f3fc7c3e36" }),
      rainbowWeb3AuthConnector({ chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
  connectors,
});

const WagmiProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
    </WagmiConfig>
  );
};

export default WagmiProvider;
