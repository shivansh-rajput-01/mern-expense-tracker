import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import authContext from "../contexts/authContext";
import axios from "axios";
import handleLogout from "../utils/Logout";
import { useState } from "react";

export default function Navbar() {
  const { username, setUsername, setLoading } = useContext(authContext);
  let [profile, setProfile] = useState(false);
  const navigate = useNavigate();

  function navigateToDashboard() {
    navigate("/dashboard");
  }

  return (
    <div className="w-full absolute h-16 top-0 bg-slate-800 text-white flex justify-between py-4 px-12">
      <NavLink
        to="/home"
        className={({ isActive }) => (isActive ? "text-orange-400" : "")}
      >
        Home
      </NavLink>
      <div className="profile px-2 flex gap-4">
        {!username && (
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? "text-orange-400" : "")}
          >
            Login
          </NavLink>
        )}
        {!username && (
          <NavLink
            to="/register"
            className={({ isActive }) => (isActive ? "text-orange-400" : "")}
          >
            Register
          </NavLink>
        )}
        {username && (
          <div
            className="relative picture w-10 h-10 rounded-full mx-4 flex justify-center items-center bg-slate-700 text-2xl text-white"
            onClick={() => setProfile((prev) => !prev)}
          >
            {username.slice(0, 1)}

            {profile && (
              <div className="absolute top-10 right-0 w-32 min-h-20 bg-white rounded-md shadow-md">
                <div
                  className="text-slate-800 rounded-md text-[16px] h-10 flex items-center justify-center border-b border-b-slate-200 hover:bg-slate-100"
                  onClick={navigateToDashboard}
                >
                  Dashboard
                </div>
                <div
                  className="text-slate-800 rounded-md text-[16px] h-10 flex items-center justify-center border-b border-b-slate-200 hover:bg-slate-100"
                  onClick={() => {handleLogout(setUsername, setLoading)}}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        )}
        {/* {username && <button onClick={() => {handleLogout(setUsername, setLoading)}}>Logout</button>} */}
      </div>
    </div>
  );
}
