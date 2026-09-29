import React, { useContext, useEffect, useState } from 'react'
import dashContext from '../contexts/dashContext';
import axios from 'axios';

function Expense() {
    let [description, setDescription] = useState("");
    let [price, setPrice] = useState(0);
    let [categorys, setCategorys] = useState("");
    let [date, setDate] = useState("");
    let [message, setMessage] = useState("");
    const { category, userData } = useContext(dashContext);

    const getTodayLocalDate = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`; 
    };

    async function handleExpense(evt) {
        evt.preventDefault();
        if (!description.trim() || !String(price).trim()) return;
        let expense = {
            description,
            price,
            category: categorys,
            date,
            owner: userData.id
        };

        if(!date) expense.date = getTodayLocalDate();

        try {
            const response = await axios.post("http://localhost:3000/expense", expense, {
                withCredentials: true
            });
            setMessage(response.data.message);
            setDescription("");
            setPrice(0);
            setDate("");
            setCategorys("");
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className='flex justify-center items-center w-[75%] pl-4 bg-slate-100 min-h-full overflow-y-auto pt-4 relative'>
            {
                message && (
                    <div className='absolute top-4 left-1/2 min-w-64 min-h-10 -translate-x-1/2 p-2 flex justify-between bg-green-400 text-white'>
                        <div className="message">{message}</div>
                        <div className="close pointer-cursor pl-8" onClick={() => { setMessage("") }}><i class="fa-solid fa-xmark"></i></div>
                    </div>
                )
            }
            <div className="form w-100 bg-white shadow-sm rounded-md flex justify-center p-4">
                <form onSubmit={handleExpense}>
                    <div className='mb-1 text-2xl'>Add Expense</div>
                    <label htmlFor="description" className="block mb-2 mt-4">Description</label>
                    <input type="text" placeholder='Description' className="outline p-2 rounded-sm w-80 h-10 mb-2 focus:outline-4 focus:outline-blue-400" value={description} onChange={(e) => { setDescription(e.target.value) }} id="description" required />

                    <label htmlFor="price" className="block mb-2">Price</label>
                    <input type="number" placeholder='Price' className="outline p-2 rounded-sm w-80 h-10 mb-2 focus:outline-4 focus:outline-blue-400" value={price} onChange={(e) => { setPrice(e.target.value) }} id="price" required />

                    <label htmlFor="date" className="block mb-2">Date(optional if empty take today)</label>
                    <input type="date" placeholder='Price' className="outline p-2 rounded-sm w-80 h-10 mb-2 focus:outline-4 focus:outline-blue-400" value={date} onChange={(e) => { setDate(e.target.value) }} id="date"/>

                    <label htmlFor="category" className="block mb-2">Category</label>
                    <select className="outline p-2 rounded-sm w-80 h-10 mb-2 focus:outline-4 focus:outline-blue-400" value={categorys} onChange={(e) => { setCategorys(e.target.value) }} id="category" required>
                        <option value="" disabled>Choose a category</option>
                        {category && category.map((cat) => {
                            return (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            )
                        })}
                    </select>
                    <button className="bg-slate-900 text-white w-80 h-10 p-2 rounded-sm my-4 block selection:bg-sl">Add</button>
                </form>
            </div>
        </div>
    )
}

export default Expense