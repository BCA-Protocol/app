"use client";
import { WagmiProvider, createConfig, http } from "wagmi";
import { arbitrum, base, bsc, optimism } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getDefaultConfig } from "connectkit";

const config = createConfig(
  getDefaultConfig({
    chains: [arbitrum, base, bsc, optimism],
    ssr: true, 
    transports: {
      [arbitrum.id]: http(),
      [base.id]: http(),
      [bsc.id]: http(),
      [optimism.id]: http(),
    },
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    appName: "BCAProtocol",

    // Optional App Info
    appDescription:
      "a web3 infrastructure designed to empower millions of internet users worldwide to directly contribute to the advancement of AI models.",
    appUrl: "https://www.bcaprotocol.org",
    appIcon:
      "https://assets-global.website-files.com/65df37b14a136ea2282aca35/65df4349f86cfdc6925358f9_bca%20-%20favicon-transparent.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};
