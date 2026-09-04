import ViewGatePassModal from "@/Components/modal/view/view-gatepass-modal"
import CircleReload from "@/Components/reload/circle-reload"
import NotifDisplayLayout from "@/Layouts/notif-display-layout"
import { useEffect, useState } from "react"

const GatePassNotification = (props) => {
    const content = JSON.parse(props.notif.content.replace(/'/g, '"'))
        

    return (
            <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
                <div className="bg-white shadow rounded-lg w-[35rem] p-6">
                    <ViewGatePassModal.Body data={content['gatepass']} />
                </div>
            </div>
    )
}

GatePassNotification.layout = (page) => <NotifDisplayLayout user={page.props.user}>{page}</NotifDisplayLayout>

export default GatePassNotification