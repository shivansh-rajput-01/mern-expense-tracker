export default function formatExcelData(expenses, category) {
    let response = [];
    let formattedData = [];
    let catNames = [];
    for(let c of category) {
        catNames.push(c.name);
    }
    // return if file is empty
    if(expenses.length === 0) {
        response.push("empty file");
        return response;
    }

    const requiredKeys = ["date", "description", "category", "price"];
    const hasAllKeys = checkKeys(expenses, requiredKeys);
    // return if headings are not correct
    if(!hasAllKeys[1]) {
        hasAllKeys[0] === 0 ? response.push("less number of columns some column is missing") : response.push("invalid column names, column names should be (date, description, category, price)");
        return response;
    }

    for(let expense of expenses) {
        if(!isConvertableToDate(expense.date)) {
            response.push(`${expense.date} date is not correct at row ${expense.__rowNum__}. check if date is correct and date format is acceptable, correct format is dd mon yyyy ex (04 sep 2026)`); // indicates error in date
            return response;
        }
        if(!isValidNumber(expense.price)) {
            response.push(`${expense.price} is not valid at row ${expense.__rowNum__}`);
            return response;
        }
        if(expense.price <= 0) {
            response.push(`${expense.price} is not valid at row ${expense.__rowNum__} price should be at least 1`);
            return response;
        }
        let data = genData(category, expense);
        if(!data[0]) {
            return [`category does not exist in database ${category} at row number ${expense.__rowNum__}`];
        }
        formattedData.push(data[1]);
    }

    response.push("");
    response.push(formattedData);
    return response;
}

function isConvertableToDate(str) {
    if(!isRequiredFormat(str)) return false;
    const timeStamp = Date.parse(str);
    return !isNaN(timeStamp);
}

function isRequiredFormat(str) {
    str = String(str).trim();
    let eleLst = str.split(/\s+/);
    if(eleLst.length !== 3) return false;
    if(!isValidNumber(eleLst[0]) || !isValidNumber(eleLst[2])) {
        return false;
    }
    let listMonths = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    if(!listMonths.includes(String(eleLst[1]).trim().toLowerCase())) return false;
    if(eleLst[0] < 0 || eleLst[0] > 31) return false;
    let d = new Date(Number(eleLst[2]), listMonths.indexOf(eleLst[1].toLowerCase()), Number(eleLst[0]));
    let valid = d.getFullYear() === Number(eleLst[2]) && d.getMonth() === listMonths.indexOf(eleLst[1].toLowerCase()) && d.getDate() === Number(eleLst[0]);
    if(!valid) return false;
    return true;
}

function checkKeys(expenses, requiredKeys) {
    for(let i=0; i<expenses.length; i++) {
        let keys = Object.keys(expenses[i]);
        if(keys.length !== requiredKeys.length) {
            return [0, false];
        }
    }
    for(let i=0; i<expenses.length; i++) {
        const result = requiredKeys.every((ele) => ele.toLowerCase() in expenses[i]);
        if(!result) return [1, false];
    }
    return [1, true];
}

function isValidNumber(num) {
    if(typeof num === "string" && num.trim() === "") return false;
    return Number.isFinite(Number(num));
}

function genData(category, expense) {
    const catName = expense.category;
    let isCatCorrect = false;
    let correctObj = {...expense};
    delete correctObj["__rowNum__"];
    correctObj.date = new Date(correctObj.date);
    for(let c of category) {
        if(c.name.toLowerCase() === catName.toLowerCase()) {
            isCatCorrect = true;
            correctObj.category = c._id;
            break;
        }
    }
    if(!isCatCorrect) {
        return [false];
    }
    return [true, correctObj];
}
