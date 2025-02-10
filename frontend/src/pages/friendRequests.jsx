// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector, useDispatch } from "react-redux";
// import { acceptFriendRequest } from "../store/friendSlice";

// const FriendRequests = () => {
//   const [requests, setRequests] = useState([]);
//   const token = useSelector((state) => state.auth.token);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchRequests = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/friends/requests", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setRequests(response.data.requests);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchRequests();
//   }, [token]);

//   const handleAcceptRequest = async (senderId) => {
//     try {
//       await axios.post(
//         "http://localhost:5000/api/friends/request/accept",
//         { senderId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       dispatch(acceptFriendRequest(senderId));
//       setRequests(requests.filter((req) => req._id !== senderId));
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <h3>Friend Requests</h3>
//       {requests.length === 0 ? <p>No friend requests</p> : null}
//       <ul>
//         {requests.map((req) => (
//           <li key={req._id}>
//             {req.name}
//             <button onClick={() => handleAcceptRequest(req._id)}>Accept</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default FriendRequests;
