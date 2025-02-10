import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFriendsRequest,
  fetchFriendRequestsRequest,
  acceptFriendRequestRequest,
  removeFriendRequest
} from "../store/friendSlice";
import "../styles/friends.css"; // Import styles

const Friends = () => {
  const dispatch = useDispatch();
  const {
    friendList,
    requestList,
    loading,
    error
  } = useSelector((state) => state.friends);

  const { user } = useSelector((state) => state.auth);
  const {requests = []} = requestList;
  const {friends = []} = friendList;

  useEffect(() => {
    if (user) {
      dispatch(fetchFriendsRequest(user._id));
      dispatch(fetchFriendRequestsRequest(user._id));
    }
  }, [dispatch, user]);

  const handleRemoveFriend = (friend) => {
    const payload = {userId: user._id, friendId: friend._id};

    dispatch(removeFriendRequest(payload));
  };

  const handleAcceptFriend = (friend) => {
    dispatch(acceptFriendRequestRequest({userId: user._id, friendId: friend._id}));
  }

  return (
    <div className="friends-container">
      <h2>Your Friends</h2>
      
      {loading ? <p>Loading...</p> : (
        <div className="friends-list">
          {friends.length > 0 ? (
            friends.map((friend) => (
              <div key={friend._id} className="friend-card">
                <img src={friend.profilePicture || "/default_avatar.png"} alt="Profile" className="profile-pic" />
                <div className="friend-info">
                  <p className="friend-name">{friend.name}</p>
                  <button className="remove-btn" onClick={() => handleRemoveFriend(friend)}>Remove</button>
                </div>
              </div>
            ))
          ) : <p>No friends yet.</p>}
        </div>
      )}

      <h2>Friend Requests</h2>
      {requests.length > 0 ? (
        <div className="requests-list">
          {requests.map((request) => (
            <div key={request._id} className="friend-card">
              <img src={request.profilePicture || "/default_avatar.png"} alt="Profile" className="profile-pic" />
              <div className="friend-info">
                <p className="friend-name">{request.name}</p>
                <button className="accept-btn" onClick={() => handleAcceptFriend(request)}>Accept</button>
              </div>
            </div>
          ))}
        </div>
      ) : <p>No pending requests.</p>}
    </div>
  );
};

export default Friends;
