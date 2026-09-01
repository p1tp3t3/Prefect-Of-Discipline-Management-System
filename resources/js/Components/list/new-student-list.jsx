import { getProfilePic, readableDate, readableTime, showUserType } from "@/others/function"
import ProfilePic from "../other/profile-pic"
import CircleReload from "../reload/circle-reload"
import { Link } from "@inertiajs/react"

const NewStudentList = ({ list = null }) => {
    return (
        <div className="w-full h-[22rem]">
            <div className="w-full flex justify-between items-center px-5 py-2">
                <b>{list.length} New Students</b>
            </div>
            <div className="overflow-hidden overflow-y-auto h-[19rem] w-full flex flex-col px-5">
                {(list != null)
                 ?
                 (list.length != 0)
                 ?
                 list.map((e, i) => <Row data={e} />)
                 :
                 <div className="text-[1em] text-gray-500 w-full grid place-items-center h-full">
                    <div className="grid place-items-center">
                        <div className="text-[4em]">
                            <i className="fa-solid fa-circle-exclamation"></i>
                        </div>
                        <div>No New Students Yet</div>
                    </div>
                 </div>
                 :
                 <div className="text-[1em] text-gray-500 w-full grid place-items-center h-full">
                    <CircleReload size={3} />
                 </div>}
            </div>
        </div>
    )
}
const Row = ({ data }) => {
    return (
        <Link href={`/profile/${data.username}`}>
            <div className="flex items-center justify-between py-2 px-3 border-b border-gray-200 hover:bg-gray-200">
                <div className="flex items-center gap-2">
                    <div>
                        <ProfilePic size={2.3} src={getProfilePic(data.profile?.profile_picture, data.profile?.sex)} />
                    </div>
                    <div>
                        <div className="text-sm font-semibold">{data.profile?.first_name} {data.profile?.last_name}</div>
                        <div className="text-xs text-gray-500">{showUserType(data)}</div>
                    </div>
                </div>
                <div className="text-sm text-gray-600">{readableDate(data.created_at)} ({readableTime(data.created_at)})</div>
            </div>
        </Link>
    )
}

export default NewStudentList