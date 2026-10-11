import displayDate from "./DisplayDate";

export default function genExcelExpenses(data) {
    let ans = [];
    for(let d of data) {
        ans.push({
            date: displayDate(d.date.slice(0, 10)),
            description: d.description,
            category: d.category.name,
            price: d.price
        });
    }
    return ans;
}