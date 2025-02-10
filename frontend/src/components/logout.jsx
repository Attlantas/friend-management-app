import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { socket } from '../utils/socket';

const Logout = () => {
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (user?._id) {
      socket.emit('user_offline', user._id);
      console.log(`User ${user._id} is now offline ❌`);
      socket.disconnect();
    }

    dispatch(logout());
    navigate('/');
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
