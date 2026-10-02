import axios from 'axios';
import React from 'react'
import { useContext } from 'react';
import { useState } from 'react';
import dashContext from '../contexts/dashContext';

function Budget() {

    let [name, setName] = useState("");
    let [start, setStart] = useState("");
    let [end, setEnd] = useState("");
    let [budget, setBudget] = useState("");
    let [message, setMessage] = useState("");
    let [error, setError] = useState("");

    const { userData } = useContext(dashContext);

    async function createBudget(evt) {

        evt.preventDefault();

        const budgetCreated = {
            name,
            start,
            end,
            budgetMoney: budget,
            owner: userData.id
        }

        try {
            const response = await axios.post("http://localhost:3000/budget", budgetCreated, {
                withCredentials: true
            });

            if(response.data.success) {
                setBudget("");
                setStart("");
                setEnd("");
                setName("");
                setMessage(response.data.message);
            } else {
                setError(`${response.data.message} named ${response.data.data}`);
            }

        } catch (err) {
            console.log(err);
        }

    }

    return (
        <div className='flex justify-center items-center w-full md:w-[75%] bg-slate-100 dark:bg-linear-to-br dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 min-h-full overflow-y-auto overflow-x-hidden p-4 relative'>
            {
                message && (
                    <div className='absolute top-4 left-1/2 min-w-64 min-h-10 -translate-x-1/2 p-2 flex justify-between bg-green-400 text-white'>
                        <div className="message">{message}</div>
                        <div className="close pointer-cursor pl-8" onClick={() => { setMessage("") }}><i class="fa-solid fa-xmark"></i></div>
                    </div>
                )
            }
            {
                error && (
                    <div className="fixed inset-0 left-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-1000">
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
            <div className="form w-100 bg-white shadow-sm rounded-md flex justify-center dark:bg-black/20 dark:text-slate-100 p-4">
                <form onSubmit={createBudget}>
                    <div className='mb-1 text-2xl'>Create New Budget</div>
                    <label htmlFor="budget-name" className="block mb-2 mt-4">Budget Name</label>
                    <input type="text" placeholder='Budget Name' className="outline p-2 rounded-sm w-80 h-10 mb-2 focus:outline-4 focus:outline-blue-400" value={name} onChange={(e) => { setName(e.target.value) }} id="budget-name" required />

                    <label htmlFor="start-date" className="block mb-2">Start Date</label>
                    <input type="date" placeholder='Start date' className="outline p-2 rounded-sm w-80 h-10 mb-2 focus:outline-4 focus:outline-blue-400" value={start} onChange={(e) => { setStart(e.target.value) }} id="start-date" required />

                    <label htmlFor="date" className="block mb-2">End Date</label>
                    <input type="date" placeholder='End date' className="outline p-2 rounded-sm w-80 h-10 mb-2 focus:outline-4 focus:outline-blue-400" value={end} onChange={(e) => { setEnd(e.target.value) }} id="date" required />

                    <label htmlFor="budget" className="block mb-2">Budget</label>
                    <input type="number" placeholder='Budget money(rs)' className="outline p-2 rounded-sm w-80 h-10 mb-2 focus:outline-4 focus:outline-blue-400" value={budget} onChange={(e) => { setBudget(e.target.value) }} id="budget" required />

                    <button className="bg-slate-900 dark:bg-purple-950/90 text-white w-80 h-10 p-2 rounded-sm my-4 block selection:bg-sl">Add</button>
                </form>
            </div>
        </div>
    )
}

export default Budget