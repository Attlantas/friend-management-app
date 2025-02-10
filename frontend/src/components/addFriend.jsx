import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendFriendRequestRequest } from '../store/friendSlice';
import '../styles/add_friend.css';

const AddFriend = () => {
  const [username, setUsername] = useState('');
  const {user} = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleAddFriend = () => {
    if (username.trim()) {
      dispatch(sendFriendRequestRequest({username, userId: user._id}));
      setUsername('');
    }
  };

  return (
    <div className='add-friend-container'>
      <h3>Add a Friend</h3>
      <input
        type='text'
        placeholder='Enter username...'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleAddFriend}>Send Request</button>
    </div>
  );
};

export default AddFriend;