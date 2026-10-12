export default function getCatName(category, id) {
    for(let c of category) {
        if(c._id.toString() === id.toString()) {
            return c.name;
        }
    }
    return "invalid record";
}