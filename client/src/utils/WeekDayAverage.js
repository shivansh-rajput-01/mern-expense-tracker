let mapper = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday"
};

export default function weekDayAverage(arr, option) {
    let dayExpenseMapper = { // [sum, occurences]
        "Sunday": [0, 0],
        "Monday": [0, 0],
        "Tuesday": [0, 0],
        "Wednesday": [0, 0],
        "Thursday": [0, 0],
        "Friday": [0, 0],
        "Saturday": [0, 0]
    };
    for(let ele of arr) {
        let currDate = new Date(ele.date);
        let day = currDate.getDay();
        let dayName = mapper[day];
        dayExpenseMapper[dayName][0] += ele.price; // add current expense to previous day expense sum
        dayExpenseMapper[dayName][1] += 1; // add 1 to number of occurences
    }
    if(option === "chart") {
        let ans = [];
        for(let key in dayExpenseMapper) {
            if(dayExpenseMapper[key][1] === 0) { // no expense in that day
                ans.push({
                    dayName: key,
                    dayAverage: 0,
                    expenses: 0
                });
                continue;
            }
            ans.push({
                dayName: key,
                dayAverage: (dayExpenseMapper[key][0] / dayExpenseMapper[key][1]),
                expenses: dayExpenseMapper[key][1]
            });
        }
        return ans;
    }
}