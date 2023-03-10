import * as css from "./style/style";
import { FormOutlined } from "@ant-design/icons";
import { CallBacksType, StatesType } from "./AppContainer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Todo from "./pages/Todo";
import NotFound from "./pages/NotFound";
import TodoEdit from "./pages/TodoEdit";
import Login from "./pages/Login";
type propsType = {
  states: StatesType;
  callBacks: CallBacksType;
};

function App({ states, callBacks }: propsType) {
  return (
    <BrowserRouter>
      <css.Wrapper className="wrap">
        <css.Inner className="inner">
          <css.AppTitle>
            <FormOutlined />
            TodoList App
          </css.AppTitle>
        </css.Inner>
        {/* 라우팅 영역 */}
        <Routes>
          {/* 로그인 화면 */}
          {/* <Route path="/login" element={<Login />} /> */}
          {/* 첫화면 : 입력창, 목록창 */}
          <Route
            path="/"
            element={<Todo states={states} callBacks={callBacks} />}
          />
          {/* 수정화면 : 편집창 */}
          <Route
            path="/edit/:uid"
            element={<TodoEdit states={states} callBacks={callBacks} />}
          />
          {/* 주소오류 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </css.Wrapper>
    </BrowserRouter>
  );
}

export default App;
