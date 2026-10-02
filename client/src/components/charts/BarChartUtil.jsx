import React from "react";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function BarChartUtil({ data }) {
  return (
    <ResponsiveContainer>
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="dayName"
          interval={0}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis
          yAxisId="left"
          tickFormatter={(value) => `₹${value.toLocaleString()}`}
          orientation="left"
        />
        <YAxis
          yAxisId="right"
          tickFormatter={(value) => value}
          orientation="right"
          allowDecimals={false}
        />
        <Tooltip
          formatter={(value, name) =>
            name === "Average Expense" ? `₹${value.toLocaleString()}` : value
          }
          cursor={false}
        />
        <Legend />
        <Bar
          yAxisId="left"
          dataKey="dayAverage"
          fill="#0000ff"
          name="Average Expense"
          radius={[4, 4, 0, 0]}
          activeBar={{ fill: '#0000ff', stroke: 'none' }}
        />
        <Bar
          yAxisId="right"
          dataKey="expenses"
          fill="#00ff00"
          name="No of Expenses"
          radius={[4, 4, 0, 0]}
          activeBar={{ fill: '#00ff00', stroke: 'none' }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BarChartUtil;
