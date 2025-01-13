import React, { useEffect, useState } from "react";
import "./AdminLogin.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import adminAxiosInstance from "../../adminaxiosconfig";
import { clearAuthAdminData, setAuthAdminData } from "../../redux/auth/authSlice";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const adminUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (adminUser && adminUser.is_superuser) {
      navigate("/admin/dashboard");
    }
  }, [adminUser, navigate]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem("adminUser"); 
      localStorage.removeItem("adminAccessToken"); 
      localStorage.removeItem("adminRefreshToken"); 
      localStorage.removeItem("adminData"); 
      dispatch(clearAuthAdminData());
      const response = await adminAxiosInstance.post("/admin/token/", {
        email,
        password,
      });
      const {user, admin_token, refresh_token } = response.data
      localStorage.setItem("adminUser", JSON.stringify(response.data.user));
      localStorage.setItem("adminAccessToken", admin_token);
      localStorage.setItem("adminRefreshToken", refresh_token);
      localStorage.setItem("adminData", JSON.stringify(response.data));
      // console.log(response.data);
      
      dispatch(setAuthAdminData({
        adminUser: user,
        adminAccessToken: admin_token,
        adminRefreshToken: refresh_token
      }));
      navigate("/admin/dashboard/", { replace: true });
    } catch (error) {
      console.error("Admin login failed", error);
      setError(error.response?.data?.detail || "Login failed, check your credentials." );
    }
  };
  return (
    <div className="admin-login-container">
      <div className="admin-login-form">
        <h2 className="admin-login-title">Admin Login</h2>
        <form onSubmit={handleAdminLogin}>
          <div className="input-container">
            <input
              type="email"
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
          </div>
          <button type="submit" className="admin-login-button">Login</button>
        </form>
        {error && <div className="error">{error}</div>}
        <div className="admin-login-links">
          <div className="redirect">
            <p>Switch to User? <Link to="/login">User Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
