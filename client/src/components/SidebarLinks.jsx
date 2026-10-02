import React from 'react'
import { NavLink } from 'react-router-dom'

function SidebarLinks({path, content}) {
  return (
    <div className='w-full h-10 text-center px-2'>
        <NavLink to={`/${path}`} className={({isActive}) => isActive?"text-purple-400 w-full block p-2 border-l-6 border-l-purple-500 hover:bg-slate-100 dark:hover:bg-slate-800":"w-full block p-2 hover:bg-slate-100 dark:hover:bg-slate-800"}>{content}</NavLink>
    </div>
  );
}

export default SidebarLinks