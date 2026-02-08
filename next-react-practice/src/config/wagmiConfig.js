import { createConfig, http, injected } from "wagmi";
import { sepolia } from 'wagmi/chains';
import { walletConnect } from "wagmi/connectors";

// 2、修改RPC节点的连接
const USE_CUSTOM_RPC = true; // 是否使用自定义的RPC节点，否则使用自带的
const sepoliaConfig = USE_CUSTOM_RPC ? {
  ...sepolia,
  rpcUrls:{
    default: { http: [process.env.NEXT_PUBLIC_RPC_URL] },
    public: { http: [process.env.NEXT_PUBLIC_RPC_URL] }
  }
}:mainnet

const transports = USE_CUSTOM_RPC ? {
  [sepolia.id]  : http(process.env.NEXT_PUBLIC_RPC_URL)
}:{
  [sepolia.id]: http()
}

// 3、walletConnect二维码连接 - 注册reown
const connectors = [
  injected(), //浏览器插件注入方式
  walletConnect({ //扫码连接
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    showQrModal: true,
    metadata: {
      name: 'lucky', // 必选：DApp 名称
      description: 'lucky Website', // 可选：描述
      url: 'https://learn-web3-frontend.com',// 必选：DApp 官网地址
      icons: ['https://avatars.githubusercontent.com/u/37784886'] // 必选：图标 URL 数组 256*256
    }
  })
]


// 1、创建并导出新的wagmi配置
export const wagmiConfig = createConfig({
  chains: [sepoliaConfig],
  transports,
  connectors,
  ssr:true // 服务端渲染
})

// 3、Provider包裹