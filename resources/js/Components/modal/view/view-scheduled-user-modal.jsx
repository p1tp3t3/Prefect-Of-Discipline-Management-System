import UpModal from "../up-modal";
import ProfilePic from "../../other/profile-pic";
import { useEffect, useState } from "react";
import { APIRequest } from "@/others/classes/api-req";
import { getProfilePic, getYearLevel, readableTime, showUserType } from "@/others/function";
import CircleReload from "@/Components/reload/circle-reload";
import ActionBtn from "@/Components/button/action-btn";
import TabBtn from "@/Components/button/tab-btn";

const ScheduledUserModal = (props) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        if (props.close) {
            fetchData();
        } else {
            setData(null);
        }
    }, [props.close]);

    useEffect(() => {
        if (props.status && props.close) {
            fetchData();
        }
    }, [props.status]);

    const fetchData = () => {
        const date = new Date(props.date);
        const id =
            date.getFullYear() +
            "-" +
            String(date.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(date.getDate()).padStart(2, "0");

        const api = new APIRequest(
            `/appointment/schedule/${id}/${props.status}`,
            "post",
            {},
            setData
        );
        api.fetchData();
    };

    return (
        <UpModal
            close={props.close}
            closeModal={props.closeModal}
            isEnableOuterClose={props.isEnableOuterClose}
            pd={props.pd}
            bgColor="bg-white"
            w="w-full max-w-[35rem]"
        >
            <div className="w-full">
                <Body
                    data={data}
                    date={props.date}
                    resched={props.resched}
                    actionEvent={props.actionEvent}
                    status={props.status}
                    setStatus={props.setStatus}
                    statusEvent={props.statusEvent}
                />
            </div>
        </UpModal>
    );
};

const Body = ({ data, date, status, setStatus, statusEvent, resched, actionEvent }) => {
    const statusOption = [
        { val: "pending", label: "Pending Appointments" },
        { val: "accepted", label: "Accepted Appointments" },
    ];

    const handleSelect = (type) => {
        if (status !== type) {
            setStatus(type);
            statusEvent(date, type); // triggers backend reload
        }
    };

    return (
        <div className="px-3 sm:px-5">

            {/* HEADER */}
            <div className="text-center pb-4 border-b grid gap-3">
                <h1 className="text-[1.1em] sm:text-[1.3em] font-bold text-gray-700 leading-tight">
                    Scheduled Users <br />
                    <span className="text-gray-500 text-[0.85em]">
                        {new Date(date).toDateString()}
                    </span>
                </h1>

                <div className="w-full flex justify-center">
                    <TabBtn list={statusOption} option={status} handleSelect={handleSelect} />
                </div>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="w-full overflow-y-auto h-[22rem] mt-3 space-y-2">

                {/* LOADING */}
                {!data && (
                    <div className="w-full flex justify-center mt-10">
                        <CircleReload size={3} />
                    </div>
                )}

                {/* LIST */}
                {data && data.length > 0 &&
                    data.map((e, i) => (
                        <Row
                            key={i}
                            data={e}
                            status={status}
                            resched={resched}
                            actionEvent={actionEvent}
                        />
                    ))
                }

                {/* EMPTY */}
                {data && data.length === 0 && (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 py-10">
                        <i className="fa-regular fa-calendar-xmark text-5xl mb-3"></i>
                        <p className="text-[1em] font-medium">
                            No {status === "pending" ? "Pending" : "Accepted"} Users
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

const Row = ({ data, status, resched, actionEvent }) => {
    const isPending = status === "pending";

    // --- SAFELY PARSE CONTENT (pending notifications only)
    let content = null;
    if (isPending) {
        try {
            content = typeof data.content === "string"
                ? JSON.parse(data.content)
                : data.content;
        } catch {
            content = {};
        }
    }

    // --- GET USER BASED ON TYPE
    const user = isPending ? data.receiver : data.user;

    // --- GET TIME BASED ON TYPE
    const time = isPending
        ? content?.time_appoint || "N/A"
        : readableTime(data.date_time_appoint);

    // --- GET PROGRAM + YEAR LEVEL (available only for accepted appointments)
    const programName = user?.program?.name || "";

    return (
        <div className="w-full border-b py-3">
            <div className="flex flex-wrap items-center gap-3 justify-between">

                {/* LEFT — USER INFO */}
                <div className="flex items-center gap-3 min-w-[180px] flex-1">
                    <ProfilePic
                        size={2.6}
                        src={getProfilePic(user.profile_picture, user.sex)}
                    />

                    <div className="leading-tight">
                        <p className="text-[0.95em] font-semibold text-gray-800">
                            {user.first_name} {user.middle_name} {user.last_name}
                        </p>

                        {/* USER TYPE */}
                        <p className="text-[0.75em] text-gray-500">
                            {showUserType(user)}
                        </p>

                        {/* LABEL */}
                        <p className={`text-[0.7em] font-semibold ${
                            isPending ? "text-blue-600" : "text-green-600"
                        }`}>
                            {isPending ? "Pending" : "Accepted Schedule"}
                        </p>
                    </div>
                </div>

                {/* CENTER — TIME */}
                <div className="text-[0.85em] text-gray-700 font-medium px-2">
                    {time}
                </div>

                {/* RIGHT — ACTION BUTTONS */}
                <div className="flex gap-2 flex-wrap justify-end min-w-[160px]">

                    {/* Resched only for accepted */}
                    {!isPending && (
                        <>
                        <ActionBtn
                            className="bg-yellow-600 text-white hover:bg-yellow-700 text-[0.8em] px-3 py-1.5 rounded-md"
                            onClick={() => resched(data.date_time_appoint, user, data.id)}
                        >
                            <i className="fa-solid fa-edit"></i> Resched
                        </ActionBtn>
                        {/* Reject for pending / Cancel for accepted */}
                        <ActionBtn
                            className="bg-red-600 text-white hover:bg-red-700 text-[0.8em] px-3 py-1.5 rounded-md"
                            onClick={() => actionEvent("cancel", data.id)}
                        >
                            {isPending ? "Reject" : "Cancel"}
                        </ActionBtn>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};

ScheduledUserModal.Body = Body;
export default ScheduledUserModal;
