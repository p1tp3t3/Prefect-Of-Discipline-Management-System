import Btn from "@/Components/button/normal-btn"
import AlertModal from "../alert-modal"

const ValidationModal2 = (props) => {
    return (
        <AlertModal
            close={props.close}
            pd={["px-10", "py-4"]}
            isEnableOuterClose={props.isEnableOuterClose}
            closeModal={props.closeModal}
            bgColor="bg-white"
            w="w-[25rem]"
            cntr={true}
        >
            <div className="z-10">
                <div className="bg-white p-4 rounded-lg w-full grid gap-5">
                    <div className="text-centergrid grid gap-3 place-items-center">
                        <div>
                            <i className={`${props.icon ? props.icon : 'fa-solid fa-circle-exclamation'} text-[8em]`}></i>
                        </div>
                        <p className="text-[0.8em] text-center">{props.label}</p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={props.cancelEvent} 
                            className="w-full border border-blue-500 text-[0.8em] px-4 py-1 rounded-md"
                        >
                            Cancel
                        </button>
                        <Btn className='w-full' onclick={props.proceedEvent}>
                            <p className="text-[0.8em]">{props.proceedLabel}</p>
                        </Btn>
                    </div>
                </div>
            </div>
        </AlertModal>
    )
}

export default ValidationModal2