'use client'

import Link from "next/link";
import { createContext, useContext, useState } from "react";

const valueContext = createContext()

function Layer1(){
  const {msg} = useContext(valueContext)
  return(
    <div style={{border:"1px solid red",padding:'20px'}}>
      <h2>Layer1</h2>
      <p>当前context消息：{msg}</p>
      <Layer2 />
    </div>
  )
}

function Layer2(){
  return(
    <div style={{border:"1px solid blue",padding:'20px'}}>
      <h3>Layer2</h3>
      <Layer3 />
    </div>
  )
}

function Layer3(){
  const {msg ,setMsg} = useContext(valueContext)
  return(
    <div style={{border:"1px solid orange",padding:'20px'}}>
      <h3>Layer3</h3>
      <p>当前context消息：{msg}</p>
      <input value={msg} onChange={(e) => {setMsg(e.target.value)}} />
    </div>
  )
}


export default function ContextDemo(){
  const [msg, setMsg] = useState('Hello from Context')
  return(
    <div>
      <h1>Context深层传递通信</h1>
      <Link href='/communication'>← 返回Communication首页</Link>
      <valueContext.Provider value={{msg,setMsg}}>
        <Layer1 />
      </valueContext.Provider>
      
    </div>
  )
}