import SearchUserBar from "../input/search-user-bar";
import { useEffect, useState, useContext } from "react";
import ProfilePic from "../other/profile-pic";
import AuthContext from "@/context-provider/auth-provider";
import DropdownField from "../input/dropdown";
import "./style.css";
import {
  checkActiveStatus,
  getProfilePic,
  readableActiveDuration,
  readableDate,
  readableTime,
  showOutputModal,
  showWarningModal,
  toTitleCase,
} from "../../others/function";
import Switch from "../button/switch-btn";
import { APIRequest } from "@/others/classes/api-req";
import { Link, router } from "@inertiajs/react";
import ActionBtn from "../button/action-btn";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

const AccountList = (props) => {
  const { isUserOnline } = useContext(AuthContext);
  const [isSearchFocus, focusSearch] = useState(false),
    [search, setSearch] = useState(""),
    [accountList, setAccountList] = useState(props.row.data),
    [select, enableSelect] = useState(false),
    [activate, setActivate] = useState(false);

  const params = new URLSearchParams(window.location.search);

  const handleSearch = (e) => setSearch(e.target.value);

  const handleSelectType = (paramKey) => (e) => {
    const link = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    params.set(paramKey, e.target.value);
    router.visit(`${link}?${params.toString()}`);
  };

  const actionAll = (e, type) => {
    const status = e.target.checked ? 1 : 0;

    const checkboxes = document.querySelectorAll(
      'input[name="selected-row"]:checked'
    );
    const ids = Array.from(checkboxes).map((checkbox) => checkbox.value);
    const param = new URLSearchParams(window.location.search);
    if (type === "activate") {
      const data = { ids: ids, status: status, page: param.get("page") || 1 };

      const api = new APIRequest(
        `/super-admin/accounts/activation/all-users`,
        "post",
        data,
        updateList
      );
      api.fetchData();
      setActivate(status);
    } else {
      showWarningModal(
        "Are You Sure You Want To Delete The Selected Accounts?",
        "Delete Accounts",
        "Cancel",
        () => {
          const data = { user_ids: ids };
          props.reload(
            true,
            "text-wait",
            "Deleting Selected Accounts is Processing"
          );
          const api = new APIRequest(
            "/super-admin/user-accounts/del",
            "post",
            data,
            null,
            () => {
              props.reload(true, "");
              showOutputModal("Accounts Deleted Successfully", "s", () => {
                props.reload(false);
                window.location.reload();
              });
            },
            () => {
              props.reload(true, "");
              showOutputModal("Error Deleting Accounts", "e", () =>
                props.reload(false)
              );
            }
          );
          api.sendPostData();
        }
      );
    }
  };

  const updateList = (list) => {
    setAccountList(list.account_list.data);
  };

  const userType = [
    { val: "itrc", label: "ITRC" },
    { val: "student", label: "Student" },
    { val: "prefect", label: "Prefect" },
    { val: "faculty", label: "Faculty" },
    { val: "program_head", label: "Program Head" },
    { val: "staff", label: "Staff" },
    { val: "parent", label: "Parent" },
  ];

  const selectAllRow = (e) => {
    const checked = e.target.checked;
    const checkboxes = document.querySelectorAll('input[name="selected-row"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = checked;
    });
  };

  return (
    <div className="w-full account-list">
      <div className="w-full">
        {/* === FILTER + ACTION HEADER === */}
        <div className="w-full flex flex-col xl:flex-row justify-between py-5 gap-4 flex-wrap">
          {/* Left side */}
          <div className="flex flex-col lg:flex-row flex-wrap gap-3 lg:gap-4 items-start lg:items-center">
            <div className="flex flex-wrap gap-3 items-center">
              <DropdownField
                default={{ val: "all", label: "All Roles" }}
                list={userType}
                val={params.get("user-type")}
                onChange={handleSelectType("user-type")}
              />
              {(params.get("user-type") === "student" ||
                params.get("user-type") === "faculty" ||
                params.get("user-type") === "program_head") && (
                <DropdownField
                  default={{ val: "all", label: "All Program" }}
                  list={props.program}
                  val={params.get("program")}
                  onChange={handleSelectType("program")}
                />
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex flex-wrap gap-3 items-center">
            <ActionBtn
              className="bg-blue-700 hover:bg-blue-800"
              onClick={() => enableSelect(!select)}
            >
              <i className={`fa-solid ${select ? "fa-xmark" : "fa-check"}`}></i>
            </ActionBtn>
            {select && (
              <div className="flex gap-5 items-center flex-wrap">
                <div className="flex gap-2 items-center text-[0.8em]">
                  <input type="checkbox" id="select-all" onClick={selectAllRow} />
                  <label htmlFor="select-all">Select All</label>
                </div>
                <Switch
                  checked={activate}
                  effect={["bg-red-600", "bg-green-600"]}
                  onChange={(e) => actionAll(e, "activate")}
                />
                <div className="text-[0.8em]">
                  <ActionBtn
                    onClick={(e) => actionAll(e, "delete")}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </ActionBtn>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full bg-white rounded-md shadow-black/20 shadow-sm overflow-x-auto">
                        <div className="w-full px-5 py-3 min-w-[1250px]">
            {/* === DATAGRID === */}
        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={accountList ?? []}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            showToolbar
            hideFooterSelectedRowCount
            pagination
            initialState={{ pagination: { paginationModel: {  page: 0, pageSize: 20 } } }}
            pageSizeOptions={[20, 50, 100, 200]}
            columns={[
              {
                field: "index",
                headerName: "#",
                width: 60,
                sortable: false,
                renderCell: (params) =>
                  `${props.row.from + params.api.getRowIndexRelativeToVisibleRows(params.id)}.`,
              },
              { field: "id_number", headerName: "User ID", width: 100 },
              {
                field: "user",
                headerName: "User",
                flex: 1,
                sortable: false,
                filterable: true,
                renderCell: ({ row }) => (
                  <div className="flex items-center gap-3 h-full">
                    <ProfilePic
                      size={2}
                      src={getProfilePic(row.profile?.profile_picture, row.profile?.sex)}
                      showActive={true}
                      isActive={isUserOnline(row.id) || checkActiveStatus(row.last_seen)}
                      activeSize={0.8}
                    />
                    <div className="flex flex-col justify-center leading-tight">
                      <div className="text-[0.8em] font-bold">
                        {row.profile?.first_name} {row.profile?.middle_name} {row.profile?.last_name}
                      </div>
                      <div className="text-[0.7em] break-all">{row.username}</div>
                    </div>
                  </div>
                ),
              },
              {
                field: "role",
                headerName: "Role",
                width: 130,
                renderCell: ({ row }) => toTitleCase(row.role).replace("_", " "),
              },
              {
                field: "created_at",
                headerName: "Registered Since",
                width: 190,
                renderCell: ({ row }) =>
                  `${readableDate(row.created_at)} (${readableTime(row.created_at)})`,
              },
              {
                field: "last_seen",
                headerName: "Active Since",
                width: 160,
                renderCell: ({ row }) =>
                  row.last_seen ? readableActiveDuration(row.last_seen) : "N/A",
              },
              {
                field: "actions",
                type: 'actions',
                headerName: "Action",
                width: 280,
                sortable: false,
                headerAlign: 'left',
                align: 'left',
                renderCell: (params) => (
                  <ActionCell
                    row={params.row}
                    select={select}
                    deleteUser={props.deleteUser}
                  />
                ),
              },
            ]}
          />
        </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========================
// ACTION CELL COMPONENT
// ========================
const ActionCell = ({ row, select, deleteUser }) => {
  const [activate, setActivate] = useState(row.activate);

  useEffect(() => {
    setActivate(row.activate);
  }, [row.activate]);

  const handleToggle = (e) => {
    const api = new APIRequest(`/super-admin/accounts/activation/${row.username}`, "post", {
      status: Number(e.target.checked),
    });
    api.sendPostData();
    setActivate(e.target.checked);
  };

  return (
    <div className="flex gap-2 items-center h-full">
      <Link href={`/profile/${row.username}`}>
        <ActionBtn className="bg-blue-600 text-white hover:bg-blue-700">View</ActionBtn>
      </Link>

      {select ? (
        <input type="checkbox" name="selected-row" value={row.id} />
      ) : (
        <Switch
          checked={activate}
          onChange={handleToggle}
          effect={["bg-red-600", "bg-green-600"]}
        />
      )}

      {!select && (
        <ActionBtn
          onClick={() => deleteUser(row)}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          Delete
        </ActionBtn>
      )}
    </div>
  );
};

export default AccountList;
