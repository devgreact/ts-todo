import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// 초기 값 타입 정의
export type LoginState = {
  userLogin: boolean;
  email: string;
  password: string;
  isLoading: boolean;
};
// store 의 state 의 초기값 셋팅
const initialState: LoginState = {
  userLogin: false,
  email: "",
  password: "",
  isLoading: false,
};
export const fbUserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fbLoginTryStateSaga: (
      state,
      action: PayloadAction<{ email: string; password: string }>
    ) => {
      state.isLoading = false;
    },
    fbLoginStateSaga: (
      state,
      action: PayloadAction<{ email: string; password: string }>
    ) => {
      state.isLoading = true;
      state.userLogin = true;
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
    fbJoinStateSaga: (state) => {
      state.userLogin = false;
      state.email = "";
      state.password = "";
    },
    fbLogoutStateSaga: (state) => {
      state.userLogin = false;
      state.email = "";
      state.password = "";
    },
    fbDeleteUserStateSaga: (state) => {
      state.userLogin = false;
      state.email = "";
      state.password = "";
    },
  },
});

export const {
  fbLoginTryStateSaga,
  fbLoginStateSaga,
  fbJoinStateSaga,
  fbLogoutStateSaga,
  fbDeleteUserStateSaga,
} = fbUserSlice.actions;
export default fbUserSlice.reducer;
