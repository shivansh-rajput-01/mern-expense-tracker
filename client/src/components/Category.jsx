import React from 'react'
import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios'
import dashContext from '../contexts/dashContext';
import { useContext } from 'react';

function Category() {
    const { message, setMessage } = useOutletContext();
    const { userData, setUserData, category, setCategory, del, setDel } = useContext(dashContext);
    let [categorys, setCategotys] = useState("");
    let [pcat, setPcat] = useState("");
    async function createCategory(evt) {
        evt.preventDefault();
        if (categorys.trim()) {
            try {
                const response = await axios.post("http://localhost:3000/category", { categorys }, {
                    withCredentials: true
                });
                setMessage("");
                setMessage(response.data.message + " " + categorys);
                setCategotys("");
                setCategory(response.data.cat);
            } catch (err) {
                console.log(err);
            }
        }
    }

    async function getPcat() {
        try {
            const response = await axios.get("http://localhost:3000/popularcategory", {
                withCredentials: true
            });
            setPcat(response.data.catArr);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getPcat();
    }, []);

    return (
        <div className='relative w-full md:w-[75%] p-4 bg-slate-100 dark:bg-linear-to-br dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 min-h-full overflow-y-auto'>
            {
                message && (
                    <div className='absolute top-4 left-1/2 min-w-64 min-h-10 -translate-x-1/2 p-2 flex justify-between bg-green-400 text-white'>
                        <div className="message">{message}</div>
                        <div className="close pointer-cursor pl-8" onClick={() => { setMessage("") }}><i className="fa-solid fa-xmark"></i></div>
                    </div>
                )
            }
            {userData.role === "admin" && (
                <div className="w-full flex flex-col h-full overflow-y-clip">
                    <div className="flex flex-wrap justify-between w-full gap-4">
                        <form onSubmit={createCategory} className='w-full md:w-100 min-h-50 flex flex-col items-center mt-4 bg-white dark:bg-white/1 dark:text-slate-100 rounded-sm shadow-md'>
                            <div className='my-2 self-start mx-8'>Add Category</div>
                            <input type="text" placeholder='Category' value={categorys} onChange={(e) => { setCategotys(e.target.value) }} className='w-80 h-10 p-2 rounded-sm outline my-4 focus:outline-4 focus:outline-blue-400' required />
                            <button className='w-80 h-10 p-2 rounded-sm block bg-slate-900 dark:bg-purple-950/90 text-white'>Create</button>
                        </form>
                        <div className='w-full md:w-120 h-50 flex flex-col items-center mt-4 bg-white dark:bg-white/1 dark:text-slate-100 rounded-sm shadow-md'>
                            <div className='mt-2 self-start w-full px-4 py-2 border-b border-b-slate-200 dark:border-b-slate-700 text-xl'>Popular Category</div>
                            <div className='flex-1 w-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none self-start'>
                                {
                                    pcat && pcat.length > 0 ? (
                                        pcat.map(p => {
                                            return (
                                                <div key={p._id} className='w-full px-4 border-b border-b-slate-200 dark:border-b-slate-700 py-1 flex justify-between hover:bg-slate-50 dark:hover:bg-white/5'>
                                                    <span>{p.categoryName}</span>
                                                    <span>{p.usageCount} expenses</span>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <div className='self-start'>No categories in use</div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    {category ? (
                        <div className="w-full bg-white dark:bg-white/1 dark:text-slate-100 mt-4 h-40 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                            <div className="section text-2xl p-4 border-b border-b-slate-300 dark:border-b-slate-700">Created Categories</div>
                            {category.map((cat) => {
                                return (
                                    <div key={cat._id} className="w-full flex dark:hover:bg-white/5 hover:bg-slate-50 justify-between px-4 py-4 border-b border-b-slate-300 dark:border-b-slate-700">
                                        <span>{cat.name}</span>
                                        <span onClick={() => setDel(cat._id)}><i className="fa-solid fa-trash"></i></span>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div>No Category Added yet</div>
                    )}

                </div>
            )}
        </div>
    )
}

export default Category