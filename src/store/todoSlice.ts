import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
// firebase 관련
import { fireDB, auth } from "../firebase";
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
import moment from "moment";

// firebase Storage 이름
const firebaseStorageName = "tsmemo";
// 컬렉션(DataBase 단위: MongoDB 참조) 불러오기
const memoCollectionRef = collection(fireDB, firebaseStorageName);
export const getTodoFB = createAsyncThunk(
  "todo/getTodo",
  async (_, thunkAPI) => {
    try {
      const q = await query(memoCollectionRef);
      const data = await getDocs(q);
      if (data !== null) {
        const firebaseData = data.docs.map((doc) => ({
          ...doc.data(),
        }));
        const initData = firebaseData.map((item) => {
          return item as TodoType;
        });
        console.log("todo/getTodo : ", initData);
        return initData;
      }
    } catch (Err) {
      return thunkAPI.rejectWithValue(Err);
    }
  }
);
export const addTodoFB = createAsyncThunk(
  "todo/addTodo",
  async (tempTodo: TodoType, thunkAPI) => {
    console.log("todo/addTodo : ", tempTodo);
    try {
      const res = await setDoc(doc(fireDB, firebaseStorageName, tempTodo.uid), {
        uid: tempTodo.uid,
        title: tempTodo.title,
        body: tempTodo.body,
        date: tempTodo.date,
        sticker: tempTodo.sticker,
        done: false,
      });
    } catch (Err) {
      return thunkAPI.rejectWithValue(Err);
    }
  }
);
export const deleteTodoFB = createAsyncThunk(
  "todo/deleteTodo",
  async (tempTodo: TodoType, thunkAPI) => {
    console.log("todo/deleteTodo : ", tempTodo.uid);
    const userDoc = doc(fireDB, firebaseStorageName, tempTodo.uid);
    try {
      const res = await deleteDoc(userDoc);
    } catch (Err) {
      return thunkAPI.rejectWithValue(Err);
    }
  }
);
export const updateTodoFB = createAsyncThunk(
  "todo/updateTodo",
  async (tempTodo: TodoType, thunkAPI) => {
    console.log("todo/updateTodo : ", tempTodo.uid);
    const userDoc = doc(fireDB, firebaseStorageName, tempTodo.uid);
    try {
      const res = await updateDoc(userDoc, {
        title: tempTodo.title,
        body: tempTodo.body,
        sticker: tempTodo.sticker,
        done: tempTodo.done,
        date: moment(tempTodo.date).format("YYYY-MM-DD"),
      });
    } catch (Err) {
      return thunkAPI.rejectWithValue(Err);
    }
  }
);
export const clearTodoFB = createAsyncThunk(
  "todo/clearTodo",
  async (tempTodo: TodoType, thunkAPI) => {
    console.log("todo/clearTodo : ", tempTodo);
    try {
      const userDoc = doc(fireDB, firebaseStorageName, tempTodo.uid);
      const res = deleteDoc(userDoc);
    } catch (Err) {
      return thunkAPI.rejectWithValue(Err);
    }
  }
);

export type TodoType = {
  uid: string;
  title: string;
  body: string;
  done: boolean;
  sticker: string;
  date: string;
};
// 초기 값 타입 정의
export type TodoState = {
  todoList: Array<TodoType>;
};
// store 의 state 의 초기값 셋팅
const initialState: TodoState = {
  todoList: [],
};
export const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    initTodoState: (state, action: PayloadAction<Array<TodoType>>) => {
      state.todoList = action.payload;
    },
    addTodoState: (state, action: PayloadAction<TodoType>) => {
      state.todoList.push(action.payload);
    },
    updateTodoState: (state, action: PayloadAction<TodoType>) => {
      const index = state.todoList.findIndex(
        (item) => item.uid === action.payload.uid
      );
      state.todoList[index].title = action.payload.title;
      state.todoList[index].body = action.payload.body;
      state.todoList[index].date = moment(action.payload.date).format(
        "YYYY-MM-DD"
      );
      state.todoList[index].sticker = action.payload.sticker;
      state.todoList[index].done = action.payload.done;
      //   state.todoList[index] = { ...action.payload };
    },
    deleteTodoState: (state, action: PayloadAction<TodoType>) => {
      const index = state.todoList.findIndex(
        (item) => item.uid === action.payload.uid
      );
      state.todoList.splice(index, 1);
    },
    sortTodoState: (state, action: PayloadAction<string>) => {},
    clearTodoState: (state) => {
      state.todoList = [];
    },
  },
  extraReducers: (builder) => {
    // pending
    builder
      // pending
      .addCase(getTodoFB.pending, (state, action) => {})
      // fulfilled
      .addCase(getTodoFB.fulfilled, (state, action) => {
        state.todoList = action.payload as Array<TodoType>;
      })
      // rejected
      .addCase(getTodoFB.rejected, (state, action) => {})

      // pending
      .addCase(addTodoFB.pending, (state, action) => {})
      // fulfilled
      .addCase(addTodoFB.fulfilled, (state, action) => {})
      // rejected
      .addCase(addTodoFB.rejected, (state, action) => {})
      // pending
      .addCase(deleteTodoFB.pending, (state, action) => {})
      // fulfilled
      .addCase(deleteTodoFB.fulfilled, (state, action) => {})
      // rejected
      .addCase(deleteTodoFB.rejected, (state, action) => {})
      // pending
      .addCase(updateTodoFB.pending, (state, action) => {})
      // fulfilled
      .addCase(updateTodoFB.fulfilled, (state, action) => {})
      // rejected
      .addCase(updateTodoFB.rejected, (state, action) => {})
      // pending
      .addCase(clearTodoFB.pending, (state, action) => {})
      // fulfilled
      .addCase(clearTodoFB.fulfilled, (state, action) => {})
      // rejected
      .addCase(clearTodoFB.rejected, (state, action) => {});
  },
});

export const {
  initTodoState,
  addTodoState,
  updateTodoState,
  deleteTodoState,
  sortTodoState,
  clearTodoState,
} = todoSlice.actions;
export default todoSlice.reducer;
