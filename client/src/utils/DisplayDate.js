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

export default function displayDate(dateStr){
    const year = dateStr.slice(0, 4);
    const month = Number(dateStr.slice(5, 7));
    let fMonth = monthMapper[month];
    const date = dateStr.slice(8, 10);
    return `${date} ${fMonth} ${year}`
}