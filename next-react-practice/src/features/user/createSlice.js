import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name:'user',
  initialState:{
    name:'lucky',
    age:18
  },
  reducers:{
    setName:(state) => {
      state.name = 'new' + state.name
    },
    setAge: () => {
      state.age += 1;
    }
  }
})

export const {setName, setAge} = userSlice.actions;

export default userSlice.reducer