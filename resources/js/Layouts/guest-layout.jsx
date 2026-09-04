import background from '../images/bg-pilar2.jpg'
import { ReloadProvider } from "@/context-provider/reload-provider"

const GuestLayout = (props) => {
    return (
        <ReloadProvider>
        <div className="w-[100%] h-[100vh] relative flex justify-center items-center">
            <div className="absolute w-[100%] h-[100%] z-[-1]">
                <div className="absolute w-full h-full bg-[#000000a6]"></div>
                <img src={background} className={`w-full h-full object-cover`} />
            </div>
            {props.children}
        </div>
        </ReloadProvider>
    )
}
export default GuestLayout