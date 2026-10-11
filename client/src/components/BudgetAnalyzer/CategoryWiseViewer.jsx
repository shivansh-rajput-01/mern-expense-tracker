import React from 'react'
import subTotal from '../../utils/SubBudgetTotal';
import expenseToBudget from '../../utils/BudgetVsExpense';

function CategoryWiseViewer({budget, catWiseExp}) {
    return (
        <div className='bg-white dark:bg-white/5 dark:text-white w-full lg:w-188 xl:flex-1 h-50 md:h-56 lg:h-36 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none rounded-md'>
            <div className="text-xl flex justify-between py-1 px-4 border-b border-b-slate-200 dark:border-b-slate-700 w-full">
                <span>View Category Budgets</span>
                {budget.budgetCategory?.length > 0 && (
                    <span>{`₹ ${subTotal(budget.budgetCategory).toLocaleString()} alloted`}</span>
                )}
            </div>
            <div className="w-full flex-1">
                <div className="w-full border-b border-b-slate-200 dark:border-b-slate-700 flex justify-between p-2">
                    <span className="w-[25%] text-center font-black">Category</span>
                    <span className="w-[25%] text-center font-black">Budget</span>
                    <span className="w-[25%] text-center font-black">Spent</span>
                    <span className="w-[25%] text-center font-black">Remaining</span>
                </div>
                {expenseToBudget(budget.budgetCategory, catWiseExp).map(
                    (ele, idx) => {
                        return (
                            <div
                                key={idx}
                                className="w-full border-b border-b-slate-200 dark:border-b-slate-700 flex justify-between p-2"
                            >
                                <span className="w-[25%] text-center">
                                    {ele.category}
                                </span>
                                <span className="w-[25%] text-center">
                                    ₹{ele.budget.toLocaleString()}
                                </span>
                                <span className="w-[25%] text-center" style={ele.expenditure > ele.budget? {color: "#ef4444"}: {}}>
                                    ₹{ele.expenditure.toLocaleString()}
                                </span>
                                <span className="w-[25%] text-center">
                                    ₹{ele.budget - ele.expenditure > 0 ? (ele.budget - ele.expenditure).toLocaleString() : 0}
                                </span>
                            </div>
                        );
                    },
                )}
            </div>
        </div>
    )
}

export default CategoryWiseViewer
