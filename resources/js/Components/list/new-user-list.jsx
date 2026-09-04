import { Link } from "@inertiajs/react"
import ProfilePic from "../other/profile-pic"
import { getProfilePic, getYearLevel, readableDate, readableTime, showUserType } from "@/others/function"
import ListSkeleton from "../reload/list-skeleton"
import { AlertCircle } from "lucide-react"

const NewUserList = ({ list = null, showTitle = true }) => {
    return (
        <div className="w-full bg-white rounded-md shadow-md shadow-black/20">
            {showTitle &&
            <div>
                <div className="px-5 py-2 w-full flex items-center gap-3 border-b-[1px] border-gray-300 text-[0.9em]">                       
                    <div><b>New User{(list.length != 1) ? 's' : ''} this {new Date().toDateString()}</b></div>
                </div>
            </div>}
            <div className="px-5 py-3 h-[22rem] w-full overflow-y-auto overflow-hidden z-2">
                <div className="h-full">
                    {list != null
                    ?
                    (list.length != 0)
                    ? list.map((e, i) => <Row obj={e} key={e.id} />)
                    :
                    <div className="text-[1em] text-gray-500 w-full grid place-items-center h-full">
                        <div className="grid place-items-center">
                            <div className="text-[4em]">
                                <AlertCircle size="1em" />
                            </div>
                            <div>No New Users Yet</div>
                        </div>
                    </div>
                    :
                    <div className="text-[1em] text-gray-500 w-full grid place-items-center h-full">
                        <div className="grid place-items-center">
                            <ListSkeleton rows={4} />
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    )
}
const Row = ({ obj }) => {
    const isStudent = obj.role === "student"
    const latestEnrollment = obj.enrollments?.[obj.enrollments.length - 1]
    const programName = obj.program?.name ?? latestEnrollment?.program?.name
    const detail = isStudent
        ? [programName, latestEnrollment?.year_level ? getYearLevel(latestEnrollment.year_level) : null].filter(Boolean).join(" • ")
        : (obj.role === "teaching_staff" ? showUserType(obj, true) : showUserType(obj))

    return (
        <div key={obj.id}>
            <Link className="w-full" href={`/profile/${obj.username}`}>
                <div>
                    <div className="py-3 px-2 flex justify-between items-center border-b hover:bg-gray-200">
                        <div className="flex gap-3 items-center">
                            <ProfilePic
                                size={2.5}
                                src={getProfilePic(obj.profile?.profile_picture, obj.profile?.sex)}
                            />
                            <div>
                                <h1 className="text-[0.9em]">
                                    <b>{`${obj.profile?.first_name ?? ""} ${obj.profile?.last_name ?? ""}`}</b>
                                </h1>
                                <h1 className="text-[0.7em]">
                                    {detail || "-"}
                                </h1>
                            </div>
                        </div>
                        <div className="text-[0.7em]">
                            <div>{readableDate(obj.created_at)}</div>
                            <div>{readableTime(obj.created_at)}</div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}
export default NewUserList