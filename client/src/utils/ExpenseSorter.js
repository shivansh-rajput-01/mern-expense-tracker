export default function sorter(data, state) {
    let usableObj = formatter(data);
    let ans = [];
    let find = [];
    for(let key in state) {
        if(state[key] !== 0) {
            find.push(key);
            find.push(state[key]);
        }
    }
    if(find[0] === "date") {
        if(find[1] === 1) {
            ans = usableObj.sort((a, b) => b.date - a.date);
        } else {
            ans = usableObj.sort((a, b) => a.date - b.date);
        }
    }
    if(find[0] === "description") {
        if(find[1] === 1) {
            ans = usableObj.sort((a, b) => (b.description || "").localeCompare(a.description || ""));
        } else {
            ans = usableObj.sort((a, b) => (a.description || "").localeCompare(b.description || ""));
        }
    }
    if(find[0] === "category") {
        if(find[1] === 1) {
            ans = usableObj.sort((a, b) => (b.category.name || "").localeCompare(a.category.name || ""));
        } else {
            ans = usableObj.sort((a, b) => (a.category.name || "").localeCompare(b.category.name || ""));
        }
    }
    if(find[0] === "price") {
        if(find[1] === 1) {
            ans = usableObj.sort((a, b) => b.price - a.price);
        } else {
            ans = usableObj.sort((a, b) => a.price - b.price);
        }
    }
    return ans;
}

function formatter(data) {
    let ans = [];
    for(let d of data) {
        ans.push({
            ...d,
            date: new Date(d.date)
        });
    }
    return ans;
}