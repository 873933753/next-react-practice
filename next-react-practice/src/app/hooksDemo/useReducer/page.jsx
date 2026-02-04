'use client'
import { useReducer } from "react"

// 2、定义reducer函数（state数据，action），返回新的state数据
function countDispatch(state,action){
  //4、根据指令修改数据并返回新的state
  const {type,value} = action
  const newState = {...state}
  switch(type){
    case 'down':
      newState.value -= value;
      return newState;
    case 'add':
      newState.value += value;
      return newState;
    default:
      return state
  }
}

export default function ReducerDemo(){
  //1、定义reducer，useReducer（reducer函数，初始数据）
  const  [ count, dispatch ] = useReducer(countDispatch,{
    value:0
  })

  const handleCount = (type) => {
    const action = {
      type:type,
      value:2
    }
    //3、派发action
    dispatch(action)
  }
  return(
    <div>
      <h1>Reducer</h1>
      <h3>计数：{count.value}</h3>
      <button onClick={() =>handleCount('down')}>-2</button>
      <button onClick={() =>handleCount('add')}>+2</button>
    </div>
  )
}