export default function calcSpent(arr){
    let sum = 0;
    for(let a of arr) {
        sum += a.price;
    }
    return sum;
}