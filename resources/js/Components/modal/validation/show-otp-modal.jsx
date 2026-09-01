import React, { useEffect, useRef, useState } from "react"
import AlertModal from "../alert-modal"
import shield from '@/images/shield.png'
import { APIRequest } from "@/others/classes/api-req"
import ActionBtn from "@/Components/button/action-btn"

const OtpModal = (props) => {
    return (
        <AlertModal
            close={props.close}
            pd={["px-4", "py-4"]}
            isEnableOuterClose={props.isEnableOuterClose}
            closeModal={props.closeModal}
            bgColor="bg-white"
            w="w-[95%] sm:w-[32rem] md:w-[35rem]"
            cntr={true}
        >
            <Body 
                proceedEvent={props.proceedEvent} 
                contact={props.contact} 
                close={props.close} 
                username={props.username}
                closeModal={props.closeModal}
                type={props.type}
            />
        </AlertModal>
    )
}

const Body = (props) => {
    const [pin, setPin] = useState(["", "", "", "", "", ""]);
    const [time, setTime] = useState(60);
    const [otpPin, setOtpPin] = useState("");
    const [invalid, setInvalid] = useState(false);
    const [error, setError] = useState("");

    const [generatedPin, setGeneratedPin] = useState("");   // ✅ NEW STATE

    const inputsRef = useRef([]);

    useEffect(() => {
        if (props.close) {
            resetFields();
            generateNewOtp();   // ⬅️ Generate & send fresh OTP when modal opens
            startTimer();
        }
    }, [props.close]);

    /** -------------------------------------------------------
     * 🔐 Generate new OTP (6 digits)
     * -------------------------------------------------------- */
    const generateNewOtp = () => {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedPin(otp);
        sendOtp(otp);
    };

    /** -------------------------------------------------------
     * 📩 Send OTP to backend
     * -------------------------------------------------------- */
    const sendOtp = (otp) => {
        const api = new APIRequest(
            "/forgot-password/otp",
            "post",
            { 
                pin: otp, 
                username: props.username, 
                email: props.contact.email,
                type: props.type != null ? props.type : 'email'
            },
            () => {},
            () => {},
            () => {}
        );
        api.sendPostData();
    };

    useEffect(() => {
        const value = pin.join("");
        setOtpPin(value);

        if (value.length === pin.length) {
            validateOtp(value);
        }
    }, [pin]);

    /** -------------------------------------------------------
     * 🧪 Validate the OTP input
     * -------------------------------------------------------- */
    const validateOtp = (value) => {
        setError("");

        if (invalid) {
            setError("O.T.P is already invalid");
            return resetFields();
        }
        
        const api = new APIRequest('/otp/verify', 'post', {
            pin: value,
            email: props.contact.email
        }, null, () => props.proceedEvent(value), () => setError("O.T.P does not match"))
        api.sendPostData()
        resetFields();
    };

    const resetFields = () => {
        setPin(["", "", "", "", "", ""]);
        inputsRef.current[0]?.focus();
    };

    /** -------------------------------------------------------
     * ⏳ Timer
     * -------------------------------------------------------- */
    const startTimer = () => {
        setTime(60);
        setInvalid(false);

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

    /** -------------------------------------------------------
     * 🔄 Resend OTP
     * -------------------------------------------------------- */
    const resendOtp = () => {
        if (time === 0) {
            generateNewOtp();   // ⬅️ New generated OTP
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

    const getContact = () => {
        return props.contact.email ?? props.contact.phone_number;
    };

    const maskEmail = (email) => {
        const [local, domain] = email.split("@");
        return `${local[0]}${local[1]}****@${domain}`;
    };

    return (
        <div className="bg-white w-full rounded-md p-2 sm:p-4" id="otp">
            <div className="px-4 sm:px-6 py-5 grid gap-6 w-full max-w-lg mx-auto">

                {/* HEADER */}
                <div className="text-center grid gap-2">
                    <img 
                        src={shield} 
                        alt="shield" 
                        className="w-20 h-20 sm:w-24 sm:h-24 mx-auto"
                    />

                    <h1 className="text-lg sm:text-2xl font-bold leading-tight">
                        OTP Verification
                    </h1>

                    <p className="text-xs sm:text-sm text-gray-600 px-4">
                        Enter the 6-digit code sent to your email.
                    </p>
                </div>

                {/* OTP INPUTS */}
                <div className="flex justify-center">
                    <div className="flex gap-1.5 sm:gap-3">
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

                {/* MESSAGES */}
                <div className="grid gap-2 text-center">
                    <p className="text-red-600 font-semibold text-xs sm:text-sm">{error}</p>

                    <p className="text-xs sm:text-sm text-gray-600">
                        Code sent to <b>{maskEmail(getContact())}</b>
                    </p>

                    <p className="text-xs sm:text-sm text-gray-600">
                        OTP is valid for <b>{time}s</b>.
                    </p>

                    {/* RESEND */}
                    <button
                        className={`text-xs sm:text-sm underline transition ${
                            time === 0 
                                ? "text-blue-600 hover:text-blue-700" 
                                : "text-gray-400 cursor-not-allowed"
                        }`}
                        disabled={time !== 0}
                        onClick={resendOtp}
                    >
                        Resend Code
                    </button>

                    {/* CLOSE BUTTON AFTER EXPIRATION */}
                    {time === 0 && (
                        <div className="mt-2">
                            <ActionBtn 
                                className="bg-red-600 text-white hover:bg-red-700 text-xs sm:text-sm px-4 py-2"
                                onClick={() => props.closeModal(false)}
                            >
                                Close
                            </ActionBtn>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const OtpBox = React.forwardRef(({ value, onChange, onKeyDown }, ref) => (
    <div className="w-10 h-12 sm:w-12 sm:h-14 flex-shrink-0">
        <input
            ref={ref}
            type="password"
            maxLength={1}
            className="
                w-full h-full 
                border-2 border-gray-300 
                rounded-lg 
                text-center 
                text-lg sm:text-2xl 
                focus:border-blue-500 
                outline-none
            "
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
        />
    </div>
));


export default OtpModal;
