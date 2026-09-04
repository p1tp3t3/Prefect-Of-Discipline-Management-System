import { DataGrid } from '@mui/x-data-grid'
import { getProfilePic, readableDate, readableTime, toTitleCase } from "@/others/function"
import ProfilePic from "../other/profile-pic"
import ActionBtn from "../button/action-btn"
import Box from '@mui/material/Box'

const GatePassList = (props) => {

    const rows = props.list.length !== 0
        ? props.list.map((e, i) => ({
            id: e.gatepass?.[0]?.id ?? i,
            index: i + 1,
            fullName: `${e.profile?.first_name || ""} ${e.profile?.last_name || ""}`,
            userType: toTitleCase(e.role),
            profile_picture: e.profile?.profile_picture,
            sex: e.profile?.sex,
            requested: e.gatepass?.[0]?.created_at,
            confirmed: e.gatepass?.[0]?.confirmed_at,
            expiration: e.gatepass?.[0]?.date_expiration,
        }))
        : []

    const columns = [
        {
            field: 'index',
            headerName: '#',
            width: 70,
        },
        {
            field: 'user',
            headerName: 'User',
            flex: 1.2,
            renderCell: (params) => (
                <div className="flex gap-2 items-center">
                    <ProfilePic
                        size={1.8}
                        src={getProfilePic(params.row.profile_picture, params.row.sex)}
                    />
                    <div>
                        <div className="text-[0.9em] font-semibold">
                            {params.row.fullName}
                        </div>
                        <div className="text-[0.7em] text-gray-600">
                            {params.row.userType}
                        </div>
                    </div>
                </div>
            )
        },
        {
            field: 'requested',
            headerName: 'Requested Since',
            flex: 1,
            renderCell: (params) =>
                params.value
                    ? `${readableDate(params.value)} (${readableTime(params.value)})`
                    : '-'
        },
        {
            field: 'confirmed',
            headerName: 'Confirmed Since',
            flex: 1,
            renderCell: (params) =>
                params.value
                    ? `${readableDate(params.value)} (${readableTime(params.value)})`
                    : '-'
        },
        {
            field: 'expiration',
            headerName: 'Expiration',
            flex: 1,
            renderCell: (params) =>
                params.value
                    ? `${readableDate(params.value)} (${readableTime(params.value)})`
                    : '-'
        },
        {
            field: 'action',
            headerName: 'Action',
            sortable: false,
            width: 120,
            renderCell: (params) => (
                <ActionBtn
                    className="bg-blue-700 hover:bg-blue-800"
                    onClick={() => props.view(params.row.id)}
                >
                    View
                </ActionBtn>
            )
        }
    ]

    return (
        <Box
            sx={{
                height: 500,
                width: '100%',
                backgroundColor: '#fff',
                borderRadius: 2,
                boxShadow: 2,
                p: 2,
                overflowX: 'auto',
            }}
        >
            <Box sx={{ minWidth: '900px' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[5, 10, 20]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 5, page: 0 } }
                    }}
                    pagination
                    disableRowSelectionOnClick
                    sx={{
                        border: 'none',
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#f9fafb',
                            fontWeight: 'bold'
                        }
                    }}
                />
            </Box>
        </Box>
    )
}

export default GatePassList