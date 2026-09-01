import { getProfilePic, readableDate, readableTime, toTitleCase } from "@/others/function"
import ProfilePic from "../other/profile-pic"
import PaginationButton from "../button/pagination-btn"


const UserReportLogList = ({ list = null }) => {
    return (
        <div className="w-full px-5 py-3 bg-white rounded-md shadow-black/20 shadow-sm grid gap-3">
            <table className="w-full border-collapse">
                <thead className="border-b-[1px] border-gray-400 text-left">
                    <th className="py-3">#</th>
                    <th className="py-3">User</th>
                    <th className="py-3">Action Type</th>
                    <th className="py-3">Details</th>
                    <th className="py-3">Date / Time</th>
                </thead>
                <tbody>
                    {list.data != null
                    ?
                    list.data.length != 0
                    ?
                    list.data.map((e, i) => <Row i={i} data={e} />)
                    :
                    <tr>
                        <td colspan={5}>
                            <div className="flex justify-center items-center w-full">
                                <div className="text-center py-10 text-[0.9em]">
                                    No Logs Yet
                                </div>
                            </div>
                        </td>
                    </tr>
                    :
                    <tr>
                        <td colspan={5}>
                            <div className="flex justify-center items-center w-full">
                                <div className="text-center py-10 text-[0.9em]">
                                    No Logs Yet
                                </div>
                            </div>
                        </td>
                    </tr>}
                </tbody>
            </table>
            {(list.data.length != 0 && list.data.length >= 50) &&
            <div className="justify-self-end">
                <PaginationButton list={list.links} />
            </div>}
        </div>
    )
}

const Row = ({ i, data }) => {
    return (
        <tr className="border-b">
            <td className="py-1">
                <div className="flex gap-5 text-[0.8em]">
                    {i + 1}.
                </div>
            </td>
            <td className="py-1">
                <div className="flex gap-3 items-center">
                    <div className="z-1">
                        <ProfilePic
                            size={1.9}
                            src={getProfilePic(data.user?.profile?.profile_picture, data.user?.profile?.sex)}
                        />
                    </div>
                    <div>
                        <h1 className="text-[0.8em]">
                            <b>{`${data.user?.profile?.first_name ?? ""} ${data.user?.profile?.last_name ?? ""}`}</b>
                        </h1>
                        <p className="text-[0.7em]">({`${toTitleCase(data.user?.id_number ?? "")}`})</p>
                        <p className="text-[0.7em]">{`${toTitleCase(data.user?.role ?? "")}`}</p>
                    </div>
                </div>
            </td>
            <td className="py-1">
                <div className="flex gap-5 text-[0.8em]">
                    {toTitleCase(data.action_type)}
                </div>
            </td>
            <td className="py-1">
                <div className="flex gap-5 text-[0.8em]">
                    {toTitleCase(data.details)}
                </div>
            </td>
            <td className="py-1">
                <div className="flex gap-5 text-[0.8em]">
                    {readableDate(data.created_at)} ({readableTime(data.created_at)})
                </div>
            </td>
        </tr>
    )
}

export default UserReportLogList
