import GuestLayout from "@/Layouts/guest-layout"
import GatePassLogInForm from "@/Components/gatepass-log-in-form"
import './style.css'
import { useReload } from "@/context-provider/reload-provider"

const GatePassLogIn = () => {
    const { loadRegister } = useReload()
    return (
        <>
        <GatePassLogInForm loadRegister={loadRegister} />
        </>
    )
}

GatePassLogIn.layout = (page) => <GuestLayout>{page}</GuestLayout>

export default GatePassLogIn