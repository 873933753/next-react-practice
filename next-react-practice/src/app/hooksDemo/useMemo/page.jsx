'use client'
import { useMemo, useState } from "react"

export default function UseMemoDemo(){
   const [ count, setCount ] = useState(0)
   console.log(1)
   const [ price, setPrice ] = useState(10)

   // 每次count变化，组件重新渲染，total()会执行，但是希望根据Price变化执行total
   const total = () => {
      console.log(2)
      return price*2
   }
   const totalMemo = useMemo(() => {
      console.log(3)
      return price*3
      //根据依赖性，useMemo 的回调函数会执行
      /* 
         [] - 执行一次
         空 - 每次都会之心
         [price] - 根据依赖项执行回调函数
      */
   },[price])
   return(
      <div>
         <h1>useMemo</h1>
         <div>
            <p>数量:{count}</p>
            <button onClick={() => setCount(count+1)}>+1</button>
         </div>
         <h2>价格：{total()}</h2>
         <h2>价格:{totalMemo}</h2>
      </div>
   )
}