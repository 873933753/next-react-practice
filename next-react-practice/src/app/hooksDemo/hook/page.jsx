'use client'

import { configureStore, createSlice } from "@reduxjs/toolkit"
import { createContext, useContext, useState } from "react"
import { Provider, useDispatch, useSelector } from "react-redux"

const MyContext = createContext()

/* context */
function ContextDemo(){
  const [ msg, setMsg ] = useState('123')
  return(
    <div style={{border:'1px solid red',padding:'20px'}}>
      <h1>contextDeo</h1>
      <MyContext.Provider value={{msg,setMsg}}>
        <ContextChild />
      </MyContext.Provider>
    </div>
  )
}

function ContextChild(){
  const {msg} = useContext(MyContext)
  return(
    <div>
      <h2>context-child</h2>
      <p>context内容为:{msg}</p>
      <ContextChild2 />
    </div>
  )
}

function ContextChild2(){
  const { msg, setMsg} = useContext(MyContext)
  return(
    <div>
      <h3>context-child-child</h3>
      <p>context的内容为：{msg}</p>
      <input value={msg} onChange={(e) => setMsg(e.target.value)} />
    </div>
  )
}

/* redux */

const userSilce = createSlice({
  name:'user',
  initialState:{
    name:'lucky'
  },
  reducers:{
    setUser:(state,action) => {
      state.name = action.payload
    }
  }
})

export const {setUser} = userSilce.actions;

const store = configureStore({
  reducer:{
    user:userSilce.reducer
  }
})



function ReduxDemo(){
  return(
    <div style={{border:'1px solid blue',padding:'20px'}}>
      <h1>ReduxDemo</h1>
      <Provider store={store}>
        <ReduxChild />
        <ReduxChild2 />
      </Provider>
    </div>
  )
}

function ReduxChild(){
  const name = useSelector(state => state.user.name)
  return(
    <div>
      <h2>redux-child</h2>
      <p>redux的内容为:{name}</p>
    </div>
  )
}

function ReduxChild2(){
  const name = useSelector(state => state.user.name)
  const userDispatch = useDispatch()
  return(
    <div>
      <h2>redux-child</h2>
      <p>redux的内容为：{name}</p>
      <input value={name} onChange={(e) => userDispatch(setUser(e.target.value))} />
    </div>
  )
}


export default function HookDemo(){
  return(
    <div>
      <ContextDemo />
      <ReduxDemo />
    </div>
  )
}