import AuthLayout from "@/Layouts/auth-layout"
import { useState } from "react"
import RequestAbsentFormModal from "@/Components/modal/submission-form/request-absent-form-modal"
import AbsentFormList from "@/Components/list/absent-form-list"
import AbsentFormRequestList from "@/Components/list/absent-form-request-list"
import Reload from "@/Components/reload/reload"
import ViewAbsentFormModal from "@/Components/modal/view/view-absent-form-modal"
import { APIRequest } from "@/others/classes/api-req"
import TabBtn from "@/Components/button/tab-btn"
import { router } from "@inertiajs/react"
import NoteAbsentFormModal from "@/Components/modal/submission-form/note-absent-form-modal"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { showWarningModal } from "@/others/function"
import SetReasonModal from "@/Components/modal/submission-form/set-reason-modal"

const PrefectAbsentForm = (props) => {
    const MySwal = withReactContent(Swal)
    const url = new URLSearchParams(window.location.search)

    const [id, setId] = useState('')
    const [lstOption, setLstOption] = useState(url.has('status') ? url.get('status') : 'req-current')
    const [absent_form_list, setAbsentFormRequestList] = useState(props.absent_form_request_list)
    const [viewAbsentForm, openViewAbsentForm] = useState(false)
    const [noteAbsent, openNoteAbsent] = useState(false)
    const [reload, setReload] = useState(false)
    const [reloadType, setReloadType] = useState("")
    const [reloadLabel, setReloadLabel] = useState("")
    const [rejectReason, openRejectReason] = useState(false)
    const [data, setData] = useState({
        reason: ''
    })

    const option = [
        { val: 'req-current', label: 'Submitted Absent Forms' },
        { val: 'noted', label: 'Noted Absent Forms' }
    ]

    const handleOption = (type) => {
        const url = window.location.pathname
        router.visit(`${url}?status=${type === 'req-current' ? 'req-current' : 'noted'}`)
    }

    const setEvents = (i, type) => {
        const api = new APIRequest(null, 'post', {}, setAbsentFormRequestList)
        switch (type) {
            case 'confirm':
                setId(i)
                openNoteAbsent(true)
                break
            case 'cancel':
                setId(i)
                openRejectReason(true)
                break
            case 'view':
                setId(i)
                openViewAbsentForm(true)
                break
        }
    }

    const successConfirm = () => loadRegister(true, 'success', 'Absent Form Noted Successfully')
    const successCancel = () => loadRegister(true, 'success', 'Absent Form Rejected Successfully')
    const errorConfirm = () => loadRegister(true, 'error', 'Failed to Approve Absent Form')
    const errorCancel = () => loadRegister(true, 'error', 'Failed to Reject Absent Form')

    const removeLoad = () => setTimeout(() => loadRegister(false), 3000)

    const loadRegister = (r, t, l) => {
        setReload(r)
        setReloadType(t)
        setReloadLabel(l)
    }

    const isReload = () => (reload ? "opacity-1 z-50" : "opacity-0 z-[-1]")

    return (
        <>
            <Reload
                transition={isReload()}
                type={reloadType}
                label={reloadLabel}
                onClose={setReload}
            />
            <NoteAbsentFormModal
                close={noteAbsent}
                closeModal={openNoteAbsent}
                pd={['px-10', 'py-7']}
                isEnableOuterClose={true}
                reload={loadRegister}
                id={id}
                setter={setAbsentFormRequestList}
            />
            <SetReasonModal
                close={rejectReason}
                closeModal={openRejectReason}
                pd={["px-10", "py-7"]}
                isEnableOuterClose={true}
                title='Reason to Reject this Absent Form'
                data={data}
                setData={setData}
                sendData={() => {
                    loadRegister(true, 'text-wait', 'Rejecting Absent Form')
                    const api = new APIRequest(`/prefect/absent-form/verify/${id}/cancel`, 'post', { reason: data.reason }, ()=>{}, successCancel, errorCancel)
                    api.fetchData()
                }}
                warning={{ title: 'Are You Sure You Want To Reject This Absent Form?' , btn: 'Reject Absent Form' }}
            />
            <ViewAbsentFormModal
                close={viewAbsentForm}
                closeModal={openViewAbsentForm}
                pd={['px-10', 'py-7']}
                isEnableOuterClose={true}
                id={id}
            />
                <div className="w-full py-4">
                    <div className="w-full grid gap-5 relative">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-3">
                            <h1 className="text-[1.3em] sm:text-[1.5em] font-bold">STUDENT ABSENT FORMS</h1>
                        </div>

                        {/* Tabs */}
                        <div className="w-full overflow-x-auto">
                            <TabBtn
                                list={option}
                                option={lstOption}
                                handleSelect={handleOption}
                                className="h-[2.2rem]"
                            />
                        </div>

                        {/* Table / List Section */}
                        <div className="w-full bg-white rounded-md shadow-sm shadow-black/20 overflow-x-auto">
                            <div className="min-w-[35rem]">
                                <AbsentFormRequestList
                                    style={true}
                                    list={absent_form_list.data}
                                    events={setEvents}
                                    noted={new URLSearchParams(window.location.search).get('status') === 'noted'}
                                />
                            </div>
                        </div>
                    </div>
                </div>
        </>
    )
}

PrefectAbsentForm.layout = (page) => <AuthLayout user={page.props.user}>{page}</AuthLayout>

export default PrefectAbsentForm
