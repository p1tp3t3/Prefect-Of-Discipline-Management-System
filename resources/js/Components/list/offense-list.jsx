import { useState, useEffect } from "react";
import CircleReload from "../reload/circle-reload";
import SearchBar from "@/Components/input/search-bar";
import { APIRequest } from "@/others/classes/api-req";
import { toTitleCase } from "@/others/function";

const OffenseList = () => {
    const [offenseList, setOffenseList] = useState(null);
    const [filteredList, setFilteredList] = useState([]);
    const [search, setSearch] = useState("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const api = new APIRequest("/api/offense-list", "get", null, (data) => {
            setOffenseList(data);
            setFilteredList(data);
        });
        api.fetchData();
    }, []);

    // SEARCH HANDLER
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);
        setCurrentPage(1);

        if (!value.trim()) {
            setFilteredList(offenseList);
            return;
        }

        const filtered = offenseList.filter((item) =>
            item.violation_name?.toLowerCase().includes(value)
        );

        setFilteredList(filtered);
    };

    // PAGINATION LOGIC
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentList = filteredList.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil((filteredList?.length || 0) / itemsPerPage);

    return (
        <div className="w-full p-4 sm:p-5 bg-white rounded-md shadow">

            {/* SEARCH BAR */}
            <div className="mb-5">
                <SearchBar
                    plc="Search Offense"
                    w="w-full sm:w-[25rem]"
                    search={search}
                    setSearch={setSearch}
                    handleSearch={handleSearch}
                />
            </div>

            {/* LOADING */}
            {offenseList === null && (
                <div className="py-10 flex justify-center">
                    <CircleReload size={3} />
                </div>
            )}

            {/* DEFAULT WHEN BACKEND RETURNS EMPTY */}
            {offenseList !== null && offenseList.length === 0 && (
                <div className="py-10 text-center text-gray-500 text-sm">
                    No offenses found.
                </div>
            )}

            {/* DEFAULT WHEN SEARCH RETURNS NO MATCHES */}
            {offenseList !== null &&
                offenseList.length > 0 &&
                filteredList.length === 0 && (
                    <div className="py-10 text-center text-gray-500 text-sm">
                        No results found for "<b>{search}</b>"
                    </div>
                )}

            {/* LIST VIEW */}
            {filteredList.length > 0 && (
                <div className="grid gap-4">
                    {currentList.map((offense, index) => (
                        <OffenseCard
                            key={index}
                            i={indexOfFirst + index}
                            data={offense}
                        />
                    ))}
                </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && filteredList.length > 0 && (
                <div className="flex flex-wrap justify-center items-center gap-2 mt-6">

                    {/* PREV */}
                    <button
                        className={`px-4 py-2 border rounded text-sm ${
                            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                    >
                        Prev
                    </button>

                    {/* PAGE NUMBERS */}
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            className={`px-4 py-2 border rounded text-sm ${
                                currentPage === i + 1 ? "bg-blue-500 text-white" : ""
                            }`}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}

                    {/* NEXT */}
                    <button
                        className={`px-4 py-2 border rounded text-sm ${
                            currentPage === totalPages
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                        }`}
                        onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                    >
                        Next
                    </button>

                </div>
            )}

        </div>
    );
};

const OffenseCard = ({ i, data }) => {
    const statusText = data.offense_status ? "Major" : "Minor";
    const statusColor = data.offense_status ? "bg-red-500" : "bg-orange-500";

    return (
        <div className="border rounded-lg shadow-sm bg-white p-4 hover:shadow-md transition">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                    <h3 className="font-bold text-lg text-gray-800">
                        {i + 1}. {toTitleCase(data.violation_name)}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Status:{" "}
                        <span
                            className={`${statusColor} px-2 py-1 text-white text-xs rounded-full`}
                        >
                            {statusText}
                        </span>
                    </p>
                </div>
            </div>

            {/* PENALTIES (Same Style As ManageViolation) */}
            <div className="mt-4">
                <h4 className="font-semibold text-sm mb-2">Penalties</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

                    {[1, 2, 3, 4, 5, 6].map((occ, idx) => {
                        const penaltiesForOcc =
                            data.penalties
                                ?.filter((p) => p.occurrence == occ)
                                .map((p) => p.penalty?.description ?? p.penalty_description)
                                ?? [];

                        return (
                            <div key={idx} className="mb-1 text-sm">
                                <b>{occ} Offense:</b>
                                <div className="flex gap-2 flex-wrap mt-1">
                                    {penaltiesForOcc.length > 0 ? (
                                        penaltiesForOcc.map((desc, j) => (
                                            <span
                                                key={j}
                                                className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full"
                                            >
                                                {desc}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 italic text-xs">
                                            No Penalty
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                </div>
            </div>
        </div>
    );
};

export default OffenseList;
