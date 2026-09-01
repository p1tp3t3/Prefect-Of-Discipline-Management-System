import UpModal from "../up-modal"
import { useEffect, useState, useRef } from "react"
import { configBroadcast } from "@/others/function"

const CsvStudentProgressModal = ({ close, closeModal, batchId, total, userId, onDone }) => {
    const [processed, setProcessed] = useState(0)
    const [log, setLog] = useState([])
    const [summary, setSummary] = useState(null)
    const logEndRef = useRef(null)

    useEffect(() => {
        if (!close || !userId || !batchId) return

        setProcessed(0)
        setLog([])
        setSummary(null)

        const channel = `job-status.progress.user.${userId}`

        configBroadcast('private', channel, 'CSV row progress', '.CsvRowProcessed', (e) => {
            if (e.batch_id !== batchId) return
            setProcessed(e.processed_count)
            setLog((prev) => [...prev, e])
        })

        configBroadcast('private', channel, 'CSV batch completed', '.CsvBatchCompleted', (e) => {
            if (e.batch_id !== batchId) return
            setSummary(e)
        })
    }, [close, userId, batchId])

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [log])

    const percent = total > 0 ? Math.min(100, Math.round((processed / total) * 100)) : 0
    const isDone = summary != null

    return (
        <UpModal
            close={close}
            pd={["px-6", "py-5"]}
            isEnableOuterClose={false}
            closeModal={closeModal}
            bgColor="bg-white"
            w="w-[45rem]"
        >
            <div className="w-full grid gap-4">
                <div>
                    <h1 className="text-[1.2em]">
                        <b>{isDone ? "Account Generation Complete" : "Generating Student Accounts..."}</b>
                    </h1>
                    <p className="text-[0.85em] text-gray-600">
                        {processed} / {total} processed
                    </p>
                </div>

                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-300 ${isDone ? (summary.error_count > 0 ? "bg-yellow-500" : "bg-green-600") : "bg-blue-600"}`}
                        style={{ width: `${percent}%` }}
                    />
                </div>
                <div className="text-right text-[0.8em] text-gray-600">{percent}%</div>

                <div className="w-full max-h-[16rem] overflow-y-auto border rounded-md text-[0.8em]">
                    {log.map((e, i) => (
                        <div
                            key={i}
                            className={`px-3 py-1.5 border-b flex justify-between gap-3 ${e.status === "error" ? "bg-red-50 text-red-700" : "text-gray-700"}`}
                        >
                            <span>Row {e.row_index + 1} &middot; {e.id_number} {e.full_name}</span>
                            <span>{e.status === "error" ? (e.message || "Failed") : "OK"}</span>
                        </div>
                    ))}
                    <div ref={logEndRef} />
                </div>

                {isDone &&
                <div className="grid gap-2">
                    <p className="text-[0.9em]">
                        <span className="text-green-700 font-semibold">{summary.success_count} succeeded</span>
                        {", "}
                        <span className="text-red-600 font-semibold">{summary.error_count} failed</span>
                    </p>
                    {summary.error_count > 0 &&
                    <div className="border rounded-md max-h-[10rem] overflow-y-auto">
                        {summary.errors.map((err, i) => (
                            <div key={i} className="px-3 py-1.5 border-b text-[0.8em] text-red-700">
                                Row {err.row_index + 1} ({err.id_number}): {err.message}
                            </div>
                        ))}
                    </div>}
                    <div className="flex justify-end pt-2">
                        <button
                            type="button"
                            onClick={() => { closeModal(false); onDone(); }}
                            className="px-4 py-2 text-[0.9em] rounded bg-blue-700 text-white hover:bg-blue-800"
                        >
                            Close
                        </button>
                    </div>
                </div>}
            </div>
        </UpModal>
    )
}
export default CsvStudentProgressModal
