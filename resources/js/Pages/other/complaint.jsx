import AuthLayout from "@/Layouts/auth-layout"
import { useEffect, useState } from "react"
import IssueComplaintModal from "@/Components/modal/submission-form/issue-complaint-modal"
import EditComplaintModal from "@/Components/modal/submission-form/edit-complaint-modal"
import ComplaintList from "@/Components/list/complaint-list"
import { useReload } from "@/context-provider/reload-provider"
import { change, showWarningModal } from "@/others/function"
import ViewComplaintModal from "@/Components/modal/view/view-complaint-modal"
import { Head, router } from "@inertiajs/react"
import Btn from "@/Components/button/normal-btn"
import TabSwitcher from "@/Components/other/tab-switcher"
import { Button, Paper } from "@mui/material"
import { DataGrid } from '@mui/x-data-grid';
import QuickFilteringGrid from "@/Components/text-component"
import { List, XCircle, PauseCircle, RotateCw, Undo2 } from "lucide-react"
import { ComplaintService } from "@/others/services/complaint-service"


const Complaint = (props) => {
    const url = new URLSearchParams(window.location.search)

    const [issueComplaint, openIssueComplaint] = useState(false),
          [viewComplaint, openViewComplaint] = useState(false),
          [editComplaint, openEditComplaint] = useState(false),
          [editData, setEditData] = useState(null),
          [complainant_id, setComplainantId] = useState(''),

          [data, setData] = useState({
                complainant: props.user.id,
                subject: '',
                complaint_incident: '',
                complaint_possible_offense: [],
                complaint_description: '',
            })

    const { loadRegister } = useReload()
    const [choose, setChoose] = useState(url.get("status") || "all")

    const handleChange = (e) => {
        change(e, setData)
    }
    const optionTab = [
      { key: "all", label: "All Complaints", icon: List },
      { key: "rejected", label: "Rejected", icon: XCircle },
      { key: "pending", label: "Pending", icon: PauseCircle },
      { key: "ongoing", label: "Ongoing", icon: RotateCw },
      { key: "revoked", label: "Revoked", icon: Undo2 },
    ];
    const setId = (id) => {
        setComplainantId(id)
        openViewComplaint(true)
    }
    const handleSelect = (type) => {
        const url = window.location.pathname
        router.visit(`${url}?status=${type}`)
        setChoose(type)
      }

    const handleAction = (type, id) => {
        if (type === "revoke") {
            showWarningModal(
                'Are You Sure You Want To Revoke This Complaint? This will not delete it, but the prefect will still be able to see it.',
                'Revoke Complaint',
                'Cancel',
                () => {
                    loadRegister(true, "text-wait", "Revoking Complaint Is Processing")
                    ComplaintService.revoke(
                        id,
                        () => {},
                        () => {
                            loadRegister(true, "success", "Complaint Revoked Successfully")
                            router.reload({ only: ['complaint_list'] })
                        },
                        () => loadRegister(true, "error", "Failed to Revoke Complaint")
                    )
                }
            )
        } else if (type === "edit") {
            ComplaintService.getComplaintInfo(id, (d) => {
                setEditData(d)
                openEditComplaint(true)
            })
        }
    }



    return (
        <>
        <Head title="Complaint" />
        <ViewComplaintModal
            close={viewComplaint}
            closeModal={openViewComplaint}
            pd={['px-10', 'py-7']}
            isEnableOuterClose={true}
            complainant={complainant_id}
            usr={props.user}
        />
        <EditComplaintModal
            close={editComplaint}
            closeModal={openEditComplaint}
            isEnableOuterClose={true}
            data={editData}
            student_list={props.students}
            incident_list={props.incident_list}
            reload={loadRegister}
        />
        {props.user.allow_complaint
        ?
        <IssueComplaintModal 
            close={issueComplaint} 
            closeModal={openIssueComplaint} 
            val={data}
            setter={setData}
            pd={['px-5', 'py-7']}
            isEnableOuterClose={true} 
            program={props.program}
            student_list={props.students}
            reload={loadRegister}
            change={handleChange}
            direct_user_id={props.user.id}
            user={props.user}
            incident_list={props.incident_list}
        />
        : ''}
        <div className="w-full py-4">
            <div className="w-full grid gap-5 relative">
                {/* Header */}
                <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-3">
                    <h1 className="text-[2em] sm:text-[1.5em] font-bold">COMPLAINT</h1>
                    {(props.user.allow_complaint)
                    ?
                    <div className="flex gap-3">
                        <Btn onclick={() => openIssueComplaint(true)} >
                            Report Complaint
                        </Btn>
                    </div>
                    : ''}
                </div>
                <div>
                    <TabSwitcher tabs={optionTab} value={choose} onChange={handleSelect} />
                </div>
                {/* Complaint List */}
                <div className="w-full bg-white rounded-md shadow-black/20 shadow-sm overflow-x-auto">
                    <div className="w-full px-5 py-3 min-w-[800px]">
                        <ComplaintList
                            type={props.user.user_type}
                            user={props.user}
                            style={true}
                            list={props.complaint_list}
                            setId={setId}
                            actionEvent={handleAction}
                        />
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

Complaint.layout = (page) => <AuthLayout user={page.props.user} program={page.props.program_name}>{page}</AuthLayout>

export default Complaint