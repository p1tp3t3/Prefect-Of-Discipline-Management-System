import { useContext, useEffect, useState } from "react"
import AuthContext from "@/context-provider/auth-provider"
import { Link } from "@inertiajs/react"
import { TransactionService } from "@/others/services/transaction-service"
import ListSkeleton from "../reload/list-skeleton"
import { FileText } from "lucide-react"

const AvailabilityList = () => {

    const { usr } = useContext(AuthContext)

    const [limit, setLimit] = useState(null)

    useEffect(() => {
        TransactionService.getLimit(setLimit)
    }, [])

    const checkUserType = () => {
        const defaultChoice =  [
            { val: 'complaint', label: 'Complaint', limit: limit.complaint.limit, requested: limit.complaint.requested },
        ]
        switch(usr.user_type) {
            case 'itrc':
                return [
                    ...defaultChoice, 
                    { val: 'gatepass', label: 'Gate Pass', limit: limit.gatepass.limit, requested: limit.gatepass.requested },
                ]
            case 'student':
                    return [
                        ...defaultChoice, 
                        { val: 'gatepass', label: 'Gate Pass', limit: limit.gatepass.limit, requested: limit.gatepass.requested },
                    ]
            case 'prefect':
                return [
                    ...defaultChoice,
                    { val: 'absent-form', label: 'Absent Form' },
                    { val: 'referral', label: 'Referral' },
                    { val: 'gatepass', label: 'Gate Pass', limit: limit.gatepass.limit, requested: limit.gatepass.requested }
                ]
            case 'faculty':
                return [
                    ...defaultChoice, 
                    { val: 'gatepass', label: 'Gate Pass', limit: limit.gatepass.limit, requested: limit.gatepass.requested }
                ]
            case 'administrative':
                return [
                    ...defaultChoice,
                    { val: 'referral', label: 'Referral', limit: limit.referral  },
                    { val: 'gatepass', label: 'Gate Pass', limit: limit.gatepass.limit, requested: limit.gatepass.requested }
                ]
            case 'staff':
                return [
                    ...defaultChoice,
                    { val: 'gatepass', label: 'Gate Pass', limit: limit.gatepass.limit, requested: limit.gatepass.requested }
                ]
            case 'parent':
                return [
                    { val: 'complaint', label: 'Complaint', limit: limit.complaint.limit, requested: limit.complaint.requested },
                ]
        }
    }
    return (
        <div className="bg-white px-1 py-3 border rounded-md shadow-md shadow-black/20 grid gap-4 flex-shrink-0">
            <div className="text-[1em] px-5 flex justify-between items-center">
                <div>
                    <b>Todays Transactions</b>
                </div>
            </div>
            <div className="h-full w-full">
                <div className="w-full grid gap-5 px-5">
                    <div className="flex gap-3 w-full">
                        <div className="h-full w-[0.3rem] rounded-full flex-shrink-0 bg-green-500"></div>
                        <div className="overflow-hidden overflow-y-auto w-full h-[21rem]">
                            <div className="h-full w-full gap-2">
                                <div className="w-full flex flex-col gap-1 h-full">
                                    {(limit != null)
                                    ?
                                    checkUserType().map((e, i) => 
                                    <Row 
                                        type={e.label} 
                                        route={e.val} 
                                        limit={e.limit}
                                        requested={e.requested}
                                    />)
                                    :
                                    <div className="mt-auto mb-auto">
                                        <ListSkeleton rows={3} />
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
const Row = ({ type, route, limit, requested }) => {
    const label = (type == 'Complaint' || type == 'Referral') ? `${type} Report` : `${type} Request`

    const available = (true) ? 'text-green-500' : 'text-gray-500'

    return (
        <Link href={`/${route}`}>
            <div className="px-3 py-2 border bg-white rounded-md w-full">
                <div className="flex w-full relative items-center">
                    <div className="flex gap-3">
                        <FileText size="1.7em" className={available} />
                        <div className="grid gap-2">
                            <div>
                                <div className="text-[0.9em]"><b>{label}</b></div>
                            </div>
                            <div>
                                {(requested <= Number(limit))
                                ?
                                <>
                                <div className="text-[0.8em]">Accepting {limit} Users</div>
                                <div className="text-[0.8em]">Requested: {requested}</div>
                                </>
                                :
                                <div className="text-[0.8em]">{label} is Already Full</div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
export default AvailabilityList
