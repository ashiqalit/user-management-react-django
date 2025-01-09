import React, { useState } from "react";
import "./CreateUserPage.css";
import { replace, useNavigate } from "react-router-dom";
import adminAxiosInstance from "../../adminaxiosconfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const CreateUserPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false)
  
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let tempErrors = {};

    if (!userData.first_name.trim()) {
      tempErrors.first_name = "First name required";
    } else if (userData.first_name.includes(".")) {
      tempErrors.first_name = "First name cannot contain a dot";
    }

    if (!userData.last_name.trim()) {
      tempErrors.last_name = "Last name required";
    } else if (userData.last_name.includes(".")) {
      tempErrors.last_name = "Last name cannot contain a dot";
    }

    if (!userData.username.trim()) {
      tempErrors.username = "Username required";
    } else if (!/^[a-zA-Z]+$/.test(userData.username)) {
      tempErrors.username =
        "Username can only contains letters (No numbers or special characters)";
    }

    if (!userData.email.trim()) {
      tempErrors.email = "Email required";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      tempErrors.email = "Email is invalid";
    }

    if (!userData.password) {
      tempErrors.password = "Password is required";
    } else if (
      !/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>~`]).{8,}/.test(
        userData.password
      )
    ) {
      tempErrors.password =
        "Password must contain atleast one uppercase, lowercase, special character and digit";
    }

    if (userData.password !== userData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
          const response = await adminAxiosInstance.post("/admin/create-user/", {
          first_name: userData.first_name,
          last_name: userData.last_name,
          username: userData.username,
          email: userData.email,
          password: userData.password,
        });
        navigate("/admin/dashboard", {replace:true});
      } catch (error) {
        console.error("Failed to create user", error);
      }
    }
  };

  const handleCancel = () => {
    navigate("/admin/dashboard");
  };

  return (
    <div className="create-user-page">
      <h2 className="create-user-title">Create new user</h2>
      <form className="create-user-form" onSubmit={handleSubmit}>
        <input
          className="create-user-input"
          name="first_name"
          value={userData.first_name}
          onChange={handleChange}
          placeholder="First Name"
          required
        />
        {errors.first_name && <span className="error">{errors.first_name}</span>}
        <input
          className="create-user-input"
          name="last_name"
          value={userData.last_name}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />
        {errors.last_name && <span className="error">{errors.last_name}</span>}
        <input
          className="create-user-input"
          name="username"
          value={userData.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        {errors.username && <span className="error">{errors.username}</span>}
        <input
          className="create-user-input"
          name="email"
          value={userData.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          required
        />
        {errors.email && <span className="error">{errors.email}</span>}
        <input
          className="create-user-input"
          name="password"
          value={userData.password}
          onChange={handleChange}
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          required
        />
        {errors.password && <span className="error">{errors.password}</span>}
        <input
          className="create-user-input"
          name="confirmPassword"
          value={userData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          type={showPassword ? "text" : "password"}
          required
        />
        <span className="eye-icon" onClick={togglePasswordVisibility}>
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </span>
        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}

        <div className="create-user-button-group">
          <button className="create-user-submit" type="submit">Create User</button>
          <button className="create-user-cancel" type="button" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserPage;
