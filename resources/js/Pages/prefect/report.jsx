import TabBtn from "@/Components/button/tab-btn"
import AuthLayout from "@/Layouts/auth-layout"
import { useRef, useState } from "react"
import ArchiveList from "@/Components/list/archive-list"
import ViewComplaintModal from "@/Components/modal/view/view-complaint-modal"
import ViewReferralModal from "@/Components/modal/view/view-referral-modal"
import IncidentReport from "./report/incident-report"
import GenerateReportModal from "@/Components/modal/submission-form/generate-report-modal"
import Reload from "@/Components/reload/reload"
import { APIRequest } from "@/others/classes/api-req"
import ViewReportModal from "@/Components/modal/view/view-report-modal"
import AnalyticalReport from "./report/risk-analysis"
import ViewAbsentFormModal from "@/Components/modal/view/view-absent-form-modal"
import { showWarningModal, toTitleCase } from "@/others/function"
import ViolationReport from "./report/violation-report"
import TardyReport from "./report/tardy-report"

const PrefectReport = (props) => {
    const optionTab = [
        { val: 'incident-report', label: 'Incident Report' },
        { val: 'violation-report', label: 'Violation Report' },
        { val: 'tardy-report', label: 'Tardy Report' },
        { val: 'appointment-report', label: 'Appointment Report' },
        { val: 'gatepass-report', label: 'Gate Pass Report' },
        { val: 'analytics', label: 'Analytical Report' },
    ]

    const [choose, setChoose] = useState('incident-report')
    const [choose2, setChoose2] = useState('all'),
          [complaint, openViewComplaint] = useState(false),
          [absent, openAbsentForm] = useState(false),
          [referral, openViewReferral] = useState(false),
          [report, openGenerateReport] = useState(false),
          [viewReport, openViewReport] = useState(false),
          [id, setDocId] = useState(''),

          [report_list, setReportList] = useState(props.report),
          [violation_report_list, setViolationReportList] = useState(props.violation_report.data),
          [tardy_report_list, setTardyReportList] = useState(props.tardy_report),

          [archive_list, setArchiveList] = useState(props.archive),

          [reload, setReload] = useState(false),
          [reloadType, setReloadType] = useState(""),
          [reloadLabel, setReloadLabel] = useState("")
          
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
    const isReload = () => {
        return reload ? "opacity-1 z-50" : "opacity-0 z-[-1]";
    };
    const loadRegister = (r, t, l) => {
        setReload(r);
        setReloadType(t);
        setReloadLabel(l);
    };
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
                const api = new APIRequest(
                    '/prefect/archive/recover', 
                    'post', 
                    data, 
                    setArchiveList,
                    () => loadRegister(true, 'success', `${toTitleCase(t)} No. ${i} Recover Successfully`),
                    () => loadRegister(true, 'error', `Failed to Recover ${toTitleCase(t)} No. ${i}`)
                )
                api.fetchData()
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
                const api = new APIRequest('/prefect/report/delete', 'post', { id: i }, (e) => setReportList(e.data))
                api.fetchData()
                break
        }
    }
    
    return (
        <>
        <Reload
            transition={isReload()}
            type={reloadType}
            label={reloadLabel}
            onClose={setReload}
        />
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
        />
            <div className="w-full py-4">
                <div className="w-full grid gap-5 relative">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-3">
                        <h1 className="text-[1.3em] sm:text-[1.5em] font-bold">REPORT</h1>
                    </div>
                    <div className="grid gap-5">
                        <TabBtn 
                            list={optionTab}
                            option={choose} 
                            handleSelect={handleSelect} 
                            className='h-[2.2rem]'
                        />
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
                        {choose == 'analytics' && 
                        <AnalyticalReport 
                            quantity={[props.incident, props.resolved, props.violation_count]}
                            top5Student={props.top5_students} 
                            incidentLineGraph={props.incident_line_graph}
                            violationProgram={props.violation_program}
                        />}
                    </div>
                </div>
            </div>
        </>
    )
}

PrefectReport.layout = (page) => <AuthLayout user={page.props.user}>{page}</AuthLayout>

export default PrefectReport