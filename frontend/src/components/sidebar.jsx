import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import "../styles/sidebar.css";

const Sidebar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="sidebar">
      {/* User Info */}
      <div className="user-info">
        <img
          src={user?.profilePic || "/default_avatar.png"}
          alt="Profile"
          className="user-profile-pic"
        />
        <h4>{user?.name || "Guest"}</h4>
      </div>

      {/* Navigation Links */}
      <nav className="nav-links">
        <NavLink to="/friends" className="active">
          🏠 Friends
        </NavLink>
        <NavLink to="/add-friend" className="active">
          ➕ Add Friend
        </NavLink>
        <button className="logout-btn" onClick={() => dispatch(logout())}>
          🚪 Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
