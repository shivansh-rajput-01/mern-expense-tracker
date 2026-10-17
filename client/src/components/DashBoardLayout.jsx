import React, { useContext, useState } from 'react'
import { Navigate, NavLink, Outlet } from 'react-router-dom'
import authContext from '../contexts/authContext'
import Sidebar from './Sidebar';
import DashNav from './DashNav';
import dashContext from '../contexts/dashContext';
import axios from "axios"
import DraggablePanel from './DraggablePanel';

function DashBoardLayout() {
    const { username, loading } = useContext(authContext);
    const {del, setDel, setCategory, userData, calc, setCalc} = useContext(dashContext);
    let [message, setMessage] = useState("");
    let [error, setError] = useState("");
    let [openSideBar, setOpenSideBar] = useState(false);
    let [closed, setClosed] = useState(false);

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
                {
                    !userData.isVerified && !closed && (
                        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-1000">
                        <div className="del-box flex flex-col w-80 sm:w-100 min-h-40 p-8 bg-white rounded-md relative">
                            <i
                            className="fa-solid fa-xmark absolute top-3 right-2 text-slate-500"
                            onClick={() => setClosed(true)}
                            ></i>
                            <div className="text-center text-2xl my-4">Email not verified yet!</div>
                            <div>Verify email now. If not verified you may not be able to access your account in case you forgot password</div>
                            <div className="my-4 flex justify-center">
                                <NavLink to="/verify" onClick={() => setClosed(true)}><button className='w-20 h-10 p-2 rounded-sm border border-slate-700 hover:bg-slate-700 hover:text-white'>Verify</button></NavLink>
                            </div>
                        </div>
                        </div>
                    )
                }
                <DashNav openSideBar={openSideBar} setOpenSideBar={setOpenSideBar} />
                <div className="relative main flex w-full pt-16 h-screen">
                    {calc && <DraggablePanel />}
                    <Sidebar openSideBar={openSideBar} setOpenSideBar={setOpenSideBar}/>
                    <Outlet context={{message, setMessage}}/>
                </div>
            </div> : <Navigate to="/login" replace/>
        }
        </div>
    )
}

export default DashBoardLayout