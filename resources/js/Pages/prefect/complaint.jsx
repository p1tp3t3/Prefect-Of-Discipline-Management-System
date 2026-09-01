import AuthLayout from "@/Layouts/auth-layout"
import IssueComplaintModal from "@/Components/modal/submission-form/issue-complaint-modal"
import ComplaintList from "@/Components/list/complaint-list"
import { useState } from "react"
import DropdownField from "@/Components/input/dropdown"
import Reload from "@/Components/reload/reload"
import ViewComplaintModal from "@/Components/modal/view/view-complaint-modal"
import IssueViolationModal from "@/Components/modal/submission-form/issue-violation-modal"
import { APIRequest } from "@/others/classes/api-req"
import Btn from "@/Components/button/normal-btn"
import TabBtn from "@/Components/button/tab-btn"
import { router } from "@inertiajs/react"
import SearchUserBar from "@/Components/input/search-user-bar"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { change, showWarningModal } from "@/others/function"
import ActionBtn from "@/Components/button/action-btn"
import SetReasonModal from "@/Components/modal/submission-form/set-reason-modal"
import IssueViolationModal2 from "@/Components/modal/submission-form/issue-violation-modal2"

const PrefectComplaint = (props) => {
  const url = new URLSearchParams(window.location.search)

  const [search, setSearch] = useState("")
  const [issueComplaint, openIssueComplaint] = useState(false)
  const [viewComplaint, openViewComplaint] = useState(false)
  const [complainant_id, setComplainantId] = useState("")
  const [id, setId2] = useState('')
  const [data, setData] = useState({
    complainant: props.user.id,
    complainant_name: "",
    subject: "",
    complaint_incident: "",
    complaint_possible_offense: [],
    complaint_description: "",
  })
  const [data2, setData2] = useState({
    reason: ''
  })
  const [complaint, setComplaint] = useState(null)
  const [rejectReason, openRejectReason] = useState(false)
  const [issueViolation, openIssueViolation] = useState(false)
  const [reload, setReload] = useState(false)
  const [reloadType, setReloadType] = useState("")
  const [reloadLabel, setReloadLabel] = useState("")
  const [complaintList, setComplaintList] = useState(props.complaint_list)
  const [select, enableSelect] = useState(false)
  const [select2, enableSelect2] = useState(false)
  const [choose, setChoose] = useState(url.get("status") || "all")
  const params = new URLSearchParams(window.location.search)
  const [role, setRole] = useState(params.get("role") || "all")
  const [year, setYear] = useState(params.get("year") || "all")
  const optionTab = [
    {
      val: "all",
      label: "All Complaints",
      icon: "list", // 📋 icon
      colorHighlight: "bg-blue-600 text-white",
      borderColor: "border-blue-600",
      textColor: "text-blue-600",
      hover: "hover:bg-blue-100",
    },
    {
      val: "pending",
      label: "Pending",
      icon: "circle-pause", // ⏸️ icon
      colorHighlight: "bg-yellow-500 text-white",
      borderColor: "border-yellow-500",
      textColor: "text-yellow-500",
      hover: "hover:bg-yellow-100",
    },
    {
      val: "ongoing",
      label: "Ongoing",
      icon: "rotate-right", // 🔄 icon
      colorHighlight: "bg-orange-500 text-white",
      borderColor: "border-orange-500",
      textColor: "text-orange-500",
      hover: "hover:bg-orange-100",
    },
  ];


  const handleSearch = (e) => setSearch(e.target.value)
  const handleChange = (e) => change(e, setData)
  const isReload = () => (reload ? "opacity-1 z-50" : "opacity-0 z-[-1]")
  const loadRegister = (r, t, l) => {
    setReload(r)
    setReloadType(t)
    setReloadLabel(l)
  }

  const setId = (id, type, obj = null) => {
    setComplainantId(id)
    if (type === "c") {
      openViewComplaint(true)
    } else if (type === "v") {
      setComplaint(obj)
      openIssueViolation(true)
    }
  }
  const setRequestActionEvent = (type, id) => {
          let route = '',
              confirmTxt = '',
              confirm = false,
              label = '',
              btn = ''
              
          switch(type) {
              case 'confirm':
                  route = `/complaint/verify/${id}/confirm`
                  confirmTxt = 'Comfirming the Complaint'
                  label = 'Are You Sure You Want To Approve The Complaint?'
                  btn = 'Approve Complaint'
                  confirm = true
                  showWarningModal(
                      label,
                      btn,
                      'Cancel',
                      () => {
                          loadRegister(true, "text-wait", confirmTxt)
                          const callBack = (confirm) ? successConfirm : successCancel
                          const api = new APIRequest(route, 'post', {}, setter, callBack, error)
                          api.fetchData()
                      }
                  )
                  break
              case 'cancel':
                  setId2(id)
                  openRejectReason(true)
                  break
          }
      }

  const handleAction = (type) => {
    let route = '',
        confirmTxt = '',
        confirm = false,
        label = '',
        btn = ''
        
    switch(type) {
        case 'approve':
            confirmTxt = 'Approving the Complaint'
            label = 'Are You Sure You Want To Approve The Selected Complaint?'
            btn = 'Approve Complaint'
            confirm = true
            break
        case 'reject':
            confirmTxt = 'Rejecting the Complaint'
            label = 'Are You Sure You Want To Reject The Selected Complaint?'
            btn = 'Reject Complaint'
            confirm = false
            break
    }
    showWarningModal(
        label,
        btn,
        'Cancel',
        () => {
            const checkboxes = document.querySelectorAll(
              'input[name="selected-row"]:checked'
            );
            const ids = Array.from(checkboxes).map((checkbox) => checkbox.value);
            const param = new URLSearchParams(window.location.search);
            const data = { ids: ids, action: type, page: param.get("page") || 1 };

            loadRegister(true, "text-wait", confirmTxt)
            const callBack = (confirm) ? successConfirm : successCancel
            const api = new APIRequest(`/complaint/select/${type}`, 'post', data, setter, callBack, error)
            api.fetchData()
        }
    )
  }

  const setter = (s) => setComplaintList(s.complaint)
  const successViolation = () =>
    loadRegister(true, "success", "Complaint Resolved Successfully")
  const errorViolation = () =>
    loadRegister(true, "error", "Failed to Resolve Complaint")
  const successConfirm = () =>
    loadRegister(true, "success", "Complaint Approved Successfully")
  const successCancel = () =>
    loadRegister(true, "success", "Complaint Rejected Successfully")
  const error = () =>
    loadRegister(true, "error", "Failed to Perform Action")

  const userType = [
    { val: "student", label: "Student" },
    { val: "prefect", label: "Prefect" },
    { val: "faculty", label: "Faculty" },
    { val: "program_head", label: "Program Head" },
    { val: "staff", label: "Staff" },
    { val: "parent", label: "Parent" },
  ]

  const yearDropdown = () => {
    const l = []
    const date = new Date()
    for (let a = date.getFullYear(); a >= 2024; a--) {
      l.push({ value: `${a} - ${a + 1}`, label: `${a} - ${a + 1}` })
    }
    return l
  }

  const handleSelect = (type) => {
    if (choose !== type) {
      const url = window.location.pathname
      router.visit(`${url}?status=${type}`)
      setChoose(type)
    }
  }

  const handleFilterChange = (field, value) => {
    const link = window.location.pathname
    const newActionType = field === "role" ? value : role
    const newDate = field === "year" ? value : year
    router.visit(`${link}?role=${newActionType}&year=${newDate}`)
  }
  const selectAllRow = (e) => {
    const checked = e.target.checked;
    const checkboxes = document.querySelectorAll('input[name="selected-row"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = checked
    })
  }

  return (
    <>
      <Reload
        transition={isReload()}
        type={reloadType}
        label={reloadLabel}
        onClose={setReload}
      />

      {/* Modals */}
      <IssueViolationModal2
        close={issueViolation}
        closeModal={openIssueViolation}
        pd={["px-10", "py-7"]}
        reload={loadRegister}
        success={successViolation}
        error={errorViolation}
        isEnableOuterClose={true}
        violation_list={props.violation_list}
        setComplaint={setComplaintList}
        complaint={complaint}
      />
      <SetReasonModal
        close={rejectReason}
        closeModal={openRejectReason}
        pd={["px-10", "py-7"]}
        isEnableOuterClose={true}
        title='Reason to Reject this Complaint'
        data={data2}
        setData={setData2}
        sendData={() => {
          loadRegister(true, "text-wait", 'Rejecting Complaint Is Processing')
          const api = new APIRequest(`/complaint/verify/${id}/cancel`, 'post', { reason: data2.reason }, setter, successCancel, error)
          api.fetchData()
        }}
        warning={{ title: 'Are You Sure You Want To Reject This Complaint?' , btn: 'Reject Complaint' }}
      />
      <ViewComplaintModal
        close={viewComplaint}
        closeModal={openViewComplaint}
        pd={["px-10", "py-7"]}
        isEnableOuterClose={true}
        complainant={complainant_id}
        usr={props.user}
      />
      <IssueComplaintModal
        close={issueComplaint}
        closeModal={openIssueComplaint}
        val={data}
        setter={setData}
        pd={["px-5", "py-7"]}
        isEnableOuterClose={true}
        program={props.program}
        student_list={props.students}
        reload={loadRegister}
        change={handleChange}
        user={props.user}
        all_users={props.all_users}
        direct_user_id={props.user.id}
        incident_list={props.incident_list}
      />

        <div className="w-full py-4">
          <div className="w-full grid gap-5 relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-3">
                <h1 className="text-[1.3em] sm:text-[1.5em] font-bold">COMPLAINT</h1>
                <Btn onclick={() => openIssueComplaint(true)}>
                  Report Complaint
                </Btn>
            </div>
              
            {/* Search and Filters */}
            <div className="grid gap-3">
              <div className="flex flex-wrap gap-3 items-center">
                {/* Dropdowns */}
                <div className="flex md:flex-nowrap gap-3 w-full md:w-auto justify-start md:justify-end">
                  <div className="w-full sm:w-auto">
                    <DropdownField
                      default={{ val: "all", label: "All Complainants" }}
                      list={userType}
                      onChange={(e) =>
                        handleFilterChange("role", e.target.value)
                      }
                      val={role}
                    />
                  </div>
                  <div className="w-full sm:w-auto">
                    <DropdownField
                      default={{ val: "all", label: "All Years" }}
                      list={yearDropdown()}
                      onChange={(e) =>
                        handleFilterChange("year", e.target.value)
                      }
                      val={year}
                    />
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="overflow-x-auto flex justify-between items-center">
                <TabBtn
                  list={optionTab}
                  option={choose}
                  handleSelect={handleSelect}
                  className="h-[2.2rem]"
                />
                {/* Right side */}
                {url.get('status') == 'pending' &&
                <div className="flex flex-wrap gap-3 items-center">
                  <ActionBtn
                    className="bg-blue-700 hover:bg-blue-800"
                    onClick={() => enableSelect2(!select2)}
                  >
                    <i
                      className={`fa-solid ${
                        select2 ? "fa-xmark" : "fa-check"
                      }`}
                    ></i>
                  </ActionBtn>
                  {select2 && (
                    <div className="flex gap-5 items-center flex-wrap">
                      <div className="flex gap-2 items-center text-[0.8em]">
                        <input type="checkbox" id="select-all" onClick={selectAllRow} />
                        <label htmlFor="select-all">Select All</label>
                      </div>
                      <div className="flex gap-2 text-[0.9em]">
                        <ActionBtn 
                            className={"bg-green-600 text-white hover:bg-green-700"}
                            onClick={() => handleAction('approve')}
                        >
                            Approve
                        </ActionBtn>
                        <ActionBtn 
                            className={"bg-red-600 text-white hover:bg-red-700"}
                            onClick={() => handleAction('reject')}
                        >
                            Reject
                        </ActionBtn>
                      </div>
                    </div>
                  )}
                </div>}
              </div>
            </div>

            {/* Complaint List */}
            <div className="w-full bg-white rounded-md shadow-black/20 shadow-sm overflow-x-auto">
              <div className="w-full px-5 py-3 min-w-[800px]">
                <ComplaintList
                  type="prefect"
                  list={complaintList}
                  setId={setId}
                  select={select}
                  select2={select2}
                  actionEvent={setRequestActionEvent}
                />
              </div>
            </div>
          </div>
        </div>
    </>
  )
}

PrefectComplaint.layout = (page) => <AuthLayout user={page.props.user}>{page}</AuthLayout>

export default PrefectComplaint
