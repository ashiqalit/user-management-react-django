import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import Home from "./components/home/Home";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import CreateUserPage from "./components/admin/CreateUserPage";
import UserProfile from "./components/home/UserProfile";
import DefaultAdmin from "./components/defaultadmin/defaultAdmin";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/admin/login" element={<AdminLogin/>} />
          <Route path="/admin/dashboard" element={<AdminDashboard/>} />
          <Route path="/admin/create-user" element={<CreateUserPage/>} />
          <Route path="/user-profile" element={<UserProfile/>} />
          <Route path="/defaultadmin" element={<DefaultAdmin/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
