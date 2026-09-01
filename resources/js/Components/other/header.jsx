import ProfilePic from "./profile-pic";
import { useState, useEffect, useRef, useContext } from "react";
import NotificationModal from "../modal/notification-modal";
import AccountModal from "../modal/account-modal";
import { getChannelList, getProfilePic } from "../../others/function";
import CallInModal from "../modal/submission-form/call-in-modal";
import { APIRequest } from "@/others/classes/api-req";
import { BroadcastManager } from "@/others/classes/broadcast-manager";
import Toast from "../modal/view/toast";
import AuthContext from "@/context-provider/auth-provider";
import { Link } from "@inertiajs/react";
import { Broadcast } from "@/others/classes/broadcast-cofiguration";

const AuthHeader = (props) => {
  const [pane, setOpenPanelId] = useState(null),
    panel = useRef({ notif: null, profile: null }),
    [student_list, setStudentList] = useState([]),
    [notifList, setNotifList] = useState(null),
    [notifCount, setNotifCount] = useState(0),
    [callIn, openCallIn] = useState(false),
    [size, setSize] = useState(null);

  const { usr, toast, toastLabel, toastIcon, openToast } =
    useContext(AuthContext);

  useEffect(() => {
    const handlePopUpRemove = (e) => {
      if (!Object.values(panel.current).some((ref) => ref?.contains(e.target))) {
        setOpenPanelId(null);
      }
    };
    document.addEventListener("click", handlePopUpRemove);
    if(props.user.role == 'sub_admin') {
      const api = new APIRequest("/all-students", "get", null, setStudentList);
      api.fetchData();
    }
    return () => document.removeEventListener("click", handlePopUpRemove);
  }, []);

  useEffect(() => {
    const user_id = props.user.id,
      user = props.user,
      broadcastType = "private",
      channelList = getChannelList(user_id),
      enableNotif = false;

    new Broadcast(
      broadcastType,
      'notify.' + user_id,
      'NotifyUser',
      (e) => {
        setNotifList(e.response)
        setNotifCount(e.count)
        setSize(e.size)
      }
    )
    .configure('enable notification')
  }, []);

  useEffect(() => {
    const api = new APIRequest(
      `/notification/${usr.id}/4`,
      "get",
      {},
      (e) => {
        setNotifCount(e.unread_count);
        setNotifList(e.notif);
        setSize(e.size);
      },
      (err) => console.log(err)
    );
    api.fetchData();
  }, []);

  const handleTogglePanel = (panelId) => {
    setOpenPanelId((prevId) => (prevId === panelId ? null : panelId));
  };


  const btn =
    "h-full w-[2.5rem] relative grid place-items-center rounded-[100%] text-[1.2em] text-black bg-white hover:bg-black/30 active:bg-black/50";

  return (
    <>
      {props.user.role == "sub_admin" && (
        <>
          {toast && (
            <Toast
              label={toastLabel}
              icon={toastIcon}
              closeToast={openToast}
            />
          )}
          <CallInModal
            close={callIn}
            closeModal={openCallIn}
            user_id={props.user.id}
            pd={["px-5", "py-7"]}
            isEnableOuterClose={true}
            student_list={student_list}
          />
        </>
      )}

      <header className="w-full px-5 py-2 bg-blue-500 grid sticky top-0 z-20 shadow-md">
        <div className="w-full flex justify-between relative">
          <div className="flex gap-2">
            {props.profile && (
              <a href={`/dashboard`}>
                <button className={btn}>
                  <i className="fa-solid fa-home"></i>
                </button>
              </a>
            )}
            <button 
                className="h-full w-[2.5rem] rounded-[100%] text-[1.2em] text-black bg-white min-[768px]:hidden"
                onClick={() => {
                  const aside = document.querySelector("aside"),
                        bg = document.querySelector('#sidebar-overlay')
                  aside.classList.toggle("max-[768px]:w-0")
                  bg.classList.toggle('hidden')
                }}>
                <i className="fa-solid fa-list"></i>
            </button>
          </div>

          <div className="grid relative">
            <div className="flex gap-2">
              {props.user.role == "sub_admin" && (
                <button
                  type="button"
                  className={btn}
                  onClick={() => openCallIn(true)}
                >
                  <i className="fa-solid fa-phone"></i>
                </button>
              )}
              <div className="h-full grid">
                <button
                  type="button"
                  className={`${btn} ${
                    pane == "notif" ? "text-blue-700 bg-blue-200" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTogglePanel("notif");
                  }}
                >
                  <i className="fa-solid fa-bell"></i>
                  {(notifCount != 0) && (
                    <div className="absolute top-6 right-0 w-[1.2rem] h-[1.2rem] text-[0.6em] grid place-items-center bg-red-600 text-white rounded-full">
                      {notifCount > 9 ? "9+" : notifCount}
                    </div>
                  )}
                </button>
              </div>
              <div className="relative">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTogglePanel("profile");
                  }}
                  className="cursor-pointer before:z-10 before:rounded-full before:w-full before:h-full before:contents-[''] before:active:bg-black/50 before:hover:bg-black/30 before:absolute"
                >
                  <ProfilePic
                    src={getProfilePic(usr.profile?.profile_picture, usr.profile?.sex)}
                    size={2.5}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Responsive modals: fixed full-width on mobile */}
          <AccountModal
            addPicRoute={props.addPicRoute}
            user={props.user}
            authType={props.user}
            click={pane == "profile"}
            refs={(el) => (panel.current.profile = el)}
          />

          <NotificationModal
            click={pane == "notif"}
            refs={(el) => (panel.current.notif = el)}
            list={notifList}
            setter={[setNotifList, setNotifCount, setSize]}
            user={props.user}
            size={size}
          />
        </div>
      </header>
    </>
  );
};

export default AuthHeader;
