import React, { useEffect } from "react";
import "./Home.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthData, setAuthData, updateToken } from "../../redux/auth/authSlice";
import axios from "axios";

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useEffect(() => {
  //   try {
  //     const intervalUpdation = setInterval(async () => {
  //       const storedAccessToken = localStorage.getItem("accessToken");
  //       if (storedAccessToken) {
  //         try {
  //           const newAccessToken = await dispatch(updateToken()).unwrap();
  //           axios.defaults.headers.common[
  //             "Authorization"
  //           ] = `Bearer ${newAccessToken}`;
  //         } catch (error) {
  //           console.error("Token refresh failed", error);
  //           handleLogout();
  //         }
  //       }
  //     }, 4000);
  //     return () => clearInterval(intervalUpdation);
  //   } catch (error) {}

  //   if (!user) {
  //     const storedUserData = localStorage.getItem("user");
  //     if (storedUserData) {
  //       const parsedUserData = JSON.parse(storedUserData);
  //       dispatch(setAuthData({ user: parsedUserData }));
  //       intervalUpdation();
  //     } else {
  //       handleLogout();
  //     }
  //   }
  // }, [dispatch, navigate, user]);

  const isTokenExpired = (token) => {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    return decodedToken.exp * 1000 < Date.now();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(clearAuthData());
    navigate("/login");
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-brand">User Side</div>
        <div className="navbar-menu">
          <Link to={"/user-profile"} className="navbar-item">
            User Profile
          </Link>
          <button onClick={handleLogout} className="navbar-item logout-btn">
            Logout
          </button>
        </div>
      </nav>
      <main className="main-content">
        <h1>Welcome, {user ? user.first_name : "Guest"}!</h1>
        <p>This is your personalized home page. Explore and enjoy!</p>
      </main>
    </div>
  );
};

export default Home;
