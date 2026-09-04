import { Link } from "@inertiajs/react"
import ProfilePic from "../other/profile-pic"
import { getProfilePic } from "@/others/function"
import ActionBtn from "../button/action-btn"
import { Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material"

const ChildrenList = ({ list = null, style }) => {
    return (
        <div className={style && "w-full px-5 py-3 bg-white rounded-md shadow-black/20 shadow-sm"}>
            <div className="grid gap-4">
                <Table sx={{ width: "100%" }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Child Name</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(list != null)
                        ?
                        (list.length != 0)
                        ?
                        list.map((e, i) => <Row key={e.id ?? i} data={e} />)
                        :
                        <TableRow>
                            <TableCell colSpan={2}>
                                No Child Yet
                            </TableCell>
                        </TableRow>
                        :
                        <TableRow>
                            <TableCell colSpan={2}>
                                Reloading...
                            </TableCell>
                        </TableRow>}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
const Row = ({ data }) => {
    return (
        <TableRow>
            <TableCell>
                <div className="flex gap-3 items-center">
                    <ProfilePic
                        size={1.9}
                        src={getProfilePic(data.profile?.profile_picture, data.profile?.sex)}
                    />
                    <div>
                        <h1 className="text-[0.8rem]"><b>{data.profile?.first_name} {data.profile?.middle_name} {data.profile?.last_name}</b></h1>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <Link href={`/profile/${data.username}`}>
                    <ActionBtn className="bg-blue-600 text-white hover:bg-blue-700">
                        View
                    </ActionBtn>
                </Link>
            </TableCell>
        </TableRow>
    )
}
export default ChildrenList
