import AuthLayout from "@/Layouts/auth-layout"
import { useEffect, useState } from "react"
import ReferralList from "@/Components/list/referral-list"
import ViewReferralModal from "@/Components/modal/view/view-referral-modal"
import IssueReferralModal from "@/Components/modal/submission-form/issue-referral-modal"
import Btn from "@/Components/button/normal-btn"
import { BroadcastManager } from "@/others/classes/broadcast-manager"
import TabBtn from "@/Components/button/tab-btn"
import { router } from "@inertiajs/react"
import { APIRequest } from "@/others/classes/api-req"
import Reload from "@/Components/reload/reload"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { showOutputModal, showWarningModal } from "@/others/function"

const PrefectReferral = (props) => {
    const MySwal = withReactContent(Swal)
    const url = new URLSearchParams(window.location.search)

    const [viewReferral, openViewReferral] = useState(false),
          [id, setId] = useState(''),
          [reload, setReload] = useState(false),
          [issueReferral, openIssueReferral] = useState(false),
          [referral_req_list, setReferralRequestList] = useState(props.referral_request.data),
          [referral_list, setReferralList] = useState(props.referral.data),
          [choose, setChoose] = useState((url.has('status') ? url.get('status') : 'req')),
          [reloadType, setReloadType] = useState(""),
          [reloadLabel, setReloadLabel] = useState(""),

          [data, setData] = useState({
              referrer_id: props.user.id,
              referred_student_id: '',
              referral_reason: ''
          })
    
    const optionTab = [
        { val: 'req', label: 'Pending Referrals' },
        { val: 'approve', label: 'Approved  Referrals' },
    ]

    const setViewReferralId = (i) => {
        openViewReferral(true)
        setId(i)
    }
    const isReload = () => {
        return reload ? "opacity-1 z-50" : "opacity-0 z-[-1]";
    }
    const loadRegister = (r, t, l) => {
        setReload(r);
        setReloadType(t);
        setReloadLabel(l);
    }
    const handleSelect = (type) => {
        if (choose != type) {
            const url = window.location.pathname;
            router.visit(`${url}?status=${type}`)
            setChoose(type)
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
                route = `/referral/verify/${id}/confirm`
                confirmTxt = 'Comfirming the Referral'
                label = 'Are You Sure You Want To Approve The Referral?'
                btn = 'Approve Referral'
                confirm = true
                break
            case 'send-guidance':
                route = `/referral/verify/${id}/send-guidance`
                confirmTxt = 'Sending the Referral to the Guidance'
                confirm = true
                break
            case 'cancel':
                route = `/referral/verify/${id}/cancel`
                confirmTxt = 'Cancelling the Referral'
                label = 'Are You Sure You Want To Reject The Referral?'
                btn = 'Reject Referral'
                confirm = false
                break
        }
        showWarningModal(
            label,
            btn,
            'Cancel',
            () => {
                loadRegister(true, "text-wait", confirmTxt)
                const callBack = (confirm) ? successConfirm : successCancel
                const api = new APIRequest(route, 'post', {}, setter, callBack, (confirm) ? errorApprove : errorCancel)
                api.fetchData()
            }
        )
    }

    const successConfirm = (e) => {
        loadRegister(true, '')
        showOutputModal(
            "Referral Confirmed Successfully",
            's',
            () => loadRegister(false)
        )
    }
    const successCancel = (e) => {
        loadRegister(true, '')
        showOutputModal(
            "Referral Rejected Successfully",
            's',
            () => loadRegister(false)
        )
    }
    const errorApprove = () => {
        loadRegister(true, '')
        showOutputModal(
            "Failed to Approve Referral",
            'e',
            () => loadRegister(false)
        )
    }
    const errorCancel = () => {
        loadRegister(true, '')
        showOutputModal(
            "Failed to Reject Referral",
            'e',
            () => loadRegister(false)
        )
    }
    const setter = (s) => {
        setReferralList(s.data)
    }

    return (
        <>
            <Reload
                transition={isReload()}
                type={reloadType}
                label={reloadLabel}
                onClose={setReload}
            />
            <IssueReferralModal 
                close={issueReferral} 
                closeModal={openIssueReferral} 
                pd={['px-10', 'py-7']}
                isEnableOuterClose={true} 
                setter={setData}
                val={data}
                reload={loadRegister}
                student_list={props.students}
                cntr={false}
                user={props.user}
            />
            <ViewReferralModal 
                close={viewReferral} 
                closeModal={openViewReferral} 
                pd={['px-10', 'py-7']}
                isEnableOuterClose={true} 
                setId={setViewReferralId}
                referralId={id}
            />

                <div className="w-full py-4">
                    <div className="w-full grid gap-5 relative">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-3">
                            <h1 className="text-[1.3em] sm:text-[1.5em] font-bold">REFERRAL</h1>
                            <div className="w-full sm:w-auto">
                                <Btn onclick={() => openIssueReferral(true)} className="">
                                    Report Referral
                                </Btn>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="overflow-x-auto">
                            <TabBtn 
                                list={optionTab}
                                option={choose} 
                                handleSelect={handleSelect} 
                                className="h-[2.2rem]"
                            />
                        </div>

                        {/* Table/List */}
                        <div className="flex w-full bg-white rounded-md shadow-black/20 shadow-sm overflow-x-auto">
                            <div className="w-full">
                                <ReferralList 
                                    list={referral_list}
                                    style={true} 
                                    viewReferral={setViewReferralId}
                                    type={props.user.user_type}
                                    events={setRequestActionEvent}
                                />
                            </div>
                        </div>
                    </div>
                </div>
        </>
    )
}

PrefectReferral.layout = (page) => <AuthLayout user={page.props.user} program={page.props.program_name}>{page}</AuthLayout>

export default PrefectReferral
