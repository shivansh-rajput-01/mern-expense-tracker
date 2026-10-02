import React, { useContext, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import authContext from '../contexts/authContext'
import Sidebar from './Sidebar';
import DashNav from './DashNav';
import dashContext from '../contexts/dashContext';
import axios from "axios"

function DashBoardLayout() {
    const { username, loading } = useContext(authContext);
    const {del, setDel, setCategory} = useContext(dashContext);
    let [message, setMessage] = useState("");
    let [error, setError] = useState("");
    let [openSideBar, setOpenSideBar] = useState(false);

    if(loading){
        return (
            <div className='loader w-full h-full flex justify-center items-center'>
                <div className="loader rounded-full w-10 h-10 border-t-2 border-t-slate-600 animate-spin"></div>
            </div>
        );
    }

    async function handleDelete(id){
        try {
            const response = await axios.delete(`http://localhost:3000/category?catId=${id}`, {
                withCredentials: true
            });

            console.log(response.data.message);
            if(!response.data.success) {
                setError(response.data.message);
                setDel("");
                return;
            }
            setCategory(response.data.cat);
            setMessage(response.data.message);
            setDel("");

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className='w-full relative dark:bg-linear-to-br dark:from-slate-950 dark:via-blue-950 dark:to-slate-900'>
        {
            username? <div className="dashboard w-full h-full relative">
                {
                    del && (
                        <div className="absolute w-full h-full top-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-1000">
                            <div className="del-box flex flex-col w-80 min-h-40 p-8 bg-white rounded-md">
                                <div className="msg mb-4">Want to delete this category?</div>
                                <div className="btns flex justify-around">
                                    <button className='w-20 h-10 border border-red-500 text-red-900 hover:bg-red-500 hover:text-white rounded-sm' onClick={() => handleDelete(del)}>Delete</button>
                                    <button className='w-20 h-10 border border-slate-700 text-slate-950 hover:bg-slate-950 hover:text-white rounded-sm' onClick={() => setDel("")}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    error && (
                        <div className="absolute w-full h-full top-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-1000">
                            <div className="del-box flex flex-col w-80 min-h-40 p-8 bg-white rounded-md">
                                <div className="msg mb-4"><i className="fa-solid fa-triangle-exclamation"></i>{error}</div>
                                <div className="btns flex justify-around">
                                    <button className='w-20 h-10 border border-red-500 text-red-900 hover:bg-red-500 hover:text-white rounded-sm hidden'>Delete</button>
                                    <button className='w-20 h-10 border border-slate-700 text-slate-950 hover:bg-slate-950 hover:text-white rounded-sm' onClick={() => setError("")}>Close</button>
                                </div>
                            </div>
                        </div>
                    )
                }
                <DashNav openSideBar={openSideBar} setOpenSideBar={setOpenSideBar} />
                <div className="relative main flex w-full pt-16 h-screen">
                    <Sidebar openSideBar={openSideBar} setOpenSideBar={setOpenSideBar}/>
                    <Outlet context={{message, setMessage}}/>
                </div>
            </div> : <Navigate to="/login" replace/>
        }
        </div>
    )
}

export default DashBoardLayout