import SearchBar from "@/Components/input/search-bar";
import { APIRequest } from "@/others/classes/api-req";
import { readableDate, readableTime, showWarningModal } from "@/others/function";
import { useState } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { Box } from "@mui/material";

const ManageProgram = ({ list, original_list, events, reload, setter }) => {
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (!value.toLowerCase().trim()) {
      setter(original_list);
      return;
    }

    const filtered = list.filter(item => {
      const acronym = (item.name ?? "").toLowerCase();
      const name = (item.description ?? "").toLowerCase();

      return (
        acronym.includes(value.toLowerCase()) ||
        name.includes(value.toLowerCase())
      );
    });

    setter(filtered);
  };

  const columns = [
    {
      field: "index",
      headerName: "#",
      width: 60,
      sortable: false,
    },
    {
      field: "name",
      headerName: "Acronym",
      width: 150,
    },
    {
      field: "description",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "created_at",
      headerName: "Added Since",
      width: 200,
      renderCell: (params) => `${readableDate(params.row.created_at)} (${readableTime(params.row.created_at)})`
    },
    {
      field: "actions",
      headerName: "Action",
      width: 180,
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          key="edit"
          label="Edit"
          showInMenu={false}
          onClick={() => events[0]("program", "edit", params.row)}
          className="text-blue-500 hover:underline"
          icon={<i className="fa-solid fa-pen"></i>}
        />,
        <GridActionsCellItem
          key="delete"
          label="Delete"
          showInMenu={false}
          onClick={() => {
            showWarningModal(
              `Are You Sure You Want To Delete ${params.row.description}?`,
              "Delete Program",
              "Cancel",
              () => {
                reload(true, "text-wait", "Deleting Program...");
                const api = new APIRequest(
                  "/maintenance/program/delete",
                  "post",
                  { id: params.row.id },
                  setter,
                  () => {
                    reload(true, "success", "Program Deleted Successfully");
                  },
                  (e) => {
                    reload(true, "error", e.response.data.message);
                  }
                );
                api.fetchData();
              }
            );
          }}
          className="text-red-500 hover:underline"
          icon={<i className="fa-solid fa-trash"></i>}
        />,
      ],
    },
  ];

  return (
    <div className="w-full bg-white rounded-md shadow-black/20 shadow-sm overflow-x-auto">
      <div className="w-full px-5 py-3 min-w-[800px]">
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={list}
          getRowId={(row) => row.id}
          columns={columns}
          pagination
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 20 } } }}
          pageSizeOptions={[20, 50, 100]}
          disableSelectionOnClick
          disableRowSelectionOnClick
          autoHeight
          showToolbar
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f3f3f3",
            },
          }}
          components={{
            NoRowsOverlay: () => (
              <div className="grid place-items-center h-full text-gray-600">
                <div className="text-[4em]">
                  <i className="fa-solid fa-circle-exclamation"></i>
                </div>
                <div><b>No Programs Found</b></div>
              </div>
            ),
          }}
        />
      </Box>
      </div>
    </div>
  );
};

export default ManageProgram;
