import { useState, useEffect } from "react"
import { APIRequest } from "@/others/classes/api-req"
import NotifDisplayLayout from "@/Layouts/notif-display-layout"
import CircleReload from "@/Components/reload/circle-reload"
import ViewReferralModal from "@/Components/modal/view/view-referral-modal"

const ReferralNotification = (props) => {
    const [data, setData] = useState(null)

    useEffect(() => {
        const id = new URLSearchParams(window.location.search).get('referral_id'),
                api = new APIRequest(`/referral/get/${id}`, 'post', {}, setData)

        api.fetchData()
    }, [])
    return  (
            <div className="py-8">
                <div className="py-8 px-10 bg-white">
                    {data != null
                    ?
                    (data != '')
                    ?
                    <div className="w-full space-y-5">
                        <ViewReferralModal.Body data={data} />
                        {props.user.user_type == 'staff' &&
                        <>
                        <div>
                            <h1 className="text-[1em]"><b>Message from Prefect:</b></h1>
                            <div className="mt-2 text-[0.9em]">
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Natus consequuntur harum quia hic, voluptas saepe libero corporis adipisci ab praesentium officiis quisquam magni repellendus ad ipsum vitae reiciendis incidunt velit?
                            </div>
                        </div>
                        <div>
                            <div>
                                {(data.file_path == null) &&
                                <a href={data.file_path} target="_blank" className="text-blue-500 underline">Download Attachment</a>}
                            </div>
                        </div>
                        </>}
                    </div>
                    :
                    <div className="text-[1.2em] text-gray-500 w-full grid place-items-center h-full">
                        <div className="grid place-items-center">
                            <div className="text-[4em]">
                                <i className="fa-solid fa-circle-exclamation"></i>
                            </div>
                            <h1 className="text-[1.2em]">No Referral Found</h1>
                        </div>
                    </div>
                    :
                    <CircleReload size={5} />}
                </div>
            </div>
    )
}

ReferralNotification.layout = (page) => <NotifDisplayLayout user={page.props.user}>{page}</NotifDisplayLayout>

export default ReferralNotification