import { useState, useEffect } from "react";
import ListSkeleton from "../reload/list-skeleton";
import SearchBar from "@/Components/input/search-bar";
import { ViolationService } from "@/others/services/violation-service";
import { toTitleCase, ordinal } from "@/others/function";
import {
    List,
    ListItem,
    ListItemText,
    Divider,
    Chip,
    Stack,
    Typography,
    Pagination,
    Box,
} from "@mui/material";

const OffenseList = ({ list = null }) => {
    const [offenseList, setOffenseList] = useState(list);
    const [filteredList, setFilteredList] = useState(list ?? []);
    const [search, setSearch] = useState("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        // Prefect dashboard passes the list down from the controller;
        // fall back to fetching it only when no list prop was given.
        if (list != null) return;

        ViolationService.getOffenseList((data) => {
            setOffenseList(data);
            setFilteredList(data);
        });
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
                    <ListSkeleton rows={4} />
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
                <List sx={{ width: "100%", bgcolor: "background.paper" }} disablePadding>
                    {currentList.map((offense, index) => (
                        <OffenseListItem
                            key={offense.id ?? index}
                            i={indexOfFirst + index}
                            data={offense}
                            isLast={index === currentList.length - 1}
                        />
                    ))}
                </List>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && filteredList.length > 0 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(e, page) => setCurrentPage(page)}
                        color="primary"
                        shape="rounded"
                    />
                </Box>
            )}

        </div>
    );
};

const OffenseListItem = ({ i, data, isLast }) => {
    const isMajor = !!data.offense_status;

    return (
        <>
            <ListItem alignItems="flex-start" sx={{ py: 2, px: { xs: 1, sm: 2 } }}>
                <ListItemText
                    primary={
                        <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap" useFlexGap>
                            <Typography component="span" sx={{ fontWeight: 700 }}>
                                {i + 1}. {toTitleCase(data.violation_name)}
                            </Typography>
                            <Chip
                                label={isMajor ? "Major" : "Minor"}
                                size="small"
                                color={isMajor ? "error" : "warning"}
                            />
                        </Stack>
                    }
                    secondary={
                        <Box
                            sx={{
                                mt: 1.5,
                                display: "grid",
                                gap: 1.5,
                                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" },
                            }}
                        >
                            {[1, 2, 3, 4, 5, 6].map((occ) => {
                                const penaltiesForOcc =
                                    data.penalties
                                        ?.filter((p) => p.occurrence == occ)
                                        .map((p) => p.penalty?.description ?? p.penalty_description)
                                        ?? [];

                                return (
                                    <Box key={occ}>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            sx={{ fontWeight: 600, color: "text.primary" }}
                                        >
                                            {ordinal(occ)} Offense:
                                        </Typography>
                                        <Stack
                                            direction="row"
                                            spacing={0.5}
                                            flexWrap="wrap"
                                            useFlexGap
                                            sx={{ mt: 0.5 }}
                                        >
                                            {penaltiesForOcc.length > 0 ? (
                                                penaltiesForOcc.map((desc, j) => (
                                                    <Chip key={j} label={desc} size="small" variant="outlined" />
                                                ))
                                            ) : (
                                                <Typography variant="caption" color="text.secondary" fontStyle="italic">
                                                    No Penalty
                                                </Typography>
                                            )}
                                        </Stack>
                                    </Box>
                                );
                            })}
                        </Box>
                    }
                    secondaryTypographyProps={{ component: "div" }}
                />
            </ListItem>
            {!isLast && <Divider component="li" />}
        </>
    );
};

export default OffenseList;
