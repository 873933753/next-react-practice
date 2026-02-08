import { http, createConfig, cookieStorage, createStorage } from 'wagmi'
import { mainnet, sepolia, goerli, polygon } from 'wagmi/chains'
import { metaMask } from 'wagmi/connectors/metaMask'
import { walletConnect } from 'wagmi/connectors/walletConnect'

// 1. 定义支持的链（按需增减）
const supportedChains = [mainnet, sepolia, goerli, polygon]

// 2. 创建存储（用于持久化钱包连接状态，可选）
const storage = createStorage({
  storage: cookieStorage, // 也可以用 localStorage: createStorage({ storage: localStorage })
})

// 3. 完整的 createConfig 配置
export const config = createConfig({
  // ========== 核心必配项 ==========
  // 1. 链配置：指定你的 DApp 支持的区块链网络
  chains: supportedChains,
  // 2. 传输层：指定与链交互的 RPC 方式（http 是最基础的，也可以用 webSocket）
  transports: {
    // 为每个链配置 RPC 传输（key 是链 ID）
    [mainnet.id]: http('https://mainnet.infura.io/v3/你的Infura ID'), // 主网 RPC
    [sepolia.id]: http('https://sepolia.infura.io/v3/你的Infura ID'), // Sepolia 测试网
    [goerli.id]: http('https://goerli.infura.io/v3/你的Infura ID'),   // Goerli 测试网
    [polygon.id]: http('https://polygon-mainnet.infura.io/v3/你的Infura ID'), // 多边形主网
  },

  // ========== 常用可选配置 ==========
  // 1. 连接器：配置支持的钱包（MetaMask + WalletConnect v2）
  connectors: [
    // MetaMask 连接器
    metaMask({
      chains: supportedChains,
      options: {
        shimDisconnect: true, // 修复 MetaMask 断开连接的兼容性问题
      },
    }),
    // WalletConnect v2 连接器（必配 projectId）
    walletConnect({
      chains: supportedChains,
      options: {
        projectId: '你的 WalletConnect Project ID', // 从 WC 官网申请
        metadata: {
          name: '我的 DApp',
          description: '基于 wagmi v2 的 DApp',
          url: 'https://mydapp.com', // 你的 DApp 域名
          icons: ['https://mydapp.com/icon-256x256.png'], // DApp 图标 URL
        },
        showQrModal: true, // 自动显示 WalletConnect 扫码弹窗
      },
    }),
  ],

  // 2. 存储：持久化钱包连接状态（刷新页面后不丢失）
  storage: storage,

  // 3. 多链默认配置
  multicall: {
    // 为不同链配置 multicall 合约地址（wagmi 已内置常用链，可省略）
    // 作用：批量调用合约方法，减少 RPC 请求次数
    contracts: {
      [mainnet.id]: { address: '0xca11bde05977b3631167028862be2a173976ca11' },
      [polygon.id]: { address: '0x1e19cf2d73a72ef1332c882f20534b6519be0276' },
    },
  },

  // 4. 缓存配置：控制数据缓存时间（优化性能）
  cacheTime: 30_000, // 缓存有效期 30 秒（默认 30s）

  // 5. 批量请求配置：合并多个相似请求（减少 RPC 调用）
  batch: {
    multicall: true, // 启用 multicall 批量处理
    dedupe: true,    // 去重相同的请求
  },

  // 6. 日志配置：调试用（生产环境建议关闭）
  ssr: false, // 是否开启服务端渲染适配（Next.js 等框架需设为 true）
  logger: {
    warn: (message) => console.warn('[wagmi warn]', message),
    error: (message) => console.error('[wagmi error]', message),
  },
})

// 4. 在 React 应用中挂载配置（根组件）
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 创建 react-query 客户端（wagmi 依赖 react-query 管理异步数据）
const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {/* 你的应用组件 */}
      </QueryClientProvider>
    </WagmiProvider>
  )
}