'use client'

import { CONTRACTS } from "@/config/contracts"
import { useEffect, useState } from "react"
import { formatEther, parseEther } from "viem"
import { useAccount, useBalance, useBlockNumber, useChainId, useConnect, useDisconnect, useReadContract, useSendTransaction, useWaitForTransactionReceipt, useWriteContract } from "wagmi"



function GetBalance({address}){
  const { data: balance, refetch: refetchBalance} = useBalance({address})
  const [ addr,setAddr] = useState('')

  const {data:hash, isPending, isSuccess, sendTransaction} = useS endTransaction()

  const handleClick = async() => {
    if(!addr){
      return alert('请输入地址')
    }
    try {
      sendTransaction({
        to:addr,
        value:parseEther('0.001')
      })
      alert('转账交易已发送，等待确认...')
    } catch (error) {
      alert(`转账失败:${error.message}`)
    }
  }

  // 0x27e93521cD7886B29DB7067F3Ec6cb256d59F20C

  useEffect(() => {
    if(isSuccess && hash){
      refetchBalance()
    }
  },[isSuccess,hash,refetchBalance])
  return(
    <div>
      <h2> 2、useBalance - 获取账户余额</h2>
      <p>
        余额: {balance?formatEther(balance.value):0} ETH
      </p>
      <button onClick={refetchBalance}>刷新余额</button>
      <br />
      <input
        value={addr}
        placeholder="请输入发送地址"
        onChange={e => setAddr(e.target.value)}
      ></input>
      <button disabled={isPending} onClick={handleClick}>发送0.001ETH</button>
    </div>
  )
}

function GetContractData(){
  const { data: contractData, refetch: refetchContract } = useReadContract({
    address:CONTRACTS.COUNTER.address,
    abi:CONTRACTS.COUNTER.abi,
    functionName:'number'
  })
  // useWriteContract - 写合约
  const { data:writeHash, writeContract } = useWriteContract()
  // 合约交易状态 - useWaitForTransactionReceipt
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({hash:writeHash})
  

  const handleData = async() => {
    try {
      writeContract({
        address:CONTRACTS.COUNTER.address,
        abi:CONTRACTS.COUNTER.abi,
        functionName:'increment'
      })
    } catch (error) {
      alert(error.message)
    }
  }

  // 合约写成功，调用更新合约
  useEffect(() => {
    if(isSuccess && writeHash){
      refetchContract()
    }
  },[isSuccess,writeHash,refetchContract])
  return(
    <div>
      <h2>useReadContract- 读取合约</h2>
      <h2>useWriteContract、useWaitForTransactionReceipt - 写合约</h2>
      <p>
        合约数据:{contractData}
        <button onClick={refetchContract}>更新合约数据</button>
      </p>
      {
        writeHash && (
          <>
            <p>合约确认中:{isLoading?'是':'否'}</p>
            <p> 交易成功:{isSuccess?'是':'否'}</p>
          </>
        )
      }
      <button onClick={handleData}>合约数据+1</button>
    </div>
  )
}


function GetChainId(){
  const chainId = useChainId()
  return(
    <div>
        <h2>useChainId - 获取当前链的Id</h2>
        <p>当前链ID:{chainId}</p>
        <p>当前链：{chainId===11155111?'Sepolia Testnet':chainId===1?'以太主网':'未知网络'}</p>
    </div>
    
  )
}

function GetBlockNumber(){
  const {data: blockNumber} = useBlockNumber({
    watch: true // 开启监听状态
  })
  return(
    <div>
        <h2>blockNumber - 获取最新的blockNumber</h2>
        <p>blockNumber:{blockNumber?.toString()}</p>
    </div>
    
  )
}

function GetConnect({isConnected,connector}){
  // connect用于连接钱包
  const { connect, connectors, isPending: isConnectPending ,error: connectError } = useConnect()
  // 断开连接
  const { disconnect } = useDisconnect()

  //点击连接钱包
  const handleConnectClick = (connector) => {
    connect({connector})
  }
  return(
    <div>
      <h2>useConnect - 连接器</h2>
      <p>可用连接器数量:{connectors.length}</p>
      {/* 未连接钱包显示连接钱包按键,连接显示连接方式 */}
      {
        !isConnected ? (
          <button
            disabled={isConnectPending}
            style={buttonStyle}
          >
            连接钱包
          </button>
        ):
        <p style={{ color: '#10b981', marginTop: '10px' }}>
          ✅ 已通过 {connector?.name} 连接
          <button onClick={disconnect}>断开连接</button>
        </p>
      }
      {connectError && (
        <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>
          错误: {connectError.message}
        </p>
      )}
      <ul>
        {
          connectors.map(item => {
            return(
              <li key={item.uid} onClick={() => handleConnectClick(item)}>
                {item.name}
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

function TokenBank({address}){
  // 总存款数 - totalDeposits
  const { data:totalDeposits, error, refetch: refetchTokenBank} = useReadContract({
    address:CONTRACTS.TOKENBANK.address,
    abi:CONTRACTS.TOKENBANK.abi,
    functionName:'totalDeposits'
  })

  //我的余额 - deposits
  const { data:myDeposits, error:errorMyDeposits, refetch: refetchMyDeposits} = useReadContract({
    address:CONTRACTS.TOKENBANK.address,
    abi:CONTRACTS.TOKENBANK.abi,
    functionName:'deposits',
    args:[address]
  })

  // 我的授权额度 - allowance，我->ERC20TOKEN 授权
  const {data: approveData, refetch:refetchApprove} = useReadContract({
    address:CONTRACTS.ERC20TOKEN.address,
    abi:CONTRACTS.ERC20TOKEN.abi,
    functionName:'allowance',
    args:[address, CONTRACTS.TOKENBANK.address] 
  })

    // 3. 错误类型判断（核心：区分不同错误场景）
  const getErrorMessage = () => {
    if (!error) return ''

    // 分类处理错误
    switch (true) {
      // 场景 1：网络/链连接错误（用户未连接钱包/链不匹配）
      case error.message.includes('chain') || error.message.includes('connector'):
        return '请先连接钱包，并切换到正确的区块链网络（如以太坊主网）'
      
      // 场景 2：合约不存在/地址错误
      case error.message.includes('contract') || error.message.includes('address'):
        return '合约地址错误或该合约不存在，请检查配置'
      
      // 场景 3：函数名/参数错误（ABI 不匹配）
      case error.message.includes('function') || error.message.includes('args'):
        return '合约方法名或参数错误，请核对 ABI 配置'
      
      // 场景 4：RPC 节点错误（网络请求失败）
      case error.message.includes('RPC') || error.message.includes('request'):
        return '网络请求失败，请检查网络或稍后重试'
      
      // 场景 5：通用错误（兜底）
      default:
        // 生产环境隐藏具体错误，调试时可打印 error
        console.error('合约读取错误：', error)
        return '查询失败，请稍后重试'
    }
  }

  return(
    <div>
      {/* bankDeposit:{bankDeposit} */}
      {/* <button onClick={refetchTokenBank}>更新合约</button> */}
      {/* <div>
        {getErrorMessage()}
      </div>
      <div>
        {error?.message}
      </div> */}
      <ul>
        <li>我的余额：{myDeposits?formatEther(myDeposits):0} WETH</li>
        <li>授权额度：{approveData ? formatEther(approveData):0} WETH</li>
        <li>总存款数:{totalDeposits?formatEther(totalDeposits):0} WETH</li>
      </ul>
    </div>
  )
}


export default function WagmiDemo(){
  const { isConnected, isConnecting, isDisconnected, address,connector } = useAccount()
  return(
    <div>
      <h1>wagmi</h1>
      <div>
        <h2>1、useAccount - 获取账户信息</h2>
        <p>连接状态:{isConnected?'已连接':'未连接'}</p>
        <p>连接中：{isConnecting?'是':'否'}</p>
        <p>已断开:{isDisconnected?'是':'否'}</p>
        <p>地址：{address}</p>
        <p>连接器:{connector?.name || 'N/A'}</p>
      </div>
      <h2>============================================================</h2>
      <GetBalance address={address} />
      <h2>============================================================</h2>
      <GetContractData />
      <h2>============================================================</h2>
      <GetChainId />
      <h2>============================================================</h2>
      <GetBlockNumber />
      <h2>============================================================</h2>
      <GetConnect isConnected={isConnected} connector={connector} />
      <h2>============================================================</h2>
      {
        isConnected && <TokenBank address={address} />
      }
      
    </div>
  )
}

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#0070f3',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
}