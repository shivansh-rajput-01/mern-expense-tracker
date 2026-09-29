import React from 'react'

import { LineChart, Line, XAxis, YAxis, Legend, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'

function LineChartUtil({data}) {
  return (
    <ResponsiveContainer>
        <LineChart data={data} margin={{top: 10, right: 10, left: 10, bottom: 10}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis tickFormatter={(value) => `₹${value}`} />
            <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
            <Legend />
            <Line type="monotone" dataKey="budget" stroke="#ff0000" strokeWidth={2} name="Category Budget" />
            <Line type="monotone" dataKey="expenditure" stroke="#0000ff" strokeWidth={2} name="Expenditure" />
        </LineChart>
    </ResponsiveContainer>
  );
}

export default LineChartUtil