import { useEffect, useState } from "react"
import ListSkeleton from "../reload/list-skeleton"
import { toTitleCase } from "@/others/function"
import { ViolationService } from "@/others/services/violation-service";
import { Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material"
const PenaltyList = ({ list = null }) => {
    const [penaltyList, setPenaltyList] = useState(list);

    useEffect(() => {
        // Prefect dashboard passes the list down from the controller;
        // fall back to fetching it only when no list prop was given.
        if (list != null) return;

        ViolationService.getPenaltyList(setPenaltyList)
    }, []);

    return (
        <div className="w-full px-5 py-3 bg-white rounded-md shadow-black/20 shadow-sm">
            <Table sx={{ width: "100%" }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ borderBottom: "1px solid #e5e7eb" }}>#</TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #e5e7eb" }}>Penalty Name</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {penaltyList ? (
                        penaltyList.length !== 0 ? (
                            penaltyList.map((e, i) => <Row key={i} i={i} data={e} />)
                        ) : (
                            <TableRow>
                                <TableCell align="center" sx={{ py: 5, fontSize: "0.9em" }} colSpan={2}>
                                    No Penalty Yet
                                </TableCell>
                            </TableRow>
                        )
                    ) : (
                        <TableRow>
                            <TableCell colSpan={2}>
                                <div className="flex justify-center items-center w-full py-10 text-[0.9em]">
                                    <ListSkeleton rows={3} />
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

const Row = ({ i, data }) => {
    return (
        <TableRow>
            <TableCell sx={{ fontSize: "0.9em" }}>{i + 1}.</TableCell>
            <TableCell sx={{ fontSize: "0.9em" }}>{toTitleCase(data.description)}</TableCell>
        </TableRow>
    );
};

export default PenaltyList;
