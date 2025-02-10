import { takeLatest, put, call } from "redux-saga/effects";
import axios from "../api/axios";
import { loginSuccess, loginFailure, registerSuccess, registerFailure } from "../store/authSlice";

// Worker Saga: Handles login logic
function* loginSaga(action) {
  try {
    const response = yield call(axios.post, "/auth/login", action.payload);
    yield put(loginSuccess(response.data)); // Dispatch success action
  } catch (error) {
    yield put(loginFailure(error.response?.data || "Login failed")); // Dispatch failure action
  }
}

// Worker Saga: Handles registration logic
function* registerSaga(action) {
  try {
    const response = yield call(axios.post, "/auth/register", action.payload);
    yield put(registerSuccess(response.data)); // Dispatch success action
  } catch (error) {
    yield put(registerFailure(error.response?.data || "Registration failed")); // Dispatch failure action
  }
}

// Watcher saga: Watches for login and register actions
export default function* watchAuthSaga() {
  yield takeLatest("auth/loginRequest", loginSaga); // Watch for loginRequest
  yield takeLatest("auth/registerRequest", registerSaga); // Watch for registerRequest
}
