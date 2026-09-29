export default function expenseToBudget(budgets, expense) {
    let ans = [];
    console.log("budgets", budgets);
    if(!budgets) return ans;
    if(budgets?.length === 0) return ans;
    for(let budget of budgets) {
        for(let e of expense) {
            if(e.category === budget.category.name) { // i.e. current budget has expenditure
                ans.push({
                    category: e.category,
                    expenditure: e.expenditure,
                    budget: budget.budget
                });
            }
        }
    }
    for(let budget of budgets) {
        let found = false;
        for(let a of ans) {
            if(a.category === budget.category.name) { // move to next iteration as category has expense
                found = true;
                break;
            }
        }
        // make entry with expenditure 0
        if(!found) {
            ans.push({
                category: budget.category.name,
                expenditure: 0,
                budget: budget.budget
            });
        } 
    }
    console.log("this is line chart data", ans);
    return ans;
}