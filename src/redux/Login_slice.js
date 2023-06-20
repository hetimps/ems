import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
  name: "login",
  initialState: {

    users: null,
    TableData : [],

  },
  reducers: {
    loginuser: (state, action) => {
      state.users = action.payload;
    },

    TableData: (state, action) => {
      state.TableData = action.payload;
    },
  },
});

export const { loginuser,TableData } = loginSlice.actions;

export default loginSlice.reducer;
