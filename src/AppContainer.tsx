// store 관련
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "./store/store";
import {
  fbLoginState,
  fbJoinState,
  fbLogoutState,
  fbDeleteUserState,
} from "./store/userSlice";
import {
  initTodoState,
  addTodoState,
  updateTodoState,
  deleteTodoState,
  sortTodoState,
  clearTodoState,
  addTodoFB,
  deleteTodoFB,
  updateTodoFB,
  clearTodoFB,
  getTodoFB,
} from "./store/todoSlice";
// firebase 관련
import { fireDB, auth } from "./firebase";

import { useEffect, useState } from "react";
// 상태관리를 위한 객체복사 라이브러리
import produce from "immer";
import App from "./App";
import moment from "moment";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
export type TodoType = {
  uid: string;
  title: string;
  body: string;
  done: boolean;
  sticker: string;
  date: string;
};
// 상태를 변경하는 함수를 묶어서 타입으로 정의해 볼까?

// 꼭 타입으로 정의해서 진행하지 않으셔도 됩니다.
// 즉, 처음부터 최적화를 하는 것은 좋지않은 거 같더군요.
// 나 혼자 관리하는 개발을 주도 : 타입정의하는것 좋다.

// 타인과 개발한다 : 쪼금 생각을 해야 한다.
// 단점 : 타인이 Type에 대한 구성을 파악하는 시간 소비
//        타인이 Type에 학습을 해야 한다.
// 더 큰 장점 : 오류가 줄어든다(오타, 오류를 줄인다. 안정성)
export type CallBacksType = {
  addTodo: (
    uid: string,
    title: string,
    body: string,
    done: boolean,
    sticker: string,
    date: string
  ) => void;
  updateTodo: (todo: TodoType) => void;
  deleteTodo: (todo: TodoType) => void;
  sortTodo: (sortType: string) => void;
  clearTodo?: () => void;
};
export type StatesType = {
  todoList: Array<TodoType>;
};

// 로그인 및 회원가입 타입정의
export type CallBacksFireBaseType = {
  fbLogin: (email: string, password: string) => void;
  fbJoin: (email: string, password: string) => void;
  fbLogout: () => void;
  fbDeleteUser: () => void;
};

const AppContainer = () => {
  // store 코드
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const todo = useSelector((state: RootState) => state.todo);

  // 로컬스토리지 활용 : 파이어베이스로 변경
  const getLocalData = async () => {
    dispatch(getTodoFB());
  };
  // 추가기능
  const addTodo = async (
    uid: string,
    title: string,
    body: string,
    done: boolean,
    sticker: string,
    date: string
  ) => {
    dispatch(
      addTodoFB({
        uid: uid,
        title: title,
        body: body,
        date: date,
        sticker: sticker,
        done: false,
      })
    );
    dispatch(
      addTodoState({
        uid: uid,
        title: title,
        body: body,
        date: date,
        sticker: sticker,
        done: false,
      })
    );
  };
  // 수정기능
  const updateTodo = async (todo: TodoType) => {
    dispatch(updateTodoFB(todo));
    dispatch(updateTodoState(todo));
  };
  // 삭제기능
  const deleteTodo = async (todo: TodoType) => {
    dispatch(deleteTodoFB(todo));
    dispatch(deleteTodoState(todo));
  };
  // 전체 목록 삭제
  const clearTodo = () => {
    dispatch(clearTodoState());
    todo.todoList.forEach(async (element) => {
      await dispatch(clearTodoFB(element));
    });
  };
  // 정렬기능
  const sortTodo = (sortType: string) => {
    dispatch(sortTodoState(sortType));
  };
  // state 관리기능타입
  const callBacks: CallBacksType = {
    addTodo,
    updateTodo,
    deleteTodo,
    sortTodo,
    clearTodo,
  };

  // 데이터목록의 타입
  const states: StatesType = { todoList: todo.todoList };

  // 사용자 로그인 기능
  const fbLogin = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);

        dispatch(fbLoginState({ email, password }));
        // setUserLogin(true);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("errorCode : ", errorCode);
        console.log("errorMessage : ", errorMessage);
      });
  };
  // 사용자 가입
  const fbJoin = (email: string, password: string) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        // 생각을 더 해보자 ????
        dispatch(fbJoinState());
        // setUserLogin(true);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("errorCode : ", errorCode);
        console.log("errorMessage : ", errorMessage);
      });
  };
  // 사용자 로그아웃
  const fbLogout = () => {
    auth.signOut();

    dispatch(fbLogoutState());
    // setUserLogin(false);
  };
  // 회원탈퇴
  const fbDeleteUser = async () => {
    await deleteUser(auth.currentUser as User)
      .then(() => {
        // User deleted.
        dispatch(fbDeleteUserState());
        // setUserLogin(false);
      })
      .catch((error) => {
        // An error ocurred
        // ...
        console.log("회원 탈퇴 실패");
      });
  };

  // 로그인 관리 기능 타입
  const callBacksFireBase: CallBacksFireBaseType = {
    fbLogin,
    fbJoin,
    fbLogout,
    fbDeleteUser,
  };

  useEffect(() => {
    getLocalData();
  }, []);

  return (
    <App
      states={states}
      callBacks={callBacks}
      callBacksFireBase={callBacksFireBase}
      userLogin={user.userLogin}
    />
  );
};

export default AppContainer;
