import AuthLayout from "@/Layouts/auth-layout"
import ReferralList from "@/Components/list/referral-list"
import { useReload } from "@/context-provider/reload-provider"
import { useState } from "react"
import { Head, router } from "@inertiajs/react"
import Btn from "@/Components/button/normal-btn"
import ViewReferralModal from "@/Components/modal/view/view-referral-modal"

const Referral = (props) => {
    const [viewReferral, openViewReferral] = useState(false),
          [id, setId] = useState('')

    const { loadRegister } = useReload()

    const setViewReferralId = (i) => {
        openViewReferral(true)
        setId(i)
    }
    return (
        <>
        <Head title="Referral" />
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
                            onclick={() => router.visit('/referral/report')}
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
                        type={props.user.role}
                    />
                </div>
            </div>
        </div>
        </>
    )
}

Referral.layout = (page) => <AuthLayout user={page.props.user} program={page.props.program_name}>{page}</AuthLayout>

export default Referral