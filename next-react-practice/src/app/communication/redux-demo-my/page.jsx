'use client'
import store from "@/libs/store"
import { Provider,useSelector,useDispatch } from "react-redux"
import { decrement,increment } from "@/features/counter/createSlice";
import { setName } from "@/features/user/createSlice";


function CounterCmp(){
  // 使用state和修改state -- 一定要在Provider内操作
  const count = useSelector(state => state.counter.value);
  const counterDispatch = useDispatch() 
  return(
    <div>
      <h1>当前显示：{count}</h1>
      <div>
        <button style={{marginLeft:'20px',background:'red'}} onClick={() => {counterDispatch(decrement())}}>-1</button>
        <button style={{marginLeft:'20px',background:'blue',color:'#fff'}} onClick={() => {counterDispatch(increment())}}>+1</button>
      </div>
    </div>
  )
}

function AnotherCmp(){
  const count = useSelector(state => state.counter.value);
  const name = useSelector(state => state.user.name)
  const userDispatch = useDispatch()
  return(
    <div>
      <h2>另一个组件中:{count}</h2>
      <h3>userReducer</h3>
      <p>
        name:{name}
      </p>
      <button onClick={() => {userDispatch(setName())}}>change name</button>
    </div>
  )
}

export default function ReduxDemoMy(){
  
  return(
    <div>
      {/* // 2、主组件，包装Provider */}
      <Provider store={store}>
        <CounterCmp />
        <AnotherCmp />
      </Provider>
    </div>
  )
}