import {PieChart, Pie, Legend, Tooltip, ResponsiveContainer} from "recharts"

export default function Doughnut({data}) {
    const chartColors = [
        '#fE7000', '#FF8E00', '#E15759', '#76B7B2', '#59A14F',
        '#EDC948', '#B07AA1', '#FF9DA7', '#9C755F', '#BAB0AC',
        '#32746D', '#FFC107', '#FF5722', '#00BCD4', '#8BC34A',
        '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3',
        '#009688', '#4CAF50', '#CDDC39', '#FFEB3B', '#FF9800'
    ];
    let newData = [];
    let idx = 0;
    for(let d of data) {
        newData.push({
            category: d.category,
            expenditure: d.expenditure,
            fill: chartColors[idx]
        });
        idx++;
    }
    return (
        <ResponsiveContainer>
            <PieChart>
                <Pie 
                    data={newData}
                    dataKey="expenditure"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={80}
                    label={(value) => `₹${value.expenditure}`}
                />
                <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    )
}