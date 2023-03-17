import {
  fbLoginTryStateSaga,
  fbLoginStateSaga,
  fbJoinStateSaga,
  fbLogoutStateSaga,
  fbDeleteUserStateSaga,
} from "./fbUserSlice";
import { call, fork, put, takeEvery } from "@redux-saga/core/effects";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  UserCredential,
  User,
} from "firebase/auth";

// FB 로그인 관련
export type FBUser = {
  email: string;
  password: string;
};

// get Saga
export function* getLoginSaga(action: { payload: FBUser }) {
  const param = action.payload;
  try {
    const response: FBUser = yield fork(() => {
      const userCredential: Promise<UserCredential> =
        signInWithEmailAndPassword(auth, param.email, param.password);
      //   const { user } = userCredential;
      return param;
    });
    yield put(fbLoginStateSaga(response));
  } catch (err) {
    console.log(err);
  }
}

// Main Saga
export function* fbUserSaga() {
  yield takeEvery(fbLoginTryStateSaga, getLoginSaga);
}
