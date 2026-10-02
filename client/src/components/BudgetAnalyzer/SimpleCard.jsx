import React from 'react'

function SimpleCard({amount, message}) {
  return (
    <div className="cards w-full sm:w-60 h-36 flex flex-col justify-center items-center bg-white dark:bg-white/5 dark:text-white rounded-md shadow-md hover:shadow-lg">
        <span className="text-2xl my-2">{message}</span>
        <span>₹{amount.toLocaleString()}</span>
    </div>
  )
}

export default SimpleCard