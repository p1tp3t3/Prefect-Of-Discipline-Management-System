import { useEffect, useState } from "react";
import UpModal from "../up-modal";
import CircleReload from "@/Components/reload/circle-reload";
import { APIRequest } from "@/others/classes/api-req";
import UserAccountFileList from "@/Components/list/user-account-file-list";

const ViewUserAccountFileModal = (props) => {
  const [data, setData] = useState(null);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    if (props.close) {
      setReload(true);
      getUserAccountFileInfo();
    } else {
      setReload(false);
      setData(null);
    }
  }, [props.close]);

  const deleteFile = (f) => {
    const api = new APIRequest(
      "/super-admin/user-accounts/file/del",
      "post",
      { fileName: f },
      setData
    );
    api.fetchData();
  };

  const getUserAccountFileInfo = () => {
    const api = new APIRequest(`/api/user-account/file`, "get", {}, setData);
    api.fetchData();
  };

  return (
    <UpModal
      close={props.close}
      closeModal={props.closeModal}
      isEnableOuterClose={props.isEnableOuterClose}
      pd={props.pd}
      bgColor="bg-white"
      // 👇 responsive width
      w="w-[90vw] sm:w-[40rem] md:w-[45rem] max-w-[95vw]"
    >
      {data !== null ? (
        <div className="w-full">
          <div className="">
            <h1 className="text-lg sm:text-[1.2em] font-bold">
              User Account Files
            </h1>
          </div>

          {/* Scrollable container for table/list */}
          <div className="mt-4 max-h-[25rem] overflow-y-auto">
            {/* 👇 horizontal scroll wrapper */}
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <UserAccountFileList list={data} deleteFile={deleteFile} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        reload && (
          <div className="w-full flex justify-center py-10">
            <CircleReload size={3} />
          </div>
        )
      )}
    </UpModal>
  );
};

export default ViewUserAccountFileModal;
