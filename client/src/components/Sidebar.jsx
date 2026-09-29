import React, { useContext } from 'react'
import SidebarLinks from './SidebarLinks'
import dashContext from '../contexts/dashContext'

function Sidebar() {
  const {userData} = useContext(dashContext);
  return (
    <div className='w-[25%] h-full pt-4 dark:bg-slate-900 dark:text-white'>
        <SidebarLinks path="dashboard" content="Dashboard"/>
        <SidebarLinks path="expenses" content="Add Expense"/>
        <SidebarLinks path="list" content="View Expenses"/>
        {userData.role === "admin" && <SidebarLinks path="category" content="Add Category" />}
        <SidebarLinks path="budget" content="Create Budget"/>
        <SidebarLinks path="budgetlist" content="View Budgets"/>
    </div>
  )
}

export default Sidebar