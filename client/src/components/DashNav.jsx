import React, { useContext } from 'react'
import authContext from '../contexts/authContext'
import handleLogout from '../utils/Logout';
import { useNavigate } from 'react-router-dom';
import profilePic from "../assets/profile.png"
import dashContext from '../contexts/dashContext';

function DashNav({openSideBar, setOpenSideBar}) {
    const {username, setUsername, setLoading} = useContext(authContext);
    const {darkMode, setDarkMode} = useContext(dashContext);
    const navigate = useNavigate();
    function handler(){
        handleLogout(setUsername, setLoading);
        navigate("/home");
    }
    function openProfile() {
        navigate("/profile")
    }
  return (
    <div className='w-full h-16 pt-4 px-2 top-0 absolute shadow-sm flex justify-between dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:shadow-none dark:backdrop-blur-xl z-100'>
        <div className="name text-2xl font-bold">Expensify</div>
        <div className='profile w-48 hidden md:flex justify-between'>
            <div className="picture w-10 h-10 rounded-full mx-4 flex justify-center items-center bg-slate-700 text-2xl text-white" onClick={openProfile}>{username.slice(0, 1)}</div>
            <button onClick={handler} className='border w-20 h-10 rounded-sm hover:shadow-md hover:bg-slate-950 hover:text-white'>Logout</button>
            <div className="theme-toggler mx-2 my-2">
                {!darkMode && <i className="fa-solid fa-moon" onClick={() => setDarkMode(prev => !prev)}></i>}
                {darkMode && <div className='text-center w-7 h-7 mb-2' onClick={() => setDarkMode(prev => !prev)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="M4.93 4.93l1.41 1.41" />
                    <path d="M17.66 17.66l1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="M6.34 17.66l-1.41 1.41" />
                    <path d="M19.07 4.93l-1.41 1.41" />
                    </svg>
                </div>
                }
            </div>
        </div>
        <div className='md:hidden flex text-xl'>
            <div className="theme-toggler mx-4">
                {!darkMode && <i className="fa-solid fa-moon" onClick={() => setDarkMode(prev => !prev)}></i>}
                {darkMode && <div className='text-center w-7 h-7 mb-2' onClick={() => setDarkMode(prev => !prev)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="M4.93 4.93l1.41 1.41" />
                    <path d="M17.66 17.66l1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="M6.34 17.66l-1.41 1.41" />
                    <path d="M19.07 4.93l-1.41 1.41" />
                    </svg>
                </div>
                }
            </div>
            <i className="fa-solid fa-bars" onClick={() => setOpenSideBar(prev => !prev)}></i>
        </div>
    </div>
  )
}

export default DashNav