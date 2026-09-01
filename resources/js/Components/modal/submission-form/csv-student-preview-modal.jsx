import UpModal from "../up-modal"
import FormButton from "../../button/button"

const CsvStudentPreviewModal = ({ close, closeModal, rows, onCancel, onFinalize }) => {
    const validCount = rows?.filter((r) => r.valid).length ?? 0
    const invalidCount = (rows?.length ?? 0) - validCount

    return (
        <UpModal
            close={close}
            pd={["px-6", "py-5"]}
            isEnableOuterClose={false}
            closeModal={closeModal}
            bgColor="bg-white"
            w="w-[70rem]"
        >
            <div className="w-full grid gap-4">
                <div>
                    <h1 className="text-[1.2em]"><b>Review Student CSV</b></h1>
                    <p className="text-[0.85em] text-gray-600">
                        {rows?.length ?? 0} row(s) found &mdash;{" "}
                        <span className="text-green-700">{validCount} valid</span>,{" "}
                        <span className="text-red-600">{invalidCount} flagged</span>.
                        Flagged rows will be skipped and reported as errors during processing.
                    </p>
                </div>

                <div className="w-full max-h-[24rem] overflow-auto border rounded-md">
                    <table className="w-full border-collapse text-[0.8em]">
                        <thead className="sticky top-0 bg-gray-100 text-left">
                            <tr>
                                <th className="px-3 py-2">#</th>
                                <th className="px-3 py-2">Status</th>
                                <th className="px-3 py-2">ID</th>
                                <th className="px-3 py-2">First Name</th>
                                <th className="px-3 py-2">Middle Name</th>
                                <th className="px-3 py-2">Last Name</th>
                                <th className="px-3 py-2">Sex</th>
                                <th className="px-3 py-2">Email</th>
                                <th className="px-3 py-2">Program</th>
                                <th className="px-3 py-2">Year Level</th>
                                <th className="px-3 py-2">School Year</th>
                                <th className="px-3 py-2">Errors</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows?.map((r) => (
                                <tr key={r.row_index} className={`border-t ${r.valid ? "" : "bg-red-50"}`}>
                                    <td className="px-3 py-1.5">{r.row_index + 1}</td>
                                    <td className="px-3 py-1.5">
                                        {r.valid
                                            ? <span className="text-green-700"><i className="fa-solid fa-circle-check"></i></span>
                                            : <span className="text-red-600"><i className="fa-solid fa-circle-exclamation"></i></span>}
                                    </td>
                                    <td className="px-3 py-1.5">{r.data.id}</td>
                                    <td className="px-3 py-1.5">{r.data.first_name}</td>
                                    <td className="px-3 py-1.5">{r.data.middle_name}</td>
                                    <td className="px-3 py-1.5">{r.data.last_name}</td>
                                    <td className="px-3 py-1.5">{r.data.sex}</td>
                                    <td className="px-3 py-1.5">{r.data.email}</td>
                                    <td className="px-3 py-1.5">{r.data.program}</td>
                                    <td className="px-3 py-1.5">{r.data.year_level}</td>
                                    <td className="px-3 py-1.5">{r.data.school_year}</td>
                                    <td className="px-3 py-1.5 text-red-600">{r.errors?.join(" ")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

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
        </UpModal>
    )
}
export default CsvStudentPreviewModal
