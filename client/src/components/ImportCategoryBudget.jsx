import axios from "axios";
import React from "react";
import { useState } from "react";
import displayDate from "../utils/DisplayDate";
import dataGenerator from "../utils/DataGenerator";

function ImportCategoryBudget({ budgetId, budget, budgetAmount, categoryBudget, bulkImport }) {
  let [override, setOverride] = useState(0);
  let [choosen, setChoosen] = useState(false);
  let [showMessage, setShowMessage] = useState(true);
  let [bName, setBName] = useState("");
  let [askList, setAskList] = useState("");
  let [intermediate, setIntermediate] = useState("");
  let [amount, setAmount] = useState(0);
  let [noBudget, setNoBudget] = useState(false);
  let [importCat, setImportCat] = useState("");
  let [selectAll, setSelectAll] = useState(false);
  let [selectList, setSelectList] = useState({});
  let [overlap, setOverlap] = useState(false);
  let [dupList, setDupList] = useState("");
  let [finalList, setFinalList] = useState("");
  let [removeList, setRemoveList] = useState([]);
  let [error, setError] = useState("");

  console.log(budget, "budget");
  async function handleImport(evt) {
    evt.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:3000/budget/import?bName=${bName.trim()}`,
        {
          withCredentials: true,
        },
      );
      if (response.data.success) {
        console.log(response.data);
        if (response.data.budget?.length > 1) {
          askUser(response.data.budget);
        } else if (response.data.budget?.length === 1) {
          setAmount(response.data.budget[0].budgetMoney);
          setImportCat(response.data.budget[0].budgetCategory);
          setChoosen(true);
        } else {
          setNoBudget(true);
          setChoosen(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
    // setChoosen(true);
  }

  function askUser(data) {
    let derivedData = [];
    for (let d of data) {
      derivedData.push({
        id: d._id,
        name: d.name,
        start: displayDate(d.start.slice(0, 10)),
        end: displayDate(d.end.slice(0, 10)),
      });
    }
    console.log(derivedData);
    setIntermediate(data);
    setAskList(derivedData);
    setChoosen(true);
  }

  function registerInterest(id) {
    let ans;
    for (let budget of intermediate) {
      if (id.toString() === budget._id.toString()) {
        ans = budget;
      }
    }
    setIntermediate("");
    setAskList("");
    console.log(ans);
    setAmount(ans.budgetMoney);
    setImportCat(ans.budgetCategory);
  }

  function selectIndividual(id) {
    let ans;
    for (let ele of importCat) {
      if (id.toString() === ele._id.toString()) {
        ans = ele;
      }
    }
    setSelectList((prev) => ({
      ...prev,
      [ans._id]: ans,
    }));
  }

  function selectAllAtOnce() {
    setSelectAll((prev) => !prev);
    let obj = {};
    for (let ele of importCat) {
      obj[ele._id] = ele;
    }
    if (!selectAll) {
      setSelectList(obj);
    } else {
      setSelectList({});
    }
  }

  function removeFromList(id) {
    console.log(id);
    setSelectList((prev) => {
      let { [id]: _, ...rest } = prev;
      return rest;
    });
  }

  function handleImportDb() {
    if(Object.keys(selectList).length === 0) {
      console.log("choose at least one");
      return;
    }
    console.log(selectList);
    setImportCat("");
    let duplicate = [];
    let flag = false;
    for (let key in selectList) {
      let name = selectList[key].category.name;
      for (let b of budget) {
        if (name === b.category.name) {
          flag = true;
          duplicate.push({
            name: name,
            current: b.budget,
            imported: selectList[key].budget,
            bid: selectList[key]._id,
            cid: b.category._id
          });
        }
      }
    }
    if(flag) {
      setOverlap(true);
    } else {
      finalDataCreater(0);
    }
    if(duplicate.length > 0) {
      setDupList(duplicate);
    }
    console.log(duplicate);
  }

  function finalDataCreater(isOverride) {
    console.log(isOverride);
    let data = {
      override: false,
      elements: [],
      remove: []
    };
    if(isOverride === 0) {
      data.elements = dataGenerator(selectList);
    }
    if(isOverride === 1) { // duplicates available and override previous conflict category budgets
      let dupId = [];
      for(let ele of dupList) {
        dupId.push({
          id: ele.bid,
          budget: ele.current
        });
      }
      setRemoveList(dupId);
      data.override = true;
      data.remove = dupId;
      data.elements = dataGenerator(selectList);
    }
    if(isOverride === 2) { // duplicates available but do not override previous data
      let newObj = {...selectList};
      for(let ele of dupList) {
        let id = ele.bid;
        delete newObj[id];
      }
      data.elements = dataGenerator(newObj);
    }
    importFinal(data, isOverride);
  }

  function importFinal(payload, parameter) {
    console.log("ready to import", payload);
    if(parameter === 0 || parameter === 2) {
      let totalRemaining = Number(budgetAmount) - Number(categoryBudget);
      let newSum = 0;
      for(let ele of payload.elements) {
        newSum += ele.budget;
      }
      console.log(newSum, "newSum");
      console.log(totalRemaining, "total remaining");
      if(newSum > totalRemaining) { // cannot import because category budgets exceeding total budget
        setError(`Cannot import as current budget is ₹${budgetAmount.toLocaleString()} and total category budget remaining is ₹${totalRemaining.toLocaleString()} but you are trying to import total of ₹${newSum.toLocaleString()}`);
        return;
      }
    } else if (parameter === 1) {
      let overrideSum = 0;
      for(let ele of payload.remove) {
        overrideSum += ele.budget;
      }
      let newSum = 0;
      let totalRemaining = budgetAmount - categoryBudget + overrideSum;
      for(let ele of payload.elements) {
        newSum += ele.budget;
      }
      console.log(newSum, "newSum");
      console.log(totalRemaining, "total remaining");
      if(newSum > totalRemaining) { // cannot import because category budgets exceeding total budget
        setError(`Cannot import as current budget is ₹${budgetAmount.toLocaleString()} and total category budget remaining is ₹${totalRemaining.toLocaleString()} but you are trying to import total of ₹${newSum.toLocaleString()}`);
        return;
      }
    }
    bulkImport(payload);
  }

  return (
    <div className="max-h-90 p-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      {error && <div className="text-sm text-red-500">{error}</div>}
      {overlap && (
        <>
          <div className="w-full">
            <div>Override conflicting sub budgets with import sub budgets</div>
            <div className="flex justify-around my-2">
              <button className="border border-slate-700 rounded-sm w-16 h-8"
                onClick={() => {
                  setChoosen(true);
                  setOverride(1);
                  setOverlap(false);
                  finalDataCreater(1);
                }}
              >
                Yes
              </button>
              <button className="border border-slate-700 rounded-sm w-16 h-8"
                onClick={() => {
                  setChoosen(true);
                  setOverride(2);
                  setOverlap(false);
                  finalDataCreater(2);
                }}
              >
                No
              </button>
            </div>
          </div>
          {dupList?.length > 0 && <div className="max-h-50 mt-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
            <div className="w-full h-10 p-2 flex justify-between border-b border-b-slate-200">
              <span className="w-1/4 text-center">Category</span>
              <span className="w-1/4 text-center">Current</span>
              <span className="w-1/4 text-center">Imported</span>
            </div>
            {dupList.map((ele, idx) => {
              return <div key={idx} className="w-full h-10 p-2 flex justify-between border-b border-b-slate-200">
              <span className="w-1/4 text-center">{ele.name}</span>
              <span className="w-1/4 text-center">₹{ele.current.toLocaleString()}</span>
              <span className="w-1/4 text-center">₹{ele.imported.toLocaleString()}</span>
            </div>
            })}
          </div>}
        </>
      )}
      {!choosen && (
        <form onSubmit={handleImport}>
          {showMessage && (
            <div className="p-2 bg-slate-50 rounded-sm text-sm italic relative">
              <span
                className="absolute top-0 right-0 text-slate-500 tetx-2xl"
                onClick={() => setShowMessage(false)}
              >
                <i className="fa-solid fa-minus"></i>
              </span>
              You can import category budgets from your previous budgets just
              type name of budget whose category budgets you want to import{" "}
            </div>
          )}
          <label htmlFor="budget" className="text-sm">
            Search by budget name to import
          </label>
          <input
            type="text"
            placeholder="Enter budget name"
            className="w-full h-10 p-2 my-2 rounded-sm outline focus:outline-4 focus:outline-blue-400"
            id="budget"
            value={bName}
            onChange={(evt) => setBName(evt.target.value)}
            required
          />
          <button className="w-full h-10 p-2 my-2 rounded-sm bg-slate-600 text-white">
            Import
          </button>
        </form>
      )}
      {askList && (
        <div className="w-full">
          <div>Select One to import</div>
          {askList.map((ele, idx) => {
            return (
              <div
                key={ele.id}
                className="border border-slate-200 hover:border-green-500 my-4 rounded-md min-h-10 flex justify-between p-2"
                onClick={() => registerInterest(ele.id)}
              >
                <span className="w-1/4 text-center">{ele.name}</span>
                <span className="w-1/4 text-center text-sm">{ele.start}</span>
                <span className="w-1/4 text-center text-sm">{ele.end}</span>
              </div>
            );
          })}
        </div>
      )}
      {importCat && (
        <div>
          {importCat.length === 0 && (
            <span className="text-red-500 text-sm">
              There are no category budgets to import from
            </span>
          )}
          {importCat.length > 0 && (
            <div className="w-full flex mb-4 p-2 justify-between">
              <span>Select all</span>
              <span
                className="border-2 inline-block rounded-sm border-green-200 w-4 h-4"
                style={selectAll ? { backgroundColor: "green" } : {}}
                onClick={selectAllAtOnce}
              ></span>
            </div>
          )}
          <div className="max-h-50 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
            {importCat.map((ele) => {
              return (
                <div
                  key={ele._id}
                  className="w-full flex justify-between rounded-md p-2 my-2"
                >
                  <span className="inline-block w-1/3">
                    {ele.category.name}
                  </span>
                  <span className="inline-block w-1/3">
                    ₹{ele.budget.toLocaleString()}
                  </span>
                  <span className="inline-block w-1/5 text-right">
                    {!Object.hasOwn(selectList, ele._id) && (
                      <span
                        className="border-2 rounded-sm inline-block border-green-200 w-4 h-4"
                        onClick={() => selectIndividual(ele._id)}
                      ></span>
                    )}
                    {Object.hasOwn(selectList, ele._id) && (
                      <span
                        className="border-2 rounded-sm bg-green-700 inline-block border-green-200 w-4 h-4"
                        onClick={() => removeFromList(ele._id)}
                      ></span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
          {importCat.length > 0 && (
            <button
              className="text-white w-full bg-slate-800 rounded-sm h-10 p-2"
              onClick={handleImportDb}
            >
              Import
            </button>
          )}
        </div>
      )}
      {noBudget && (
        <div className="text-sm text-red-500">
          No budget found named {bName}
        </div>
      )}
    </div>
  );
}

export default ImportCategoryBudget;
