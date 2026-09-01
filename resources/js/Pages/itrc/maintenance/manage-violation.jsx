import { APIRequest } from "@/others/classes/api-req";
import { readableDate, readableTime, showWarningModal, toTitleCase } from "@/others/function";
import ActionBtn from "@/Components/button/action-btn";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

const ManageViolation = ({ list, events, reload, setter }) => {
    const deleteViolation = (e) => {
        showWarningModal(
            "Are You Sure You Want To Delete " + e.violation_name + "?",
            "Delete Violation",
            "Cancel",
            () => {
                reload(true, "text-wait", "Deleting Violation...");
                const api = new APIRequest(
                    "/maintenance/violation/delete",
                    "post",
                    { id: e.id },
                    setter,
                    () => {
                        reload(true, "success", "Violation Deleted Successfully");
                    },
                    (err) => {
                        reload(true, "error", err.response.data.message);
                    }
                );
                api.fetchData();
            }
        );
    };

    return (
        <div className="flex-1 overflow-y-auto">

            {/* Toolbar */}
            <div className="flex justify-end mb-4">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
                    onClick={() => events[0]("violation", "add")}
                >
                    Add Violation
                </button>
            </div>

            {/* DATA TABLE */}
            <div className="w-full bg-white rounded-md shadow-black/20 shadow-sm overflow-x-auto">
                <div className="w-full px-5 py-3 min-w-[1000px]">
                    <Box sx={{ width: "100%" }}>
                        <DataGrid
                            rows={list ?? []}
                            getRowId={(row) => row.id}
                            disableRowSelectionOnClick
                            showToolbar
                            hideFooterSelectedRowCount
                            pagination
                            initialState={{ pagination: { paginationModel: { page: 0, pageSize: 20 } } }}
                            pageSizeOptions={[20, 50, 100, 200]}
                            getRowHeight={() => "auto"}
                            columns={[
                                {
                                    field: "index",
                                    headerName: "#",
                                    width: 50,
                                    sortable: false,
                                    renderCell: (params) =>
                                        params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
                                },
                                {
                                    field: "violation_name",
                                    headerName: "Violation Name",
                                    flex: 1,
                                    minWidth: 220,
                                    renderCell: ({ row }) => (
                                        <div className="py-2 font-semibold">
                                            {toTitleCase(row.violation_name)}
                                        </div>
                                    ),
                                },
                                {
                                    field: "offense_status",
                                    headerName: "Status",
                                    width: 110,
                                    renderCell: ({ row }) => (
                                        <div className="py-2">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    row.offense_status
                                                        ? "bg-red-100 text-red-600"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}
                                            >
                                                {row.offense_status ? "Major" : "Minor"}
                                            </span>
                                        </div>
                                    ),
                                },
                                {
                                    field: "penalties",
                                    headerName: "Penalties",
                                    flex: 1.6,
                                    minWidth: 300,
                                    sortable: false,
                                    renderCell: ({ row }) => (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-3">
                                            {[1, 2, 3, 4, 5, 6].map((occ) => {
                                                const penaltiesForOcc = row.penalties
                                                    ?.filter((p) => p.occurrence == occ)
                                                    .map((p) => p.penalty_description) ?? [];

                                                if (penaltiesForOcc.length === 0) return null;

                                                return (
                                                    <div key={occ} className="text-[0.8em]">
                                                        <b>{occ} Offense:</b>
                                                        <div className="flex gap-1 flex-wrap mt-1">
                                                            {penaltiesForOcc.map((desc, j) => (
                                                                <span
                                                                    key={j}
                                                                    className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full"
                                                                >
                                                                    {desc}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ),
                                },
                                {
                                    field: "created_at",
                                    headerName: "Added Since",
                                    width: 190,
                                    renderCell: ({ row }) =>
                                        `${readableDate(row.created_at)} (${readableTime(row.created_at)})`,
                                },
                                {
                                    field: "actions",
                                    type: "actions",
                                    headerName: "Action",
                                    width: 160,
                                    sortable: false,
                                    headerAlign: "left",
                                    align: "left",
                                    renderCell: ({ row }) => (
                                        <div className="flex gap-2 items-center h-full py-2">
                                            <ActionBtn
                                                className="bg-blue-600 hover:bg-blue-700"
                                                onClick={() => events[0]("violation", "edit", row)}
                                            >
                                                Edit
                                            </ActionBtn>
                                            <ActionBtn
                                                className="bg-red-600 hover:bg-red-700"
                                                onClick={() => deleteViolation(row)}
                                            >
                                                Delete
                                            </ActionBtn>
                                        </div>
                                    ),
                                },
                            ]}
                        />
                    </Box>
                </div>
            </div>
        </div>
    );
};

export default ManageViolation;
