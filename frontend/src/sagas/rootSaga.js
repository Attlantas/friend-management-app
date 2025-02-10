import { all } from "redux-saga/effects";
import watchAuthSaga from "./authSaga";
import watchFriendSaga from "./friendSaga";

export default function* rootSaga() {
  yield all([watchAuthSaga(), watchFriendSaga()]);
}