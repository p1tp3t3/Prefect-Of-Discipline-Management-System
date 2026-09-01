import ProfilePic from "@/Components/other/profile-pic"
import UpModal from "../up-modal"

const AppointmentHistoryModal = (props) => {
    function renderRow(s) {
        const l = []
        for(let a = 0; a < s; a++) {
            l.push(<Row />)
        }
        return l.map((e, i) => <div key={i} className="w-full">{e}</div>)
    }
    return (
        <UpModal
            close={props.close} 
            closeModal={props.closeModal}
            isEnableOuterClose={props.isEnableOuterClose}
            pd={props.pd}
            bgColor='bg-white'
            w='w-[30rem]'>
            <div className="w-full">
                <div className="pt-3 text-[1.2em]">
                    <h1><b>My Recent Appointments</b></h1>
                </div>
                <div className="py-3">
                    <input type="date" name="" id="" />
                </div>
                <div className="h-[23rem] overflow-hidden overflow-y-auto">
                    {renderRow(10)}
                </div>
            </div>
        </UpModal>
    )
}
const Row = (props) => {
    return (
        <div className="w-full hover:bg-gray-200 cursor-pointer">
            <div className="px-2 py-1 w-full flex gap-2">
                <div>
                    <ProfilePic size={4} />
                </div>
                <div className="grid gap-2">
                    <div className="w-full text-[0.8em]">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                        Voluptas at quo voluptatum debitis, ex ut odit, 
                    </div>
                    <div className="text-[0.7em] justify-self-end"><b>Yesterday Ago</b></div>
                </div>
            </div>
        </div>
    )
}
export default AppointmentHistoryModal