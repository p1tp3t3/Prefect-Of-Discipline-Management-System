import FormButton from "../button/button"
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer } from "@mui/material"
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react"

const CsvStudentPreviewPage = ({ rows, onCancel, onFinalize }) => {
    const validCount = rows?.filter((r) => r.valid).length ?? 0
    const invalidCount = (rows?.length ?? 0) - validCount

    return (
        <div className="w-full py-4 grid gap-4">
            <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-3">
                <h1 className="text-[1.3em] sm:text-[1.5em] font-bold">REVIEW STUDENT CSV</h1>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-[0.9em] rounded border border-gray-400 hover:bg-gray-100 bg-white"
                >
                    <ArrowLeft size={14} /> Back
                </button>
            </div>

            <div className="w-full bg-white rounded-md shadow-md p-5 grid gap-4">
                <p className="text-[0.9em] text-gray-600">
                    {rows?.length ?? 0} row(s) found &mdash;{" "}
                    <span className="text-green-700 font-semibold">{validCount} valid</span>,{" "}
                    <span className="text-red-600 font-semibold">{invalidCount} flagged</span>.
                    Flagged rows will be skipped and reported as errors during processing.
                </p>

                <TableContainer sx={{ width: "100%", maxHeight: "65vh", border: "1px solid #e5e7eb", borderRadius: "0.375rem" }}>
                    <Table stickyHeader sx={{ width: "100%", fontSize: "0.8em" }}>
                        <TableHead>
                            <TableRow sx={{ "& .MuiTableCell-root": { backgroundColor: "#f3f4f6", fontWeight: 700 } }}>
                                <TableCell>#</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>ID</TableCell>
                                <TableCell>First Name</TableCell>
                                <TableCell>Middle Name</TableCell>
                                <TableCell>Last Name</TableCell>
                                <TableCell>Suffix</TableCell>
                                <TableCell>Sex</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Program</TableCell>
                                <TableCell>Year Level</TableCell>
                                <TableCell>School Year</TableCell>
                                <TableCell>Enrolled Since</TableCell>
                                <TableCell>Errors</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows?.map((r) => (
                                <TableRow key={r.row_index} sx={{ backgroundColor: r.valid ? "transparent" : "#fef2f2" }}>
                                    <TableCell>{r.row_index + 1}</TableCell>
                                    <TableCell>
                                        {r.valid
                                            ? <span className="text-green-700"><CheckCircle2 size={14} /></span>
                                            : <span className="text-red-600"><AlertCircle size={14} /></span>}
                                    </TableCell>
                                    <TableCell>{r.data.id}</TableCell>
                                    <TableCell>{r.data.first_name}</TableCell>
                                    <TableCell>{r.data.middle_name}</TableCell>
                                    <TableCell>{r.data.last_name}</TableCell>
                                    <TableCell>{r.data.suffix}</TableCell>
                                    <TableCell>{r.data.sex}</TableCell>
                                    <TableCell>{r.data.email}</TableCell>
                                    <TableCell>{r.data.program}</TableCell>
                                    <TableCell>{r.data.year_level}</TableCell>
                                    <TableCell>{r.data.school_year}</TableCell>
                                    <TableCell>{r.data.enrolled_at}</TableCell>
                                    <TableCell sx={{ color: "#dc2626" }}>{r.errors?.join(" ")}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-[0.9em] rounded border border-gray-400 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <FormButton
                        label={`Finalize & Create ${validCount} Account(s)`}
                        click={onFinalize}
                        enable={validCount > 0}
                    />
                </div>
            </div>
        </div>
    )
}
export default CsvStudentPreviewPage
