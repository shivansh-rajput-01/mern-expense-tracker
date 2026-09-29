import React, { useContext, useEffect, useState } from "react";
import dashContext from "../contexts/dashContext";
import axios from "axios";
import displayDate from "../utils/DisplayDate";
import SearchBudget from "./SearchBudget";

function ListExpenses() {
  const { userData } = useContext(dashContext);
  let [expenses, setExpenses] = useState("");
  let [message, setMessage] = useState("");
  let [edit, setEdit] = useState("");
  let [del, setDel] = useState("");
  let { category } = useContext(dashContext);

  async function getUserExpenses() {
    try {
      const response = await axios.get(
        `http://localhost:3000/expense?userId=${userData.id}`,
        {
          withCredentials: true,
        },
      );
      setExpenses(response.data.exp);
    } catch (err) {
      console.log(err.response.data.message);
    }
  }

  function handleDelete(id) {
    setDel(id);
  }

  function handleEdit(data) {
    setEdit(data);
  }

  async function delExp() {
    try {
      setDel("");
      const response = await axios.delete(
        `http://localhost:3000/expense?eid=${del}`,
        {
          withCredentials: true,
        },
      );
      if (response.data.success) {
        setExpenses(response.data.data);
        setMessage(response.data.message);
      }
    } catch (err) {
      console.log(err.response.data.message);
    }
  }

  function handleChange(evt, num) {
    if (num === 1) {
      setEdit((prev) => {
        return {
          ...prev,
          description: evt.target.value,
        };
      });
    } else if (num === 2) {
      setEdit((prev) => {
        return {
          ...prev,
          price: evt.target.value,
        };
      });
    } else if (num === 3) {
      setEdit((prev) => {
        return {
          ...prev,
          category: evt.target.value,
        };
      });
    }
  }

  async function handleEditSubmit(evt) {
    evt.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:3000/expense",
        {
          id: edit.id,
          description: edit.description,
          price: edit.price,
          category: edit.category,
        },
        {
          withCredentials: true,
        },
      );
      if (response.data.success) {
        setExpenses(response.data.data);
        setMessage(response.data.message);
        setEdit("");
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (userData && userData.id) {
      getUserExpenses();
    }
  }, [userData]);

  return (
    <div className="relative bg-slate-100 flex flex-col max-h-full overflow-y-auto pt-4 w-[75%]">
      {message && (
        <div className="absolute top-4 left-1/2 min-w-64 min-h-10 -translate-x-1/2 p-2 flex justify-between bg-green-400 text-white">
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
      {del && (
        <div className="absolute w-full h-full top-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-1000">
          <div className="del-box flex flex-col w-80 min-h-40 p-8 bg-white rounded-md">
            <div className="msg mb-4">
              <i className="fa-solid fa-triangle-exclamation"></i>
              Do want to delete this expense
            </div>
            <div className="btns flex justify-around">
              <button
                className="w-20 h-10 border border-red-500 text-red-900 hover:bg-red-500 hover:text-white rounded-sm"
                onClick={delExp}
              >
                Delete
              </button>
              <button
                className="w-20 h-10 border border-slate-700 text-slate-950 hover:bg-slate-950 hover:text-white rounded-sm"
                onClick={() => setDel("")}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {edit && (
        <div className="absolute w-full h-full top-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-1000">
          <div className="del-box flex flex-col w-80 min-h-40 p-8 bg-white rounded-md relative">
            <i
              className="fa-solid fa-xmark absolute top-3 right-2 text-slate-500"
              onClick={() => setEdit("")}
            ></i>
            <form className="w-full flex flex-col" onSubmit={handleEditSubmit}>
              <label htmlFor="des">Description</label>
              <input
                type="text"
                value={edit.description}
                onChange={(evt) => handleChange(evt, 1)}
                className="w-full h-10 p-2 my-2 rounded-sm outline focus:outline-4 focus:outline-blue-400"
                id="des"
                required
              />
              <label htmlFor="price">Price</label>
              <input
                type="number"
                value={edit.price}
                onChange={(evt) => handleChange(evt, 2)}
                className="w-full h-10 p-2 my-2 rounded-sm outline focus:outline-4 focus:outline-blue-400"
                id="price"
                required
              />
              <label htmlFor="category">
                Category
              </label>
              <select
                className="w-full h-10 p-2 my-2 rounded-sm outline focus:outline-4 focus:outline-blue-400"
                value={edit.category}
                onChange={(evt) => {
                  handleChange(evt, 3)
                }}
                id="category"
                required
              >
                <option value="" disabled>
                  Choose a category
                </option>
                {category &&
                  category.map((cat) => {
                    return (
                      <>
                      <option key={cat._id} value={cat._id} selected>
                        {cat.name}
                      </option>
                      </>
                    );
                  })}
              </select>
              <button className="w-full h-10 p-2 my-2 rounded-sm bg-slate-600 text-white">
                Edit
              </button>
            </form>
          </div>
        </div>
      )}
      {!expenses && <div>No expenses added yet</div>}
      {expenses && (
        <>
          <div className="w-[94%] mx-auto h-100 my-4 flex flex-col">
            <SearchBudget budgetExpenses={expenses} />
          </div>
          <div className="w-[90%] mx-auto overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
            <div className="w-full mx-auto flex justify-around bg-white border-b border-b-slate-300 hover:bg-slate-50">
              <div className="w-[20%] rounded-sm p-4 text-center font-bold">
                Date
              </div>
              <div className="w-[20%] rounded-sm p-4 text-center font-bold">
                Description
              </div>
              <div className="w-[20%] rounded-sm p-4 text-center font-bold">
                Price
              </div>
              <div className="w-[20%] rounded-sm p-4 text-center font-bold">
                Category
              </div>
              <div className="w-[20%] rounded-sm p-4 text-center font-bold">
                Options
              </div>
            </div>
            {expenses.map((exp) => {
              return (
                <div
                  key={exp._id}
                  className="w-full mx-auto flex justify-around bg-white border-b border-b-slate-300 hover:bg-slate-50"
                >
                  <div className="w-[20%] rounded-sm p-4 text-center font-bold">
                    {displayDate(exp.date.toString().slice(0, 10))}
                  </div>
                  <div className="w-[20%] rounded-sm p-4 text-center">
                    {exp.description}
                  </div>
                  <div className="w-[20%] rounded-sm p-4 text-center">
                    {exp.price}
                  </div>
                  <div className="w-[20%] rounded-sm p-4 text-center">
                    {exp.category.name}
                  </div>
                  <div className="w-[20%] rounded-sm p-4 text-center">
                    <i
                      className="fa-regular fa-pen-to-square"
                      onClick={() =>
                        handleEdit({
                          id: exp._id,
                          description: exp.description,
                          price: exp.price,
                          category: exp.category._id,
                        })
                      }
                    ></i>
                    <i
                      className="fa-solid fa-trash text-red-500 mx-2"
                      onClick={() => handleDelete(exp._id)}
                    ></i>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default ListExpenses;
