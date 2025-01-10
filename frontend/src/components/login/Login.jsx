import React, { useEffect, useState } from "react";
import "./Login.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosconfig";
import { setAuthData } from "../../redux/auth/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState();

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/login/", { email, password });
      const { user, access_token, refresh_token } = response.data;
      // console.log(access_token);
      
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      dispatch(setAuthData(response.data));
      navigate("/home", { replace: true });
    } catch (error) {
      console.error("Login failed", error);
      setError("Login failed. Check your credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="avatar-container">
          <div className="avatar">
            <h2>User Login</h2>
          </div>
        </div>
        <form onSubmit={handleLogin}>
          <div className="input-container">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="input-container">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <span className="password-toggle"></span>
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        {error && <div className="error">{error}</div>}
        <div className="redirect">
          <p>Don't have an account? <Link to={"/signup"}>Signup</Link><br/></p>
          <p>Switch to Admin ?<Link to={"/admin/login"}>Admin Login</Link><br/></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
