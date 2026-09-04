import TabSwitcher from "@/Components/other/tab-switcher"
import AuthLayout from "@/Layouts/auth-layout"
import { useRef, useState } from "react"
import ArchiveList from "@/Components/list/archive-list"
import ViewComplaintModal from "@/Components/modal/view/view-complaint-modal"
import ViewReferralModal from "@/Components/modal/view/view-referral-modal"
import IncidentReport from "./report/incident-report"
import GenerateReportModal from "@/Components/modal/submission-form/generate-report-modal"
import { useReload } from "@/context-provider/reload-provider"
import { ReportArchiveService } from "@/others/services/report-archive-service"
import ViewReportModal from "@/Components/modal/view/view-report-modal"
import GeneratedReportsModal from "@/Components/modal/view/generated-reports-modal"
import AnalyticalReport from "./report/risk-analysis"
import ViewAbsentFormModal from "@/Components/modal/view/view-absent-form-modal"
import { showWarningModal, toTitleCase } from "@/others/function"
import ViolationReport from "./report/violation-report"
import TardyReport from "./report/tardy-report"
import AppointmentReport from "./report/appointment-report"
import GatePassReport from "./report/gatepass-report"
import { FileText } from "lucide-react"

const PrefectReport = (props) => {
    const optionTab = [
        { key: 'incident-report', label: 'Incident Report' },
        { key: 'violation-report', label: 'Violation Report' },
        { key: 'tardy-report', label: 'Tardy Report' },
        { key: 'appointment-report', label: 'Appointment Report' },
        { key: 'gatepass-report', label: 'Gate Pass Report' },
        { key: 'analytics', label: 'Analytical Report' },
    ]

    const [choose, setChoose] = useState('incident-report')
    const [choose2, setChoose2] = useState('all'),
          [complaint, openViewComplaint] = useState(false),
          [absent, openAbsentForm] = useState(false),
          [referral, openViewReferral] = useState(false),
          [report, openGenerateReport] = useState(false),
          [viewReport, openViewReport] = useState(false),
          [generatedReports, openGeneratedReports] = useState(false),
          [id, setDocId] = useState(''),

          [report_list, setReportList] = useState(props.report),
          [violation_report_list, setViolationReportList] = useState(props.violation_report.data),
          [tardy_report_list, setTardyReportList] = useState(props.tardy_report),
          [appointment_report_list, setAppointmentReportList] = useState(props.appointment_report),
          [gatepass_report_list, setGatepassReportList] = useState(props.gatepass_report),

          [archive_list, setArchiveList] = useState(props.archive)

    const { loadRegister } = useReload()
    const contentRef = useRef()

    const handleSelect = (type) => {
        if(choose != type) {
            const url = window.location.pathname;
            setChoose(type)
        }
    }
    const setId = (id, type) => {
        setDocId(id)
        if(type == 'c') {
            openViewComplaint(true)
        }if(type == 'r') {
            openViewReferral(true)
        }if(type == 'a') {
            openAbsentForm(true)
        }
    }
    const recoverDocument = (i, t, usr) => {
        const data = {
            id: i,
            type: t
        }
        showWarningModal(
            `Are You Sure You Want to Recover the Complaint of ${usr.first_name} ${usr.middle_name} ${usr.last_name}?`,
            "Recover " + toTitleCase(t),
            "Cancel",
            () => {
                loadRegister(true, 'text-wait', `Recovering ${toTitleCase(t)} No. ${i}. Please Wait`)
                ReportArchiveService.recover(
                    i, t,
                    setArchiveList,
                    () => loadRegister(true, 'success', `${toTitleCase(t)} No. ${i} Recover Successfully`),
                    () => loadRegister(true, 'error', `Failed to Recover ${toTitleCase(t)} No. ${i}`)
                )
            }
        );
    }
    const actionEvent = (i, type) => {
        switch(type) {
            case 'v':
                openViewReport(true)
                break
            case 'ed':
                break
            case 'ex':
                break
            case 'd':
                ReportArchiveService.deleteReport(i, (e) => setReportList(e.data))
                break
        }
    }
    
    return (
        <>
        <ViewAbsentFormModal
            close={absent}
            closeModal={openAbsentForm} 
            pd={['px-10', 'py-7']}
            isEnableOuterClose={true} 
            id={id}
        />
        <ViewComplaintModal 
            close={complaint} 
            closeModal={openViewComplaint} 
            pd={['px-10', 'py-7']}
            isEnableOuterClose={true} 
            complainant={id}
            usr={props.user}
        />
        <ViewReferralModal 
            close={referral} 
            closeModal={openViewReferral} 
            pd={['px-10', 'py-7']}
            isEnableOuterClose={true} 
            referralId={id}
            usr={props.user}
        />
        <ViewReportModal
            close={viewReport}
            closeModal={openViewReport}
            pd={['px-5', 'py-7']}
            isEnableOuterClose={true}
        />
        <GeneratedReportsModal
            close={generatedReports}
            closeModal={openGeneratedReports}
            pd={['px-5', 'py-7']}
            isEnableOuterClose={true}
        />
        <GenerateReportModal
            close={report} 
            closeModal={openGenerateReport} 
            pd={['px-5', 'py-7']}
            isEnableOuterClose={true} 
            reload={loadRegister}
            setter={setReportList}
            violations={props.violation_list}
            incidents={props.incident_list}
            programs={props.programs}
            students={props.students}
            schoolYears={props.school_years}
            userId={props.user.id}
        />
            <div className="w-full py-4">
                <div className="w-full grid gap-5 relative">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-3">
                        <h1 className="text-[1.3em] sm:text-[1.5em] font-bold">REPORT</h1>
                        <button
                            type="button"
                            onClick={() => openGeneratedReports(true)}
                            className="flex items-center gap-2 px-4 py-2 text-[0.9em] rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                            <FileText size="1em" />
                            Generated Reports
                        </button>
                    </div>
                    <div className="grid gap-5">
                        <TabSwitcher tabs={optionTab} value={choose} onChange={handleSelect} />
                        {choose == 'incident-report' && 
                        <IncidentReport 
                            openGenerateReport={openGenerateReport} 
                            report={report_list}  
                            events={actionEvent} 
                        />}
                        {choose == 'violation-report' && 
                        <ViolationReport
                            openGenerateReport={openGenerateReport} 
                            report={violation_report_list}  
                        />}
                        {choose == 'tardy-report' &&
                        <TardyReport
                            openGenerateReport={openGenerateReport}
                            report={tardy_report_list}
                        />}
                        {choose == 'appointment-report' &&
                        <AppointmentReport
                            openGenerateReport={openGenerateReport}
                            report={appointment_report_list}
                        />}
                        {choose == 'gatepass-report' &&
                        <GatePassReport
                            openGenerateReport={openGenerateReport}
                            report={gatepass_report_list}
                        />}
                        {choose == 'analytics' &&
                        <AnalyticalReport
                            quantity={[props.incident, props.resolved, props.violation_count]}
                            top5Student={props.top5_students}
                            incidentLineGraph={props.incident_line_graph}
                            violationProgram={props.violation_program}
                            userId={props.user.id}
                        />}
                    </div>
                </div>
            </div>
        </>
    )
}

PrefectReport.layout = (page) => <AuthLayout user={page.props.user}>{page}</AuthLayout>

export default PrefectReport