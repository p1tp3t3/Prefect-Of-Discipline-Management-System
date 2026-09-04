import AuthLayout from "@/Layouts/auth-layout"
import SearchUserBar from "@/Components/input/search-user-bar"
import ProfilePic from "@/Components/other/profile-pic"
import RichTextEditor from "@/Components/input/rich-text-editor"
import FormButton from "@/Components/button/button"
import { useState } from "react"
import { Head, router } from "@inertiajs/react"
import { getProfilePic, showWarningModal, showOutputModal, toTitleCase } from "@/others/function"
import { ReferralService } from "@/others/services/referral-service"
import { useReload } from "@/context-provider/reload-provider"

const ReportReferral = ({ user, students, back_url }) => {
    const [search, setSearch] = useState("")
    const [selectedStudents, setSelectedStudents] = useState([])
    const [reason, setReason] = useState("")

    const { loadRegister } = useReload()

    const handleSearch = (e) => setSearch(e.target.value)

    const getSelectedStudent = (i) => {
        const select = students.find((e) => e.id == i)
        setSelectedStudents((prev) => {
            if (prev.some((student) => student.id === select.id)) return prev
            return [...prev, select]
        })
        setSearch("")
    }

    const removeStudent = (index) => {
        setSelectedStudents((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (selectedStudents.length === 0) {
            showOutputModal("Please select at least one student to refer.", "e")
            return
        }

        const f = new FormData()
        f.append("referrer_id", user.id)
        f.append("referred_student_id", selectedStudents[0].id)
        selectedStudents.forEach((s, i) => f.append(`referred_students[${i}]`, s.id))
        f.append("referral_reason", reason)

        showWarningModal(
            "Are You Want to Refer a Student?",
            "Refer Student",
            "Cancel",
            () => {
                loadRegister(true, "text-wait", "Your Referral is Processing")
                ReferralService.create(f, success, error)
            }
        )
    }

    const success = () => {
        loadRegister(true, "")
        showOutputModal("Referral Created Successfully", "s", () => {
            loadRegister(false)
            router.visit(back_url)
        })
    }

    const error = () => {
        loadRegister(true, "")
        showOutputModal("Failed to Process Referral. Please Try Again", "e", () => loadRegister(false))
    }

    return (
        <>
            <Head title="Report Referral" />

            <div className="w-full py-6 grid justify-items-center">
                <div className="w-full max-w-[50rem] bg-white rounded-md shadow-black/20 shadow-md">
                    <form onSubmit={handleSubmit} className="grid gap-6 px-6 sm:px-10 py-8">

                        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                            <div>
                                <h1 className="text-[1.3em] font-bold">Referral Report</h1>
                                <p className="text-[0.85em] text-gray-500">Refer a student to the Prefect of Discipline</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => router.visit(back_url)}
                                className="text-[0.85em] text-gray-600 hover:text-gray-900"
                            >
                                <i className="fa-solid fa-arrow-left"></i> Back
                            </button>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-[0.85em] font-medium text-gray-700">
                                Referred Student/s <span className="text-[#d12323]">*</span>
                            </label>
                            <div className="relative z-10">
                                <SearchUserBar
                                    setSearch={setSearch}
                                    name="student_search"
                                    search={search}
                                    plc="Search Student/s as the Referred Student"
                                    handleSearch={handleSearch}
                                    lim={4}
                                    list={selectedStudents}
                                    def="Student Not Found"
                                    withLink={false}
                                    click={getSelectedStudent}
                                    apiLink={`/api/all-users/${user.role == "administrative" ? "program_student" : "student"}`}
                                    user={user}
                                />
                            </div>
                            <div className="flex overflow-y-hidden overflow-x-auto w-full pt-2">
                                {selectedStudents.map((e, i) => (
                                    <SelectedUser key={e.id} src={getProfilePic(e.profile?.profile_picture, e.profile?.sex)} name={[e.profile?.first_name, e.profile?.last_name]} user={e} unselect={removeStudent} index={i} />
                                ))}
                            </div>
                        </div>

                        <RichTextEditor
                            label="Reason to Refer"
                            val={reason}
                            change={setReason}
                            req={true}
                            placeholder="Describe the reason for this referral in detail — this will appear on the referral document sent to Guidance."
                            minHeight="24rem"
                        />

                        <div className="flex justify-end">
                            <FormButton type="submit" label="Submit Referral" />
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

const SelectedUser = (props) => {
    const isStudent = props.user.user_type == "student"
        ? `${props.user.program?.name}`
        : toTitleCase(props.user.parent?.parent_role)
    return (
        <div className="flex-shrink-0 grid relative w-[5rem]">
            <div className="justify-self-center grid">
                <div className="grid w-[2.5rem] justify-self-center relative">
                    <div className="absolute -top-1 right-0 z-[5]">
                        <button
                            type="button"
                            className="bg-gray-300 w-[1.2rem] h-[1.2rem] rounded-full text-[0.8em]"
                            onClick={() => props.unselect(props.index)}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div className="justify-self-center">
                        <ProfilePic src={props.src} size={2.5} />
                    </div>
                </div>
                <div className="text-[0.7em] text-center">
                    <h1><b>{`${props.name[0]} ${props.name[1]} (${isStudent})`}</b></h1>
                </div>
            </div>
        </div>
    )
}

ReportReferral.layout = (page) => <AuthLayout user={page.props.user}>{page}</AuthLayout>

export default ReportReferral
