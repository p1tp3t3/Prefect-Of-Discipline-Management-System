import { useEffect, useState } from "react"
import UpModal from "../up-modal"
import { ReportArchiveService } from "@/others/services/report-archive-service"
import { readableDate, readableTime, showWarningModal, toTitleCase } from "@/others/function"
import { Table, TableHead, TableBody, TableRow, TableCell, Chip } from "@mui/material"
import { FileText, Trash2, Download, Eye, FolderOpen } from "lucide-react"

const GeneratedReportsModal = ({ close, closeModal, pd, isEnableOuterClose }) => {
    const [list, setList] = useState(null)

    const load = () => {
        setList(null)
        ReportArchiveService.getReportHistory(setList)
    }

    useEffect(() => {
        if (close) load()
    }, [close])

    const handleDelete = (report) => {
        showWarningModal(
            `Are You Sure You Want to Delete "${report.report_name}"?`,
            "Delete Report",
            "Cancel",
            () => {
                ReportArchiveService.deleteGeneratedReport(report.id, load, load)
            }
        )
    }

    return (
        <UpModal
            close={close}
            closeModal={closeModal}
            pd={pd}
            isEnableOuterClose={isEnableOuterClose}
            bgColor="bg-white"
            w="w-[45rem]"
        >
            <div className="w-full grid gap-4">
                <div className="pt-3 flex items-center gap-2 text-[1.2em]">
                    <FileText size="1em" />
                    <h1><b>Generated Reports</b></h1>
                </div>

                {list === null &&
                <div className="py-10 text-center text-gray-500">Loading...</div>}

                {list !== null && list.length === 0 &&
                <div className="py-10 text-center text-gray-500">
                    <FolderOpen size="2.5em" className="mb-2 mx-auto opacity-60" />
                    <p>No reports generated yet.</p>
                </div>}

                {list !== null && list.length > 0 &&
                <div className="w-full overflow-x-auto max-h-[28rem]">
                    <Table sx={{ width: "100%", fontSize: "0.875rem" }} stickyHeader>
                        <TableHead>
                            <TableRow sx={{ "& .MuiTableCell-root": { backgroundColor: "#f3f4f6", fontWeight: 700 } }}>
                                <TableCell>Report Name</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>File</TableCell>
                                <TableCell>Generated At</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {list.map((r) => (
                                <TableRow key={r.id} hover>
                                    <TableCell>{r.report_name}</TableCell>
                                    <TableCell>
                                        <Chip label={toTitleCase(r.report_type)} size="small" variant="outlined" />
                                    </TableCell>
                                    <TableCell>{r.file_type?.toUpperCase()}</TableCell>
                                    <TableCell>
                                        {readableDate(r.created_at)} ({readableTime(r.created_at)})
                                    </TableCell>
                                    <TableCell align="right">
                                        <div className="flex justify-end gap-2">
                                            {r.view_url &&
                                            <a
                                                href={r.view_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-1.5 rounded hover:bg-gray-100 text-gray-700"
                                                title="View"
                                            >
                                                <Eye size={16} />
                                            </a>}
                                            <a
                                                href={r.download_url}
                                                className="p-1.5 rounded hover:bg-blue-50 text-blue-600"
                                                title="Download"
                                            >
                                                <Download size={16} />
                                            </a>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(r)}
                                                className="p-1.5 rounded hover:bg-red-50 text-red-600"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>}
            </div>
        </UpModal>
    )
}

export default GeneratedReportsModal
