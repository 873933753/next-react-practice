'use client'
import { useState } from "react"

function Child(props){
  const { value, count, reset } = props;
  return(
    <div style={{border:'1px solid red',padding:'20px'}}>
      <h2>子组件</h2>
      <p>接收到的消息：{value}</p>
      <p>接收到的计数：{count}</p>
      <button onClick={reset}>reset</button>
    </div>
  )
}

function Parent(){
  const [ count, setCount ] = useState(0)
  const [ value, setValue ] = useState('Hello from Parent!')

  const reset = () => {
    setValue('Hello from Parent!')
    setCount(0)
  }
  
  return(
    <div style={{border:'1px solid blue',padding:'20px'}}>
      <h2>父组件</h2>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <button onClick={() => setCount(count+1)}>计数:{count}</button>
      <Child value={value} count={count} reset={reset} />
    </div>
  )
}

export default function PropsDemo(){
  
  return(
    <div>
      <h1>父子通信 - Props</h1>
      <div style={{ marginBottom: '20px' }}>
        <a href="/communication" style={{ color: '#2196F3' }}>← 返回Communication首页</a>
      </div>
      <Parent />
    </div>
  )
}