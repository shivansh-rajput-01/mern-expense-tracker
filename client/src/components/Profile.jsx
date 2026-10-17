import React from "react";
import { useContext } from "react";
import authContext from "../contexts/authContext";
import dashContext from "../contexts/dashContext";
import { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

function Profile() {
  const { username, setUsername } = useContext(authContext);
  const { userData, setUserData } = useContext(dashContext);
  let [editDetails, setEditDetails] = useState(false);
  let [mes, setMes] = useState("");
  let [message, setMessage] = useState("");
  let [error, setError] = useState("");
  let [profileDetails, setProfileDetails] = useState({
    username: username,
    email: userData.email,
  });
  let [passwordDetails, setPasswordDetails] = useState({
    oldPass: "",
    newPass: "",
    confirmPass: "",
  });

  async function profileHandler(evt) {
    evt.preventDefault();
    if (!profileDetails.username.trim() || !profileDetails.username.trim()) {
      return;
    }
    try {
      const response = await axios.put(
        "http://localhost:3000/userdata",
        {
          username: profileDetails.username.trim(),
          email: profileDetails.email.trim(),
        },
        {
          withCredentials: true,
        },
      );
      if (response.data.success) {
        setMessage(response.data.message);
        setUsername(response.data.username);
        setUserData(response.data.userData);
        setEditDetails(false);
        console.log(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function passHandler(evt) {
    evt.preventDefault();
    const old = passwordDetails.oldPass.trim();
    const newP = passwordDetails.newPass.trim();
    const cP = passwordDetails.confirmPass.trim();
    setMes("");
    if (!old || !newP || !cP) {
      return;
    }
    if (newP !== cP) {
      setMes("Password do not match");
      return;
    }
    try {
      const response = await axios.put(
        "http://localhost:3000/password",
        {
          oldPass: old,
          newPass: newP,
        },
        {
          withCredentials: true,
        },
      );
      if (response.data.success) {
        setMessage(response.data.message);
        setPasswordDetails({
          oldPass: "",
          newPass: "",
          confirmPass: "",
        });
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="relative dark:text-slate-100 bg-slate-100 dark:bg-linear-to-br dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 w-full md:w-[75%] overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      {message && (
        <div className="absolute top-4 left-1/2 min-w-64 min-h-10 -translate-x-1/2 p-2 flex justify-between bg-green-400 text-white">
          <div className="message">{message}</div>
          <div
            className="close pointer-cursor pl-8"
            onClick={() => {
              setMessage("");
            }}
          >
            <i class="fa-solid fa-xmark"></i>
          </div>
        </div>
      )}
      {error && (
        <div className="fixed inset-0 left-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-1000">
          <div className="del-box flex flex-col w-80 min-h-40 p-8 bg-white text-black rounded-md">
            <div className="msg mb-4">
              <i className="fa-solid fa-triangle-exclamation"></i>
              {error}
            </div>
            <div className="btns flex justify-around">
              <button className="w-20 h-10 border border-red-500 text-red-900 hover:bg-red-500 hover:text-white rounded-sm hidden">
                Delete
              </button>
              <button
                className="w-20 h-10 border border-slate-700 text-slate-950 hover:bg-slate-950 hover:text-white rounded-sm"
                onClick={() => setError("")}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="hero w-full flex flex-col my-6 justify-center items-center">
        <div className="avatar w-20 h-20 rounded-full bg-slate-500 text-white text-4xl outline outline-4 outline-purple-500 outline-offset-4 p-4 flex justify-center items-center">
          {username.slice(0, 1)}
        </div>
        <div className="name my-2 text-2xl">{username}</div>
        <div className="role text-lg">Role: {userData.role}</div>
      </div>
      <div className="personal-info flex flex-col lg:flex-row justify-around">
        <div className="direct w-[90%] mx-auto my-4 md:my-1 md:w-[45%] bg-white rounded-md shadow-sm dark:bg-white/5 min-h-90 relative">
          <div className="heading h-16 border-b flex items-center px-4 border-b-slate-100 dark:border-b-slate-700">
            User Profile Details
          </div>
          {!editDetails && (
            <>
              <div className="info">
                <div className="sub-info mx-auto w-[90%] my-2">Username</div>
                <div className="actual-data border border-slate-700 dark:border-slate-100 mx-auto rounded-md h-10 flex items-center px-4 w-[90%]">
                  {username}
                </div>
              </div>
              <div className="info">
                <div className={`sub-info mx-auto w-[90%] my-2 ${!userData.isVerified? "text-red-400": ""}`}>Email</div>
                <div className={`actual-data border mx-auto rounded-md h-10 flex items-center px-4 w-[90%] ${!userData.isVerified? "border-red-400": "border-slate-700 dark:border-slate-100"}`}>
                  {userData.email}
                </div>
                {!userData.isVerified && <div className="w-[90%] mx-auto text-red-400">Email not verified</div>}
                {!userData.isVerified && <div className="w-[90%] mx-auto"><NavLink to="/verify"><button className="w-16 h-8 rounded-sm bg-slate-700 text-white">Verify</button></NavLink></div>}
              </div>
            </>
          )}
          {editDetails && (
            <form className="user-details" onSubmit={profileHandler}>
              <label htmlFor="username" className="block my-2 w-[90%] mx-auto">
                Username
              </label>
              <input
                type="text"
                placeholder="username"
                className="w-[90%] mx-auto block outline focus:outline-4 focus:outline-blue-400 h-10 rounded-md px-4"
                value={profileDetails.username}
                onChange={(evt) =>
                  setProfileDetails((prev) => ({
                    ...prev,
                    username: evt.target.value,
                  }))
                }
                id="username"
                required
              />
              <label htmlFor="email" className="block my-2 w-[90%] mx-auto">
                Email
              </label>
              <input
                type="email"
                placeholder="email"
                className="w-[90%] mx-auto block outline focus:outline-4 focus:outline-blue-400 h-10 rounded-md px-4"
                value={profileDetails.email}
                onChange={(evt) =>
                  setProfileDetails((prev) => ({
                    ...prev,
                    email: evt.target.value,
                  }))
                }
                id="email"
                required
              />
              <div className="w-[90%] mx-auto my-2">
                <button className="border border-slate-700 dark:border-slate-100 w-32 h-10 rounded-sm text-white bg-slate-700 dark:text-slate-100 dark:bg-slate-500">
                  Save Changes
                </button>
              </div>
            </form>
          )}
          <div className="absolute bottom-6 left-6">
            {!editDetails && (
              <button
                className="border border-slate-700 dark:border-slate-100 w-32 h-10 rounded-sm text-white bg-slate-700 dark:text-slate-100 dark:bg-slate-500"
                onClick={() => setEditDetails(true)}
              >
                Edit Details
              </button>
            )}
          </div>
        </div>
        <div className="sensetive w-[90%] mx-auto my-4 md:my-1 md:w-[45%] bg-white rounded-md shadow-sm dark:bg-white/5 min-h-90">
          <div className="heading h-16 border-b flex items-center px-4 border-b-slate-100 dark:border-b-slate-700">
            Security & Access
          </div>
          <form className="password" onSubmit={passHandler}>
            <label htmlFor="oldpass" className="block my-2 w-[90%] mx-auto">
              Current Password
            </label>
            <input
              type="text"
              placeholder="old password"
              className="w-[90%] mx-auto block outline focus:outline-4 focus:outline-blue-400 h-10 rounded-md px-4"
              value={passwordDetails.oldPass}
              onChange={(evt) =>
                setPasswordDetails((prev) => ({
                  ...prev,
                  oldPass: evt.target.value,
                }))
              }
              id="oldpass"
              required
            />
            <label htmlFor="newpass" className="block my-2 w-[90%] mx-auto">
              New Password
            </label>
            <input
              type="text"
              placeholder="New password"
              className="w-[90%] mx-auto block outline focus:outline-4 focus:outline-blue-400 h-10 rounded-md px-4"
              value={passwordDetails.newPass}
              onChange={(evt) =>
                setPasswordDetails((prev) => ({
                  ...prev,
                  newPass: evt.target.value,
                }))
              }
              id="newpass"
              required
            />
            <label htmlFor="confirmpass" className="block my-2 w-[90%] mx-auto">
              Confirm Password
            </label>
            <input
              type="text"
              placeholder="Confirm password"
              className="w-[90%] mx-auto block outline focus:outline-4 focus:outline-blue-400 h-10 rounded-md px-4"
              value={passwordDetails.confirmPass}
              onChange={(evt) =>
                setPasswordDetails((prev) => ({
                  ...prev,
                  confirmPass: evt.target.value,
                }))
              }
              id="confirmpass"
              required
            />
            {mes && (
              <div className="text-sm text-red-500 w-[90%] mx-auto">{mes}</div>
            )}
            <div className="w-[90%] mx-auto my-2">
              <button className="border border-slate-700 dark:border-slate-100 w-32 h-10 rounded-sm text-white bg-slate-700 dark:text-slate-100 dark:bg-slate-500">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
