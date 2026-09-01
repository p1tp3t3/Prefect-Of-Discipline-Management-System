import Btn from "@/Components/button/normal-btn"
import TardyReportList from "@/Components/list/tardy-report-list"

const TardyReport = (props) => {
    return (
        <>
        <div className="flex justify-end">
            <Btn onclick={() => props.openGenerateReport(true)}>
                <i className="fa-solid fa-file"></i> Generate Report
            </Btn>
        </div>
        <div className="grid gap-3">
            <div className="overflow-x-auto w-full scroll-smooth">
                <TardyReportList list={props.report} events={props.events} />
            </div>
        </div>
        </>
    )
}

export default TardyReport