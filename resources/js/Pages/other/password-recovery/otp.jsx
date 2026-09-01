import React, { useState, useEffect, useRef } from "react";
import shield from "../../../images/shield.png";
import { APIRequest } from "@/others/classes/api-req";

const OTP = (props) => {

    const [pin, setPin] = useState(["", "", "", "", "", ""]);
    const [time, setTime] = useState(60);
    const [otpPin, setOtpPin] = useState("");
    const [invalid, setInvalid] = useState(false);
    const [error, setError] = useState("");

    const inputsRef = useRef([]);

    useEffect(() => {
        startTimer();
        resendOtp();
        inputsRef.current[0]?.focus();
    }, []);

    useEffect(() => {
        const joined = pin.join("");
        setOtpPin(joined);

        if (joined.length === pin.length) {
            if (invalid) {
                setError("O.T.P Is Already Invalid");
                resetPin();
                return;
            }

            if (props.generatedPin == joined) {
                props.setNext(2);
            } else {
                setError("O.T.P Is Not Matched");
            }

            resetPin();
        }
    }, [pin, invalid]);

    const startTimer = () => {
        setInvalid(false);
        setTime(60);

        const interval = setInterval(() => {
            setTime((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setInvalid(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const resetPin = () => {
        setPin(["", "", "", "", "", ""]);
        inputsRef.current[0]?.focus();
    };

    /** FIXED — Only resend if timer expired */
    const resendOtp = () => {
        if (time === 0) {
            const api = new APIRequest(
                "/forgot-password/otp",
                "post",
                { pin: props.generatedPin, type: "email", username: props.data.username }
            );
            api.sendPostData();
            startTimer();
        }
    };

    const handleChange = (e, i) => {
        const value = e.target.value;
        if (!/^\d?$/.test(value)) return;

        const updated = [...pin];
        updated[i] = value;
        setPin(updated);

        if (value && i < pin.length - 1) {
            inputsRef.current[i + 1]?.focus();
        }
    };

    const handleKeyDown = (e, i) => {
        if (e.key === "Backspace" && !pin[i] && i > 0) {
            inputsRef.current[i - 1]?.focus();
        }
    };

    const maskEmail = (email) => {
        if (!email) return "";
        const [local, domain] = email.split("@");
        return `${local.slice(0, 2)}****@${domain}`;
    };

    return (
        <div className="bg-white w-[90%] sm:w-[28rem] rounded-lg shadow-lg" id="otp">
            <div className="px-6 sm:px-10 py-6 grid gap-6 w-full">

                {/* HEADER */}
                <div className="text-center grid gap-2">
                    <img src={shield} alt="" className="w-24 h-24 mx-auto" />

                    <h1 className="text-xl font-bold">OTP Verification</h1>

                    <p className="text-sm text-gray-600">
                        Please type the O.T.P sent to your email.
                    </p>
                </div>

                {/* OTP INPUT BOXES */}
                <div className="flex justify-center">
                    <div className="flex h-[4rem] gap-2 sm:gap-3">
                        {pin.map((v, i) => (
                            <OtpBox
                                key={i}
                                ref={(el) => (inputsRef.current[i] = el)}
                                value={v}
                                onChange={(e) => handleChange(e, i)}
                                onKeyDown={(e) => handleKeyDown(e, i)}
                            />
                        ))}
                    </div>
                </div>

                {/* ERRORS + INFO */}
                <div className="text-center grid gap-3">

                    <div className="text-[0.9em] text-red-600 font-semibold">
                        {error}
                    </div>

                    <p className="text-sm text-gray-600">
                        Sent to <b>{maskEmail(props.contact.email)}</b>
                    </p>

                    <p className="text-sm text-gray-700">
                        O.T.P will be valid for <b>{time}</b>s.
                    </p>

                    <button
                        className={`text-sm underline ${
                            time === 0 ? "text-blue-600" : "text-gray-400 cursor-not-allowed"
                        }`}
                        disabled={time !== 0}
                        onClick={resendOtp}
                    >
                        Resend Code
                    </button>

                </div>
            </div>
        </div>
    );
};

/* ----------------------------------------
   OTP BOX COMPONENT (RESPONSIVE + CLEAN)
---------------------------------------- */

const OtpBox = React.forwardRef(({ value, onChange, onKeyDown }, ref) => {
    return (
        <div className="w-10 sm:w-12 h-full px-1 py-2 border-2 border-gray-300 rounded-lg shadow-sm">
            <input
                ref={ref}
                type="password"
                maxLength={1}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                className="w-full h-full text-center text-xl sm:text-2xl outline-none"
            />
        </div>
    );
});

export default OTP;
