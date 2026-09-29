export default function catBudget(arr) {
    let ans = [];
    for(let a of arr) {
        ans.push({
            category: a.category.name,
            expenditure: a.budget
        });
    }
    console.log(ans);
    return ans;
}