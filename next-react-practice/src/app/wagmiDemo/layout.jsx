'use client'
import { WagmiProvider } from "wagmi"
import { wagmiConfig } from "@/config/wagmiConfig"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export default function WagmiLayout({children}){
  const queryClient = new QueryClient()
  return(
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}