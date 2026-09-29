import axios from "axios";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import authContext from "../contexts/authContext";

export default function Login(){

    let [userName, setUserName] = useState('');
    let [password, setPassword] = useState('');
    let [message, setMessage] = useState(false);
    let [error, setError] = useState(false);

    const navigate = useNavigate();

    const {setUsername, setLoading} = useContext(authContext);

    async function submitHandler(evt){
        evt.preventDefault();
        const user = {
            userName,
            password
        }
        try{
            const response = await axios.post("http://localhost:3000/login", user, {
                withCredentials: true
            });
            setMessage(response.data.message);
            setUsername(response.data.username);
            setLoading(false);
            navigate("/dashboard");
        } catch (err) {
            if(err.response){
                setError(err.response.data.message);
            }
        }
    }

    return (
        <div className="flex justify-center items-center w-full selection:bg-white bg-slate-50 h-screen pt-16">
            <div className="reg-box w-100 p-10 shadow-md rounded-md flex justify-center items-center bg-white">
                <form onSubmit={submitHandler} className="h-[90%]">
                    {message && <div className="w-80 h-10 p-2 rounded-sm bg-green-400 text-white">{message}</div>}
                    {error && <div className="w-80 h-10 p-2 rounded-sm bg-red-400 text-white">{error}</div>}
                    <label htmlFor="username" className="block mb-2">Username</label>
                    <input type="text" placeholder="Username" id="username" className="outline p-2 rounded-sm w-80 h-10 mb-2 focus:outline-4 focus:outline-blue-400" value={userName} onChange={(e) => setUserName(e.target.value)} required/>
                    <label htmlFor="password" className="block mb-2">Password</label>
                    <input type="password" placeholder="Password" id="password" className="outline p-2 rounded-sm w-80 h-10 mb-2 focus:outline-4 focus:outline-blue-400" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    <button className="bg-slate-900 text-white w-80 h-10 p-2 rounded-sm my-4 block selection:bg-sl">Login</button>
                    <div>New User: <NavLink to="/register" className="text-blue-500 font-bold">Register</NavLink></div>
                </form>
            </div>
        </div>
    )
}
