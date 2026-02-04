'use client'
import { useCallback, useState } from "react"

export default function CallbackDemo(){
  const [ count, setCount ] = useState(0)
  const [ text, setText ] = useState('!')

  /* 用来缓存函数，否则每次函数会再被创建一次,[]会影响函数生成 */
  const handleCount = useCallback(() => {
    setCount(count+1)
    console.log('useCallback')
  },[])

  const handleText = () => {
    setText(text + '!')
    console.log('nomal')
  }
  return(
    <div>
      <h1>useCakllback</h1>
      <div>
        <p>计数：{count}</p>
        <button onClick={handleCount}>使用useCallback</button>
      </div>
      <div>
        <p>文本：{text}</p>
        <button onClick={handleText}>使用useCallback</button>
      </div>
    </div>
  )
}