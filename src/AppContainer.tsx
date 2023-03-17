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
import { auth } from "./firebase";

import { useEffect } from "react";
import App from "./App";

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

  // 파이어베이스 전체 데이터 로드
  const getLocalData = async () => {
    dispatch(getTodoFB());
  };
  // FB 추가기능
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
  // FB 수정기능
  const updateTodo = async (todo: TodoType) => {
    // 서버 연동으로 비동기로 자료를 업로드
    dispatch(updateTodoFB(todo));
    // 동기로 즉시 State 업데이트
    dispatch(updateTodoState(todo));
  };
  // 삭제기능
  const deleteTodo = async (todo: TodoType) => {
    // 서버 연동으로 비동기로 자료를 삭제요청
    // 서버작업
    dispatch(deleteTodoFB(todo));
    // 동기로 삭제 후 즉시 State 업데이트
    // 즉시 store 의 state 갱신
    dispatch(deleteTodoState(todo));
  };
  // 전체 목록 삭제
  const clearTodo = () => {
    // 동기로 state 전체 자료 삭제후 즉시 화면 갱신
    dispatch(clearTodoState());
    // 서버로 자료를 하나씩 보내서 처리
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
