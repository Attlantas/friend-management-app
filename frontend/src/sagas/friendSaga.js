import {takeLatest, put, call} from "redux-saga/effects";
import axios from "../api/axios";
import {
  fetchFriendsRequest,
  fetchFriendsSuccess,
  fetchFriendsFailure,
  fetchFriendRequestsRequest,
  fetchFriendRequestsSuccess,
  fetchFriendRequestsFailure,
  sendFriendRequestRequest,
  sendFriendRequestSuccess,
  sendFriendRequestFailure,
  removeFriendRequest,
  removeFriendSuccess,
  removeFriendFailure,
  acceptFriendRequestRequest,
  acceptFriendRequestSuccess,
  acceptFriendRequestFailure,
} from "../store/friendSlice";

// Fetch Friends Saga
function* fetchFriendsSaga(action) {
  try {
    const userId = action.payload;

    const response = yield call(axios.get, `friends/${userId}`);
    yield put(fetchFriendsSuccess(response.data)); // ✅ Correctly dispatch success
  } catch (error) {
    yield put(fetchFriendsFailure(error.response?.data || "Failed to fetch friends"));
  }
}

// Fetch Friend Requests Saga
function* fetchFriendRequestsSaga(action) {
  try {
    const userId = action.payload;

    const response = yield call(axios.get, `/friends/${userId}/requests`);
    yield put(fetchFriendRequestsSuccess(response.data));
  } catch (error) {
    yield put(fetchFriendRequestsFailure(error.response?.data || "Failed to fetch friend requests"));
  }
}

// Send Friend Requests Saga
function* sendFriendRequestSaga(action) {
  try {
    const {userId, username} = action.payload;
    
    const response = yield call(axios.post, "/friends/request/send", {userId, username});
    yield put(sendFriendRequestSuccess(response.data));
  } catch (error) {
    yield put(sendFriendRequestFailure(error.response?.data || "Failed to fetch friend requests"));
  }
}

// Remove Friend Saga
function* removeFriendSaga(action) {
  try {
    const {userId, friendId} = action.payload;

    const response = yield call(axios.delete, `/friends/${userId}/remove/${friendId}`);
    yield put(removeFriendSuccess(response.data));
  } catch (error) {
    yield put(removeFriendFailure(error.response?.data || "Failed to remove friend"));
  }
}

// Accept Friend Request Saga
function* acceptFriendRequestSaga(action) {
  try {
    const {userId, friendId} = action.payload;

    const response = yield call(axios.post, "/friends/request/accept", {userId, friendId});
    yield put(acceptFriendRequestSuccess(response.data));
  } catch (error) {
    yield put(acceptFriendRequestFailure(error.response?.data || "Failed to accept request"));
  }
}

// Watcher Saga
export default function* watchFriendSaga() {
  yield takeLatest(fetchFriendsRequest.type, fetchFriendsSaga);
  yield takeLatest(fetchFriendRequestsRequest.type, fetchFriendRequestsSaga);
  yield takeLatest(sendFriendRequestRequest.type, sendFriendRequestSaga);
  yield takeLatest(removeFriendRequest.type, removeFriendSaga);
  yield takeLatest(acceptFriendRequestRequest.type, acceptFriendRequestSaga);
}
