import React, { useContext, useEffect, useState } from "react";
import dashContext from "../contexts/dashContext";
import * as XLSX from 'xlsx';
import axios from "axios";
import formatExcelData from "../utils/FormatExcelData";
import displayDate from "../utils/DisplayDate";
import getCatName from "../utils/GetCategoryNameFromId";

function Expense() {
  let [description, setDescription] = useState("");
  let [price, setPrice] = useState(0);
  let [categorys, setCategorys] = useState("");
  let [date, setDate] = useState("");
  let [message, setMessage] = useState("");
  let [error, setError] = useState("");
  let [excelMode, setExcelMode] = useState(false);
  let [templateDownloaded, setTemplateDownloaded] = useState(false);
  let [uploadData, setUploadData] = useState("");
  const { category, userData } = useContext(dashContext);

  const getTodayLocalDate = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
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
      owner: userData.id,
    };

    if (!date) expense.date = getTodayLocalDate();

    try {
      const response = await axios.post(
        "http://localhost:3000/expense",
        expense,
        {
          withCredentials: true,
        },
      );
      setMessage(response.data.message);
      setDescription("");
      setPrice(0);
      setDate("");
      setCategorys("");
    } catch (err) {
      console.log(err);
    }
  }

  function handleExcelImport(evt) {
    const file = evt.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log(jsonData);
        let result = formatExcelData(jsonData, category);
        if(result[0]){
          setError(result[0]);
          return;
        }
        setUploadData(result[1]);
    }
    reader.readAsArrayBuffer(file);
  }

  async function bulkUpload(data) {
    try {
      const response = await axios.post("http://localhost:3000/expenses/bulk", {data}, {
        withCredentials: true
      });
      if(response.data.success) {
        setMessage(response.data.message);
        setError("");
        setUploadData("");
        console.log(response.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="flex justify-center items-center w-full md:w-[75%] p-4 dark:bg-linear-to-br dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 bg-slate-100 min-h-full overflow-y-auto relative">
      {message && (
        <div className="absolute top-4 left-1/2 min-w-64 min-h-10 -translate-x-1/2 p-2 flex justify-between bg-green-400 text-white">
          <div className="message">{message}</div>
          <div
            className="close pointer-cursor pl-8"
            onClick={() => {
              setMessage("");
            }}
          >
            <i className="fa-solid fa-xmark"></i>
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
              <button
                className="w-20 h-10 border border-slate-700 text-slate-950 hover:bg-slate-950 hover:text-white rounded-sm"
                onClick={() => setError("")}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {uploadData && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-10000">
          <div className="del-box flex flex-col w-80 min-h-40 p-8 bg-white rounded-md">
            <div className="msg mb-4">
              File readed Successfully. Want to save these data?
            </div>
            <span className="text-sm">Scroll to see full data</span>
            <div className="max-h-40 w-60 my-4 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
              <div className="w-100 overflow-auto shadow-sm">
                <div className="header w-full min-h-10 flex justify-around border-b border-b-slate-100">
                  <div className="w-1/4 text-center">Date</div>
                  <div className="w-1/4 text-center">Description</div>
                  <div className="w-1/4 text-center">Category</div>
                  <div className="w-1/4 text-center">Price</div>
                </div>
                {uploadData.map((ele, idx) => (
                  <div key={idx} className="data min-h-10 w-full flex justify-around border-b border-b-slate-100">
                    <div className="w-1/4 text-center">{displayDate(ele.date.toLocaleString().slice(0, 10), 2)}</div>
                    <div className="w-1/4 text-center">{ele.description}</div>
                    <div className="w-1/4 text-center">{getCatName(category, ele.category)}</div>
                    <div className="w-1/4 text-center">{ele.price}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="btns flex justify-around">
              <button className="w-20 h-10 border border-red-500 text-red-900 hover:bg-red-500 hover:text-white rounded-sm" onClick={() => setUploadData("")}>
                Cancel
              </button>
              <button
                className="w-20 h-10 border border-slate-700 text-slate-950 hover:bg-slate-950 hover:text-white rounded-sm"
                onClick={() => bulkUpload(uploadData)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      }
      <div className="form w-100 bg-white dark:bg-black/20 dark:text-slate-100 shadow-sm rounded-md flex justify-center p-4">
        {!excelMode && (
          <form onSubmit={handleExpense}>
            <div className="mb-1 text-2xl">Add Expense</div>
            <label htmlFor="description" className="block mb-2 mt-4">
              Description
            </label>
            <input
              type="text"
              placeholder="Description"
              className="outline p-2 rounded-sm w-80 h-10 mb-2 focus:outline-4 focus:outline-blue-400"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              id="description"
              required
            />

            <label htmlFor="price" className="block mb-2">
              Price
            </label>
            <input
              type="number"
              placeholder="Price"
              className="outline p-2 rounded-sm w-80 h-10 mb-2 focus:outline-4 focus:outline-blue-400"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
              id="price"
              required
            />

            <label htmlFor="date" className="block mb-2">
              Date(optional if empty take today)
            </label>
            <input
              type="date"
              placeholder="Price"
              className="outline p-2 rounded-sm w-80 h-10 mb-2 focus:outline-4 focus:outline-blue-400"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
              id="date"
            />

            <label htmlFor="category" className="block mb-2">
              Category
            </label>
            <select
              className="outline p-2 rounded-sm w-80 h-10 mb-2 focus:outline-4 focus:outline-blue-400"
              value={categorys}
              onChange={(e) => {
                setCategorys(e.target.value);
              }}
              id="category"
              required
            >
              <option value="" className="dark:bg-slate-950/90" disabled>
                Choose a category
              </option>
              {category &&
                category.map((cat) => {
                  return (
                    <option
                      key={cat._id}
                      value={cat._id}
                      className="dark:bg-slate-950/90"
                    >
                      {cat.name}
                    </option>
                  );
                })}
            </select>
            <button className="bg-slate-900 dark:bg-purple-950/90 text-white w-80 h-10 p-2 rounded-sm my-4 block selection:bg-sl">
              Add
            </button>
            <button type="button"
              className="bg-green-700 text-white w-80 h-10 p-2 rounded-sm my-4 block selection:bg-sl"
              onClick={() => setExcelMode(true)}
            >
              Upload XLSX, XSL
            </button>
          </form>
        )}
        {excelMode && (
          <div>
            {templateDownloaded && <input type="file" accept=".xlsx, .xls, .csv" className="outline p-2 rounded-sm w-80 h-10 mb-2" onChange={handleExcelImport} />}
            {!templateDownloaded && <a href="/expenses.xlsx" download="template.xlsx" onClick={() => setTemplateDownloaded(true)}><button
              className="border border-green-700 dark:text-white w-80 h-10 p-2 rounded-sm my-4 block selection:bg-sl"
            >
              Download Template and fill expenses
            </button></a>}
            {!templateDownloaded && <button
              className="border border-green-700 dark:text-white w-80 h-10 p-2 rounded-sm my-4 block selection:bg-sl" onClick={() => setTemplateDownloaded(true)}
            >
              Already have file upload
            </button>}
            <button
              className="bg-green-700 text-white w-80 h-10 p-2 rounded-sm my-4 block selection:bg-sl"
              onClick={() => setExcelMode(false)}
            >
              Add via application
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Expense;
