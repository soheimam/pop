import { CustomWeb3Connector } from "./Web3Connector";
import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { TorusWalletConnectorPlugin } from "@web3auth/torus-wallet-connector-plugin";

const name = "PepeAuth";
const iconUrl =
  "https://pbs.twimg.com/profile_images/1651688795429822464/cmDeEncE_400x400.jpg";

export const rainbowWeb3AuthConnector = ({ chains }: any) => {
  // Create Web3Auth Instance
  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x" + chains[0].id.toString(16),
    rpcTarget: chains[0].rpcUrls.default.http[0], // This is the public RPC we have added, please pass on your own endpoint while creating an app
    displayName: chains[0].name,
    tickerName: chains[0].nativeCurrency?.name,
    ticker: chains[0].nativeCurrency?.symbol,
    blockExplorer: chains[0].blockExplorers?.default.url[0],
  };
  const web3AuthInstance = new Web3Auth({
    projectId: "web3auth.io",
    clientId:
      "BLnARNdBdBbMk-5xiFCf-4EYfvYnnMtVsHtt-rWyLl_-Yy8TYIkjPCNqlfrScHf25_MMbUQ4YURHvM2hKYEl6tQ",
    chainConfig,
    uiConfig: {
      theme: { primary: "#00a8ff" },
      loginMethodsOrder: ["facebook", "google"],
      defaultLanguage: "en",
      // appLogo: "",
      modalZIndex: "2147483647",
    },
    web3AuthNetwork: "sapphire_devnet",
  });

  // Add openlogin adapter for customisations
  const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig },
  });
  const openloginAdapterInstance = new OpenloginAdapter({
    privateKeyProvider,
    adapterSettings: {
      network: "sapphire_devnet",
      uxMode: "popup",
      whiteLabel: {
        appName: "OpenLoginAdapter",
        logoLight: "",
        logoDark: "",
        defaultLanguage: "en",
        // dark: true, // whether to enable dark mode. defaultValue: false
      },
    },
  });
  web3AuthInstance.configureAdapter(openloginAdapterInstance);

  // Add Torus Wallet Plugin
  const torusPlugin = new TorusWalletConnectorPlugin({
    torusWalletOpts: {
      buttonPosition: "bottom-left",
    },
    walletInitOptions: {
      whiteLabel: {
        theme: { isDark: false, colors: { primary: "#00a8ff" } },
        logoDark: iconUrl,
        logoLight: iconUrl,
      },
      useWalletConnect: true,
      enableLogging: true,
    },
  });
  web3AuthInstance.addPlugin(torusPlugin);
  return {
    id: "Custom Web3 Connector",
    name,
    iconUrl,
    iconBackground: "#fff",
    createConnector: () => {
      const connector = new CustomWeb3Connector({
        chains: chains,
        options: {
          web3AuthInstance,
        },
      });
      return {
        connector,
      };
    },
  };
};
