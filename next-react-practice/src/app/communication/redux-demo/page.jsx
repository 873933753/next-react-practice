'use client'
import { configureStore, createSlice } from "@reduxjs/toolkit"
import { useState } from "react"
import { Provider, useDispatch, useSelector } from "react-redux"

// 3、创建redux slice
const MsgSlice = createSlice({
  name:'message',
  initialState:{
    value:''
  },
  reducers:{
    setMsg:(state,action) => {
      state.value = action.payload
    }
  }
})
//导出actions
export const { setMsg } = MsgSlice.actions;

// 1、创建store
const store = configureStore({
  reducer:{
    // 4、将slice reducers添加到store
    message:MsgSlice.reducer
  }
})

//发送方A
function CmpA(){
  const [ value, setValue] = useState('')
  const msgDispatch = useDispatch()

  const sendMsg = () => {
    msgDispatch(setMsg(value))
    setValue('')
  }
  return(
    <div>
      <h2>组件A（发送方）</h2>
      <input type="text"
       value={value}
       onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={sendMsg}>发送到Store</button>
    </div>
  )
}

//接收方
function CmpB(){
  const msg = useSelector(state => state.message.value)
  return(
    <div>
      <h3>组件B（接收方）</h3>
      <p>从Redux Store获取的消息:{msg}</p>
    </div>
  )
}

function CmpC(){
  const msg = useSelector(state => state.message.value)
  return(
    <div>
      <h3>组件C（接收方）</h3>
      <p>从Redux Store获取的消息:{msg}</p>
    </div>
  )
}

export default function ReduxDemo(){
  return(
    <div>
      <h1>Redux全局状态管理</h1>
      {/* Provider包裹 */}
      <Provider store={store}>
        <CmpA />
        <CmpB />
        <CmpC />
      </Provider>
    </div>
  )
}