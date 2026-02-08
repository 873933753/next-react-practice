import Web3Providers from "@/app/components/Web3Providers";

export default function ConnectRPCLayout({children}){
  return(
    <Web3Providers>
      {children}
    </Web3Providers>
  )
}