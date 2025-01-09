import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosconfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validate = () => {
    let tempErrors = {};

    if (!formData.firstName.trim()) {
      tempErrors.firstName = "First name required";
    } else if (formData.firstName.includes(".")) {
      tempErrors.firstName = "First name cannot contain a dot";
    }

    if (!formData.lastName.trim()) {
      tempErrors.lastName = "Last name required";
    } else if (formData.lastName.includes(".")) {
      tempErrors.lastName = "Last name cannot contain a dot";
    }

    if (!formData.username.trim()) {
      tempErrors.username = "Username required";
    } else if (!/^[a-zA-Z]+$/.test(formData.username)) {
      tempErrors.username =
        "Username can only contains letters (No numbers or special characters)";
    }

    if (!formData.email.trim()) {
      tempErrors.email = "Email required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (
      !/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>~`]).{8,}/.test(
        formData.password
      )
    ) {
      tempErrors.password =
        "Password must contain atleast one uppercase, lowercase, special character and digit";
    }

    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axiosInstance.post("/signup/", {
          first_name: formData.firstName,
          last_name: formData.lastName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        navigate("/login/", { replace: true });
      } catch (error) {
        console.error("Signup failed", error);
        setError(error)
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <div className="signup-avatar-container">
          <div className="signup-avatar">
            <h2>User Registration</h2>
          </div>
        </div>
        <form onSubmit={handleSignup}>
          <div className="input-container">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
            />
            {errors.firstName && (
              <span className="error">{errors.firstName}</span>
            )}

            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
            />
            {errors.lastName && (
              <span className="error">{errors.lastName}</span>
            )}

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
            {errors.username && (
              <span className="error">{errors.username}</span>
            )}

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            {errors.email && <span className="error">{errors.email}</span>}

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}

            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
            />
            <span className="eye-icon" onClick={togglePasswordVisibility}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
            {errors.confirmPassword && (
              <span className="error">{errors.confirmPassword}</span>
            )}
          </div>
          <button type="submit" className="signup-button">
            Signup
          </button>
        </form>
        {error && (
          <div className="error">
            {Object.keys(error.response.data).map((key) => (
              <div key={key}>{error.response.data[key].map((message, index) => (
                <span key={index}>{message}</span>
              ))}</div>
            ))}
          </div>
        )}
        <div className="redirect">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
