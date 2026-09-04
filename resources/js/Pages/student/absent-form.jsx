import AuthLayout from "@/Layouts/auth-layout"
import AbsentFormList from "@/Components/list/absent-form-list"
import RequestAbsentFormModal from "@/Components/modal/submission-form/request-absent-form-modal"
import { useState } from "react"
import { useReload } from "@/context-provider/reload-provider"
import Btn from '@/Components/button/normal-btn'


const AbsentForm = (props) => {
    const [requestAbsentForm, openRequestAbsentForm] = useState(true)

    const { loadRegister } = useReload();
    return (
        <>
            <div className="w-full py-4">
                <div className="w-full grid gap-5 relative">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-3">
                        <h1 className="text-[2em] sm:text-[1.5em] font-bold">STUDENT ABSENT FORM</h1>
                    </div>
                    <div>
                        <div className="w-full px-5 py-3 bg-white rounded-md shadow-black/20 shadow-sm">
                        {props.user.allow_absent_form != 1 ? (
                                // 🚫 Restricted View
                                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                                    <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-red-100">
                                        <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-8 h-8 text-red-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 11c.828 0 1.5.672 1.5 1.5v4.5a1.5 1.5 0 01-3 0v-4.5c0-.828.672-1.5 1.5-1.5zM12 7a4 4 0 014 4v1H8v-1a4 4 0 014-4z"
                                        />
                                        </svg>
                                    </div>

                                    <h2 className="text-2xl font-bold text-red-600 mb-2">Access Restricted</h2>
                                    <p className="text-gray-700 max-w-md">
                                        You don’t have permission to access or submit this form.
                                        Please contact your <span className="font-semibold">administrator</span> if you believe this is an error.
                                    </p>
                                </div>

                            ) :
                            <RequestAbsentFormModal.Body
                                id={props.user.id}
                                reload={loadRegister}
                            />}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

AbsentForm.layout = (page) => <AuthLayout user={page.props.user}>{page}</AuthLayout>

const Disallow = () => {
    return (
        <div className="w-full grid place-items-center">
            <div className="w-[25rem] h-[25rem] grid place-items-center">
                <div className="text-center grid gap-5 text-gray-400">
                    <i className="fa-solid fa-circle-exclamation text-[10em]"></i>
                    <p className="text-[1.4em]"><b>No Absence Confirmation Has Been Generated Yet</b></p>
                </div>
            </div>
        </div>
    )
}
export default AbsentForm
