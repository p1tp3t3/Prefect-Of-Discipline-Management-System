import GuestLayout from "@/Layouts/guest-layout"
import GatePassLogInForm from "@/Components/gatepass-log-in-form"
import './style.css'
import Reload from "@/Components/reload/reload"
import { useState } from "react"

const GatePassLogIn = () => {
    const [reload, setReload] = useState(false)
    const isReload = () => {
        return (reload) ? 'opacity-1 z-20' : 'opacity-0'
    }
    return (
        <>
        <Reload transition={isReload()} type='logo' />
        <GatePassLogInForm setReload={setReload} />
        </>
    )
}

GatePassLogIn.layout = (page) => <GuestLayout>{page}</GuestLayout>

export default GatePassLogIn