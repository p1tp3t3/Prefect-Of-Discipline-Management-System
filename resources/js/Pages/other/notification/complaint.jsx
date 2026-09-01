import NotifDisplayLayout from "@/Layouts/notif-display-layout"
import { useEffect, useState } from "react"
import ViewComplaintModal from "@/Components/modal/view/view-complaint-modal"
import { APIRequest } from "@/others/classes/api-req"
import CircleReload from "@/Components/reload/circle-reload"

const ComplaintNotification = (props) => {
    const [data, setData] = useState(null)

    useEffect(() => {
        const id = new URLSearchParams(window.location.search).get('complaint_id'),
              api = new APIRequest(`/complainant/get/${id}`, 'post', {}, setData)

        api.fetchData()
    }, [])
    return  (
            <div className="py-8">
                <div className="py-8 px-10 bg-white">
                    {data != null
                    ?
                    (data != '')
                    ?
                    <ViewComplaintModal.Body data={data} usr={props.user} />
                    :
                    <div className="text-[1.2em] text-gray-500 w-full grid place-items-center h-full">
                        <div className="grid place-items-center">
                            <div className="text-[4em]">
                                <i className="fa-solid fa-circle-exclamation"></i>
                            </div>
                            <h1 className="text-[1.2em]">No Complaint Found</h1>
                        </div>
                    </div>
                    :
                    <CircleReload size={5} />}
                </div>
            </div>
    )
}

ComplaintNotification.layout = (page) => <NotifDisplayLayout user={page.props.user}>{page}</NotifDisplayLayout>

export default ComplaintNotification