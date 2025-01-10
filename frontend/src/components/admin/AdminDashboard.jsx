import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearAuthData, setAuthData } from "../../redux/auth/authSlice";
import adminAxiosInstance from "../../adminaxiosconfig";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [activeUsers, setActiveUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      const storedAdminData = localStorage.getItem("adminData");
      if (storedAdminData) {
        dispatch(setAuthData(JSON.parse(storedAdminData)));
      } else {
        navigate("/admin/login");
      }
    }
    fetchDashboardData();
  }, [user, dispatch, navigate]);

  const handleCreateUser = () => {
    navigate("/admin/create-user");
  };

  const fetchDashboardData = async () => {
    try {
      const response = await adminAxiosInstance.get("/admin/dashboard/");
      setActiveUsers(response.data.active_users);
      setInactiveUsers(response.data.inactive_users);
      setMessage(response.data.message);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    dispatch(clearAuthData());
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRefreshToken");
    localStorage.removeItem("adminData");
    navigate("/admin/login");
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await adminAxiosInstance.post(`/admin/users/${userId}/toggle-status/`);
      fetchDashboardData();
    } catch (error) {
      console.error("Failed to toggle user status", error);
    }
  };

  const UserTable = ({ users, tableTitle, isActive }) => {
    return (
      <div className="user-table-container">
        <h3 className="table-title">{tableTitle}</h3>
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className={`action-btn ${
                      isActive ? "block-btn" : "unblock-btn"
                    }`}
                    onClick={() => toggleUserStatus(user.id, user.is_active)}
                  >
                    {isActive ? "Block" : "Unblock"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <div className="user-info">
          <h5 className="welcom-message">
            Welcome {user ? user.first_name : "Admin"}!
          </h5>
          <button className="create-btn" onClick={handleCreateUser}>
            Create User
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="message-container">
          <h5 className="dashboard-message">{message}</h5>
        </div>

        <div className="users-section">
          <UserTable
            users={activeUsers}
            tableTitle="Active Users"
            isActive={true}
          />
          <UserTable
            users={inactiveUsers}
            tableTitle="Inactive Users"
            isActive={false}
          />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
