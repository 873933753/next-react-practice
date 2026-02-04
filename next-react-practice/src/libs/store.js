import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '@/features/counter/createSlice';
import userReducer from '@/features/user/createSlice'

// 1、创建store
export default configureStore({
  reducer: {
    // 4、添加 Slice Reducers 到 Store
    counter:counterReducer,
    user:userReducer
  },
});

// 2、主组件，用Provider包裹，传入store

// 3、创建Redux Slice和render函数

// 4、添加 Slice Reducers 到 Store

// 5、在组件种使用redux state和Actions
/* 
  1)获取state种的变量 - useSelector
  const count = useSelector((state) => state.counter.value)
*/
/* 
  2)修改变量 - useDispatch
  const dispath = useDispatch()
  onClick = dispath(increatment())
*/