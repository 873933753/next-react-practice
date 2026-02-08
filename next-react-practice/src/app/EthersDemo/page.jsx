import { ethers } from 'ethers';

const SEPOLIA_URL  = process.env.NEXT_PUBLIC_RPC_URL;
const MAINNET_URL = process.env.MAINNET_RPC_URL;
export default function EthersDemo(){
  // 连接以太坊
  // const provider = ethers.getDefaultProvider();
  // Provider不接触用户私钥，只能读取链上信息，不能写入

  // 连接以太坊主网
  const providerETH = new ethers.JsonRpcProvider(MAINNET_URL)
  // 连接Sepolia测试网
  const providerSepolia = new ethers.JsonRpcProvider(SEPOLIA_URL)

  /* 读取链上数据 */
  // 1、getBalance余额
  const ethersGetBalance = async() => {
    const balance = await providerETH.getBalance(`vitalik.eth`)
    const balanceSepolia = await providerSepolia.getBalance(`0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`);
    // 将余额输出在console（主网）
    console.log(`ETH Balance of vitalik: ${ethers.formatEther(balance)} ETH`);
    // 输出Sepolia测试网ETH余额
    console.log(`Sepolia ETH Balance of vitalik: ${ethers.formatEther(balanceSepolia)} ETH`);
  }

  ethersGetBalance()

  // 2、查询连接到的链 - getNetwork,homestead代表ETH主网
  const getNetWorkEthers = async() => {
    const network = await providerETH.getNetwork();
    console.log('链接网络：'+ JSON.stringify(network));
  }
  getNetWorkEthers()

  // 3、getBlockNumber()查询当前区块高度
  const getBlockNumber = async() => {
    const blockNumber = await providerETH.getBlockNumber();
    console.log('区块高度：'+blockNumber);
  }
  getBlockNumber()

  return(
    <div>
      ethers
    </div>
  )
}