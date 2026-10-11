import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import authContext from '../contexts/authContext'
import dashContext from '../contexts/dashContext';
import axios from "axios"
import displayDate from '../utils/DisplayDate';
import Doughnut from './charts/Doughnut';
import categoryExpenses from '../utils/CategoryExpenses';
import weekDayAverage from '../utils/WeekDayAverage';
import BarChartUtil from './charts/BarChartUtil';

function DashBoard() {
  let {username} = useContext(authContext);
  let {userData} = useContext(dashContext);
  let [lastTen, setLastTen] = useState("");
  let [lastThree, setLastThree] = useState("");
  let [numBudget, setNumBudget] = useState(0);
  let [weekData, setWeekData] = useState("");

  async function loadData() {
    try {
      const response = await axios.get("http://localhost:3000/analysis", {
        withCredentials: true
      });
      if(response.data.success) {
        console.log("response", response.data);
        setNumBudget(response.data.numberOfBudgets);
        setLastTen(response.data.lastTenExpense);
        setLastThree(response.data.lastThreeMonthsExpenses);
        setWeekData(weekDayAverage(response.data.lastThreeMonthsExpenses, "chart"));
      }
    } catch (err) {
      console.log(err);
      if(err.response) {
        console.log(err.response.data.message);
      }
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className='relative w-full md:w-[75%] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none pl-4 flex flex-col bg-slate-100 dark:bg-linear-to-br dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 min-h-full overflow-y-auto pt-4'>
        <div className="main w-[90%] mx-auto flex flex-wrap gap-4 justify-around">
          <div className="upper border-l-4 border-l-purple-600 w-[90%] sm:w-[70%] md:w-60 h-40 flex flex-col justify-center items-center bg-white dark:bg-white/5 dark:text-slate-100 shadow-md rounded-md hover:shadow-lg">
            <div className='text-xl'>Welcome, {username}</div>
            <div>Role: {userData.role}</div>
          </div>
          <div className="upper border-l-4 border-l-purple-600 w-[90%] sm:w-[70%] md:w-60 h-40 flex flex-col justify-center items-center bg-white dark:bg-white/5 dark:text-slate-100 shadow-md rounded-md hover:shadow-lg">
            <div className='text-xl'>Number of Budgets</div>
            <div>{numBudget}</div>
          </div>
          <div className="upper border-l-4 border-l-purple-600 w-[90%] sm:w-[70%] md:w-60 h-40 flex flex-col justify-center items-center bg-white dark:bg-white/5 dark:text-slate-100 shadow-md rounded-md hover:shadow-lg">
            <div className='text-xl'>Created Last Expense On</div>
            {lastTen?.length > 0 ? <div>{displayDate(lastTen[0].date.slice(0, 10))}</div> : <div>No expense created yet</div>}
          </div>
        </div>
        {lastTen?.length > 0 && <div className="flex flex-wrap justify-around gap-8 w-[95%] my-4 mx-auto flex-1">
          <div className='w-full lg:w-[80%] xl:w-110 mx-2 my-4 bg-white dark:bg-white/5 dark:text-slate-100 rounded-sm shadow-md hover:shadow-lg min-h-100'>
            <div className="min-h-10 px-4 py-1 border-b-2 text-xl border-b-slate-300 dark:border-b-slate-700 hover:bg-slate-50 dark:hover:bg-white/1">
              Recent Expenses
            </div>
            <div className='[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none overflow-y-auto h-90'>
              <div className='w-120 sm:w-full'>
                <div className='min-h-10 p-1 border-b border-b-slate-200 dark:border-b-slate-700 hover:bg-slate-50 dark:hover:bg-white/1 flex justify-between'>
                  <span className='w-1/4 text-center font-black'>Date</span>
                  <span className='w-1/4 text-center font-black'>Description</span>
                  <span className='w-1/4 text-center font-black'>Category</span>
                  <span className='w-1/4 text-center font-black'>Price</span>
                </div>
              {lastTen && lastTen.map((ele, idx) => (
                <div key={idx} className='min-h-10 p-1 border-b border-b-slate-200 dark:border-b-slate-700 hover:bg-slate-50 dark:hover:bg-white/1 flex justify-between'>
                  <span className='w-1/4 text-center'>{displayDate(ele.date.slice(0, 10))}</span>
                  <span className='w-1/4 text-center'>{ele.description}</span>
                  <span className='w-1/4 text-center'>{ele.category.name}</span>
                  <span className='w-1/4 text-center'>₹{ele.price.toLocaleString()}</span>
                </div>
              ))}
              </div>
            </div>
          </div>
          <div className='w-full lg:w-[80%] xl:w-110 mx-2 my-4 bg-white rounded-sm shadow-md hover:shadow-lg dark:bg-white/5 dark:text-slate-100 min-h-100'>
            <div className="min-h-10 px-4 py-1 border-b-2 text-xl border-b-slate-300 hover:bg-slate-50 dark:hover:bg-white/1">
              Last 3 Months Category wise expense analysis
            </div>
            <div className='w-full h-90'>
              <Doughnut data={categoryExpenses(lastThree)} />
            </div>
          </div>
          <div className='w-full lg:w-[80%] xl:w-110 mx-2 my-4 bg-white rounded-sm shadow-md hover:shadow-lg dark:bg-white/5 dark:text-slate-100 min-h-100'>
            <div className="min-h-10 px-4 py-1 border-b-2 text-lg border-b-slate-300 dark:border-b-slate-700 hover:bg-slate-50 dark:hover:bg-white/1">
              Last 3 Months day wise average expense Table
            </div>
              <div className='[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none overflow-y-auto h-90'>
                  <div className='min-h-10 p-1 border-b border-b-slate-200 dark:border-b-slate-700 hover:bg-slate-50 dark:hover:bg-white/1 flex justify-between'>
                    <span className='w-1/3 text-center font-black'>Day</span>
                    <span className='w-1/3 text-center font-black'>Average Expense</span>
                    <span className='w-1/3 text-center font-black'>No of Expenses</span>
                  </div>
                {lastThree && weekDayAverage(lastThree, "chart").map((ele, idx) => (
                  <div key={idx} className='min-h-10 p-1 border-b border-b-slate-200 dark:border-b-slate-700 hover:bg-slate-50 dark:hover:bg-white/1 flex justify-between'>
                    <span className='w-1/3 text-center'>{ele.dayName}</span>
                    <span className='w-1/3 text-center'>₹{ele.dayAverage.toFixed(1).toLocaleString()}</span>
                    <span className='w-1/3 text-center'>{ele.expenses}</span>
                  </div>
                ))}
              </div>
          </div>
          <div className='w-full lg:w-[80%] xl:w-110 mx-2 my-4 bg-white rounded-sm shadow-md hover:shadow-lg dark:bg-white/5 dark:text-slate-100 min-h-100'>
            <div className="min-h-10 px-4 py-1 border-b-2 text-lg border-b-slate-300 hover:bg-slate-50 dark:hover:bg-white/1">
              Last 3 Months day wise average expense Chart
            </div>
            <div className='[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none dark:text-yellow-500 overflow-y-auto h-90'>
              {weekData && <BarChartUtil data={weekData} />}
            </div>
          </div>
        </div>}
    </div>
  );
}

export default DashBoard
