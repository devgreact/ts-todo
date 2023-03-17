import { call, put, takeEvery } from "redux-saga/effects";
import { getCatsSuccess } from "./catSlice";

function* workGetCatsFetch() {
  console.log("catSaga: workGetCatsFetch");
  const cats = yield call(() =>
    fetch(
      "https://api.thecatapi.com/v1/breeds?api_key=live_Z9dx0VtiK2f0qbMsh1fhE7Z3Sw21vaP79MAhtKChl3XFPpWKvoBDSa6OSqZHYNSJ"
    )
  );

  console.log("catSaga: call", cats);
  const formattedCats = yield cats.json();
  const formattedCatsShortened = formattedCats.slice(0, 10);
  yield put(getCatsSuccess(formattedCatsShortened));
}

function* catSaga() {
  console.log("catSaga: catSaga");
  yield takeEvery("cats/getCatsFetch", workGetCatsFetch);
}

export default catSaga;
