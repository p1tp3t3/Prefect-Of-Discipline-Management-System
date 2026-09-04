import { readableDate, toTitleCase } from "../../others/function"
import ProfilePic from "../other/profile-pic"
import pdf from "../../pdf/test-pdf.pdf"
import AuthContext from "@/context-provider/auth-provider"
import { useContext } from "react"
import { Eye, AlertCircle, FileText } from "lucide-react"

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
                                <Eye size={14} />
                            </button>}
                            {usr.user_type == 'prefect' &&
                            <button onClick={viewViolation}>
                                <AlertCircle size={14} />
                            </button>}
                        </div>
                    </div>
                    <div className="text-[4em] text-center text-gray-300">
                        <FileText size="1em" />
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