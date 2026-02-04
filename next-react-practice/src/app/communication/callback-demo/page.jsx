'use client'
import Link from "next/link"
import { useState } from "react"


function Child({toParent}){
  const [ value, setValue ] = useState('')
  const sendValue = () => {
    toParent(value)
    setValue('')
  }
  return(
    <div style={{border:'1px solid red',padding:'20px'}}>
      <h3>子组件</h3>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <button onClick={sendValue}>发送到父组件</button>
    </div>
  )
}

function Parent(){
  const [ value, setValue ] = useState('') 
  function getValue(value){
    setValue(prev => [...prev,value])
  }
  return(
    <div style={{border:'1px solid blue',padding:'20px'}}>
      <h2>父组件</h2>
      <p>接收到的消息：{value.join(',')}</p>
      <Child toParent={getValue}/>
    </div>
  )
}

export default function CallBackDemo(){
  return(
    <div>
      <h1>子传父回调函数</h1>
      <Link href='/communication'>← 返回Communication首页</Link>
      <Parent />
    </div>
  )
}