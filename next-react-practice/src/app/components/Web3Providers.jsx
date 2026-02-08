'use client'

import '@rainbow-me/rainbowkit/styles.css';
import { WagmiProvider } from "wagmi"
import { wagmiConfig } from "@/config/wagmiConfig"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { useState } from 'react';

export default function Web3Providers({children}){
  const queryClient = new QueryClient()

  return(
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}