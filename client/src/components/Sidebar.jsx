import React, { useContext } from 'react'
import SidebarLinks from './SidebarLinks'
import dashContext from '../contexts/dashContext'
import { useNavigate } from 'react-router-dom';
import handleLogout from '../utils/Logout';
import authContext from '../contexts/authContext';

function Sidebar({openSideBar, setOpenSideBar}) {
  const { userData } = useContext(dashContext);
  const {setUsername, setLoading} = useContext(authContext);
  const navigate = useNavigate();
  function handler(){
    handleLogout(setUsername, setLoading);
    navigate("/home");
  }
  return (
    <>
      <div className='hidden md:block md:w-[25%] md:h-full pt-4 dark:bg-white/5 dark:text-slate-100'>
        <SidebarLinks path="home" content="Home" />
        <SidebarLinks path="dashboard" content="Dashboard" />
        <SidebarLinks path="expenses" content="Add Expense" />
        <SidebarLinks path="list" content="View Expenses" />
        {userData.role === "admin" && <SidebarLinks path="category" content="Add Category" />}
        <SidebarLinks path="budget" content="Create Budget" />
        <SidebarLinks path="budgetlist" content="View Budgets" />
      </div>
      {openSideBar && <div className='block w-[60%] sm:w-[40%] md:hidden h-full bg-white absolute top-0 z-10 left-0 pt-20 dark:bg-blue-950 dark:text-slate-100'>
        <SidebarLinks path="home" content="Home" />
        <SidebarLinks path="dashboard" content="Dashboard" />
        <SidebarLinks path="profile" content="Profile" />
        <SidebarLinks path="expenses" content="Add Expense" />
        <SidebarLinks path="list" content="View Expenses" />
        {userData.role === "admin" && <SidebarLinks path="category" content="Add Category" />}
        <SidebarLinks path="budget" content="Create Budget" />
        <SidebarLinks path="budgetlist" content="View Budgets" />
        <button className='text-red-500 w-full text-center my-4' onClick={handler}><i className="fa-solid fa-right-from-bracket text-red-500"></i>Logout</button>
      </div>}
    </>
  )
}

export default Sidebar