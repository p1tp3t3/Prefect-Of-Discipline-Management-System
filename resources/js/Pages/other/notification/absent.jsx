import ViewAbsentFormModal from "@/Components/modal/view/view-absent-form-modal"
import CircleReload from "@/Components/reload/circle-reload"
import NotifDisplayLayout from "@/Layouts/notif-display-layout"
import { APIRequest } from "@/others/classes/api-req"
import { useEffect, useState } from "react"

const AbsentNotification  = (props) => {
    const content = JSON.parse(props.notif.content.replace(/'/g, '"'))

    const [data, setData] = useState(null)
    
    useEffect(() => {
        const id = new URLSearchParams(window.location.search).get('absent_id'),
                api = new APIRequest(`/absent-form/get/${id}`, 'post', {}, setData)

        api.fetchData()
    }, [])


    return (
            <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
                {props.notif.confirmed_at == null
                ?
                <>
                {
                ((data != null)
                ?
                (data != '')
                ?
                <div className="bg-white shadow rounded-lg w-full max-w-2xl p-6">
                    <ViewAbsentFormModal.Body data={data} />
                </div>
                :
                <div className="text-[1.2em] text-gray-500 w-full grid place-items-center h-full">
                    <div className="grid place-items-center">
                        <div className="text-[4em]">
                            <i className="fa-solid fa-circle-exclamation"></i>
                        </div>
                        <h1 className="text-[1.2em]">No Absent Form Found</h1>
                    </div>
                </div>
                :
                <CircleReload size={5} />)
                }
                </>
                :
                <div className="bg-white shadow rounded-lg w-full max-w-2xl p-6">
                    <div className="text-[1.2em] text-gray-500 w-full grid place-items-center h-full">
                        <div className="grid place-items-center">
                            <div className="text-[4em]">
                                <i className="fa-solid fa-circle-exclamation"></i>
                            </div>
                            <h1 className="text-[1.2em]">No Absent Form Found</h1>
                        </div>
                    </div>
                </div>}
            </div>
    )
}

AbsentNotification.layout = (page) => <NotifDisplayLayout user={page.props.user}>{page}</NotifDisplayLayout>

const ApproveModal = ({ content }) =>  {
    return (
        <div className="bg-white shadow rounded-lg w-full max-w-2xl p-6">
            <h1 className="text-2xl font-bold mb-4">
                Your Absent Form Has Been Approved
            </h1>
            <div className="border-t border-b py-4 mb-6">
                <p className="mb-2 text-gray-700">
                    <span className="font-medium">Date: {content.date_appoint}</span>
                </p>
                <p className="mb-2 text-gray-700">
                    <span className="font-medium">Time: {content.time_appoint}</span>
                </p>
                <p className="text-gray-700">
                    {content.reason}
                </p>
            </div>
            <div>
                <p className="text-gray-700">
                    From: Prefect Name
                </p>
                <p className="text-gray-700">
                    Prefect Of Discipline Of The Higher Education Department
                </p>
            </div>
        </div>
    )
}

export default AbsentNotification