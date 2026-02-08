
'use client'
/* 
client：3种
1）publicClient - 公共信息操作，获取区块链信息，获取余额等
2）walletClient -  钱包操作，交易，签名等
3）testClient - 测试客户端，测试和模拟

transport
1）http - 通过 HTTP JSON-RPC API 执行请求
2）ws - 通过 WebSocket JSON-RPC API 执行请求，如监听链上信息等
3）custom - 自定义传输，通过 EIP-1193 request 函数 执行请求

*/

import { useState } from "react"
import { createPublicClient, createWalletClient, formatEther, formatUnits, http } from "viem"
import { mainnet, sepolia } from "viem/chains"

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL

/* 1、publicClient */
function PublicClient({address}){
  const [ results, setResults ] = useState({})

  const publicClient = createPublicClient({
    chain: [sepolia],
    transport: http(RPC_URL)
  })

  /* 获取公共信息 */
  const getPublicActions = async() => {
    if(!address){
      return alert('请输入地址')
    }
    try {
      // 1) getBalance - 获取余额
      const balance = await publicClient.getBalance({
        address
      })   
      // 2）getTransactionCount - 获取账户交易数量
      const transactionCount = await publicClient.getTransactionCount({  
        address,
      })
      // 3) getBlock - 获取区块号
      const block = await publicClient.getBlock({ blockTag: 'latest' })

      // 获取链信息
      const chainId = await publicClient.getChainId()
      const blockNumber = await publicClient.getBlockNumber()

      // 返回当前的gas价格 - Wei
      const gasPrice = await publicClient.getGasPrice()

      setResults({
        publicActions:{
          address,
          transactionCount:transactionCount,
          balance:formatEther(balance),
          lastblock:block.number.toString(),
          chainId,
          blockNumber:blockNumber.toString(),
          gasPrice:formatUnits(gasPrice,9) + 'GWei'
        }
      })
    } catch (error) {
      alert(`获取失败:${error.message}`)
    }
  }
  return(
    <div>
      <h2>1、publicClient</h2>
      <button onClick={getPublicActions}>获取公共信息</button>
      {/* 结果显示 */}
      <div style={{ marginTop: '20px' }}>
        <h3>publicClient结果</h3>
        <pre style={{ 
          backgroundColor: '#1e1e1e',
          color: '#d4edda',
          padding: '20px',
          borderRadius: '8px',
          overflow: 'auto',
          maxHeight: '600px'
        }}>
          {JSON.stringify(results,null,2)}
        </pre>
      </div>
    </div>
  )
}

function isEmptyObject(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}


/* 2、WalletClient - 钱包操作 */
function WalletClient({address}){
  const [ results, setResults ] = useState({})

  const walletClient = createWalletClient({
    chain: sepolia,
    transport: http(RPC_URL)
  })
  const getWalletActions = async() => {
    if(!address){
      return alert('请输入地址')
    }
    try {
      const accounts = await walletClient.getAddresses() 
      setResults({
        walletActions:{
          accounts
        }
      }) 
    } catch (error) {
      alert(`获取失败:${error.message}`)
    }
  }
// 0x5843a8DfCadDD0C01F9Df306Eb6C130EC15997C3
  return(
    <div>
      <h2>2、walletClient</h2>
      <button onClick={getWalletActions}>获取wallet信息</button>
      {/* 结果显示 */}
      {
        !isEmptyObject(results) && (
          <div style={{ marginTop: '20px' }}>
            <h3>2、WalletClient结果</h3>
            <pre style={{ 
              backgroundColor: '#1e1e1e',
              color: '#d4edda',
              padding: '20px',
              borderRadius: '8px',
              overflow: 'auto',
              maxHeight: '600px'
            }}>
              {JSON.stringify(results,null,2)}
            </pre>
          </div>
        )
      }
    </div>
  )
}

export default function ViemDemo(){
  const [ address,setAddress] = useState('')
  return(
    <div>
      <h1>Viem</h1>
      <input
        placeholder="请输入地址"
        value = {address}
        onChange={e => setAddress(e.target.value)}
      />
      <PublicClient address={address}/>
      <WalletClient address={address} />
    </div>
  )
}