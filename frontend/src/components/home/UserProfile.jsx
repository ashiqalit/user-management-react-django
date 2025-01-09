import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosconfig";
import { clearAuthData } from "../../redux/auth/authSlice";
import "./UserProfile.css";

const UserProfile = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newProfilePicture, setNewProfilePicture] = useState(null);

  const [error, setError] = useState(null);

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get("user-profile/");
      setProfile(response.data);
      setNewFirstName(response.data.first_name);
      setNewLastName(response.data.last_name);
      setNewUserName(response.data.username);
      setNewEmail(response.data.email);
      setError(null);
    } catch (error) {
      console.error("Error fetching profile", error);
      if (error.response && error.response.status === 401) {
        handleLogout();
      } else {
        setError(error);
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setUsernameError("");
    setFileError("");
  };

  const validateFirstName = (firstName) => {
    if (!firstName.trim()) {
      setFirstNameError("First Name is required");
      return false;
    } else if (firstName.includes(".")) {
      setFirstNameError("First name cannot contain a dot");
      return false;
    }
    setFirstNameError("");
    return true;
  };

  const validateLastName = (lastName) => {
    if (!lastName.trim()) {
      setLastNameError("Last Name is required");
      return false;
    } else if (lastName.includes(".")) {
      setLastNameError("Last name cannot contain a dot");
      return false;
    }
    setLastNameError("");
    return true;
  };

  const validateEmail = (email) => {
    if (!email.trim()) {
      setEmailError("Email is required");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validateUsername = (username) => {
    if (!username.trim()) {
      setUsernameError("Username is required");
      return false;
    } else if (!/^[a-zA-Z]+$/.test(username)) {
      setUsernameError(
        "Username can only contains letters (No numbers or special characters)"
      );
      return false;
    }
    setUsernameError("");
    return true;
  };

  const validateFile = (file) => {
    if (file) {
      const allowdTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowdTypes.includes(file.type)) {
        setFileError("Only JPG, JPEG, and PNG files are allowed");
        return false;
      }
    }
    setFileError("");
    return true;
  };

  const handleSave = async () => {
    if (
      !validateFirstName(newFirstName) ||
      !validateLastName(newLastName) ||
      !validateUsername(newUserName) ||
      !validateEmail(newEmail) ||
      !validateFile(newProfilePicture)
    ) {
      return;
    }
    const formData = new FormData();
    formData.append("firstName", newFirstName);
    formData.append("lastName", newLastName);
    formData.append("username", newUserName);
    formData.append("email", newEmail);
    if (newProfilePicture) {
      formData.append("profile_picture", newProfilePicture);
    }
    try {
      await axiosInstance.put("user-profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile", error);
      setError(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(clearAuthData());
    navigate("/login");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (validateFile(file)) {
      setNewProfilePicture(file);
    } else {
      e.target.value = "";
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile">
      <h1 className="profile-title">User Profile</h1>
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-picture">
            {profile.profile_picture ? (
              <img src={profile.profile_picture} alt="Profile" />
            ) : (
              <div className="profile-initial">{user?.first_name[0]}</div>
            )}
          </div>
          <h2 className="profile-name">
            Welcom {user?.first_name} {user?.last_name}
          </h2>
        </div>
        <div className="profile-body">
          {isEditing ? (
            <div className="edit-form">
              <input
                type="text"
                value={newFirstName}
                onChange={(e) => {
                  setNewFirstName(e.target.value);
                  validateFirstName(e.target.value);
                }}
                placeholder="New First Name"
              />
              {firstNameError && (
                <span className="error">{firstNameError}</span>
              )}
              <input
                type="text"
                value={newLastName}
                onChange={(e) => {
                  setNewLastName(e.target.value);
                  validateLastName(e.target.value);
                }}
                placeholder="New Last Name"
              />
              {lastNameError && <span className="error">{lastNameError}</span>}
              <input
                type="text"
                value={newUserName}
                onChange={(e) => {
                  setNewUserName(e.target.value);
                  validateUsername(e.target.value);
                }}
                placeholder="New Username"
              />
              {usernameError && <span className="error">{usernameError}</span>}
              <input
                type="text"
                value={newEmail}
                onChange={(e) => {
                  setNewEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                placeholder="New Email"
              />
              {emailError && <span className="error">{emailError}</span>}
              <input
                type="file"
                onChange={handleFileChange}
                className="file-input"
                accept=".jpg,.jpeg,.png"
              />
              {fileError && <span className="error">{fileError}</span>}
              <button onClick={handleSave} className="save-btn">
                Save
              </button>
            </div>
          ) : (
            <div className="profile-info">
              <p>First Name: {profile.first_name}</p>
              <p>Last Name: {profile.last_name}</p>
              <p>Username: {profile.username}</p>
              <p>Email: {profile.email}</p>
              <div className="profile-actions">
                <button onClick={handleEdit} className="edit-btn">
                  Edit Profile
                </button>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
