import { NavLink } from "react-router-dom";
import { useContext } from "react";
import authContext from "../contexts/authContext";
import axios from "axios"
import handleLogout from "../utils/Logout";

export default function Navbar(){
    const {username, setUsername, setLoading} = useContext(authContext);
    return (
        <div className="w-full absolute h-16 top-0 bg-slate-800 text-white flex justify-around p-4">
            <NavLink to='/home' className={({isActive}) => isActive?"text-orange-400":""}>Home</NavLink>
            {!username && <NavLink to='/login' className={({isActive}) => isActive?"text-orange-400":""}>Login</NavLink>}
            {!username && <NavLink to='/register' className={({isActive}) => isActive?"text-orange-400":""}>Register</NavLink>}
            {username && <button onClick={() => {handleLogout(setUsername, setLoading)}}>Logout</button>}
        </div>
    )
}
