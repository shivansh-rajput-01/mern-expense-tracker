module.exports = function createBulkData(data, budgets, id) {
    for(let d of data) {
        let date = new Date(d.date);
        d.owner = id;
        d.date = date.toLocaleDateString();
        let [day, month, year] = d.date.split('/');
        day = Number(day);
        month = Number(month);
        year = Number(year);
        const parsedDate = new Date(Date.UTC(year, month - 1, day));
        d.date = parsedDate;
    }
    if(budgets?.length === 0) {
        return data;
    }
    for(let d of data) {
        d.budget = createBudgetList(d, budgets);
    }
    return data;
}

function createBudgetList(d, budgets) {
    let ans = [];
    let date = Date.parse(d.date.toISOString());
    for(let budget of budgets) {
        let start = Date.parse(budget.start);
        let end = Date.parse(budget.end);
        if(start <= date && date <= end) {
            ans.push(budget._id);
        }
    }
    return ans;
}
