import NotifDisplayLayout from "@/Layouts/notif-display-layout"
import { APIRequest } from "@/others/classes/api-req"
import { useEffect, useState } from "react"
import NewUserList from "@/Components/list/new-user-list"
import Btn from "@/Components/button/normal-btn"
import { readableDate, readableTime } from "@/others/function"

const UserNotification = ({ user, notif }) => {
    const [data, setData] = useState(notif)
    const [users, setUsers] = useState(null)
    const [loading, setLoading] = useState(true)

    const content = JSON.parse(data.content.replace(/'/g, '"'))

    useEffect(() => {
        if (content.success) {
            const api = new APIRequest(
                `/api/all-users/all?search=&date_registered=${content.new_user_date_registered}`,
                "get",
                {},
                setUsers
            )
            api.fetchData()
        }
    }, [])

    function downloadErrorBlob(errorBlob, fileName) {
    // Convert base64 to raw binary
    const byteCharacters = atob(errorBlob);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob
    const blob = new Blob([byteArray], { type: 'text/plain' });

    // Create a temporary link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName || 'error.txt';
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}


    return (
            <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center">
                <div className="w-full max-w-4xl">

                    {/* HEADER */}
                    <div className="bg-white shadow rounded-lg p-6 mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800">
                            {content.success ? "User Account Generated Successfully" : "User Account Generation Failed"}
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm">
                            {content.success
                                ? `New users registered on ${content.new_user_date_registered}`
                                : "Notification Details"}
                        </p>
                    </div>
                    {/* CONTENT */}
                    {content.success
                    ?
                    <NewUserList list={users} showTitle={false} />
                    : (
                        <div className="bg-white shadow rounded-lg p-6">
                            <p className="text-gray-500 text-center py-10 space-y-2">
                                <Btn onclick={() => downloadErrorBlob(content.error_blob, content.error_filename)}>Download Error File</Btn>
                                <p>Since {readableDate(data.created_at)} {readableTime(data.created_at)}</p>
                            </p>
                        </div>
                    )}
                </div>
            </div>
    )
}

UserNotification.layout = (page) => <NotifDisplayLayout user={page.props.user}>{page}</NotifDisplayLayout>

export default UserNotification
