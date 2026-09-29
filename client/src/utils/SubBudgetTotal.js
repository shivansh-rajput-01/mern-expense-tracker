export default function subTotal(arr) {
    let sum = 0;
    for(let a of arr) {
        sum += a.budget;
    }
    return sum;
}