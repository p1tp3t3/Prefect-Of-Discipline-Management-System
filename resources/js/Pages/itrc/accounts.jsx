import AuthLayout from "@/Layouts/auth-layout";
import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import AccountList from "@/Components/list/account-list";
import AccountFilesTab from "@/Components/other/account-files-tab";
import TabSwitcher from "@/Components/other/tab-switcher";
import EditUserInfoModal from "@/Components/modal/submission-form/edit-user-information-modal";
import { useReload } from "@/context-provider/reload-provider";
import { AccountService } from "@/others/services/account-service";
import { showOutputModal, showWarningModal } from "@/others/function";

const Accounts = (props) => {
  const [editUserInfo, openEditUserInfo] = useState(false),
    [data, setData] = useState(null),
    [profile, setProfile] = useState(""),
    [deleteUser, openDeleteUser] = useState(false),
    [clickedOk, setClickOk] = useState(false);

  const { loadRegister, setReload, setOnClose } = useReload();

  useEffect(() => {
    setOnClose(() => (e) => {
      setReload(e);
      if (clickedOk) window.location.reload();
      setClickOk(false);
    });
  }, [clickedOk]);

  const activeTab = new URLSearchParams(window.location.search).get("tab") || "users";
  const goToTab = (tab) => router.visit(`/super-admin/user-accounts?tab=${tab}`);

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
        AccountService.deleteAccount(
          d,
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
      }
    )
  };

  const buttonStyle =
    "px-4 h-[2rem] rounded-md bg-blue-700 text-white text-[0.8em] hover:bg-blue-900";

  return (
    <>
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
        </div>

        {/* Tabs */}
        <div className="mt-3">
          <TabSwitcher
            tabs={[
              { key: "users", label: "Users" },
              { key: "files", label: "Account Files" },
            ]}
            value={activeTab}
            onChange={goToTab}
          />
        </div>

        {activeTab === "users" && (
          <div className="pt-3">
            <AccountList
              row={props.account_list}
              openEditUserInfo={showEditUserInfo}
              deleteUser={openDeleteUserAccount}
              program={props.program}
              reload={loadRegister}
            />
          </div>
        )}

        {activeTab === "files" && (
          <div className="pt-3">
            <AccountFilesTab files={props.account_files} canDelete={true} />
          </div>
        )}
      </div>
    </>
  );
};

Accounts.layout = (page) => <AuthLayout user={page.props.user}>{page}</AuthLayout>

export default Accounts;
