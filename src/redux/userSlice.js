import { createSlice } from '@reduxjs/toolkit'




const initialState = {
  userInfo: {},
  loading: false,
  error:null,
  singleOrderId:''
}

export const userSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    loginStart: (state) => {
        state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.userInfo = action.payload;
      state.loading = false;
    },
    loginFail: (state, action) => {
      state.loading =false;
      state.error =action.payload;
    },
    singleOrder: (state, action) => {
      state.singleOrderId =action.payload;
    },
  },
})


export const {singleOrder, loginFail,loginStart, loginSuccess } = userSlice.actions

export default userSlice.reducer