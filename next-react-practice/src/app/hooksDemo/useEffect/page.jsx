'use client'

import { useEffect, useState } from "react"

export default function EffectDemo(){
  const [ count ,setCount ] = useState(0)

  const handleClick = () => {
    setCount(count+1)
  }

  // useEffect处理副作用， useEffect是在render执行结束页面更新时候，才执行的。
  useEffect(() => {
    //如果写在handleClick中获取到的count并不是+1后的count
    document.title = count
    // []则只执行一次
  },[count])

  useEffect(() => {
    console.log('组件挂载');
    return () => console.log('组件卸载');
  }, []);

  return(
    <div>
      <h1>useEffect</h1>
      <h3>计数：{count}</h3>
      <button onClick={handleClick}>+1</button>
    </div>
  )
}