import { Link } from "@inertiajs/react"
import ProfilePic from "../other/profile-pic"
import { getProfilePic } from "@/others/function"
import ActionBtn from "../button/action-btn"

const ChildrenList = ({ list = null, style }) => {
    return (
        <div className={style && "w-full px-5 py-3 bg-white rounded-md shadow-black/20 shadow-sm"}>
            <div className="grid gap-4">
                <table className="w-full">
                    <thead>
                        <th className="text-start py-3">Child Name</th>
                        <th className="text-start py-3">Action</th>
                    </thead>
                    <tbody>
                        {(list != null)
                        ?
                        (list.length != 0)
                        ?
                        list.map((e, i) => <Row data={e} />)
                        :
                        <tr>
                            <td colSpan={2}>
                                No Child Yet
                            </td>
                        </tr>
                        :
                        <tr>
                            <td colSpan={2}>
                                Reloading...
                            </td>
                        </tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
const Row = ({ data }) => {
    return (
        <tr className="border-t">
            <td className="py-2">
                <div className="flex gap-3 items-center">
                    <ProfilePic
                        size={1.9}
                        src={getProfilePic(data.profile?.profile_picture, data.profile?.sex)}
                    />
                    <div>
                        <h1 className="text-[0.8rem]"><b>{data.profile?.first_name} {data.profile?.middle_name} {data.profile?.last_name}</b></h1>
                    </div>
                </div>
            </td>  
            <td className="py-2">
                <Link href={`/profile/${data.username}`}>
                    <ActionBtn className="bg-blue-600 text-white hover:bg-blue-700">
                        View
                    </ActionBtn>
                </Link>
            </td>
        </tr>
    )
}
export default ChildrenList