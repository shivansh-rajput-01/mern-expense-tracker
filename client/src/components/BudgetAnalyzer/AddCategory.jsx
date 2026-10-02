import React, { useContext } from 'react'
import dashContext from '../../contexts/dashContext';

function AddCategory({setImportModal, setBudgetCategory, addCategoryBudget, budgetCategory, budgetCategoryAmount, setBudgetCategoryAmount}) {
    const {category} = useContext(dashContext);
    return (
        <div className='bg-white dark:bg-white/5 dark:text-white rounded-md w-full lg:w-188 xl:flex-1 min-h-36'>
            <div className="self-start rounded-md bg-white dark:bg-white/1 dark:text-white flex justify-between text-xl py-4 px-4 mb-4 border-b border-b-slate-200 w-full">
                <span>Add Category Budgets</span>
                <button
                    className="border text-sm w-20 h-8 rounded-sm hover:shadow-md hover:bg-slate-950 dark:hover:bg-purple-600 hover:text-white"
                    onClick={() => setImportModal(true)}
                >
                    <i className="fa-solid fa-download"></i> import
                </button>
            </div>
            <form
                className="w-full lg:flex lg:justify-around bg-white dark:bg-transparent dark:text-white"
                onSubmit={addCategoryBudget}
            >
                <select
                    id="category"
                    className="outline block lg:inline-block rounded-sm w-[90%] mx-auto lg:mx-0 my-2 lg:my-0 lg:w-[25%] h-10 p-2 focus:outline-4 focus:outline-blue-400"
                    value={budgetCategory}
                    onChange={(e) => setBudgetCategory(e.target.value)}
                    required
                >
                    <option value="" className='dark:bg-slate-950' selected disabled>
                        Choose Category
                    </option>
                    {category &&
                        category.map((cat) => {
                            return (
                                <option key={cat._id} value={cat._id} className='dark:bg-slate-950'>
                                    {cat.name}
                                </option>
                            );
                        })}
                </select>
                <input
                    type="number"
                    placeholder="Category Budget"
                    className="outline block lg:inline-block rounded-sm w-[90%] mx-auto lg:mx-0 my-2 lg:my-0 lg:w-[25%] h-10 p-2 focus:outline-4 focus:outline-blue-400"
                    value={budgetCategoryAmount}
                    onChange={(e) => setBudgetCategoryAmount(e.target.value)}
                    required
                />
                <button className="bg-slate-900 dark:bg-purple-600 block lg:inline-block w-[90%] mx-auto lg:mx-0 my-2 lg:my-0 text-white lg:w-20 h-10 rounded-sm">
                    Add
                </button>
            </form>
        </div>
    )
}

export default AddCategory