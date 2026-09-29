import React, { useEffect, useState } from 'react'
import authContext from './authContext'
import axios from "axios"

function AuthContextProvider({ children }) {

    let [username, setUsername] = useState("");
    let [loading, setLoading] = useState(true);
    
    const getStatus = async () => {
        try{
            const response = await axios.get("http://localhost:3000/me", {
                withCredentials: true
            });
            setUsername(response.data.username);
        } catch (err) {
            console.log(err);
            setUsername("");
        } finally {
            setLoading(false);
        }
    }

    // on site render(1st time) check from server if cookies has username i.e. login
    useEffect(() => { 
        getStatus();
    }, []);

    return (
        <authContext.Provider value={{ username, setUsername, loading, setLoading }}>
            {children}
        </authContext.Provider>
    )
}

export default AuthContextProvider