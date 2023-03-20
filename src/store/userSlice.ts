import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser,
  User,
  UserCredential,
} from "firebase/auth";
import { auth } from "../firebase";
import { stat } from "fs";
// FB 로그인 관련
export type FBUser = {
  email: string;
  password: string;
};

// 파이어베이스  로그인

// 액션(fbLoginFB)을 만들어서( Action Creator )
// { type: 구별할수 있는 문자열, action: {payload:데이터}}

// Reducer 로 전달한다.
// 이후 회신값으로 store 의 state 를 업데이트한다.
export const fbLoginFB = createAsyncThunk(
  "user/login",
  async (tempUser: FBUser) => {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        tempUser.email,
        tempUser.password
      );
      const user = userCredential.user;
      console.log(user);

      // payload 전송
      return tempUser;
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("errorCode : ", errorCode);
      console.log("errorMessage : ", errorMessage);
    }
  }
);
// Action 을 만든다.
// {type:문자열, action: payload }
export const fbJoinFB = createAsyncThunk(
  "user/join",
  async (tempUser: FBUser) => {
    try {
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(
          auth,
          tempUser.email,
          tempUser.password
        );
      const user = userCredential.user;
      console.log(user);
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("errorCode : ", errorCode);
      console.log("errorMessage : ", errorMessage);
    }
  }
);
// 액션{type, action}을 만들어서 reduer 로 전송한다.
export const fbLogoutFB = createAsyncThunk("user/logout", async () => {
  try {
    await auth.signOut();
    // fbLogoutState();
  } catch (error: any) {}
});

// 액션을 만든다.
export const fbDeleteUserFB = createAsyncThunk("user/delete", async () => {
  try {
    await deleteUser(auth.currentUser as User);
  } catch (error: any) {
    console.log("회원탈퇴 실패");
  }
});

// 초기 값 타입 정의
export type LoginState = {
  userLogin: boolean;
  email: string;
  password: string;
};
// store 의 state 의 초기값 셋팅
const initialState: LoginState = {
  userLogin: false,
  email: "",
  password: "",
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fbLoginState: (
      state,
      action: PayloadAction<{ email: string; password: string }>
    ) => {
      state.userLogin = true;
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
    fbJoinState: (state) => {
      state.userLogin = false;
      state.email = "";
      state.password = "";
    },
    fbLogoutState: (state) => {
      state.userLogin = false;
      state.email = "";
      state.password = "";
    },
    fbDeleteUserState: (state) => {
      state.userLogin = false;
      state.email = "";
      state.password = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // 로그인
      .addCase(fbLoginFB.pending, (state, action) => {})
      .addCase(fbLoginFB.fulfilled, (state, action) => {
        state.userLogin = true;
        const { email, password } = action.payload as FBUser;
        state.email = email;
        state.password = password;
      })
      .addCase(fbLoginFB.rejected, (state, action) => {})
      // 회원가입
      .addCase(fbJoinFB.pending, (state, action) => {})
      .addCase(fbJoinFB.fulfilled, (state, action) => {
        state.userLogin = false;
        state.email = "";
        state.password = "";
      })
      .addCase(fbJoinFB.rejected, (state, action) => {})
      // 로그아웃
      .addCase(fbLogoutFB.pending, (state, action) => {})
      .addCase(fbLogoutFB.fulfilled, (state, action) => {
        state.userLogin = false;
        state.email = "";
        state.password = "";
      })
      .addCase(fbLogoutFB.rejected, (state, action) => {})
      // 회원탈퇴
      .addCase(fbDeleteUserFB.pending, (state, action) => {})
      .addCase(fbDeleteUserFB.fulfilled, (state, action) => {
        state.userLogin = false;
        state.email = "";
        state.password = "";
      })
      .addCase(fbDeleteUserFB.rejected, (state, action) => {});
  },
});

export const { fbLoginState, fbJoinState, fbLogoutState, fbDeleteUserState } =
  userSlice.actions;
export default userSlice.reducer;
