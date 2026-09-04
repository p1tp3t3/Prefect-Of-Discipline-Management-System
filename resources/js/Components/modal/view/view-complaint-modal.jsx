import UpModal from "../up-modal"
import { useState, useEffect } from "react"
import { getData, getProfilePic, readableDate, readableTime, toTitleCase } from "../../../others/function"
import SelectedUser from "../../other/selected-user"
import { ComplaintService } from "@/others/services/complaint-service"
import CircleReload from "@/Components/reload/circle-reload"
import { Link } from "@inertiajs/react"
import { AlertCircle } from "lucide-react"

const ViewComplaintModal = (props) => {
    const [data, setData] = useState(null),
          [reload, setReload] = useState(false)

    useEffect(() => {
        if (props.close) {
            setReload(true)
            getComplaintInfo()
        } else {
            setReload(false)
            setData(null)
        }
    }, [props.close])

    const getComplaintInfo = () => {
        ComplaintService.getComplaintInfo(props.complainant, setData)
    }

    return (
        <UpModal
            close={props.close}
            closeModal={props.closeModal}
            isEnableOuterClose={props.isEnableOuterClose}
            pd={props.pd}
            bgColor='bg-white'
            w='w-[55rem] max-w-[90vw]'>  {/* Increased width and made responsive */}
            <div className="w-full">  {/* Added padding */}
                <div className="grid gap-4">
                    {(data != null)
                    ?
                    <Body data={data} usr={props.usr} />
                    :
                    reload &&
                    <div className="w-full flex justify-center py-8">
                        <CircleReload size={3} />
                    </div>}
                </div>
            </div>
        </UpModal>
    )
}

const Body = ({ data, usr }) => {
    const evidences = data.complaint_evidences ? JSON.parse(data.complaint_evidences) : []

    const status = (s) => {
        if (s == 'rejected') return 'bg-red-500'
        if (s == 'pending') return 'bg-yellow-500'
        if (s == 'ongoing') return 'bg-orange-500'
        if (s == 'resolved') return 'bg-green-500'
        return 'bg-gray-500'  // Default
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold">{toTitleCase((data.user != null ? data.user.profile?.first_name : data.complainant_name))}'s Complaint</h1>
            </div>
            <div className="grid gap-6">
                <div className="grid gap-3">
                    <div>
                        <h2 className="text-lg font-semibold">Reference No.</h2>
                        <p className="text-sm">{data.complaint_number}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Status</h2>
                        <span className={`inline-block px-3 py-1 text-white text-sm rounded-full ${status(data.complaint_status)}`}>
                            {toTitleCase(data.complaint_status)}
                        </span>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Reported Since</h2>
                        <p className="text-sm">{readableDate(data.created_at)} ({readableTime(data.created_at)})</p>
                    </div>
                    {data.confirmed_at &&
                    <div>
                        <h2 className="text-lg font-semibold">Approved Since</h2>
                        <p className="text-sm">{readableDate(data.confirmed_at)} ({readableTime(data.confirmed_at)})</p>
                    </div>}
                    {data.offense_issued_at &&
                    <div>
                        <h2 className="text-lg font-semibold">Resolved Since</h2>
                        <p className="text-sm">{readableDate(data.offense_issued_at)} ({readableTime(data.offense_issued_at)})</p>
                    </div>}
                    {data.rejected_reason != null &&
                    <div className="text-sm">
                        <h2 className="text-lg font-semibold">Reason</h2>
                        <div className="text-sm h-40 overflow-y-auto border rounded p-2 bg-gray-50">
                            {data.rejected_reason}
                        </div>
                    </div>}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    {data.user != null
                    ?
                    <ProfileSection
                        title='Complainant'
                        data={data.user} />
                    :
                    <div className="text-[0.9em]">
                        <h3 className="text-lg font-semibold">Complainant</h3>
                        <div>
                            {toTitleCase(data.complainant_name)}
                        </div>
                    </div>}
                    <ProfileSection
                        title='Subject'
                        data={data.subject}
                        data_list={data.complaint_subject != null ? data.complaint_subject : null} />
                </div>
                <div>
                    <h2 className="text-lg font-semibold mb-2">Incident Reported</h2>
                    <p className="text-sm">{toTitleCase(data.violation?.violation_name)}</p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold mb-2">Reason by the Complainant</h2>
                    <div className="text-sm h-40 overflow-y-auto border rounded p-2 bg-gray-50">
                        <p>{data.complaint_description}</p>
                    </div>
                </div>
                {usr.role === "sub_admin" && (
                    <div className="mt-6 w-full">
                        <h2 className="text-lg font-semibold mb-3">
                            Context of the Complainant's Reason
                        </h2>
                        <div className="grid gap-3 w-full">
                            <div className="flex-wrap flex gap-2 text-[0.8em] text-center font-bold w-full whitespace-nowrap">
                                <div className="bg-green-100 text-green-700  border-green-400 border-[1.9px] px-3 py-1 rounded-full">Very Strong Match</div>
                                <div className="bg-yellow-100 text-yellow-700  border-yellow-400 border-[1.9px] px-3 py-1 rounded-full">Strong Match</div>
                                <div className="bg-orange-100 text-orange-700  border-orange-400 border-[1.9px] px-3 py-1 rounded-full">Likely Related</div>
                                <div className="bg-red-100 text-red-700  border-red-400 border-[1.9px] px-3 py-1 rounded-full">Possibly Related</div>
                                <div className="bg-gray-200 text-gray-700  border-gray-400 border-[1.9px] px-3 py-1 rounded-full">Unclear / Needs Review</div>
                            </div>
                            {JSON.parse(data.context_analysis).length !== 0 ? (
                                <div className="flex flex-wrap gap-2 p-3 border rounded-md">
                                    {JSON.parse(data.context_analysis).map((e, i) => {

                                        const status = () => {
                                            if (e.similarity >= 0.70) return "bg-green-100 border-green-400 text-green-700";       // Very Strong Match
                                            if (e.similarity >= 0.55) return "bg-yellow-100 border-yellow-400 text-yellow-700";    // Strong Match
                                            if (e.similarity >= 0.40) return "bg-orange-100 border-orange-400 text-orange-700";    // Likely Related
                                            if (e.similarity >= 0.25) return "bg-red-100 border-red-400 text-red-700";          // Possibly Related
                                            return "bg-gray-200 border-gray-400 text-gray-700";                                 // Not Related
                                        };
                                        

                                        return (
                                            <div
                                                key={i}
                                                className={`flex items-center justify-between gap-3 ${status()} rounded-xl px-3 py-1 border-[1.9px]`}
                                            >
                                                <p className="text-[0.8em] font-medium">
                                                    {e.violation}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                    <AlertCircle size="2.25rem" className="mb-2" />
                                    <p className="text-sm font-medium">No Context Analyzed</p>
                                </div>
                            )}

                        </div>
                    </div>
                    )}
                <div>
                    <h2 className="text-lg font-semibold mb-2">Additional Evidences</h2>
                    {evidences.length !== 0
                    ? <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {evidences.map((e, i) => {
                            const src = `/complaint/${data.id}/evidence/${e.file}`
                            return (
                                <a key={i} href={src} target="_blank" rel="noreferrer" className="block border rounded overflow-hidden">
                                    {e.type === 'vid'
                                    ? <video src={src} className="w-full h-32 object-cover" controls />
                                    : <img src={src} className="w-full h-32 object-cover" alt={`Evidence ${i + 1}`} />}
                                </a>
                            )
                        })}
                      </div>
                    : <div className="text-center py-8 text-gray-500">
                        <AlertCircle size="2.25rem" className="mb-2" />
                        <div>No Evidences Included</div>
                      </div>}
                </div>

                {data.complaint_status === "resolved" &&
                data.complaint_subject?.map((sub, i) => {

                    // Filter offenses belonging only to THIS student
                    const offenses = (data.complaint_subject_violation || []).filter(
                        off => off.student_id === sub.student_id
                    );

                    return (
                        <div key={i} className="mt-5 rounded-lg border shadow-sm bg-white">

                            {/* Header */}
                            <div className="px-4 py-3 border-b bg-gray-100 rounded-t-lg">
                                <h2 className="text-[1.05rem] font-bold text-gray-800">
                                    {sub.user?.profile?.first_name} {sub.user?.profile?.middle_name} {sub.user?.profile?.last_name}
                                </h2>
                            </div>

                            <div className="p-4 space-y-4">
                                
                                {/* Offense Section */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-1">
                                        Offenses
                                    </h3>

                                    {offenses.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {offenses.map((off, idx) => {
                                                const hasViolation = !!off.violation;

                                                const label = hasViolation
                                                    ? off.violation.violation_name
                                                    : "No Violation Committed";

                                                const type = hasViolation
                                                    ? (off.violation.offense_status ? "major" : "minor")
                                                    : "none";

                                                const badgeColor =
                                                    type === "major"
                                                        ? "bg-red-600"
                                                        : type === "minor"
                                                            ? "bg-orange-500"
                                                            : "bg-gray-500";

                                                return (
                                                    <span
                                                        key={idx}
                                                        className={`inline-block text-white text-xs px-3 py-1 rounded-full ${badgeColor}`}
                                                    >
                                                        {label}
                                                        {type !== "none" && (
                                                            <span className="ml-1 opacity-80">
                                                                ({type})
                                                            </span>
                                                        )}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-500">
                                            No Offense Records Found
                                        </span>
                                    )}
                                </div>

                                {/* Summary */}
                                {sub.incident_summary && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 mb-1">
                                            Summary About The Incident
                                        </h3>

                                        <div className="border rounded-md bg-gray-50 h-36 overflow-y-auto p-3 text-sm text-gray-800 leading-relaxed">
                                            {sub.incident_summary}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

const ProfileSection = ({ title, data, data_list = null }) => {
    return (
        <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            {data_list != null
            ?
            data_list.length != 0
            ?
            <div className="grid gap-1">
                {data_list.map((e, i) =>
                <Link href={`/profile/${e.user.username}`} className="block">
                    <SelectedUser
                        src={getProfilePic(e.user.profile?.profile_picture, e.user.profile?.sex)}
                        name={[e.user.profile?.first_name, e.user.profile?.last_name]}
                        user={e.user}
                    />
                </Link>)}
            </div>
            :
            <Link href={`/profile/${data.username}`} className="block">
                <SelectedUser
                    src={getProfilePic(data.profile?.profile_picture, data.profile?.sex)}
                    name={[data.profile?.first_name, data.profile?.last_name]}
                    user={data}
                />
            </Link>
            :
            <Link href={`/profile/${data.username}`} className="block">
                <SelectedUser
                    src={getProfilePic(data.profile?.profile_picture, data.profile?.sex)}
                    name={[data.profile?.first_name, data.profile?.last_name]}
                    user={data}
                />
            </Link>}
        </div>
    )
}

ViewComplaintModal.Body = Body

export default ViewComplaintModal
