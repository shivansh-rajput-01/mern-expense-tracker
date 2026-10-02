import React from 'react'
import displayDate from '../utils/DisplayDate'

function SearchedExpenses({data, total}) {
  return (
    <>
        {data.map((ele) => (
            <div key={ele._id} className='w-full p-2 border-b border-b-slate-200 dark:border-b-slate-700 dark:hover:bg-white/1 flex justify-between hover:bg-slate-50'>
                <span className='block w-[20%] text-center'>{displayDate(ele.date.slice(0, 10))}</span>
                <span className='block w-[20%] text-center'>{ele.description}</span>
                <span className='block w-[20%] text-center'>{ele.category.name}</span>
                <span className='block w-[20%] text-center'>{ele.price}</span>
            </div>
        ))}
        <div className='w-full p-2 border-b border-b-slate-200 dark:border-b-slate-700 dark:hover:bg-white/1 flex justify-between hover:bg-slate-50'>
            <span className='block w-[20%] text-center font-black'>Total</span>
            <span className='block w-[20%] text-center font-black'>{total}</span>
        </div>
    </>
  );
}

export default SearchedExpenses