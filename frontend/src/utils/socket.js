import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import {WEBSOCKET_SERVER_URL} from '../constants';

const showNotification = (message, type = 'info') => {
  toast[type](message, {
    position: 'top-right',
    autoClose: 5000, // Auto-hide after 5 seconds
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
}

export const socket = io(WEBSOCKET_SERVER_URL, {
  transports: ['websocket'],
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
  withCredentials: true
});

export const setupSocketListeners = (dispatch, userId) => {
  if (!socket) return;

  socket.on('connect', () => {
    console.log('Connected to WebSocket ✅');
    socket.emit('user_online', userId); // Inform server that user is online
  });

  socket.on('friend_request', (request) => {
    console.log('New Friend Request 📩', request);
    dispatch({type: 'friends/sendFriendRequestSuccess', payload: request});

    showNotification(`📩 New friend request from ${request.name}`);
  });

  socket.on('friend_request_accepted', (friend) => {
    console.log('Friend Added 🎉', friend);
    dispatch({ type: 'friends/acceptFriendRequestSuccess', payload: friend });

    showNotification(`📩 ${friend.name} has accepted your friend request`);
  });

  socket.on('friend_removed', (removedFriendId) => {
    console.log('Friend Removed ❌', removedFriendId);
    dispatch({ type: 'friends/removeFriendSuccess', payload: removedFriendId });
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket ❌');
  });

  // Emit `user_offline` when user closes the tab
  window.addEventListener('beforeunload', () => {
    if (userId) {
      socket.emit('user_offline', userId);
      console.log(`User ${userId} is offline (Tab Closed) ❌`);
    }
  });
};
