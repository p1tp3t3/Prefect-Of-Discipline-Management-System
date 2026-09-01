import { APIRequest } from "@/others/classes/api-req"
import CircleReload from "../reload/circle-reload"
import { useEffect, useState } from "react"
import ActionBtn from "../button/action-btn"

const AppointmentList = ({ 
    events = () => alert('show appointment request modal'),
    list = null
}) => {

    const [selectedDate, setSelectedDate] = useState(null)

    return (
        <div className="w-full">
            <div className="overflow-hidden overflow-y-auto h-[25rem] w-full flex flex-col gap-2">
                {list != null ? (
                    list.length !== 0 ? (
                        list.map((e, i) => (
                            <Row 
                                key={i} 
                                data={e} 
                                event={events}
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                            />
                        ))
                    ) : (
                        <Empty />
                    )
                ) : (
                    <Loading />
                )}
            </div>
        </div>
    )
}

const Empty = () => (
    <div className="text-[1em] text-gray-500 w-full grid place-items-center h-full">
        <div className="grid place-items-center">
            <div className="text-[4em]">
                <i className="fa-solid fa-circle-exclamation"></i>
            </div>
            <div>No Available Appointments</div>
        </div>
    </div>
)

const Loading = () => (
    <div className="h-full grid place-items-center">
        <CircleReload size={3} />
    </div>
)


const Row = ({ data, event, selectedDate, setSelectedDate }) => {
// Clean input date
    const input = data.date;

    // Parse manually

    // Extract the part like "Mon Dec 01 2025"
    const match = input.match(/[A-Za-z]{3} [A-Za-z]{3} \d{2} \d{4}/);
    const clean = match ? match[0] : input;

    // Parse correctly
    const dateObj = new Date(clean);

    // Build YYYY-MM-DD
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, "0");
    const d = String(dateObj.getDate()).padStart(2, "0");

    const readable = dateObj.toDateString();  // "Mon Dec 01 2025"
    const ymd = `${y}-${m}-${d}`;             // "2025-12-01"

    // Compare with today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentDate = new Date(ymd);
    currentDate.setHours(0, 0, 0, 0);

    const isPast = currentDate < today;

    const isSelected = selectedDate?.getTime() === currentDate.getTime();

    const handleSelect = (callback) => {
        if (!isPast) {
            setSelectedDate(currentDate);
            callback(ymd);
        }
    };

    return (
    <div
        className={ `flex flex-col sm:flex-row justify-between items-center py-2 px-4 rounded-lg shadow-sm transition ${isPast ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white"} ${isSelected && !isPast ? "border-2 border-blue-500 bg-blue-50" : "border border-gray-200"} mb-2` }
    >
        {/* Left: Date & Count */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
            <i className="fa-solid fa-calendar text-lg text-blue-500"></i>
            <div className="flex gap-3 text-sm">
                <span className="font-semibold">{readable}</span>
                {data.count > 0 &&
                <div className="w-[1.25rem] h-[1.25rem] grid place-items-center text-white text-xs rounded-full bg-red-600">
                    {data.count}
                </div>}
            </div>
        </div>

        {/* Right: Action Buttons */}
        {!isPast && (
        <div className="flex gap-2 mt-2 sm:mt-0 text-[0.8em] justify-self-end">
            <ActionBtn
                className="bg-green-600 text-white px-3 rounded-md hover:bg-green-700"
                onClick={() => handleSelect(event[1])}
            >
                <i className="fa-solid fa-calendar mr-1"></i> Schedule
            </ActionBtn>
            <ActionBtn
                className="bg-blue-600 text-white px-3 rounded-md hover:bg-blue-700"
                onClick={() => handleSelect(event[0])}
            >
                <i className="fa-solid fa-eye mr-1"></i> View
            </ActionBtn>
        </div>
        )}
    </div>
    );

}


export default AppointmentList
