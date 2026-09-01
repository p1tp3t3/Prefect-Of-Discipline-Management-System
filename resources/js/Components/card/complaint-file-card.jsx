import { readableDate, toTitleCase } from "../../others/function"
import ProfilePic from "../other/profile-pic"
import pdf from "../../pdf/test-pdf.pdf"
import AuthContext from "@/context-provider/auth-provider"
import { useContext } from "react"

const ComplaintFileCard = ({ data, viewComplaint, viewViolation }) => {
    const { usr } = useContext(AuthContext)

    return (
        <div className="w-full relative bg-gray-100 shadow hover:bg-gray-400 cursor-pointer" onClick={(usr.user_type != 'prefect') ? viewViolation : ()=>{}}>
            <div>
                <div>
                    <div className="flex justify-between items-center px-3 py-2">
                        {usr.user_type == 'prefect' &&
                        <div title={`${data.user.first_name} ${data.user.last_name} (${toTitleCase(data.user.user_type)})`}>
                            <ProfilePic 
                                size={1.6} 
                                src={`../user-assets/${data.user.username}/profile-${data.user.username}.jpg`}
                            />
                        </div>}
                        <div className="flex gap-2 items-center text-[0.9em]">
                            {usr.user_type == 'prefect' && 
                            <button onClick={viewComplaint}>
                                <i className="fa-solid fa-eye"></i>
                            </button>}
                            {usr.user_type == 'prefect' &&
                            <button onClick={viewViolation}>
                                <i className="fa-solid fa-circle-exclamation"></i>
                            </button>}
                        </div>
                    </div>
                    <div className="text-[4em] text-center text-gray-300">
                        <i className="fa-solid fa-file"></i>
                    </div>
                </div>
                <div className="text-[0.7em] px-3 py-1 bg-white">
                    <div>Case No. {data.case_number}</div>
                    <div>Status: {toTitleCase(data.complaint_status)}</div>
                    <div>Reported Since {readableDate(data.created_at)}</div>
                </div>
            </div>
        </div>
    )
}
export default ComplaintFileCard