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
// FB 로그인 관련
export type FBUser = {
  email: string;
  password: string;
};

// 파이어베으스  로그인
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

export const fbJoinFB = createAsyncThunk(
  "user/join",
  async (tempUser: FBUser) => {
    await createUserWithEmailAndPassword(
      auth,
      tempUser.email,
      tempUser.password
    )
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);

        fbJoinState();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("errorCode : ", errorCode);
        console.log("errorMessage : ", errorMessage);
      });
  }
);
export const fbLogoutFB = createAsyncThunk("user/logout", async () => {
  await auth.signOut();
  fbLogoutState();
});

export const fbDeleteUserFB = createAsyncThunk("user/delete", async () => {
  await deleteUser(auth.currentUser as User)
    .then(() => {
      // User deleted.
      fbDeleteUserState();
    })
    .catch((error) => {
      console.log("회원 탈퇴 실패");
    });
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
      .addCase(fbJoinFB.fulfilled, (state, action) => {})
      .addCase(fbJoinFB.rejected, (state, action) => {})
      // 로그아웃
      .addCase(fbLogoutFB.pending, (state, action) => {})
      .addCase(fbLogoutFB.fulfilled, (state, action) => {})
      .addCase(fbLogoutFB.rejected, (state, action) => {})
      // 회원탈퇴
      .addCase(fbDeleteUserFB.pending, (state, action) => {})
      .addCase(fbDeleteUserFB.fulfilled, (state, action) => {})
      .addCase(fbDeleteUserFB.rejected, (state, action) => {});
  },
});

export const { fbLoginState, fbJoinState, fbLogoutState, fbDeleteUserState } =
  userSlice.actions;
export default userSlice.reducer;
