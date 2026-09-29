import axios from "axios"

export default async function handleLogout(setUsername, setLoading){
    console.log("trying to logout");
    try{
        await axios.post("http://localhost:3000/logout", {}, {
            withCredentials: true
        });
        setUsername("");
        setLoading(true);
    } catch (err) {
        console.log(err);
    }
}