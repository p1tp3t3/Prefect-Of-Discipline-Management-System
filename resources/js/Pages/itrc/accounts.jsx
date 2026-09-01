import AuthLayout from "@/Layouts/auth-layout";
import { useState } from "react";
import AccountList from "@/Components/list/account-list";
import EditUserInfoModal from "@/Components/modal/submission-form/edit-user-information-modal";
import Reload from "@/Components/reload/reload";
import { APIRequest } from "@/others/classes/api-req";
import Btn from "@/Components/button/normal-btn";
import ViewUserAccountFileModal from "@/Components/modal/view/view-user-account-file-modal";
import { showOutputModal, showWarningModal } from "@/others/function";

const Accounts = (props) => {
  const [editUserInfo, openEditUserInfo] = useState(false),
    [data, setData] = useState(null),
    [profile, setProfile] = useState(""),
    [reload, setReload] = useState(false),
    [reloadType, setReloadType] = useState(""),
    [reloadLabel, setReloadLabel] = useState(""),
    [userAccountFile, openViewUserAccountFile] = useState(false),
    [deleteUser, openDeleteUser] = useState(false),
    [clickedOk, setClickOk] = useState(false);

  const showEditUserInfo = (data) => {
    openEditUserInfo(true);
    setData(data);
  };

  const openDeleteUserAccount = (data) => {
    const userId = data.id_number
    showWarningModal(
      `Are You Sure You Want To Delete Account ${userId}?`,
      'Delete Account',
      'Cancel',
      () => {
        const d = { user_id: data.id, user_type: data.role };

        loadRegister(true, "text-wait", "Deleting Account Is Processing");
        const api = new APIRequest(
          "/super-admin/user-accounts/del",
          "post",
          d,
          null,
          () => {
            loadRegister(true, "");
            showOutputModal(
              `Account ${userId} Deleted Successfully`,
              's',
              () => {
                loadRegister(false)
                window.location.reload()
              }
            )
          },
          (err) => {
            loadRegister(true, "");
            showOutputModal(
              err.response.data.message,
              'e',
              () => loadRegister(false)
            )
          }
        );

        api.sendPostData();
      }
    )
  };

  const loadRegister = (r, t, l) => {
    setReload(r);
    setReloadType(t);
    setReloadLabel(l);
  };

  const isReload = () => {
    return reload ? "opacity-1 z-[100]" : "opacity-0 z-[-1]";
  };

  const buttonStyle =
    "px-4 h-[2rem] rounded-md bg-blue-700 text-white text-[0.8em] hover:bg-blue-900";

  return (
    <>
      <Reload
        transition={isReload()}
        type={reloadType}
        label={reloadLabel}
        onClose={(e) => {
          setReload(e);
          if (clickedOk) window.location.reload();
          setClickOk(false);
        }}
      />
      <ViewUserAccountFileModal
        close={userAccountFile}
        closeModal={openViewUserAccountFile}
        pd={["px-5", "py-7"]}
        isEnableOuterClose={true}
      />
      <EditUserInfoModal
        close={editUserInfo}
        closeModal={openEditUserInfo}
        pd={["px-5", "py-7"]}
        isEnableOuterClose={true}
        data={data}
        profilePic={profile}
        reload={loadRegister}
      />

      <div className="w-full py-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-3">
          <h1 className="text-[1.3em] sm:text-[1.5em] font-bold">USER LIST</h1>
          <div className="text-[1em]">
            <Btn onclick={() => openViewUserAccountFile(true)}>
              <i className="fa-solid fa-file"></i> User Account Files
            </Btn>
          </div>
        </div>

        {/* Account List */}
        <div className="">
          <AccountList
            row={props.account_list}
            openEditUserInfo={showEditUserInfo}
            deleteUser={openDeleteUserAccount}
            program={props.program}
            reload={loadRegister}
          />
        </div>
      </div>
    </>
  );
};

Accounts.layout = (page) => <AuthLayout user={page.props.user}>{page}</AuthLayout>

export default Accounts;
