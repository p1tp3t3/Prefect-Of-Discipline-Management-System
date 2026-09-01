import AuthLayout from "@/Layouts/auth-layout"
import ReferralList from "@/Components/list/referral-list"
import Reload from "@/Components/reload/reload"
import IssueReferralModal from "@/Components/modal/submission-form/issue-referral-modal"
import { useEffect, useState } from "react"
import { Head } from "@inertiajs/react"
import Btn from "@/Components/button/normal-btn"
import ViewReferralModal from "@/Components/modal/view/view-referral-modal"

const Referral = (props) => {
    const [issueReferral, openIssueReferral] = useState(false),
          [viewReferral, openViewReferral] = useState(false),
          [reload, setReload] = useState(false),
          
          [reloadType, setReloadType] = useState(""),
          [reloadLabel, setReloadLabel] = useState(""),
          [id, setId] = useState(''),

          [data, setData] = useState({
              referrer_id: props.user.id,
              referred_student_id: '',
              referral_reason: ''
          })
    const isReload = () => {
        return reload ? "opacity-1 z-50" : "opacity-0 z-[-1]";
    }
    const setViewReferralId = (i) => {
        openViewReferral(true)
        setId(i)
    }
    const loadRegister = (r, t, l) => {
        setReload(r);
        setReloadType(t);
        setReloadLabel(l);
    };
    return (
        <>
        <Head title="Referral" />
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
        <div className="w-full py-10">
            <div className="w-full grid gap-10 relative">
                <div className="flex w-full justify-between items-center">
                    <h1 className="text-[1.3em]"><b>My Referrals</b></h1>
                    {props.user.allow_referral
                    ?
                    <div>
                        <Btn
                            onclick={() => openIssueReferral(true)}
                        >
                            Report Referral
                        </Btn>
                    </div>
                    : ''}
                </div>
                <div className="w-full">
                    <ReferralList
                        list={props.referral.data}
                        style={true}
                        viewReferral={setViewReferralId}
                        type={props.user.user_type}
                    />
                </div>
            </div>
        </div>
        </>
    )
}

Referral.layout = (page) => <AuthLayout user={page.props.user} program={page.props.program_name}>{page}</AuthLayout>

export default Referral