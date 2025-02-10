import { createSlice } from "@reduxjs/toolkit";

const friendSlice = createSlice({
  name: "friends",
  initialState: {
    friendList: {
      friends: []
    },
    requestList: {
      requests: []
    },
    loading: false,
    error: null,
  },
  reducers: {
    fetchFriendsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchFriendsSuccess: (state, action) => {
      state.loading = false;
      state.friendList = action.payload;
    },
    fetchFriendsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchFriendRequestsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchFriendRequestsSuccess: (state, action) => {
      state.loading = false;
      state.requestList = action.payload;
    },
    fetchFriendRequestsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    sendFriendRequestRequest: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    sendFriendRequestSuccess: (state, action) => {
      state.loading = false;
      state.requestList.requests.push(action.payload)
    },
    sendFriendRequestFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    removeFriendRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    removeFriendSuccess: (state, action) => {
      state.loading = false;
      state.friendList.friends = state.friendList.friends.filter((friend) => friend._id !== action.payload._id);
    },
    removeFriendFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    acceptFriendRequestRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    acceptFriendRequestSuccess: (state, action) => {
      state.loading = false;
      state.friendList.friends.push(action.payload)
      state.requestList.requests = state.requestList.requests.filter((req) => req._id !== action.payload._id);
    },
    acceptFriendRequestFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
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
} = friendSlice.actions;

export default friendSlice.reducer;