import React from "react";
import { CallBacksType, StatesType } from "../AppContainer";
import TodoInput from "../components/TodoInput";
import TodoList from "../components/TodoList";

type propsType = {
  states: StatesType;
  callBacks: CallBacksType;
};
const Todo = ({ states, callBacks }: propsType) => {
  return (
    <>
      <TodoInput addTodo={callBacks.addTodo} />
      <TodoList
        todoList={states.todoList}
        updateTodo={callBacks.updateTodo}
        deleteTodo={callBacks.deleteTodo}
        clearTodo={callBacks.clearTodo}
      />
    </>
  );
};

export default Todo;
