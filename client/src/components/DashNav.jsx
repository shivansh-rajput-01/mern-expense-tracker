import React, { useContext } from 'react'
import authContext from '../contexts/authContext'
import handleLogout from '../utils/Logout';
import { useNavigate } from 'react-router-dom';
import profilePic from "../assets/profile.png"

function DashNav() {
    const {username, setUsername, setLoading} = useContext(authContext);
    const navigate = useNavigate();
    function handler(){
        handleLogout(setUsername, setLoading);
        navigate("/home");
    }
  return (
    <div className='w-full h-16 pt-4 px-2 top-0 absolute shadow-sm flex justify-between z-100'>
        <div className="name text-2xl font-bold">Expensify</div>
        <div className='profile w-40 flex justify-between'>
            <div className="picture w-10 h-10 rounded-full mx-4 bg-cover bg-center" style={{backgroundImage: `url(${profilePic})`}}></div>
            <button onClick={handler} className='border w-20 h-10 rounded-sm hover:shadow-md hover:bg-slate-950 hover:text-white'>Logout</button>
        </div>
    </div>
  )
}

export default DashNav