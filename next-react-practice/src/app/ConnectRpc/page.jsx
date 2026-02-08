'use client'

import { useAccount, useBalance, useReadContract, useSendTransaction, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { ConnectButton } from '@rainbow-me/rainbowkit'; 
import { formatEther, parseEther } from 'viem'
import { useEffect, useState } from "react";
import { CONTRACTS } from "@/config/contracts";

const objReplacer = (key, value) => {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
};


/* 转账功能 */
function Transfer({cb}){
  const [ transferAddr , setTransferAddr ] = useState('')
  const [ transferAmount, setTransferAmount ] = useState('')
  // 发送交易
  const { data: hash, error, sendTransaction } = useSendTransaction()
  // 等待交易确认
  const { isLoading: isConfirming, isSuccess: isConfirmed}  = useWaitForTransactionReceipt({hash})

  const handleTransfer = async() => {
    if (!transferAddr || !transferAmount) {
      return alert('请填写完整的转账信息')
    }

    try {
      sendTransaction({
        to:transferAddr,
        value:parseEther(transferAmount)
      })
      alert('转账交易已发送，等待确认...')
    } catch (error) {
      alert(`转账失败:${error.message}`)
    }
  }

  //监听交易状态 - 刷新余额
  useEffect(() => {
    if(hash && isConfirmed){
      alert('交易成功')
      cb && cb()
    }
  },[hash, cb, isConfirmed])

  return(
    <div>
      <h5>2、转账功能 - {hash}</h5>
      {
        error && <h4>error：{error.cause.shortMessage}</h4>
      }
      <input
        value={transferAddr}
        onChange={(e) => {setTransferAddr(e.target.value)}}
        type="text"
        placeholder="接收地址"
        style={{ width: '100%', padding: '8px', marginBottom: '5px' }}
      />
      <input
        value={transferAmount}
        onChange={(e) => {setTransferAmount(e.target.value)}}
        type="text"
        placeholder="转账金额（ETH）"
        style={{ width: '100%', padding: '8px', marginBottom: '5px' }}
      />
      <button 
        onClick={handleTransfer} 
        disabled={isConfirming}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: isConfirming ? '#ccc' : '#10b981', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: isConfirming ? 'not-allowed' : 'pointer'
        }}
      >
        {isConfirming ? '确认中...' : '发送转账'}
      </button>
    </div>
  )
}

/* 读取合约数据 */
function ReadContractData(){
  const { data: contractData, refetch: refetchContractData } = useReadContract({
    address: CONTRACTS.COUNTER.address,
    abi:CONTRACTS.COUNTER.abi,
    functionName: 'number'
  })

  const handleReadContract = async() => {
    try {
      // 手动读取合约
      await refetchContractData()
      alert('读取合约成功')
    } catch (error) {
      alert(`读取合约失败:${error.message}`)
    }
  }
  return(
    <div>
      <h5>3、读取合约数据</h5>
      <h6>合约数据:{contractData}</h6>
      <button onClick={handleReadContract} style={{ 
        padding: '10px 20px', 
        backgroundColor: '#8b5cf6', 
        color: 'white', 
        border: 'none', 
        borderRadius: '5px',
        cursor: 'pointer',
        marginRight: '10px'
      }}>
        读取Counter合约的number值
      </button>
    </div>
  )
}

/* 写合约 */
function WriteContractData({cb}){
  const [ newNumber, setNewNumber ] = useState('')
  // 写合约
  const { data:writeHash, writeContract } = useWriteContract()
  // 合约交易状态
  const  { isLoading: isWriteConfirming, isSuccess: isWriteConfirmed} = useWaitForTransactionReceipt({
    hash:writeHash
  })

  const handleSetNumber = async() => {
    if(!newNumber){
      return alert('请输入新数值')
    }
    try {
      await writeContract({
        address:CONTRACTS.COUNTER.address,
        abi:CONTRACTS.COUNTER.abi,
        functionName:'setNumber',
        args: [BigInt(newNumber)]
      })
      alert('setNumber交易已发送，等待确认...')
    } catch (error) {
      alert(`setNumber调用失败: ${error.message}`)
    }
  }
  const handleIncrement = async() => {
    try {
      await writeContract({
        address:CONTRACTS.COUNTER.address,
        abi:CONTRACTS.COUNTER.abi,
        functionName:'increment'
      })
    } catch (error) {
      alert(`setNumber调用失败: ${error.message}`)
    }
  }

  //监听合约状态 - 重新读取合约
  useEffect(() => {
    if(isWriteConfirmed && writeHash){
      alert(`合约调用成功,交易hash:${writeHash}`)
      cb && cb()
    }
  },[isWriteConfirmed,writeHash,cb])

  return(
    <div>
      <h5>写合约数据:{isWriteConfirming ? "合约确认中...":""}</h5>
      {writeHash && <div>交易hash:{writeHash}</div>}
      <div style={{ marginBottom: '10px' }}>
        <input
          type="number"
          value={newNumber}
          onChange={(e) => setNewNumber(e.target.value)}
          placeholder="新的number值"
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <button 
          onClick={handleSetNumber} 
          disabled={isWriteConfirming}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: isWriteConfirming ? '#ccc' : '#f59e0b', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: isWriteConfirming ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {isWriteConfirming ? '确认中...' : '调用setNumber'}
        </button>
        <button 
          onClick={handleIncrement} 
          disabled={isWriteConfirming}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: isWriteConfirming ? '#ccc' : '#ef4444', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: isWriteConfirming ? 'not-allowed' : 'pointer'
          }}
        >
          {isWriteConfirming ? '确认中...' : '调用increment'}
        </button>
      </div>
    </div>
  )
}


export default function ConnectRpc(){
  // 1、判断连接状态，获取钱包地址
  const { isConnected,address }  = useAccount();

  // 2、获取余额，手动获取
  const { status, data: balance, refetch: refetchBalance } = useBalance({address})

  // 读合约
  const { data: contractData, refetch: refetchContractData } = useReadContract({
    address: CONTRACTS.COUNTER.address,
    abi:CONTRACTS.COUNTER.abi,
    functionName: 'number'
  })

  const handleReadContract = async() => {
    try {
      // 手动读取合约
      await refetchContractData()
      alert('读取合约成功')
    } catch (error) {
      alert(`读取合约失败:${error.message}`)
    }
  }
  
  return(
    <div>
      <h1>RPC连接</h1>
      <ConnectButton
       label='connect wallet'
      />
      {
        !isConnected ? (
          <h3>请先连接钱包</h3>
        ):( 
          <>
            <div>
              {/* 显示账户地址，余额 */}
              <h4>
                <p>账户地址:{address}</p>
                <p>账户余额：{balance ? formatEther(balance.value) : '01'} ETH</p>
                <p>获取余额状态:{status}</p>
              </h4>
            </div>
            <div>
              <h5>1、刷新余额</h5>
              <button onClick={refetchBalance}>点击刷新余额</button>
            </div>
            {/* 转账功能 */}
            <Transfer cb={refetchBalance} />
            {/* 读取合约数据 */}
            <ReadContractData  />
            <div>
              <h5>3、读取合约数据</h5>
              <h6>合约数据:{contractData}</h6>
              <button onClick={handleReadContract} style={{ 
                padding: '10px 20px', 
                backgroundColor: '#8b5cf6', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px',
                cursor: 'pointer',
                marginRight: '10px'
              }}>
                读取Counter合约的number值
              </button>
            </div>
            {/* 写合约 */}
            <WriteContractData cb = {refetchContractData} />
            
            {/* 结果显示 */}
              {/* <div style={{ marginTop: '20px' }}>
                <h3>演示结果</h3>
                <pre style={{ 
                  backgroundColor: '#1e1e1e',
                  color: '#d4edda',
                  padding: '20px',
                  borderRadius: '8px',
                  overflow: 'auto',
                  maxHeight: '600px'
                }}>
                  {JSON.stringify(results,objReplacer)}
                </pre>
              </div> */}
          </>
        ) 
      }
    </div>
  )
}