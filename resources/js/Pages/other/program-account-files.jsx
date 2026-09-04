import StudentList from "@/Components/list/student-list"
import FacultyList from "@/Components/list/faculty-list"
import AccountFilesTab from "@/Components/other/account-files-tab"
import TabSwitcher from "@/Components/other/tab-switcher"
import AuthLayout from "@/Layouts/auth-layout"
import { Head, router } from "@inertiajs/react"

const tabs = [
    { key: "students", label: "Students" },
    { key: "faculty", label: "Faculty" },
    { key: "files", label: "Account Files" },
]

const ProgramAccountFiles = (props) => {
    const activeTab = new URLSearchParams(window.location.search).get("tab") || "students"
    const goToTab = (tab) => router.visit(`/teaching-staff/account-files?tab=${tab}`)

    return (
        <>
        <Head title="Program Accounts" />
        <div className="w-full py-4">
            <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-3">
                <h1 className="text-[1.3em] sm:text-[1.5em] font-bold">{props.program_name} ACCOUNTS</h1>
            </div>

            <div className="mt-3">
                <TabSwitcher tabs={tabs} value={activeTab} onChange={goToTab} />
            </div>

            {activeTab === "students" && (
                <div className="pt-3">
                    <StudentList list={props.students} type="program_head" />
                </div>
            )}

            {activeTab === "faculty" && (
                <div className="pt-3">
                    <FacultyList list={props.faculty} type="program_head" />
                </div>
            )}

            {activeTab === "files" && (
                <div className="pt-3">
                    <AccountFilesTab files={props.account_files} canDelete={false} />
                </div>
            )}
        </div>
        </>
    )
}

ProgramAccountFiles.layout = (page) => <AuthLayout user={page.props.user} program={page.props.program_name}>{page}</AuthLayout>

export default ProgramAccountFiles
