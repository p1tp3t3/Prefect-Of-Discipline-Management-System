import { Link, router } from "@inertiajs/react"
import AlertModal from "../alert-modal"
import Btn from "@/Components/button/normal-btn"
import { TriangleAlert } from "lucide-react"

const UnresolvedComplaintModal = (props) => {
    return (
        <AlertModal
            close={props.close}
            pd={["px-10", "py-4"]}
            isEnableOuterClose={props.isEnableOuterClose}
            closeModal={props.closeModal}
            bgColor="bg-white"
            w="w-[25rem]"
        >
            <div className="bg-white p-4 rounded-lg w-full grid gap-5">
                <div className="text-centergrid grid gap-3 place-items-center">
                    <div>
                        <TriangleAlert size="8em" className="text-red-500" />
                    </div>
                    <p className="text-[0.9em]">You Have {props.count} Unresolved Complaints this Year. Do You Want to See the Unresolved Complaints?</p>
                </div>
                <div className="flex gap-3">
                    <Btn className='w-full' onclick={() => {
                        localStorage.removeItem('is-unresolved-complaint-modal-clicked');
                        router.visit('/prefect/complaints?status=ongoing')
                    }}>
                        <p className="text-[0.8em]">See Unresolved Complaints</p>
                    </Btn>
                    <button 
                        onClick={() => {
                            localStorage.removeItem('is-unresolved-complaint-modal-clicked');
                            props.closeModal(!props.close);
                        }} 
                        className="w-full border border-blue-500 text-[0.8em] px-4 py-1 rounded-md"
                    >
                        Later
                    </button>
                </div>
            </div>
        </AlertModal>
    )
}

export default UnresolvedComplaintModal