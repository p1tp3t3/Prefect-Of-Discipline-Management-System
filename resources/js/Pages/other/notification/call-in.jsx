import NotifDisplayLayout from "@/Layouts/notif-display-layout"
import { readableDate, readableTime } from "@/others/function"
import { useEffect, useState } from "react"

const CallInNotification = (props) => {
    const [refresh, setRefresh] = useState(true)

    const content = JSON.parse(props.notif.content.replace(/'/g, '"'));

    return (
            <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
                <div className="bg-white shadow rounded-lg w-full max-w-2xl p-6">
                    <h1 className="text-2xl font-bold mb-4">
                        You Have Been Called In By The Prefect
                    </h1>
                    <div className="border-t border-b py-4 mb-6">
                        <p className="mb-2 text-gray-700">
                            <span className="font-medium">Date:</span>{" "}
                            {readableDate(props.notif.created_at)}
                        </p>
                        <p className="mb-2 text-gray-700">
                            <span className="font-medium">Time:</span>{" "}
                            {readableTime(props.notif.created_at)}
                        </p>
                        <p className="text-gray-700">
                            {content.receiver_notif_message}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-700">
                            From: Office of the Prefect
                        </p>
                        <p className="text-gray-700">
                            Prefect Of Discipline Of The Higher Education Department
                        </p>
                    </div>
                </div>
            </div>
    )
}

CallInNotification.layout = (page) => <NotifDisplayLayout user={page.props.user}>{page}</NotifDisplayLayout>

export default CallInNotification