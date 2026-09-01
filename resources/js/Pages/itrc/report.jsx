import UserReportLogList from "@/Components/list/user-report-log-list"
import AuthLayout from "@/Layouts/auth-layout"
import DropdownField from "@/Components/input/dropdown"
import Btn from "@/Components/button/normal-btn"
import { router } from "@inertiajs/react"
import { useState } from "react"
import GenerateActionLogReportMoodal from "@/Components/modal/submission-form/generate-action-log-report-modal"

const ITRCReport = (props) => {
    const [action_log_list, setActionLogList] = useState(props.action_log_list)
    const actionList = [
        { val: 'login', label: 'Login' },
        { val: 'logout', label: 'Logout' },
        { val: 'register', label: 'Register' },
        { val: 'account activation', label: 'Account Activation' },
        { val: 'account update', label: 'Account Update' },
        { val: 'profile update', label: 'Profile Update' },
        { val: 'complaint', label: 'Complaint' },
        { val: 'referral', label: 'Referral' },
        { val: 'appointment', label: 'Appointment' },
        { val: 'gatepass', label: 'Gatepass' },
    ]
    const params = new URLSearchParams(window.location.search)
    const [actionType, setActionType] = useState(params.get('action_type') || 'all')
    const [date, setDate] = useState(params.get('date') || '')
    const [report, openGenerateReport] = useState(false)

    const handleFilterChange = (field, value) => {
        const link = window.location.pathname

        const newActionType = field === 'action_type' ? value : actionType
        const newDate = field === 'date' ? value : date

        // Update both filters in the URL
        router.visit(`${link}?action_type=${newActionType}&date=${newDate}`)
    };
    return (
        <>
        <GenerateActionLogReportMoodal
            close={report} 
            closeModal={openGenerateReport} 
            pd={['px-5', 'py-7']}
            isEnableOuterClose={true}
            students={props.students}
        />
        <div className="w-full py-10 grid gap-10">
            <div className="flex justify-between items-center">
                <h1 className="text-[1.3em]">
                    <b>Action Log Report</b>
                </h1>
                <div>
                    <Btn onclick={() => openGenerateReport(true)}>
                        Generate Report
                    </Btn>
                </div>
            </div>
            <div className="w-full flex justify-between items-center">
                <div className="flex gap-2">
                    <DropdownField
                        default={{ val: 'all', label: 'All Action Type' }}
                        list={actionList}
                        titleCase={true}
                        onChange={(e) => handleFilterChange('action_type', e.target.value)}
                        val={actionType}

                    />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => handleFilterChange('date', e.target.value)}
                        className="cursor-pointer border border-gray-500 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
            </div>
            <div>
                <UserReportLogList
                    list={action_log_list}
                />
            </div>
        </div>
        </>
    )
}

ITRCReport.layout = (page) => <AuthLayout user={page.props.user}>{page}</AuthLayout>

export default ITRCReport