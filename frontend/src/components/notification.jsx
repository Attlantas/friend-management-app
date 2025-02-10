// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
// import { acceptFriendRequestRequest } from "../store/friendSlice";
// import "../styles/notification.css";
// import io from "socket.io-client";
// import {WEBSOCKET_SERVER_URL} from '../constants';

// const socket = io(WEBSOCKET_SERVER_URL);

// const Notification = () => {
//   const [notifications, setNotifications] = useState([]);
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.auth.user);

//   useEffect(() => {
//     if (!user) return;

//     // Listen for incoming friend requests
//     socket.emit("user_online", user.id);
//     socket.on("friend_request", (data) => {
//       setNotifications((prev) => [...prev, data]);
//     });

//     return () => socket.off("friend_request");
//   }, [user]);

//   return (
//     <div className="notification-container">
//       <h3>Notifications</h3>
//       {notifications.length > 0 ? (
//         notifications.map((notif, index) => (
//           <div key={index} className="notification-item">
//             <p>
//               <strong>{notif.senderName}</strong> sent you a friend request.
//             </p>
//             <button onClick={() => dispatch(acceptFriendRequestRequest(notif.senderId))} className="accept-btn">
//               Accept
//             </button>
//           </div>
//         ))
//       ) : (
//         <p>No new notifications.</p>
//       )}
//     </div>
//   );
// };

// export default Notification;
