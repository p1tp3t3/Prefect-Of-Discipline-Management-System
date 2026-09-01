import ParentRequestList from "@/Components/list/parent-request-list"
import RegisterFamilyModal from "@/Components/modal/submission-form/register-family-modal"
import SetReasonModal from "@/Components/modal/submission-form/set-reason-modal"
import ViewParentRequestModal from "@/Components/modal/view/view-parent-request-modal"
import AuthLayout from "@/Layouts/auth-layout"
import { APIRequest } from "@/others/classes/api-req"
import { useState } from "react"

const ParentApprovalRequest = (props) => {
    const [viewParent, openParent] = useState(false),
          [rejectReason, openRejectReason] = useState(false),
          [parent, setParent] = useState(null),
          [parent_request_list, setParentRequestList] = useState(props.parent_requests),
          [id, setId] = useState(''),
          [familyRegistration, openFamilyRegistration] = useState(false)

    const [data, setData] = useState({
        reason: ''
    })

    const setEvent = (t, i, info) => {
        if(t == 'v') {
            openParent(true)
            setId(i)
        }if(t == 'a') {
            console.log(info)
            setParent(info)
            openFamilyRegistration(true)
            /*
            showWarningModal(
                'This Will Generate ' +  info.name + "'s Account And Create The Family Background. Are You Sure You Want To Approve The Request?",
                'Approve',
                'Cancel',
                () => {
                    const api = new APIRequest(
                        `/super-admin/parent-request/approve`, 
                        'post', 
                        null, 
                        setParentRequestList,
                        () => {
                            showOutputModal(
                                info.name + "'s Request Has Been Approved Successfully",
                                's',
                                () => {

                                }
                            )
                        },
                        () => {
                            showOutputModal(
                                "There Was An Error While Approving " + info.name + "'s Request",
                                'e',
                                () => {

                                }
                            )
                        }
                    )
                    api.fetchData()
                }
            ) */
        }if(t == 'r') {
            setId(i)
            openRejectReason(true)
        }
    }
    const loadRegister = () => {

    }

    return (
        <>
        <SetReasonModal
            close={rejectReason}
            closeModal={openRejectReason}
            pd={["px-10", "py-7"]}
            isEnableOuterClose={true}
            title='Reason to Reject this Parent Request'
            data={data}
            setData={setData}
            sendData={() => {
                loadRegister(true, "text-wait", 'Rejecting Parent Request Is Processing')
                const api = new APIRequest(`/super-admin/parent-register/reject/${id}`, 'post', { reason: data.reason })
                api.fetchData()
            }}
            warning={{ title: 'Are You Sure You Want To Reject This Parent Request?' , btn: 'Reject Request' }}
            />
        <RegisterFamilyModal 
            close={familyRegistration} 
            closeModal={openFamilyRegistration} 
            setter={setParent}
            pd={['px-5', 'py-7']} 
            isEnableOuterClose={true} 
            parent={parent}
        />
        {
        <ViewParentRequestModal
            close={viewParent} 
            closeModal={openParent} 
            pd={['px-5', 'py-7']}
            isEnableOuterClose={true}
            id={id}
        />}
        <div className="w-full py-4 grid gap-4">
            <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-3">
                <h1 className="text-[1.3em] sm:text-[1.5em] font-bold">PARENT REQUEST LIST</h1>
            </div>
            <div>
                <ParentRequestList
                    list={parent_request_list}
                    event={setEvent}
                />
            </div>
        </div>
        </>
    )
}

ParentApprovalRequest.layout = (page) => <AuthLayout user={page.props.user}>{page}</AuthLayout>

export default ParentApprovalRequest