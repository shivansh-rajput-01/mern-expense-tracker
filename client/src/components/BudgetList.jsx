import React, { useState } from 'react'
import { useContext, useEffect } from 'react'
import dashContext from '../contexts/dashContext'
import axios from 'axios';
import displayDate from '../utils/DisplayDate';
import { NavLink } from 'react-router-dom';
import SearchBudget from '../utils/SearchBudget';

function BudgetList() {

    let [search, setSearch] = useState("");

    let [searchResults, setSearchResults] = useState("");

    let {budget, setBudget} = useContext(dashContext);

    async function getBudgets(){

        try {

            const response = await axios.get("http://localhost:3000/budget", {
                withCredentials: true
            });

            if(response.data.success) {
                setBudget(response.data.data);
            }

        } catch (err) {

            console.log(err);

        }

    }

    useEffect(() => {
        getBudgets();
    }, []);

    function searchHandler(evt){
        evt.preventDefault();
        setSearch(evt.target.value);
        const result = SearchBudget(evt.target.value, budget);
        setSearchResults(result);
    }

    return (
        <div className='relative w-[75%] pl-4 bg-slate-100 min-h-full overflow-y-auto pt-4 flex flex-col'>
            <div className="w-full">
                <form className='flex w-full justify-around my-4' onSubmit={(evt) => evt.preventDefault()}>
                    <input type="text" placeholder='Search Budget by name' className='w-4/6 h-10 outline rounded-sm p-2 focus:outline-blue-400 focus:outline-4' value={search} onChange={(e) => searchHandler(e)}/>
                    <button className='w-1/5 bg-slate-800 text-white shadow-sm rounded-sm h-10'>Search</button>
                </form>
            </div>
            {
                budget && budget.length && !search ? (
                    <div className='flex flex-wrap gap-4 w-full flex-1 overflow-y-auto'>
                        {budget.map(b => {
                            return <div key={b._id} className='w-80 h-40 rounded-md shadow-sm p-4 bg-white flex flex-col border-l-4 border-l-slate-950 hover:shadow-lg'>
                                <span className='block pb-2'>Budget Name: {b.name}</span>
                                <div className='pb-2'>{displayDate(b.start.slice(0,10))} to {displayDate(b.end.slice(0, 10))}</div>
                                <span>Budget: {b.budgetMoney}</span>
                                <span className='self-end text-slate-950 underline'>
                                    <NavLink to={`/analyse/budget/${b._id}`}> Explore </NavLink>
                                </span>
                            </div>
                        })}
                    </div>
                ) : (
                    !search? (
                        <div>No budget added yet</div>
                    ) : (
                        <div className='flex flex-wrap gap-4 w-full flex-1 overflow-y-auto'>
                            {searchResults.map(b => {
                                return <div key={b._id} className='w-80 h-40 rounded-md shadow-sm p-4 bg-white flex flex-col border-l-4 border-l-slate-950 hover:shadow-lg'>
                                    <span className='block pb-2'>Budget Name: {b.name.slice(0, b.st)}<span className='bg-gray-500 text-white m-0 p-0 inline-block text-lg'>{b.name.slice(b.st, b.st + b.l)}</span>{b.name.slice(b.st + b.l, b.name.length)}</span>
                                    <div className='pb-2'>{displayDate(b.start.slice(0,10))} to {displayDate(b.end.slice(0, 10))}</div>
                                    <span>Budget: {b.budgetMoney}</span>
                                    <span className='self-end text-slate-950 underline'>
                                        <NavLink to={`/analyse/budget/${b._id}`}> Explore </NavLink>
                                    </span>
                                </div>
                            })}
                            {searchResults.length === 0 && <div>Nothing found in search for {search}</div>}
                        </div>
                    )
                )
            }
        </div>
    )
}

export default BudgetList
