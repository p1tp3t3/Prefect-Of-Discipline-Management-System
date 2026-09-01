import { useState } from "react"
import QuantityCard from "@/Components/card/qntty-statistic-card"
import BarGraph from "@/Components/card/bar-graph-statistic-card"
import Btn from "@/Components/button/normal-btn"
import IncidentReportList from "@/Components/list/incident-report-list"
import ViolationReportList from "@/Components/list/violation-report-list"

const ViolationReport = (props) => {
    return (
        <>
        <div className="flex justify-end">
            <Btn onclick={() => props.openGenerateReport(true)}>
                <i className="fa-solid fa-file"></i> Generate Report
            </Btn>
        </div>
        <div className="grid gap-3">
            <div className="overflow-x-auto w-full scroll-smooth">
                <ViolationReportList list={props.report} events={props.events} />
            </div>
        </div>
        </>
    )
}

export default ViolationReport