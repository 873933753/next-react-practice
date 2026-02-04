'use client'
import { forwardRef, useEffect, useRef, useState } from "react"

function Child(){
  const inputRef = useRef(null)
  const handleClick = () => {
    inputRef.current.focus()
  }
  return(
    <div>
      <h2>
        1、获取DOM元素
      </h2>
      <input ref={inputRef} />
      <button onClick={handleClick}>聚焦输入框</button>
    </div>
  )
}

const Child2 = forwardRef((props,childRef) => {
  /* props接收父组件传递的属性 */
  return(
    <div>
      <h2>父组件获取子组件的DOM元素，需要使用forwardRef获取</h2>
      <input ref={childRef} />
    </div>
  )
})

export default function RefDemo(){
  const childRef = useRef(null)
  // 持久化状态，不会重新渲染
  let [ count, setCount ] = useState(0)
  let timer = useRef(null)
  let timerNew = null

  const handleStar = () => {
    timer.current = setInterval(() => {
      setCount(count++)
    }, 1000)
  }
  
  const handleStop = () => {
    //timerNew每次都是null
    clearInterval(timer.current)
  }
  return(
    <div>
      <h1>useRef</h1>
      <Child />
      <Child2 ref={childRef} />
      <button onClick={() => childRef.current.focus() }>聚焦输入框</button>
      <h3>
        数字：{count}
      </h3>
      <button onClick={handleStar}>start</button>
      <button onClick={handleStop}>stop</button>
    </div>
  )
}