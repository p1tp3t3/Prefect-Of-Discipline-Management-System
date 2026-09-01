import { useEffect, useState } from "react";
import CircleReload from "../reload/circle-reload";
import { APIRequest } from "@/others/classes/api-req";

const RecentViolationOccurenceList = ({ user_id }) => {
    const [list, setList] = useState(null);

    useEffect(() => {
        const api = new APIRequest(`/violation-occurence/list/${user_id}`, "get", null, setList);
        api.fetchData();
    }, []);

    return (
        <div className="w-full grid gap-5">
            <div className="w-full grid gap-3">

                {/* LOADING */}
                {list === null && (
                    <div className="w-full h-[20rem] grid place-items-center">
                        <CircleReload size={4} />
                    </div>
                )}

                {/* EMPTY */}
                {list !== null && list.length === 0 && (
                    <div className="w-full h-[20rem] grid place-items-center">
                        <div className="text-center text-gray-500 py-10">
                            <i className="fa-solid fa-triangle-exclamation text-[2.5em] mb-2"></i>
                            <h1 className="text-[1.2em] font-semibold">No Violations Found</h1>
                            <p className="text-[0.9em]">There are no recorded violations for this student.</p>
                        </div>
                    </div>
                )}

                {/* LIST */}
                {list !== null && list.length > 0 && (
                    list.map((e, i) => <Row key={i} data={e} />)
                )}

            </div>
        </div>
    );
};

const Row = ({ data }) => {
    const violation = data.offense?.violation;
    const penalty = data.penalty;

    const name = violation?.violation_name ?? "Unknown Violation";
    const count = data.total_occurrence;
    const occurrenceLabel = `${count} Offense${count > 1 ? "s" : ""}`;

    return (
        <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition">

            {/* TITLE */}
            <h2 className="font-semibold text-[1.05em] text-gray-900 mb-1">
                {name}
            </h2>

            {/* OCCURRENCE */}
            <p className="text-gray-600 text-sm mb-3">
                <b>Occurrences:</b> {occurrenceLabel}
            </p>

            {/* PENALTY SECTION */}
            <div className="mt-2">
                <p className="text-gray-800 font-medium text-sm mb-1">Penalty:</p>

                {penalty ? (
                    <div className="bg-blue-50 border border-blue-300 px-3 py-2 rounded text-sm text-blue-900">
                        <p><b>{penalty.description}</b></p>
                        <p className="text-xs text-blue-700">
                            (Based on {penalty.occurrence_used} occurrence)
                        </p>
                    </div>
                ) : (
                    <div className="bg-gray-100 border border-gray-300 px-3 py-2 rounded text-sm text-gray-600 italic">
                        No penalty defined for this occurrence.
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentViolationOccurenceList;
