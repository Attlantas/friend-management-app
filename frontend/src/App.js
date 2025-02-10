import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./store";
import { loginSuccess } from "./store/authSlice";
import ProtectedRoute from "./utils/protectedRoute";
import LoginRegister from "./pages/login";
import Friends from "./pages/friends";
import Logout from "./components/logout";
import AddFriend from "./components/addFriend";
import Notification from "./components/notification";
import Sidebar from "./components/sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";  // Import styles
import "./styles/app.css";
import { setupSocketListeners } from "./utils/socket";
//import "./styles/global.css"; // Import a global stylesheet for consistency

const App = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    // Check if the user was already logged in
    const savedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    const savedUser = localStorage.getItem("user") || sessionStorage.getItem("user");

    const parsedUser = savedUser ? JSON.parse(savedUser) : null;

    if (savedToken && savedUser) {
      //dispatch(loginSuccess({token: savedToken, user: parsedUser, rememberMe: true}));

      // Emit the `user_online` event after login or page refresh
      setupSocketListeners(dispatch, user._id);
    }
  }, [dispatch]);

  return (
    <Provider store={store}>
      <Router>
        <div className="app-container">
          {token && <Sidebar />}
          <div className={token ? 'main-content with-sidebar' : 'main-content'}>
            <Routes>
              {/* If user is logged in, redirect to Friends. Otherwise, show Login/Register */}
              <Route path="/" element={token ? <Navigate to="/friends" /> : <LoginRegister />} />
              
              <Route
                path="/friends"
                element={
                  <ProtectedRoute>
                    <Friends />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-friend"
                element={
                  <ProtectedRoute>
                    <AddFriend />
                  </ProtectedRoute>
                }
              />
            </Routes>
            {/* Toast Notification Container */}
            <ToastContainer />
          </div>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
