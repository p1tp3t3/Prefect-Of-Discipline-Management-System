import { readableDate, readableTime } from "../../others/function";

const AppointmentScheduleList = ({ list = [], showAction = false, events = () => {} }) => {
    return (
        <div className="w-full h-[22rem] bg-white rounded-lg shadow-sm border border-gray-200">
            
            {/* Header */}
            <div
                className={`${
                    showAction
                        ? "pb-3"
                        : "py-[6px] text-[0.95em] border-b border-gray-300"
                } px-5`}
            >
                <b>Upcoming Appointments</b>
            </div>

            {/* Content */}
            <div className="overflow-hidden overflow-y-auto h-[19rem] w-full flex flex-col px-5 pt-3">

                {list.length !== 0 ? (
                    list.map((e, i) => (
                        <Row key={i} events={events} data={e} showAction={showAction} />
                    ))
                ) : (
                    <div className="text-[1em] text-gray-500 w-full grid place-items-center h-full">
                        <div className="grid place-items-center">
                            <div className="text-[3.5em] text-gray-400 mb-2">
                                <i className="fa-solid fa-calendar-xmark"></i>
                            </div>
                            <div className="text-gray-600">No Appointments Yet</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const Row = ({ data, showAction, events }) => {
    return (
        <div className="border-gray-200 border-b py-3">

            <div className="flex flex-col gap-3 px-2">

                {/* Date + Time */}
                <div className="flex justify-between items-start">
                    <div className="flex gap-3 items-center">
                        <div className="text-[#1E3A8A] text-xl">
                            <i className="fa-solid fa-calendar-day"></i>
                        </div>

                        <div>
                            <p className="text-[0.95em] font-semibold text-gray-800">
                                {readableDate(data.date_time_appoint)}
                            </p>
                            <p className="text-[0.75em] text-gray-600">
                                Starts at <span className="font-medium text-gray-700">{readableTime(data.date_time_appoint)}</span>
                            </p>
                        </div>
                    </div>

                    {/* View Icon */}
                    {showAction && (
                        <button
                            onClick={() => events("view", data.id)}
                            className="text-[#1E3A8A] hover:text-[#162d66] text-lg"
                        >
                            <i className="fa-solid fa-circle-info"></i>
                        </button>
                    )}
                </div>

                {/* Action Buttons */}
                {showAction && (
                    <div className="flex justify-end gap-2 mt-1">

                        <button
                            type="button"
                            className="py-1 px-3 border border-red-600 text-red-600 text-[0.75em] font-semibold rounded-md hover:bg-red-600 hover:text-white transition"
                            onClick={() => events("cancel", data.id, data)}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="py-1 px-3 border border-blue-700 text-blue-700 text-[0.75em] font-semibold rounded-md hover:bg-blue-700 hover:text-white transition"
                            onClick={() => events("resched", data.id, data)}
                        >
                            Re-Schedule
                        </button>

                    </div>
                )}

            </div>
        </div>
    );
};

export default AppointmentScheduleList;
