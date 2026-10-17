import React, { useContext, useRef, useState } from 'react'
import dashContext from '../contexts/dashContext'
import axios from "axios"

function VerifyEmail() {
    const { userData } = useContext(dashContext);
    let [otp, setOtp] = useState(["", "", "", "", "", ""]);
    let [send, setSend] = useState(false);
    let itemsRef = useRef([]);
    function setOtpValues(evt, idx) {
        if(otp[idx].length >= 1 && evt.target.value.length !== 0) {
            if(idx === 5) {
                return;
            }
            itemsRef.current[idx+1]?.focus();
        }
        if(!"0123456789".includes(evt.target.value)) {
            return;
        }
        setOtp((prev) => (
            prev.map((ele, i) => {
                return i === idx ? evt.target.value: ele;
            })
        ))
        if(evt.target.value.length > 0 && idx < 5) {
            itemsRef.current[idx+1]?.focus();
        }
    }

    function setBackMove(evt, idx) {
        if(evt.key === "Backspace") {
            if(otp[idx].length === 0 && idx >= 1) {
                itemsRef.current[idx-1]?.focus();
            }
        }
    }

    async function sendEmail() {
        try {
            const response = await axios.get("http://localhost:3000/verify", {
                withCredentials: true
            });
            if(response.data.success) {
                setSend(true);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="flex justify-center items-center w-full md:w-[75%] p-4 dark:bg-linear-to-br dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 bg-slate-100 min-h-full overflow-y-auto relative dark:text-white">
            <div className="verify-otp w-[90%] md:w-120 min-h-10 p-8 rounded-sm shadow-md bg-white dark:bg-white/5">
                {!send && <>
                    <p>We will send a verification code at your email <b>{userData.email}</b>. Enter this code and get verified.</p>
                    <button className='w-full my-4 h-10 p-2 rounded-sm bg-slate-800 text-white cursor-pointer' onClick={sendEmail} >Get Email</button>
                </>}
                {send && <>
                    <div className="text-center text-2xl my-4">Verify Your Email Address</div>
                    <div>A 6 digit code has been sent to your email address <b>{userData.email}</b>. Please enter the code below to verify your account.</div>
                    <div className="take-input flex justify-around my-4">
                        {otp.map((ele, idx) => (
                            <input key={idx} type="text" className="w-7 h-7 text-center sm:w-10 sm:h-10 rounded-sm outline focus:outline-2 focus:outline-blue-400" ref={(el) => {itemsRef.current[idx] = el }} value={otp[idx]} onChange={(evt) => setOtpValues(evt, idx)} onKeyDown={(evt) => setBackMove(evt, idx)} />
                        ))}
                    </div>
                    <div className='flex flex-wrap justify-around my-4'>
                        <button className="w-full md:w-[45%] my-4 h-10 p-2 rounded-sm bg-slate-800 text-white cursor-pointer">Verify Code</button>
                        <button className="w-full md:w-[45%] my-4 h-10 p-2 rounded-sm bg-slate-400 text-white cursor-pointer">Resend Code</button>
                    </div>
                </>}
            </div>
        </div>
    )
}

export default VerifyEmail