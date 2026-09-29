export default function dataGenerator(obj) {
    let ans = [];
    for(let key in obj) {
        ans.push({
            category: obj[key].category._id,
            budget: obj[key].budget
        });
    }
    return ans;
}