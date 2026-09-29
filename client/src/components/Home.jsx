import React from 'react'
import axios from 'axios'
import { useContext } from 'react';
import authContext from '../contexts/authContext';

function Home() {
    let [data, setData] = React.useState('');
    const {username} = useContext(authContext);
    const getData = async () => {
        const response = await axios.get("http://localhost:3000/");
        setData(response.data.key);
    }
    React.useEffect(() => {
        getData()
    }, []);
    return (
        <div className='pt-16'>
            <h1>Expense Tracker</h1>
            <div>Api response: {data}</div>
            <div>Username: {username? username: "login please"}</div>
        </div>
    )
}

export default Home
