import { APIRequest } from "@/others/classes/api-req"
import { useEffect, useState } from "react"
import CircleReload from "../reload/circle-reload"

const PendingRequestList = ({ type }) => {
    const [status, setStatus] = useState(null)

    useEffect(() => {
        const api = new APIRequest('/transaction/status', 'get')
        api.setSetter(setStatus)
        api.fetchData()
    }, [])
        console.log(status)

    const renderRow = () => {
        const DefaultRow = (
            <>
            <Row label="Complaint Report" status={status.complaint} />
            <Row label="Gate Pass Request" status={status.gatepass} />
            </>
        )

        switch(type) {
            case 'itrc':
                return DefaultRow
            case 'student':
                return (
                    <>
                    {DefaultRow}
                    </>
                )
            case 'faculty':
                return (
                    <>
                    {DefaultRow}
                    </>
                )
            case 'administrative':
                return (
                    <>
                    {DefaultRow}
                    <Row label="Referral Request" />
                    </>
                )
            case 'staff':
                return DefaultRow
            case 'parent':
                return (
                    <>
                    <Row label="Complaint Requests" />
                    </>
                )
        }
    }
    return (
        <div className="bg-white w-full h-full rounded-md shadow shadow-black/20">
            <div className="px-4 py-4 w-full flex flex-col gap-4 h-full">
                <div>
                    <h1 className="text-[1em]"><b>Request Status This Day</b></h1>
                </div>
                {(status != null)
                ?
                <div className="grid gap-1">
                    {renderRow()}
                </div>
                :
                <div className="w-full h-full grid place-items-center">
                    <CircleReload size={3} />
                </div>}
            </div>       
        </div>
    )
}
const Row = ({ label, status = 'none' }) => {
    const statusList = [
        ['None', 'bg-gray-500'],
        ['Pending...', 'bg-orange-600'],
        [(label.toLowerCase().includes('complaint')) ? 'Ongoing' : 'Approved', 'bg-green-600']
    ]
    const changeStatus = (status, i) => {
        if(status == 'none') return statusList[0][i]
        if(status == 'pending') return statusList[1][i]
        if(status == (label.toLowerCase().includes('complaint')) ? 'ongoing' : 'approve') return statusList[2][i]
    }
    return (
        <div className="w-full">
            <div className="py-2 px-3 border flex w-full gap-3">
                <div className="w-[2.5rem] h-[2.5rem] rounded-full bg-green-400 grid place-items-center text-[1.3em]">
                    <i className="fa-solid fa-file"></i>
                </div>
                <div className="grid gap-1">
                    <div>
                        <h1 className="text-[0.9em]">
                            <b>{label}</b>
                        </h1>
                    </div>
                    <div className="text-[0.8em]">
                        <div>
                            <span className={`px-3 py-1 rounded-full text-white ${changeStatus(status, 1)}`}>
                                {changeStatus(status, 0)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PendingRequestList