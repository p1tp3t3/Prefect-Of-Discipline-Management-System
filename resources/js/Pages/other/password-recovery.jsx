import GuestLayout from "@/Layouts/guest-layout"
import UsernameVerify from "./password-recovery/username"
import OTP from "./password-recovery/otp"
import RecoverPassword from "./password-recovery/recover-password"
import { useState } from "react"
import { sendData } from "@/others/function"
import { useReload } from "@/context-provider/reload-provider"


const PasswordRecovery = () => {
    const [type, setType] = useState(''),
          [next, setNext] = useState(0)

    const [data, setData] = useState({ username: '' }),
          [contact, setContact] = useState(null),
          [generatedPin, setGeneratedPin] = useState(0),
          [clickedOk, setClickOk] = useState(false)

    const { loadRegister } = useReload()

    const handleChange = (e) => {
        change(e, setData)
    }

    const showOtp = t => {
        const pin =  Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
        setGeneratedPin(pin)
        setNext(1)
        sendData(
            '/forgot-password/otp', 
            { pin: pin, type: t, username: data.username }, 
            ()=>{}, 
            ()=>{}
        );
    };
    
    const nextPage = n => {
        const page = [
            <UsernameVerify 
                setData={setData} 
                data={data} 
                contact={contact}
                setNext={setNext} 
                setContact={setContact}
                showOtp={showOtp}
            />,
            <OTP 
                contact={contact}
                type={type} 
                data={data} 
                setNext={setNext} 
                setGeneratedPin={setGeneratedPin} 
                generatedPin={generatedPin} 
            />, 
            <RecoverPassword data={data} reload={loadRegister}  setClickOk={setClickOk} />
        ]
        return page[n]
    }

    return (
        <>
        {nextPage(next)}
        </>
    )
}

PasswordRecovery.layout = (page) => <GuestLayout>{page}</GuestLayout>
const OptionPanel = (props) => {
    const pin = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
    const notify = t => {
        sendData(
            '/forgot-password/otp', 
            { pin: pin, type: t }, 
            showOtp(t), 
            ()=>{}
        );
    };
    const showOtp = t => {
        props.setType(t)
        props.setGeneratedPin(pin)
        props.setNext(2)
    };

    
    return (
        <div className="bg-white w-[28rem] rounded-md">
            <div className="px-5 py-10 grid gap-10 w-full">
                <div className="text-center">
                    <h1 className="text-[1.5em]"><b>Where Do You Want To Be Notified?</b></h1>
                </div>
                <div className="grid gap-2">
                    <div className="w-full border border-gray-400 rounded-md text-[0.9em]">
                        <button 
                            type="button" 
                            className="px-2 py-3 w-full"
                            onClick={() => notify('email')}>
                            <i className="fa-solid fa-envelope"></i> Email Address
                        </button>
                    </div>
                    <div className="text-center text-[0.8em]">
                        <p>Or</p>
                    </div>
                    <div className="w-full border border-gray-400 rounded-md text-[0.9em]">
                        <button 
                            type="button" 
                            className="px-2 py-3 w-full"
                            onClick={() => notify('phone number')}>
                            <i className="fa-solid fa-phone"></i> Phone Number
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PasswordRecovery