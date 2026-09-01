import { APIRequest } from "@/others/classes/api-req"
import UpModal from "../up-modal"
import { useEffect, useState } from "react"
import SelectedUser from "@/Components/other/selected-user"
import { getProfilePic, readableDate, readableTime, toTitleCase } from "@/others/function"
import CircleReload from "@/Components/reload/circle-reload"
import { Link } from "@inertiajs/react"

const ViewReferralModal = (props) => {
    const [data, setData] = useState(null),
          [reload, setReload] = useState(false)
          
    useEffect(() => {
        if(props.close) {
            setReload(true)
            getReferralInfo()
        }else {
            setReload(false)
            setData(null)
        }
    }, [props.close])

    const getReferralInfo = () => {
        const id = props.referralId
        const api = new APIRequest(`/referral/get/${id}`, 'post', {}, setData, ()=>{}, ()=>{})
        api.fetchData()
    }

    return (
        <UpModal
            close={props.close} 
            closeModal={props.closeModal}
            isEnableOuterClose={props.isEnableOuterClose}
            pd={props.pd}
            bgColor='bg-white'
            w='w-[36rem]'>  {/* Increased width and made responsive */}
            <div className="w-full">  {/* Added padding */}
                <div className="grid gap-4">
                    {(data != null)
                    ?
                    <Body data={data} />
                    :
                    reload &&
                    <div className="w-full flex justify-center py-8">
                        <CircleReload size={3} />
                    </div>}
                </div>
            </div>
        </UpModal>
    )
}

const Body = ({ data }) => {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold">{toTitleCase(data.user.profile?.first_name)}'s Referral</h1>
            </div>
            <div>
                <h2 className="text-lg font-semibold">Reported Since</h2>
                <p className="text-sm">{readableDate(data.created_at)} ({readableTime(data.created_at)})</p>
            </div>
            {data.confirmed_at &&
            <div>
                <h2 className="text-lg font-semibold">Approved Since</h2>
                <p className="text-sm">{readableDate(data.confirmed_at)} ({readableTime(data.confirmed_at)})</p>
            </div>}
            <div className="grid gap-6 md:grid-cols-2">  {/* Responsive grid for profiles */}
                <ProfileSection
                    title='Referrer'
                    data={data.user} />
                <ProfileSection 
                    title='Referred Student'
                    data={data.referred_student}
                    data_list={data.referral_referred_student} />
            </div>
            <div>
                <h2 className="text-lg font-semibold mb-3">Reason for the Referral</h2>
                <div className="text-sm h-60 overflow-y-auto overflow-hidden border rounded p-3 bg-gray-50">
                    <p>{data.reason_description}</p>
                </div>
            </div>
        </div>
    )
}

const ProfileSection = ({ title, data, data_list = null }) => {
    return (
        <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            {data_list != null
            ?
            data_list.length != 0
            ?
            <div className="grid gap-1">
                {data_list.map((e, i) =>
                <Link href={`/profile/${e.user.username}`} className="block">
                    <SelectedUser
                        src={getProfilePic(e.user.profile?.profile_picture, e.user.profile?.sex)}
                        name={[e.user.profile?.first_name, e.user.profile?.last_name]}
                        user={e.user}
                    />
                </Link>)}
            </div>
            :
            <Link href={`/profile/${data.username}`} className="block">
                <SelectedUser
                    src={getProfilePic(data.profile?.profile_picture, data.profile?.sex)}
                    name={[data.profile?.first_name, data.profile?.last_name]}
                    user={data}
                />
            </Link>
            :
            <Link href={`/profile/${data.username}`} className="block">
                <SelectedUser
                    src={getProfilePic(data.profile?.profile_picture, data.profile?.sex)}
                    name={[data.profile?.first_name, data.profile?.last_name]}
                    user={data}
                />
            </Link>}
        </div>
    )
}

ViewReferralModal.Body = Body
export default ViewReferralModal
