import React from "react";

function CategoryWiseExpenses({catWiseExp}) {
  return (
    <div className="cards w-full sm:w-60 flex flex-col h-36 bg-white dark:bg-white/5 dark:text-white  rounded-md shadow-md hover:shadow-lg">
      <span className="block w-full h-12 p-2 border-b border-b-slate-200 dark:border-b-slate-700">
        Category wise expenditure
      </span>
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        {catWiseExp &&
          catWiseExp.map((el) => {
            return (
              <div
                key={el.id}
                className="p-2 flex justify-between border-b border-b-slate-200 dark:border-b-slate-700 hover:bg-slate-50 dark:hover:bg-white/1"
              >
                <span>{el.category}</span>
                <span>{el.expenditure}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default CategoryWiseExpenses;
