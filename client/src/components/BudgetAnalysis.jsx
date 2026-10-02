import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import displayDate from "../utils/DisplayDate";
import dashContext from "../contexts/dashContext";
import calcSpent from "../utils/CalcSpent";
import subTotal from "../utils/SubBudgetTotal";
import categoryExpenses from "../utils/CategoryExpenses";
import Doughnut from "./charts/Doughnut";
import catBudget from "../utils/CatWiseBudget";
import expenseToBudget from "../utils/BudgetVsExpense";
import LineChartUtil from "./charts/LineChartUtil";
import SearchBudget from "./SearchBudget";
import ImportCategoryBudget from "./ImportCategoryBudget";
import SimpleCard from "./BudgetAnalyzer/SimpleCard";
import CategoryWiseExpenses from "./BudgetAnalyzer/CategoryWiseExpenses";
import CategoryWiseViewer from "./BudgetAnalyzer/CategoryWiseViewer";
import AddCategory from "./BudgetAnalyzer/AddCategory";

function BudgetAnalysis() {
  let [budgetExpenses, setBudgetExpenses] = useState("");
  let [spentAmount, setSpentAmount] = useState("");
  let [budget, setBudget] = useState("");
  let [budgetCategory, setBudgetCategory] = useState("");
  let [budgetCategoryAmount, setBudgetCategoryAmount] = useState("");
  let [message, setMessage] = useState("");
  let [error, setError] = useState("");
  let [edit, setEdit] = useState(false);
  let [newBudget, setNewBudget] = useState("");
  let [openMenu, setOpenMenu] = useState(false);
  let [menuActive, setMenuActive] = useState("analysis");
  let [catWiseExp, setCatWiseExp] = useState("");
  let [block, setBlock] = useState(false);
  let [delModal, setDelModal] = useState("");
  let [editModal, setEditModal] = useState("");
  let [importModal, setImportModal] = useState(false);
  let { budgetId } = useParams();
  const { category } = useContext(dashContext);

  async function getBudgetExpenses() {
    try {
      const response = await axios.get(
        `http://localhost:3000/budget/expenses?bid=${budgetId}`,
        {
          withCredentials: true,
        },
      );
      if (response.data.success) {
        setBudgetExpenses(response.data.expenses);
        setSpentAmount(calcSpent(response.data.expenses));
        setCatWiseExp(categoryExpenses(response.data.expenses));
        setBudget(response.data.budget);
        console.log(response.data.budget);
      } else {
        setError(response.data.message);
        setBlock(true);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getBudgetExpenses();
  }, []);

  async function addCategoryBudget(evt) {
    evt.preventDefault();

    const data = {
      bid: budgetId,
      category: budgetCategory,
      amount: budgetCategoryAmount,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/budget/category",
        data,
        {
          withCredentials: true,
        },
      );
      if (response.data.success) {
        setMessage("Saved Successfully");
        setBudget(response.data.budget);
      } else {
        setError(response.data.message);
      }
      setBudgetCategory("");
      setBudgetCategoryAmount("");
    } catch (err) {
      console.log(err);
    }
  }

  async function updateBudget(evt) {
    evt.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/budget?id=${budgetId}`,
        { newBudget },
        {
          withCredentials: true,
        },
      );
      if (response.data.success) {
        setBudget(response.data.budget);
      } else {
        setError(response.data.message);
      }
      setEdit(false);
      setNewBudget("");
    } catch (err) {
      console.log(err);
    }
  }

  async function bulkImport(payload) {
    try {
      const response = await axios.post(
        `http://localhost:3000/budget/category/bulk?bid=${budgetId}`,
        payload,
        {
          withCredentials: true,
        },
      );
      if (response.data.success) {
        setImportModal(false);
        setMessage(response.data.message);
        setBudget(response.data.budget);
      }
    } catch (err) {
      console.log(err);
    }
  }

  function displayTab(str) {
    console.log("display tab");
    setMenuActive(str);
  }

  function handleSubDelete(evt, id) {
    setDelModal(id);
  }

  async function delCat() {
    try {
      const response = await axios.delete(
        `http://localhost:3000/budget/category?bid=${budgetId}&delModal=${delModal}`,
        {
          withCredentials: true,
        },
      );
      if (response.data.success) {
        setMessage(response.data.message);
        setDelModal("");
        setBudget(response.data.newList);
      }
    } catch (err) {
      console.log(err);
      if (err.response) {
        console.log(err.response.data.message);
      }
    }
  }

  function handleEdit(data) {
    setEditModal(data);
    console.log("edit", data);
  }

  async function handleEditSubmit(evt) {
    evt.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/budget/category?bid=${budgetId}`,
        { id: editModal.id, budget: editModal.budget },
        {
          withCredentials: true,
        },
      );
      if (response.data.success) {
        setMessage(response.data.message);
        setEditModal("");
        setBudget(response.data.budget);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="relative w-full md:w-[75%] bg-slate-100 dark:bg-linear-to-br dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 max-h-full overflow-y-auto pt-4 flex flex-col overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      {message && (
        <div className="absolute top-4 left-1/2 min-w-64 min-h-10 -translate-x-1/2 p-2 flex justify-between bg-green-400 text-white z-100">
          <div className="message">{message}</div>
          <div
            className="close pointer-cursor pl-8"
            onClick={() => {
              setMessage("");
            }}
          >
            <i class="fa-solid fa-xmark"></i>
          </div>
        </div>
      )}
      {error && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-10000">
          <div className="del-box flex flex-col w-80 min-h-40 p-8 bg-white rounded-md">
            <div className="msg mb-4">
              <i className="fa-solid fa-triangle-exclamation"></i>
              {error}
            </div>
            <div className="btns flex justify-around">
              <button className="w-20 h-10 border border-red-500 text-red-900 hover:bg-red-500 hover:text-white rounded-sm hidden">
                Delete
              </button>
              {!block && (
                <button
                  className="w-20 h-10 border border-slate-700 text-slate-950 hover:bg-slate-950 hover:text-white rounded-sm"
                  onClick={() => setError("")}
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {importModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-1000">
          <div className="del-box flex flex-col w-90 min-h-40 p-8 bg-white rounded-md relative">
            <i
              className="fa-solid fa-xmark absolute top-3 right-2 text-slate-500"
              onClick={() => setImportModal(false)}
            ></i>
            <ImportCategoryBudget
              budgetId={budgetId}
              budget={budget.budgetCategory}
              budgetAmount={budget.budgetMoney}
              categoryBudget={subTotal(budget.budgetCategory)}
              bulkImport={bulkImport}
            />
          </div>
        </div>
      )}
      {delModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-1000">
          <div className="del-box flex flex-col w-80 min-h-40 p-8 bg-white rounded-md">
            <div className="msg mb-4">
              <i className="fa-solid fa-triangle-exclamation"></i>
              Do want to delete this category budget
            </div>
            <div className="btns flex justify-around">
              <button
                className="w-20 h-10 border border-red-500 text-red-900 hover:bg-red-500 hover:text-white rounded-sm"
                onClick={delCat}
              >
                Delete
              </button>
              <button
                className="w-20 h-10 border border-slate-700 text-slate-950 hover:bg-slate-950 hover:text-white rounded-sm"
                onClick={() => setDelModal("")}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-1000">
          <div className="del-box flex flex-col w-80 min-h-40 p-8 bg-white rounded-md relative">
            <i
              className="fa-solid fa-xmark absolute top-3 right-2 text-slate-500"
              onClick={() => setEditModal("")}
            ></i>
            <form className="w-full flex flex-col" onSubmit={handleEditSubmit}>
              <div className="text-slate-700/50">Category</div>
              <div className="border border-slate-300 h-10 p-2 my-2 rounded-sm w-full text-slate-700/50">
                {editModal.name}
              </div>
              <label htmlFor="des">Amount</label>
              <input
                type="number"
                value={editModal.budget}
                onChange={(evt) =>
                  setEditModal((prev) => ({
                    ...prev,
                    budget: evt.target.value,
                  }))
                }
                className="w-full h-10 p-2 my-2 rounded-sm outline focus:outline-4 focus:outline-blue-400"
                id="des"
                required
              />
              <button className="w-full h-10 p-2 my-2 rounded-sm bg-slate-600 text-white">
                Edit
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="text-white p-2 mx-4 bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-sm flex justify-between  relative">
        <span>Budget Analysis: {budget.name}</span>
        <span onClick={() => setOpenMenu((e) => !e)}>
          <i className="fa-solid fa-ellipsis-vertical absolute top-3 right-1"></i>
        </span>
        {openMenu && (
          <div className="absolute right-0 top-8 min-h-40 min-w-40 bg-white dark:bg-blue-950 dark:text-slate-100 shadow-md rounded-md flex flex-col">
            <span
              className="block w-full text-black dark:text-slate-100 p-2 border-b border-b-slate-200 hover:bg-slate-100 dark:border-b-slate-700 dark:hover:bg-blue-900 rounded-md selection:bg-white dark:selection:bg-blue-950"
              onClick={() => displayTab("analysis")}
            >
              Analytics
            </span>
            <span
              className="block w-full text-black dark:text-slate-100 p-2 border-b border-b-slate-200 hover:bg-slate-100 dark:border-b-slate-700 dark:hover:bg-blue-900 rounded-md selection:bg-white dark:selection:bg-blue-950"
              onClick={() => displayTab("add")}
            >
              Manage Category Budget
            </span>
            <span
              className="block w-full text-black dark:text-slate-100 p-2 border-b border-b-slate-200 hover:bg-slate-100 dark:border-b-slate-700 dark:hover:bg-blue-900 rounded-md selection:bg-white dark:selection:bg-blue-950"
              onClick={() => displayTab("view")}
            >
              View Category Budget
            </span>
            <span
              className="block w-full text-black dark:text-slate-100 p-2 border-b border-b-slate-200 hover:bg-slate-100 dark:border-b-slate-700 dark:hover:bg-blue-900 rounded-md selection:bg-white dark:selection:bg-blue-950"
              onClick={() => displayTab("search")}
            >
              Search
            </span>
          </div>
        )}
      </div>
      <div className="budget flex flex-wrap gap-4 my-2 mx-4">
        <div className="rounded-sm shadow-md bg-white dark:bg-white/5 dark:text-white  w-full sm:w-60 h-36 flex flex-col justify-center items-center hover:shadow-lg">
          <span className="text-slate-800 dark:text-white text-2xl block mb-2">Budget</span>
          <div className="flex justify-around w-[80%]">
            <span>₹ {budget.budgetMoney}</span>
            <span onClick={() => setEdit((e) => !e)}>
              <i className="fa-regular fa-pen-to-square"></i>
            </span>
          </div>
          {edit && (
            <div className="flex w-full justify-center">
              <form
                className="flex justify-between w-3/4"
                onSubmit={updateBudget}
              >
                <input
                  type="number"
                  placeholder="Budget"
                  className="outline p-1 w-24 h-8 rounded-sm"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  required
                />
                <button className="text-white bg-slate-800 rounded-sm w-16 h-8 p-1">
                  Edit
                </button>
              </form>
            </div>
          )}
        </div>
        {menuActive === "add" && (
          <AddCategory
            setImportModal={setImportModal}
            setBudgetCategory={setBudgetCategory}
            addCategoryBudget={addCategoryBudget}
            budgetCategory={budgetCategory}
            budgetCategoryAmount={budgetCategoryAmount}
            setBudgetCategoryAmount={setBudgetCategoryAmount}
          />
        )}
        {menuActive === "view" && (
          <CategoryWiseViewer budget={budget} catWiseExp={catWiseExp} />
        )}
        {(menuActive === "analysis" || menuActive === "search") && (
          <>
            <SimpleCard amount={spentAmount} message="Spent" />
            <SimpleCard
              amount={budget.budgetMoney - spentAmount}
              message="Remaining"
            />
            <CategoryWiseExpenses catWiseExp={catWiseExp} />
          </>
        )}
      </div>
      {menuActive === "analysis" && budgetExpenses && budgetExpenses.length ? (
        <div className="flex flex-wrap w-full justify-between">
          <div className="container bg-white dark:bg-white/5 dark:text-white w-full mx-4 xl:w-[46%] 2xl:w-150 h-90 flex flex-col rounded-md shadow-md my-4">
            <div className="rounded-md h-10 p-2 border-b border-b-slate-100 dark:border-b-slate-700 flex justify-between w-full font-bold hover:bg-slate-50 dark:hover:bg-white/1">
              <span className="w-[20%] text-center">Date</span>
              <span className="w-[20%] text-center">Description</span>
              <span className="w-[20%] text-center">Category</span>
              <span className="w-[20%] text-center">Price</span>
            </div>

            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
              {budgetExpenses.map((budgetExpense) => {
                return (
                  <div
                    key={budgetExpense._id}
                    className="rounded-md min-h-10 p-2 border-b border-b-slate-100 dark:border-b-slate-700 flex justify-between w-full hover:bg-slate-50 dark:hover:bg-white/1"
                  >
                    <span className="w-[20%] text-center">
                      {displayDate(budgetExpense.date.slice(0, 10))}
                    </span>
                    <span className="w-[20%] text-center">
                      {budgetExpense.description}
                    </span>
                    <span className="w-[20%] text-center">
                      {budgetExpense.category.name}
                    </span>
                    <span className="w-[20%] text-center">
                      {budgetExpense.price}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="container bg-white dark:bg-white/5 dark:text-white w-full mx-4 xl:w-[46%] 2xl:w-150 min-h-100 xl:min-h-90 rounded-md shadow-md my-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
            <Doughnut data={catWiseExp} />
          </div>
        </div>
      ) : (
        <>
          {menuActive === "analysis" && (
            <div className="dark:text-white">No expenses added yet in this budget</div>
          )}
        </>
      )}

      {menuActive === "add" && budget.budgetCategory?.length > 0 ? (
        <div className="flex flex-wrap w-full gap-4 justify-around">
          <div className="container bg-white dark:bg-white/5 dark:text-white w-full mx-4 xl:mx-0 xl:w-[46%] overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none 2xl:w-150 h-90 flex flex-col rounded-md shadow-md my-4">
            <div className="w-140 sm:w-full">
              <>
              <div className="rounded-md h-10 p-2 border-b border-b-slate-100 dark:border-b-slate-700 flex justify-between w-full font-bold hover:bg-slate-50 dark:hover:bg-white/1">
                <span className="w-[20%] text-center">Category</span>
                <span className="w-[20%] text-center">Budget</span>
                <span className="w-[20%] text-center">Options</span>
              </div>
              {budget.budgetCategory?.length === 0 && (
                <div>No category budget added yet</div>
              )}
            </>

            {menuActive === "add" &&
              budget.budgetCategory.map((el, idx) => {
                return (
                  <div
                    key={idx}
                    className="rounded-md min-h-10 p-2 border-b border-b-slate-100 dark:border-b-slate-700 flex justify-between w-full hover:bg-slate-50 dark:hover:bg-white/1"
                  >
                    <span className="w-[20%] text-center">
                      {el.category.name}
                    </span>
                    <span className="w-[20%] text-center">
                      ₹{el.budget.toLocaleString()}
                    </span>
                    <span className="w-[20%] text-center">
                      <i
                        className="fa-regular fa-pen-to-square mx-2"
                        onClick={() =>
                          handleEdit({
                            name: el.category.name,
                            budget: el.budget,
                            id: el._id,
                          })
                        }
                      ></i>
                      <i
                        className="fa-solid fa-trash mx-2 text-red-500"
                        onClick={(evt) => handleSubDelete(evt, el._id)}
                      ></i>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {menuActive === "add" && budget.budgetCategory?.length > 0 && (
            <div className="budget container bg-white dark:bg-white/5 dark:text-white  w-full mx-4 xl:mx-0 xl:w-[45%] 2xl:w-150 min-h-100 xl:min-h-90 rounded-md shadow-md my-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
              <Doughnut data={catBudget(budget.budgetCategory)} />
            </div>
          )}
        </div>
      ) : (
        menuActive === "add" && <div className="dark:text-white">No category budget added yet</div>
      )}

      {menuActive === "view" &&
      budget.budgetCategory &&
      budget.budgetCategory.length > 0 ? (
        <div className="flex flex-wrap gap-4 my-4 justify-around">
          <div className="left bg-white dark:bg-white/5 dark:text-orange-500 rounded-md w-full mx-4 xl:mx-0 xl:w-[45%] 2xl:w-150 min-h-90">
            {budget.budgetCategory?.length > 1 && (
              <LineChartUtil
                data={expenseToBudget(budget.budgetCategory, catWiseExp)}
              />
            )}
            {budget.budgetCategory?.length <= 1 && (
              <div className="dark:text-white">Analytics opens with at least two category budget</div>
            )}
          </div>
          <div className="right bg-white dark:bg-white/5 dark:text-white rounded-md w-full mx-4 xl:mx-0 xl:w-[45%] 2xl:w-150 min-h-100 xl:min-h-90">
            {menuActive !== "analysis" && (
              <Doughnut data={catBudget(budget.budgetCategory)} />
            )}
          </div>
        </div>
      ) : (
        menuActive === "view" && <div className="dark:text-white">No category budget added yet</div>
      )}
      {menuActive === "search" && (
        <SearchBudget budgetExpenses={budgetExpenses} />
      )}
    </div>
  );
}

export default BudgetAnalysis;
