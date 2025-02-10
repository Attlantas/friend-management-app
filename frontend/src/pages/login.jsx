import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest, registerRequest } from "../store/authSlice"; // Import actions
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/auth.css"; // Import the styles

const LoginRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user, token, loading, error, isRegistering, registrationSuccess} = useSelector((state) => state.auth);

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    if (user && token) {
      navigate("/friends"); // Redirect when user is logged in
    }
  }, [user, token, navigate]);

  // Handle successful registration
  useEffect(() => {
    if (registrationSuccess) {
      toast.success("Registration successful! Please log in.");
      setIsRegisterMode(false);
      setFormData({ name: "", email: "", password: "" }); // Clear fields
    }
  }, [registrationSuccess, dispatch]);

  useEffect(() => {
    setFormData({ name: "", email: "", password: "" }); // Clear fields
  }, [isRegisterMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isRegisterMode) {
      dispatch(registerRequest(formData));
    } else {
      dispatch(loginRequest({email: formData.email, password: formData.password}))
    }
  };

  console.log("error: ", error);

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isRegisterMode ? "Create an account" : "Welcome Back!"}</h2>
        <p className="toggle-text">
          {isRegisterMode ? "Already have an account?" : "Don't have an account?"}{" "}
          <span onClick={() => setIsRegisterMode(!isRegisterMode)}>
            {isRegisterMode ? "Login" : "Register"}
          </span>
        </p>

        <form onSubmit={handleSubmit}>
          {isRegisterMode && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading || isRegistering}>
            {(loading || isRegistering) ? "Processing..." : isRegisterMode ? "Register" : "Login"}
          </button>
        </form>

        {error && <p className="error-message">{error.message}</p>}
      </div>
    </div>
  );
};

export default LoginRegister;