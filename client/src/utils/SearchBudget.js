export default function SearchBudget(searched, searchList){
    searched = searched.trim();
    let actualSearchAnswer = [];
    for(let obj of searchList){
        let l = obj.name.toLowerCase();
        if(l.includes(searched.toLowerCase())) {
            actualSearchAnswer.push({
                ...obj,
                st: l.indexOf(searched.toLowerCase()),
                l: searched.length
            });
        }
    }
    return actualSearchAnswer;
}