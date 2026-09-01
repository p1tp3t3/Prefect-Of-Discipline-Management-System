import UpModal from "../up-modal"
import ProfilePic from "../../other/profile-pic"
import { useState, useEffect } from "react"
import { getData, getProfilePic, readableDate, readableTime } from "../../../others/function"
import CircleReload from "@/Components/reload/circle-reload"
import { APIRequest } from "@/others/classes/api-req"

const ViewAbsentFormModal = (props) => {

    const [data, setData] = useState(null),
          [reload, setReload] = useState(false)

    useEffect(() => {
        if(props.close) {
            setReload(true)
            getAbsentFormInfo()
        }else {
            setReload(false)
            setData(null)
        }
    }, [props.close])
    const getAbsentFormInfo = () => {
        const api = new APIRequest(`/absent-form/get/${props.id}`, 'post', {}, setData)
        api.fetchData()
    }

    return (
        <UpModal
            close={props.close} 
            closeModal={props.closeModal}
            isEnableOuterClose={props.isEnableOuterClose}
            pd={props.pd}
            bgColor='bg-white'
            w='w-[38rem]'>
            <div className="w-full">
                {(data != null)
                ?
                <Body data={data} />
                :
                reload &&
                <div className="w-full flex justify-center">
                    <CircleReload size={3} />
                </div>}
            </div>
        </UpModal>
    )
}

const Body = ({ data }) => {
    return (
        <div className="grid gap-3">
            {(data != null)
            ?
            <>
            <div className="text-[1.4em] text-center">
                <h1><b>{data.user.profile?.first_name}'s Absent Form</b></h1>
            </div>
            <div className="grid gap-5">
                <div>
                    <h2 className="text-lg font-semibold">Reported Since</h2>
                    <p className="text-sm">{readableDate(data.created_at)} ({readableTime(data.created_at)})</p>
                </div>
                <div className="grid gap-2">
                    <ProfileSection
                        title='Student'
                        name={`${data.user.profile?.first_name ?? ""} ${data.user.profile?.last_name ?? ""}`}
                        src={getProfilePic(data.user.profile?.profile_picture, data.user.profile?.sex)}
                        program={`${data.user.program?.name ?? ""} ${data.user.enrollments?.[data.user.enrollments.length - 1]?.year_level ?? ""}`} />
                </div>
                <div>
                    <div><b>Date of Absent</b></div>
                    <div className="text-[0.9em]">
                        {readableDate(data.date_from)} to {readableDate(data.date_to)}
                    </div>
                </div>
                <div className="grid gap-2">
                    <div><b>Reason</b></div>
                    <div className="grid gap-1">
                        {JSON.parse(data.reason).map((e, i) =>    
                            <div className="text-[0.9em]">
                                - {e}
                            </div>
                        )}
                    </div>
                </div>
                <div className="grid gap-2">
                    <div><b>Evidence</b></div>
                    <div className="grid grid-cols-3 gap-2">
                        {(data.evidences ? JSON.parse(data.evidences) : []).map((e, i) => (
                            <a key={i} href={`/absent-form/${data.id}/evidence/${e.file}`} target="_blank" rel="noreferrer" className="block border rounded overflow-hidden">
                                <img src={`/absent-form/${data.id}/evidence/${e.file}`} className="w-full h-24 object-cover" alt={`Evidence ${i + 1}`} />
                            </a>
                        ))}
                    </div>
                </div>
                {data.note &&
                <div className="grid gap-2">
                    <div><b>Note From the Prefect</b></div>
                    <div className="text-sm h-40 overflow-y-auto border rounded p-2 bg-gray-50">{data.note}</div>
                    {data.confirmed_at &&
                    <div>
                        <div><b>Noted Since</b></div>
                        <p className="text-sm">{readableDate(data.confirmed_at)} ({readableTime(data.confirmed_at)})</p>
                    </div>}
                </div>}
            </div>
            </>
            :
            reload &&
            <div className="w-full flex justify-center">
                <CircleReload size={3} />
            </div>}
        </div>
    )
}
const ProfileSection = ({ title, src, name, program }) => {
    return (
        <div>
            <div className="text-[1em]"><b>{title}</b></div>
            <div className="flex gap-2">
                <div><ProfilePic src={src} size={2.5}/></div>
                <div className="grid content-between">
                    <div className="text-[0.9em]"><h1>{name}</h1></div>
                    <div className="text-[0.8em]"><p>{program}</p></div>
                </div>
            </div>
        </div>
    )
}

ViewAbsentFormModal.Body = Body
export default ViewAbsentFormModal