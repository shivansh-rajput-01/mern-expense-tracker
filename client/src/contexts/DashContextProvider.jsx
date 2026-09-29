import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import dashContext from './dashContext';
import axios from 'axios';
import authContext from './authContext';

function DashContextProvider({ children }) {
  let {username} = useContext(authContext);
  let [userData, setUserData] = useState("");
  let [category, setCategory] = useState("");
  let [admin, setAdmin] = useState("");
  let [del, setDel] = useState("");
  let [budget, setBudget] = useState("");

  async function getAdmin() {
    try {
      const response = await axios.get("http://localhost:3000/admindata", {
        withCredentials: true
      });

      setAdmin(response.data.adminid);

    } catch (err) {
      console.log(err);
    }
  }

  async function getCategory(id) {
      try {
          const response = await axios.get(`http://localhost:3000/categories?userId=${id}`, {
              withCredentials: true
          });
          setCategory(response.data.cat);
      } catch (err) {
          console.log(err);
      }
  }

  const user = { username };

  const getUser = async () => {
    try {
      const response = await axios.post("http://localhost:3000/userinfo", user, {
        withCredentials: true
      });
      setUserData(response.data.userData);
      return response.data.userData.id;
    } catch (err) {
      console.log(err);
    }
  }

  async function caller(){
    if(!username) return;
    const user = await getUser();
    await getAdmin();
    await getCategory(user);
  }

  useEffect(() => {
    if(username){
      caller();
    }
  }, [username]);

  return (
    <dashContext.Provider value={{ userData, setUserData, category, setCategory, admin, del, setDel, budget, setBudget }}>
      {children}
    </dashContext.Provider>
  )
}

export default DashContextProvider