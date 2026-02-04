'use client'

/* 父组件渲染会引起子组件重新渲染，用memo缓存组件 */

import { memo, useState } from "react"

function Child(){
  console.log('child')
  return(
    <div>
      <h2>没有memo的子组件</h2>
    </div>
  )
}

const MemoChild = memo(() =>{
  console.log('MemoChild')
  return(
    <div>
      <h2>memo的子组件</h2>
    </div>
  )
})


export default function MemoDemo(){
  const [ count ,setCount ] = useState(0)
  return(
    <div>
      <h1>memo</h1>
      <p>计数：{count}</p>
      <button onClick={() => setCount(count+1)}>+1</button>
      <MemoChild />
      <Child />
    </div>
  )
}