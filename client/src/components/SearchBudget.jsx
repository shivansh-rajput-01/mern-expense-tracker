import React from 'react'
import { useContext } from 'react';
import { useState } from 'react'
import dashContext from '../contexts/dashContext';
import displayDate from '../utils/DisplayDate';
import stagedSearch from '../utils/StagedSearch';
import SearchedExpenses from './SearchedExpenses';

function SearchBudget({ budgetExpenses }) {

    let [filters, setFilters] = useState(["date", "price", "description", "category"]);
    let [stages, setStages] = useState([]);
    let [currStage, setCurrStage] = useState(0);
    let [currFilter, setCurrFilter] = useState("");
    let [errMes, setErrMes] = useState("");
    let [searchedData, setSearchedData] = useState("");
    let [totals, setTotals] = useState("");
    let [inputs, setInputs] = useState({
        inp1: "",
        inp2: ""
    });
    let [addPossible, setAddPossible] = useState(true);
    let [clearPossible, setClearPossible] = useState(false);
    let [showSearch, setShowSearch] = useState(false);
    let [stageViewer, setStageViewer] = useState(0);

    let {category, darkMode, setDarkMode} = useContext(dashContext);

    // console.log(budgetExpenses);

    function incStage() {
        if(currStage < 4) {
            setCurrStage((prev) => prev + 1);
            setAddPossible(false);
        }
    }

    function handleInputs(evt, num) {
        if(num === 1) {
            setInputs((prev) => (
                {
                    ...prev,
                    inp1: evt.target.value,
                }
            ));
        } else if (num === 2) {
            setInputs((prev) => (
                {
                    ...prev,
                    inp2: evt.target.value,
                }
            ));
        }
    }

    function addStage() {
        let res = [];
        if(currStage === 4) setShowSearch(true);
        if(currFilter.trim() === "" && currStage < 4) return;
        setErrMes("");
        if(currFilter === "date" || currFilter === "price") {
            if(inputs.inp1.trim() === "" || inputs.inp2.trim() === "") return false;
            if(currFilter === "price") {
                if(Number(inputs.inp1.trim()) > Number(inputs.inp2.trim())) {
                    setErrMes("1");
                    return false;
                }
            }
            if(currFilter === "date") {
                let date1 = new Date(inputs.inp1.trim());
                let date2 = new Date(inputs.inp2.trim());
                if(date1 > date2) {
                    setErrMes("2");
                    return false;
                }
            }
            setStages((prev) => {
                return [
                    ...prev,
                    {
                        filter: currFilter,
                        inp1: inputs.inp1.trim(),
                        inp2: inputs.inp2.trim()
                    }
                ]
            });
            res = [...stages, {
                filter: currFilter,
                inp1: inputs.inp1.trim(),
                inp2: inputs.inp2.trim()
            }];
        } else if (currFilter === "description" || currFilter === "category") {
            if(inputs.inp1.trim() === "") return false;
            setStages((prev) => {
                return [
                    ...prev,
                    {
                        filter: currFilter,
                        inp1: inputs.inp1.trim()
                    }
                ]
            });
            res = [...stages, {
                filter: currFilter,
                inp1: inputs.inp1.trim()
            }];
        }

        setFilters((prev) => {
            let newArr = [];
            for(let p of prev) {
                if (p !== currFilter) {
                    newArr.push(p)
                }
            }
            return newArr;
        });
        setCurrFilter("");
        setInputs({
            inp1: "",
            inp2: ""
        });
        setAddPossible(true);
        let calc = stagedSearch(res, budgetExpenses);
        setTotals(calc.totals);
        setSearchedData(calc.lists);
        return res;
    }

    function handleSearch() {
        let res = addStage();
        if(!res) return;
        setShowSearch(false);
        setAddPossible(false);
        setClearPossible(true);
        let calc;
        if(showSearch) {
            calc = stagedSearch(stages, budgetExpenses);
            setTotals(calc.totals);
            setSearchedData(calc.lists);
        } 
        else {
            calc = stagedSearch(res, budgetExpenses);
            setTotals(calc.totals);
            setSearchedData(calc.lists);
        } 
        console.log(calc);
    }

    function handleClean() {
        setClearPossible(false);
        setFilters(["date", "price", "description", "category"])
        setStages([]);
        setCurrFilter("");
        setInputs({
            inp1: "",
            inp2: ""
        });
        setAddPossible(true);
        setCurrStage(0);
        setErrMes("");
        setShowSearch(false);
        setSearchedData("");
        setTotals("");
        setStageViewer(0);
    }
    
    return (
        <div className='w-full flex flex-wrap gap-4 justify-around'>
            <div className='w-full md:w-md xl:w-[45%] min-h-90 ml-2 dark:bg-white/5 dark:text-slate-100 max-h-85 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none bg-white rounded-md shadow-md mr-2'>
                <div className='stage-adder w-full border-b h-14 border-b-slate-200 dark:border-b-slate-700 flex justify-between p-2 items-center'>
                    <span>Search Expenses</span>
                    {addPossible && currStage < 4 && <button className='w-32 h-10 p-2 rounded-sm border text-black dark:text-slate-100 dark:hover:bg-purple-800 border-slate-900 hover:bg-slate-700 hover:text-white' onClick={incStage}>+ Add Stage</button>}
                    {clearPossible && <button className='w-32 h-10 p-2 rounded-sm border text-black border-slate-900 dark:text-slate-100 dark:hover:bg-purple-800 hover:bg-slate-700 hover:text-white' onClick={handleClean}>Clear</button>}
                </div>
                {stages.map((ele, idx) => (
                    <div key={idx} className='w-full p-1 border-b border-b-slate-200 dark:border-b-slate-700 dark:text-slate-100 flex justify-between' style={darkMode? idx <= stageViewer - 1 ? {color: "white"}: stageViewer > 0? {color: "rgba(255, 255, 255, 0.2)"} : {color: "white"} : idx <= stageViewer - 1 ? {color: "black"}: stageViewer > 0? {color: "rgb(0, 0, 0, 0.2)"}: {color: "black"}}>
                        <span className='mr-8 w-[20%]'>{ele.filter}</span>
                        <span>{ele.filter !== "date" ? ele.inp1: displayDate(ele.inp1.slice(0, 10))}</span>
                        {(ele.filter === "date" || ele.filter === "price") && <span>{ele.filter !== "date" ? ele.inp2: displayDate(ele.inp2.slice(0, 10))}</span>}
                    </div>
                ))}
                {currStage > 0 && !addPossible && !clearPossible && (
                    <div className='w-[80%] mx-auto'>
                        <select value={currFilter} onChange={(e) => setCurrFilter(e.target.value)} className='w-full outline focus:outline-4 focus:outline-blue-400 rounded-md my-2 h-10' required >
                            <option value="" className='dark:bg-slate-950/90' disabled>Select Filter</option>
                            {filters.map((ele, idx) => (
                                <option key={idx} value={ele} className='dark:bg-slate-950/90'>{ele}</option>
                            ))}
                        </select>
                        {currFilter && (
                            <>
                            {currFilter === "date" && <>
                                <input type="date" value={inputs.inp1} onChange={(e) => handleInputs(e, 1)} className='w-full outline focus:outline-4 focus:outline-blue-400 rounded-md h-10 my-2' />
                                <input type="date" value={inputs.inp2} onChange={(e) => handleInputs(e, 2)} className='w-full outline focus:outline-4 focus:outline-blue-400 rounded-md h-10 my-2' />
                            </>}
                            {currFilter === "price" && <>
                                <input type="number" placeholder='Lower Limit' value={inputs.inp1} onChange={(e) => handleInputs(e, 1)} className='w-full outline focus:outline-4 focus:outline-blue-400 rounded-md h-10 my-2' />
                                <input type="number" placeholder='Upper Limit' value={inputs.inp2} onChange={(e) => handleInputs(e, 2)} className='w-full outline focus:outline-4 focus:outline-blue-400 rounded-md h-10 my-2' />
                            </>}
                            {currFilter === "description" && <>
                                <input type="text" placeholder='description' value={inputs.inp1} onChange={(e) => handleInputs(e, 1)} className='w-full outline focus:outline-4 focus:outline-blue-400 rounded-md h-10 my-2' />
                            </>}
                            {currFilter === "category" && <>
                                <select value={inputs.inp1} onChange={(e) => handleInputs(e, 1)} className='w-full outline focus:outline-4 focus:outline-blue-400 rounded-md my-2 h-10' required >
                                    <option value="" className='dark:bg-slate-950/90' disabled>Choose</option>
                                    {category.map((ele) => (
                                        <option key={ele._id} value={ele.name} className='dark:bg-slate-950/90'>{ele.name}</option>
                                    ))}
                                </select>
                            </>}
                            {errMes === "1" && <div className='text-red-500 text-sm'>Lower Limit must be less then upperLimit</div>}
                            {errMes === "2" && <div className='text-red-500 text-sm'>Start date must come before last date</div>}
                            <button className='w-[47%] mx-1 rounded-sm h-10 border border-slate-900 hover:text-white hover:bg-slate-700' onClick={addStage}>Save Stage</button>
                            <button className='w-[47%] mx-1 rounded-sm h-10 border border-slate-900 hover:text-white hover:bg-slate-700' onClick={handleSearch}>Search</button>
                        </>
                        )}

                        
                    </div>
                )}
                {showSearch && <button className='w-[90%] mx-1 my-4 rounded-sm h-10 border border-slate-900 hover:text-white hover:bg-slate-700' onClick={handleSearch}>Search</button>}
                {clearPossible && <>
                    {searchedData.map((ele, idx) => {
                        return (
                            <button key={idx} className='mx-2 my-4 rounded-sm w-20 h-10 border border-slate-900 hover:bg-slate-700 hover:text-white' onClick={() => setStageViewer(idx+1)} style={stageViewer === idx+1? {backgroundColor: "blue", color: "white"} : {}}>
                                {`Stage ${idx + 1}`}
                            </button>
                        )
                    })}
                </>}
            </div>
            <div className='w-full md:w-md xl:w-[45%] min-h-90 ml-2 dark:bg-white/5 dark:text-slate-100 max-h-85 flex flex-col bg-white rounded-md shadow-md mr-2 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none'>
                {searchedData ? (
                    <>
                        <div className='w-140 sm:w-full p-2 border-b border-b-slate-200 dark:border-b-slate-700 flex justify-between hover:bg-slate-50 dark:hover:bg-white/1'>
                            <span className='block w-[20%] text-center font-black'>Date</span>
                            <span className='block w-[20%] text-center font-black'>Description</span>
                            <span className='block w-[20%] text-center font-black'>Category</span>
                            <span className='block w-[20%] text-center font-black'>Price</span>
                        </div>
                        <div className='flex-1 w-140 sm:w-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none'>
                            {stageViewer === 0 && <SearchedExpenses data={searchedData[searchedData.length - 1]} total={totals[totals.length - 1]}/>}
                            {stageViewer !== 0 && <SearchedExpenses data={searchedData[stageViewer - 1]} total={totals[stageViewer - 1]}/>}
                        </div>
                    </>
                ): (
                    <div>Nothing Searched yet</div>
                )}
            </div>
        </div>
    )
}

export default SearchBudget