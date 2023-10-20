"use client";
import React from "react";
import {
  connectorsForWallets,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";

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
const { connectors } = getDefaultWallets({
  appName: "POP",
  projectId: "2fd65f52a50707f4ea6190f3fc7c3e36",
  chains,
});

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
