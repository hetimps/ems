import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
  name: "login",
  initialState: {

    users: null,
    userName:"",
    TableData : [],

  },
  reducers: {
    loginuser: (state, action) => {
      state.users = action.payload;
    },
    userName: (state, action) => {
      state.userName = action.payload;
    },

    TableData: (state, action) => {
      state.TableData = action.payload;
    },
  },
});

export const { loginuser,TableData,userName } = loginSlice.actions;

export default loginSlice.reducer;
