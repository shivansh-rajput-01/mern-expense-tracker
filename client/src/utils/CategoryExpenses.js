export default function categoryExpenses(arr) {
    let obj = {};
    for(let a of arr) {
        if(Object.hasOwn(obj, a.category.name)){ // i.e. object has some prices for particular category
            obj[a.category.name] += a.price;
        } else {
            obj[a.category.name] = a.price;
        }
    }
    let ans = [];
    let id = 0;
    for(let key in obj) {
        ans.push({
            id: id,
            category: key,
            expenditure: obj[key]
        });
        id++;
    }
    return ans;
}