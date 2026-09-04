import { getProfilePic, readableDate, readableTime, toTitleCase } from "@/others/function"
import ProfilePic from "../other/profile-pic"
import PaginationButton from "../button/pagination-btn"
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer } from "@mui/material"


const UserReportLogList = ({ list = null }) => {
    return (
        <div className="w-full px-5 py-3 bg-white rounded-md shadow-black/20 shadow-sm grid gap-3">
            <TableContainer sx={{ minWidth: "650px" }}>
            <Table sx={{ width: "100%" }}>
                <TableHead sx={{ "& .MuiTableCell-root": { fontWeight: 700, borderBottom: "1px solid #9ca3af" } }}>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>User</TableCell>
                        <TableCell>Action Type</TableCell>
                        <TableCell>Details</TableCell>
                        <TableCell>Date / Time</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {list.data != null && list.data.length != 0
                    ?
                    list.data.map((e, i) => <Row key={e.id ?? i} i={i} data={e} />)
                    :
                    <TableRow>
                        <TableCell align="center" sx={{ py: 5, fontSize: "0.9em" }} colSpan={5}>
                            No Logs Yet
                        </TableCell>
                    </TableRow>}
                </TableBody>
            </Table>
            </TableContainer>
            {(list.data.length != 0 && list.data.length >= 50) &&
            <div className="justify-self-end">
                <PaginationButton list={list.links} />
            </div>}
        </div>
    )
}

const Row = ({ i, data }) => {
    return (
        <TableRow>
            <TableCell sx={{ fontSize: "0.8em" }}>
                {i + 1}.
            </TableCell>
            <TableCell>
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
            </TableCell>
            <TableCell sx={{ fontSize: "0.8em" }}>
                {toTitleCase(data.action_type)}
            </TableCell>
            <TableCell sx={{ fontSize: "0.8em" }}>
                {toTitleCase(data.details)}
            </TableCell>
            <TableCell sx={{ fontSize: "0.8em" }}>
                {readableDate(data.created_at)} ({readableTime(data.created_at)})
            </TableCell>
        </TableRow>
    )
}

export default UserReportLogList
