export default function stagedSearch(target, searchList) {
    let ans = {
        totals: [],
        lists: [],
    };
    for(let t of target) {
        let searchList2;
        if(ans.lists.length === 0) {
            searchList2 = [...searchList];
        } else {
            searchList2 = ans.lists[ans.lists.length - 1];
        }
        if (t.filter === "date") {
            let mid = compDate(t.inp1, t.inp2, searchList2);
            ans.totals.push(mid[0]);
            ans.lists.push(mid[1]);
        } else if (t.filter === "price") {
            let mid = compPrice(t.inp1, t.inp2, searchList2);
            ans.totals.push(mid[0]);
            ans.lists.push(mid[1]);
        } else if (t.filter === "description") {
            let mid = compDescription(t.inp1, searchList2);
            ans.totals.push(mid[0]);
            ans.lists.push(mid[1]);
        } else if (t.filter === "category") {
            let mid = compCategory(t.inp1, searchList2);
            ans.totals.push(mid[0]);
            ans.lists.push(mid[1]);
        }
    }
    return ans;
}

function compDate(start, end, searchList) {
    let date1 = new Date(start);
    let date2 = new Date(end);
    let ans = [];
    let total = 0;
    for(let el of searchList) {
        let currDate = new Date(el.date);
        if(date1 <= currDate && currDate <=date2) {
            ans.push(el);
            total += el.price;
        }
    }
    return [total, ans];
}

function compPrice(low, high, searchList) {
    let ans = [];
    let total = 0;
    for(let el of searchList) {
        if(low <= el.price && el.price <= high) {
            ans.push(el);
            total += el.price;
        }
    }
    return [total, ans];
}

function compDescription(keyword, searchList) {
    let ans = [];
    let total = 0;
    let keyList = keyword.split(",");
    for(let el of searchList) {
        for(let k of keyList) {
            if(el.description.toLowerCase().includes(k.trim().toLowerCase())) {
                ans.push(el);
                total += el.price;
            }
        }
    }
    return [total, ans];
}

function compCategory(keyword, searchList) {
    let ans = [];
    let total = 0;
    for(let el of searchList) {
        if(el.category.name === keyword) {
            ans.push(el);
            total += el.price;
        }
    }
    return [total, ans];
}
