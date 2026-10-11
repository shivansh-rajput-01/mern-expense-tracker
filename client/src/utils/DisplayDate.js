const monthMapper = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec"
}

export default function displayDate(dateStr, option = 1){
    if(option === 2) {
        const year = dateStr.slice(6, 10);
        const month = Number(dateStr.slice(3, 5));
        let fMonth = monthMapper[month];
        const date = dateStr.slice(0, 2);
        return `${date} ${fMonth} ${year}`
        return;
    }
    const year = dateStr.slice(0, 4);
    const month = Number(dateStr.slice(5, 7));
    let fMonth = monthMapper[month];
    const date = dateStr.slice(8, 10);
    return `${date} ${fMonth} ${year}`
}
